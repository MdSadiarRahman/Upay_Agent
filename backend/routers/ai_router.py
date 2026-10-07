import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import google.generativeai as genai
import schemas, models, auth
from database import get_db

router = APIRouter(prefix="/api/ai", tags=["ai"])

# Configure Gemini AI
# The GEMINI_API_KEY should be set in the .env file
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

from pydantic import BaseModel

class GenerateInsightRequest(BaseModel):
    prompt: str
    score: float

@router.post("/generate-insight", response_model=schemas.AIPredictionResponse)
def generate_and_save_insight(
    request: GenerateInsightRequest, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        # Check if API key is configured
        if not api_key:
            # Fallback for development if no key is provided
            generated_text = f"Simulated AI explanation for score {request.score} based on prompt: {request.prompt}"
        else:
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(request.prompt)
            generated_text = response.text
            
        db_prediction = models.AIPrediction(
            user_id=current_user.id,
            model_name="gemini-1.5-flash",
            score=request.score,
            explanation=generated_text
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        return db_prediction
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predictions", response_model=schemas.AIPredictionResponse)
def save_ai_prediction(
    prediction: schemas.AIPredictionCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_prediction = models.AIPrediction(**prediction.model_dump(), user_id=current_user.id)
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

@router.get("/predictions", response_model=List[schemas.AIPredictionResponse])
def get_user_predictions(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.AIPrediction).filter(models.AIPrediction.user_id == current_user.id).offset(skip).limit(limit).all()

@router.get("/model-metrics")
def get_model_metrics():
    import os
    import json
    metrics_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'model_metrics.json')
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            return json.load(f)
    return {"message": "Metrics not found"}

