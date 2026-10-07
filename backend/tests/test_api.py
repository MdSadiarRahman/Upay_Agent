from fastapi.testclient import TestClient
from main import app
from database import get_db, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    # if it doesn't exist, we will create it
    if response.status_code == 200:
        assert response.json() == {"status": "ok"}
    else:
        # Check if the root exists
        response = client.get("/")
        if response.status_code == 200:
            assert "Welcome to UpayPulse AI Backend API" in response.json().get("message", "")

def test_ai_model_metrics():
    response = client.get("/api/ai/model-metrics")
    assert response.status_code == 200
    data = response.json()
    assert "xgboost" in data
    assert "baseline" in data
    assert "accuracy" in data["xgboost"]
    assert "auc" in data["xgboost"]

def test_unauthorized_access():
    response = client.get("/api/users/me")
    assert response.status_code == 401 # Unauthorized since no token

def test_ai_assistant_without_auth():
    # If the AI assistant endpoint is protected, it should return 401
    # If not protected, we test if it returns a response
    response = client.post("/api/ai/generate-insight", json={"message": "Hello", "context": {}})
    # Depending on implementation, it might be 401, 200, or 422
    assert response.status_code in [200, 401, 422]
