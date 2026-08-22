import os
import sys

# Add ml-service directory to sys.path so modules and models resolve identically
current_dir = os.path.dirname(os.path.abspath(__file__))
ml_service_dir = os.path.join(current_dir, "ml-service")
if ml_service_dir not in sys.path:
    sys.path.insert(0, ml_service_dir)

from main import app  # imports FastAPI app from ml-service/main.py

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
