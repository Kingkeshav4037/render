# Norway SmartLife ML Service

This directory contains the Python FastAPI backend for the Machine Learning and AI prediction endpoints.

## Prerequisites
- Python 3.9+

## Installation

1. Navigate to the `ml-service` directory:
   ```bash
   cd ml-service
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Start the FastAPI development server using Uvicorn:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## Interactive API Documentation

FastAPI automatically generates interactive Swagger documentation. Once the server is running, visit:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

You can use the Swagger UI to easily test the `/predict/aurora`, `/predict/trail-safety`, and `/route/optimize` endpoints directly from your browser!
