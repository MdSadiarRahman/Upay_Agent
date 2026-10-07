from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Users
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

# Authentication
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# Transactions
class TransactionBase(BaseModel):
    amount: float
    type: str
    status: str

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        from_attributes = True

# Merchants
class MerchantBase(BaseModel):
    business_name: str
    category: str
    revenue: float

class MerchantCreate(MerchantBase):
    pass

class MerchantResponse(MerchantBase):
    id: int
    class Config:
        from_attributes = True

# Agents
class AgentBase(BaseModel):
    location: str
    cash_balance: float
    risk_score: float

class AgentCreate(AgentBase):
    pass

class AgentResponse(AgentBase):
    id: int
    class Config:
        from_attributes = True

# AI Predictions
class AIPredictionBase(BaseModel):
    model_name: str
    score: float
    explanation: str

class AIPredictionCreate(AIPredictionBase):
    pass

class AIPredictionResponse(AIPredictionBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True
