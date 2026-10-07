from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models, auth
from database import get_db

router = APIRouter(prefix="/api/agents", tags=["agents"])

@router.post("/", response_model=schemas.AgentResponse)
def create_agent(
    agent: schemas.AgentCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(["Admin", "Agent"]))
):
    db_agent = models.Agent(**agent.model_dump())
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.get("/", response_model=List[schemas.AgentResponse])
def get_agents(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Agent).offset(skip).limit(limit).all()
