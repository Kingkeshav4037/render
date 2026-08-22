import os
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_recommendations():
    print("Testing /api/v1/recommendations...")
    response = client.post("/api/v1/recommendations", json={
        "prompt": "I want a 3 day trip to see the northern lights",
        "user_id": "test_user_123"
    })
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_aurora():
    print("\nTesting /api/v1/predict/aurora...")
    response = client.post("/api/v1/predict/aurora", json={
        "latitude": 69.6492, # Tromso
        "longitude": 18.9553,
        "date": "2026-12-15"
    })
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_route():
    print("\nTesting /api/v1/route/optimize...")
    response = client.post("/api/v1/route/optimize", json={
        "start_lat": 59.9139,
        "start_lng": 10.7522,
        "end_lat": 60.3913,
        "end_lng": 5.3221
    })
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    test_recommendations()
    test_aurora()
    test_route()
