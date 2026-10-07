from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models, auth
from database import get_db

router = APIRouter(prefix="/api/merchants", tags=["merchants"])

@router.post("/", response_model=schemas.MerchantResponse)
def create_merchant(
    merchant: schemas.MerchantCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(["Admin", "Merchant"]))
):
    db_merchant = models.Merchant(**merchant.model_dump())
    db.add(db_merchant)
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

@router.get("/", response_model=List[schemas.MerchantResponse])
def get_merchants(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Merchant).offset(skip).limit(limit).all()
