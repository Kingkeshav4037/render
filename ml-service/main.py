import os
import re
import uuid
import time
import random
import logging
import httpx
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from dotenv import load_dotenv

class SecretSanitizingFilter(logging.Filter):
    """
    Scans and redacts sensitive credentials, tokens, passwords, and secrets from all logs.
    """
    SENSITIVE_PATTERNS = [
        (re.compile(r"Bearer\s+[A-Za-z0-9-_=.]+", re.IGNORECASE), "Bearer [REDACTED]"),
        (re.compile(r"eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+"), "[JWT_REDACTED]"),
        (re.compile(r"(password|secret|apikey|api_key|token|otp|cvv|card_number)['\"]?\s*[:=]\s*['\"]?([^'\"\s,]+)", re.IGNORECASE), r"\1=[REDACTED]"),
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            for pattern, replacement in self.SENSITIVE_PATTERNS:
                record.msg = pattern.sub(replacement, record.msg)
        return True

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s")
logger = logging.getLogger("norway-smartlife-api")
logger.addFilter(SecretSanitizingFilter())

# Try to load supabase client if installed
try:
    from supabase import create_client, Client
except ImportError:
    pass

load_dotenv()

app = FastAPI(
    title="Norway SmartLife ML Service",
    description="Backend API for AI predictions and smart routing.",
    version="2.0.0"
)

# ─── Standardized Global Exception Handlers ────────────────────────────────────
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        errors.append({"field": loc, "message": err.get("msg")})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "detail": exc.errors(),
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request payload or query parameters.",
                "details": errors
            }
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing your request. Please try again later."
            }
        }
    )

# ─── CORS Middleware Configuration (Render & Local Vercel Support) ────────────
cors_origins_env = os.environ.get("CORS_ORIGINS", "")
if cors_origins_env:
    allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]
else:
    allowed_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

# If wildcard is present, allow all, otherwise use explicit list and regex for vercel previews
if "*" in allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_origin_regex=r"^https://.*\.vercel\.app$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Initialize Supabase Client for logging
supabase: Optional['Client'] = None
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if supabase_url and supabase_key:
    try:
        supabase = create_client(supabase_url, supabase_key)
        print("Supabase client initialized for ML logging.")
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")

# Models
class LocationInput(BaseModel):
    latitude: float
    longitude: float
    date: str
    user_id: Optional[str] = None

class RouteInput(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    user_id: Optional[str] = None

class RecommendationInput(BaseModel):
    interests: Optional[List[str]] = None
    budget: Optional[float] = None
    days: Optional[int] = None
    prompt: Optional[str] = None
    user_id: Optional[str] = None

def extract_from_prompt(prompt: str) -> dict:
    """Uses Gemini to extract structured travel parameters from a natural language prompt."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key or gemini_key == "YOUR_GEMINI_API_KEY":
        # Fallback if key is missing
        return {"budget": 15000, "days": 7, "interests": ["Fjords", "Northern Lights"]}
        
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
        headers = {"Content-Type": "application/json"}
        system_instruction = (
            "You are a travel extraction API. Given a user prompt, extract the budget (in NOK, default 15000), "
            "the duration in days (default 7), and a list of broad interests (e.g., 'Fjords', 'Northern Lights', 'Hiking', 'Cities'). "
            "Output EXACTLY a valid JSON object with keys: budget (number), days (number), interests (list of strings). Nothing else."
        )
        payload = {
            "system_instruction": {"parts": [{"text": system_instruction}]},
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json"}
        }
        
        # We use a synchronous request here because the extract_from_prompt function is synchronous
        # (It's called by get_recommendations which is a def, not async def)
        response = httpx.post(url, headers=headers, json=payload, timeout=10.0)
        if response.status_code == 200:
            import json
            data = response.json()
            text_content = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text_content)
        else:
            print(f"Gemini API Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Gemini API Exception: {e}")
        
    return {"budget": 15000, "days": 7, "interests": ["Fjords", "Northern Lights"]}

def log_prediction(model_id: str, request_id: str, user_id: str, input_data: dict, prediction: dict, confidence: float, latency: int):
    """Helper to log prediction runs to the Supabase database."""
    if not supabase:
        return
    
    try:
        supabase.table("prediction_runs").insert({
            "request_id": request_id,
            "model_id": model_id,
            "model_version": "v1.0.0",
            "user_id": user_id,
            "input_hash": str(hash(str(input_data))),
            "prediction": prediction,
            "confidence": confidence,
            "latency_ms": latency
        }).execute()
    except Exception as e:
        print(f"Logging failed: {e}")

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "norway-smartlife-ml",
        "description": "Norway SmartLife AI & ML Prediction Backend",
        "version": app.version,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "state": "HEALTHY",
        "service": "norway-smartlife-ml",
        "version": app.version
    }

@app.get("/models")
def list_models():
    return {
        "models": [
            {"id": "aurora-v1", "name": "Aurora Predictor", "status": "ACTIVE"},
            {"id": "route-opt-v1", "name": "Smart Route Optimizer", "status": "ACTIVE"},
            {"id": "reco-engine-v1", "name": "Travel Recommender", "status": "ACTIVE"},
            {"id": "env-forecast-v1", "name": "Environmental Forecaster", "status": "ACTIVE"}
        ]
    }

@app.post("/api/v1/predict/aurora")
async def predict_aurora(loc: LocationInput):
    start = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    
    # 1. Fetch real cloud cover from Open-Meteo
    cloud_cover = 50
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.open-meteo.com/v1/forecast?latitude={loc.latitude}&longitude={loc.longitude}&hourly=cloud_cover&forecast_days=1"
            )
            if resp.status_code == 200:
                data = resp.json()
                cloud_cover = data.get("hourly", {}).get("cloud_cover", [50])[0]
    except Exception as e:
        print(f"Weather API error: {e}")

    # 2. Simulate Kp Index realistically based on latitude
    base_kp = 2.0
    if loc.latitude > 65.0: # Arctic circle
        base_kp += random.uniform(2.0, 5.0)
    else:
        base_kp += random.uniform(0.0, 2.0)
        
    kp = min(9.0, round(base_kp, 1))
    
    # 3. Probability is high if Kp is high AND cloud cover is low
    probability = max(0, min(100, int((kp / 9.0) * 100) - (cloud_cover // 2)))
    confidence = 0.90
    
    result = {
        "location": {"lat": loc.latitude, "lng": loc.longitude},
        "date": loc.date,
        "forecast": {
            "kp_index": kp,
            "probability_percentage": probability,
            "cloud_cover_percentage": cloud_cover
        }
    }
    
    latency = int((time.time() - start) * 1000)
    log_prediction("aurora-v1", req_id, loc.user_id, loc.dict(), result, confidence, latency)
    
    return {"request_id": req_id, "data": result}

@app.post("/api/v1/recommendations")
def get_recommendations(req: RecommendationInput):
    start = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    
    # NLP Parsing if prompt exists
    if req.prompt:
        extracted = extract_from_prompt(req.prompt)
        req.budget = extracted["budget"]
        req.days = extracted["days"]
        req.interests = extracted["interests"]
        
    # Fallbacks if still none
    req.budget = req.budget or 15000
    req.days = req.days or 7
    req.interests = req.interests or ["Fjords"]

    # Query Supabase for matching destinations
    destinations = []
    if supabase:
        try:
            # Simple fallback: get random published locations
            # In a full app, we would use embeddings or full-text search on interests
            locs_res = supabase.table("locations").select("id, name, type, tags").eq("status", "PUBLISHED").limit(50).execute()
            if locs_res.data:
                # Filter by interest loosely if possible, else take random
                filtered = [l["name"] for l in locs_res.data if any(i.lower() in str(l.get("tags", "")).lower() or i.lower() in l.get("type", "").lower() for i in req.interests)]
                destinations = filtered if filtered else [l["name"] for l in locs_res.data]
        except Exception as e:
            print(f"Failed to query locations: {e}")
            
    if not destinations:
        destinations = ["Tromsø", "Lofoten", "Bergen", "Geiranger", "Oslo", "Stavanger", "Svalbard"]
        
    recommended = random.sample(destinations, k=min(3, len(destinations)))
    confidence = random.uniform(0.75, 0.95)
    
    random.seed()
    
    trip_id = str(uuid.uuid4())
    
    if supabase:
        try:
            # Insert root trip
            supabase.table("trips").insert({
                "id": trip_id,
                "title": f"AI Generated {req.days}-Day Adventure",
                "budget_nok": req.budget,
                "status": "PLANNING"
            }).execute()
            
            # Fetch some real locations to mock a route
            locs_res = supabase.table("locations").select("id, name").eq("status", "PUBLISHED").limit(3).execute()
            locs = locs_res.data
            
            if locs and len(locs) >= 2:
                # ----------------------------------------------------
                # PHASE 10: SUSTAINABILITY ENGINE (CO2 CALCULATION)
                # ----------------------------------------------------
                distance = 300 # Mock distance km
                transport_mode = "TRAIN"
                # Train = 0.014 kg/km, Car = 0.104 kg/km, Flight = 0.285 kg/km
                segment_co2 = distance * 0.014 
                
                stay_nights = 2
                stay_co2 = stay_nights * 12.5 # 12.5 kg per night in eco-hotel
                
                activity_co2 = 5.0 # 5 kg for a standard tour
                
                total_co2 = round(segment_co2 + stay_co2 + activity_co2, 2)
                
                # Update main trip with total_co2
                supabase.table("trips").update({
                    "total_co2_kg": total_co2
                }).eq("id", trip_id).execute()

                # Insert segment
                supabase.table("trip_segments").insert({
                    "trip_id": trip_id,
                    "sequence_order": 1,
                    "start_location_id": locs[0]["id"],
                    "end_location_id": locs[1]["id"],
                    "transport_mode": transport_mode,
                    "start_time": "2026-09-01T08:00:00Z",
                    "end_time": "2026-09-01T12:00:00Z",
                    "distance_km": distance,
                    "co2_kg": round(segment_co2, 2)
                }).execute()
                
                # Insert stay
                supabase.table("trip_stays").insert({
                    "trip_id": trip_id,
                    "location_id": locs[1]["id"],
                    "accommodation_name": f"Hotel {locs[1]['name']}",
                    "check_in": "2026-09-01T15:00:00Z",
                    "check_out": "2026-09-03T11:00:00Z",
                    "co2_kg": round(stay_co2, 2)
                }).execute()
                
                # Insert activity
                supabase.table("trip_activities").insert({
                    "trip_id": trip_id,
                    "location_id": locs[1]["id"],
                    "activity_title": f"Guided tour of {locs[1]['name']}",
                    "activity_type": "TOUR",
                    "start_time": "2026-09-02T10:00:00Z",
                    "end_time": "2026-09-02T14:00:00Z",
                    "co2_kg": round(activity_co2, 2)
                }).execute()
        except Exception as e:
            print(f"Failed to insert trip to DB: {e}")
    
    result = {
        "trip_id": trip_id,
        "destinations": random.sample(destinations, min(3, len(destinations))),
        "explanation": f"Matches your budget of {req.budget} NOK and interests in {', '.join(req.interests)}."
    }
    
    latency = int((time.time() - start) * 1000)
    log_prediction("reco-engine-v1", req_id, req.user_id, req.dict(), result, confidence, latency)
    
    return {"request_id": req_id, "trip_id": trip_id, "data": result}

@app.post("/api/v1/route/optimize")
async def optimize_route(route: RouteInput):
    start = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    
    # Fetch real routing data from OSRM
    distance_km = 300.0
    duration_mins = 180
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://router.project-osrm.org/route/v1/driving/{route.start_lng},{route.start_lat};{route.end_lng},{route.end_lat}?overview=false"
            )
            if resp.status_code == 200:
                data = resp.json()
                routes = data.get("routes", [])
                if routes:
                    distance_km = routes[0].get("distance", 0) / 1000.0
                    duration_mins = int(routes[0].get("duration", 0) / 60.0)
    except Exception as e:
        print(f"OSRM API error: {e}")
    
    # CO2 Calculation: Compare Driving vs Train (0.104 vs 0.014 kg/km)
    driving_co2 = distance_km * 0.104
    train_co2 = distance_km * 0.014
    co2_saved = driving_co2 - train_co2
    
    result = {
        "route_id": f"rt_{random.randint(1000,9999)}",
        "estimated_duration_mins": duration_mins,
        "co2_saved_kg": round(co2_saved, 1),
        "segments": [
            {"type": "WALK", "duration_mins": 5},
            {"type": "TRAIN", "duration_mins": duration_mins},
            {"type": "WALK", "duration_mins": 5}
        ]
    }
    
    latency = int((time.time() - start) * 1000)
    log_prediction("route-opt-v1", req_id, route.user_id, route.dict(), result, 0.98, latency)
    
    return {"request_id": req_id, "data": result}

@app.post("/api/v1/predict/environment")
def predict_environment(loc: LocationInput):
    start = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    
    # Mock environment logic
    result = {
        "air_quality_index": random.randint(10, 50),
        "co2_ppm": random.randint(390, 420),
        "trend": "STABLE"
    }
    
    latency = int((time.time() - start) * 1000)
    log_prediction("env-forecast-v1", req_id, loc.user_id, loc.dict(), result, 0.85, latency)
    
    return {"request_id": req_id, "data": result}
    
@app.post("/api/v1/predict/energy")
def predict_energy(loc: LocationInput):
    start = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    
    result = {
        "reservoir_level_pct": random.randint(40, 95),
        "production_forecast_mw": random.randint(500, 2000),
        "demand_forecast_mw": random.randint(400, 1900)
    }
    
    latency = int((time.time() - start) * 1000)
    log_prediction("energy-forecast-v1", req_id, loc.user_id, loc.dict(), result, 0.92, latency)
    
    return {"request_id": req_id, "data": result}
    
@app.post("/api/v1/predict/fish")
def predict_fish(loc: LocationInput):
    start = time.time()
    req_id = f"req_{uuid.uuid4().hex[:8]}"
    
    result = {
        "target_species": "Cod",
        "population_density": "HIGH",
        "recommended_zone": "Zone A"
    }
    
    latency = int((time.time() - start) * 1000)
    log_prediction("fish-forecast-v1", req_id, loc.user_id, loc.dict(), result, 0.78, latency)
    
    return {"request_id": req_id, "data": result}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

