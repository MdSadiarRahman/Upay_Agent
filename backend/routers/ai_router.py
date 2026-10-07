from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models, auth
from database import get_db

router = APIRouter(prefix="/api/ai", tags=["ai"])

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
