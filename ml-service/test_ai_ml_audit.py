import os
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# ─── 1. Health & Model Catalog Endpoints ──────────────────────────────
def test_health_endpoint():
    """Verify health check returns HEALTHY and service version."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "version" in data

def test_models_catalog():
    """Verify model listing endpoint returns active ML models."""
    response = client.get("/models")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) >= 4
    model_ids = [m["id"] for m in data["models"]]
    assert "aurora-v1" in model_ids
    assert "route-opt-v1" in model_ids
    assert "reco-engine-v1" in model_ids

# ─── 2. Input Validation & Error Handling (HTTP 422) ───────────────────
def test_aurora_invalid_input_rejected():
    """Verify missing required fields return controlled 422 Unprocessable Entity."""
    # Missing date and coordinates
    response = client.post("/api/v1/predict/aurora", json={
        "invalid_key": "some_value"
    })
    assert response.status_code == 422
    errors = response.json()
    assert "detail" in errors

def test_aurora_invalid_coordinate_types():
    """Verify non-numeric latitude/longitude are rejected."""
    response = client.post("/api/v1/predict/aurora", json={
        "latitude": "INVALID_NOT_A_FLOAT",
        "longitude": "INVALID_NOT_A_FLOAT",
        "date": "2026-12-15"
    })
    assert response.status_code == 422

def test_route_optimize_missing_coordinates():
    """Verify route optimization requires start and end coordinates."""
    response = client.post("/api/v1/route/optimize", json={
        "start_lat": 59.9139
        # Missing start_lng, end_lat, end_lng
    })
    assert response.status_code == 422

# ─── 3. Predictions & Recommendation Services ─────────────────────────
def test_aurora_prediction_success():
    """Verify Aurora prediction returns Kp index, probability, and cloud cover."""
    response = client.post("/api/v1/predict/aurora", json={
        "latitude": 69.6492, # Tromsø
        "longitude": 18.9553,
        "date": "2026-12-15",
        "user_id": "usr-test-01"
    })
    assert response.status_code == 200
    data = response.json()
    assert "request_id" in data
    forecast = data["data"]["forecast"]
    assert "kp_index" in forecast
    assert 0 <= forecast["kp_index"] <= 9.0
    assert 0 <= forecast["probability_percentage"] <= 100
    assert 0 <= forecast["cloud_cover_percentage"] <= 100

def test_recommendations_with_natural_language_prompt():
    """Verify travel recommendation engine extracts prompt parameters and returns destinations."""
    response = client.post("/api/v1/recommendations", json={
        "prompt": "I want a 5-day adventure around western fjords with a budget of 20000 NOK",
        "user_id": "usr-test-02"
    })
    assert response.status_code == 200
    data = response.json()
    assert "trip_id" in data
    assert len(data["data"]["destinations"]) > 0
    assert "explanation" in data["data"]

def test_recommendations_with_empty_prompt_fallback():
    """Verify recommendation engine falls back gracefully when given minimal input."""
    response = client.post("/api/v1/recommendations", json={
        "user_id": "usr-test-03"
    })
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]["destinations"]) > 0

def test_route_optimization_and_co2_savings():
    """Verify route optimization calculates duration and CO2 reduction compared to driving."""
    response = client.post("/api/v1/route/optimize", json={
        "start_lat": 59.9139, # Oslo
        "start_lng": 10.7522,
        "end_lat": 60.3913,   # Bergen
        "end_lng": 5.3221,
        "user_id": "usr-test-04"
    })
    assert response.status_code == 200
    data = response.json()
    assert "route_id" in data["data"]
    assert data["data"]["estimated_duration_mins"] > 0
    assert data["data"]["co2_saved_kg"] >= 0
    assert len(data["data"]["segments"]) >= 1

# ─── 4. Specialized Predictive Analytics ──────────────────────────────
def test_environment_forecaster():
    """Verify environment prediction returns air quality and CO2 ppm."""
    response = client.post("/api/v1/predict/environment", json={
        "latitude": 59.9139,
        "longitude": 10.7522,
        "date": "2026-12-15"
    })
    assert response.status_code == 200
    data = response.json()
    assert "air_quality_index" in data["data"]
    assert "co2_ppm" in data["data"]

def test_energy_forecaster():
    """Verify energy prediction returns reservoir level and production forecast."""
    response = client.post("/api/v1/predict/energy", json={
        "latitude": 60.0,
        "longitude": 7.0,
        "date": "2026-12-15"
    })
    assert response.status_code == 200
    data = response.json()
    assert "reservoir_level_pct" in data["data"]
    assert "production_forecast_mw" in data["data"]

def test_fish_forecaster():
    """Verify fish population forecast returns target species and density."""
    response = client.post("/api/v1/predict/fish", json={
        "latitude": 68.0,
        "longitude": 14.0,
        "date": "2026-12-15"
    })
    assert response.status_code == 200
    data = response.json()
    assert "target_species" in data["data"]
    assert "population_density" in data["data"]

# ─── 5. Security & Process Metrics ────────────────────────────────────
def test_security_secrets_not_exposed():
    """Ensure sensitive API keys and database secrets are never exposed in responses."""
    response = client.get("/health")
    headers_str = str(response.headers).lower()
    body_str = response.text.lower()
    
    # Check that secrets are not leaked
    assert "gemini_api_key" not in headers_str and "gemini_api_key" not in body_str
    assert "service_role" not in headers_str and "service_role" not in body_str

def test_process_time_header():
    """Verify process timing middleware adds X-Process-Time header."""
    response = client.get("/health")
    assert "X-Process-Time" in response.headers

if __name__ == "__main__":
    print("Running Python AI/ML audit suite...")
    test_health_endpoint()
    test_models_catalog()
    test_aurora_invalid_input_rejected()
    test_aurora_invalid_coordinate_types()
    test_route_optimize_missing_coordinates()
    test_aurora_prediction_success()
    test_recommendations_with_natural_language_prompt()
    test_recommendations_with_empty_prompt_fallback()
    test_route_optimization_and_co2_savings()
    test_environment_forecaster()
    test_energy_forecaster()
    test_fish_forecaster()
    test_security_secrets_not_exposed()
    test_process_time_header()
    print("All 14 Python AI/ML backend tests passed!")
