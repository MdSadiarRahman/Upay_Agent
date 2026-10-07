from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth_router, users_router, transactions_router, merchants_router, agents_router, ai_router, financial_readiness

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="UpayPulse AI Backend", version="1.0.0")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Should be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(transactions_router.router)
app.include_router(merchants_router.router)
app.include_router(agents_router.router)
app.include_router(ai_router.router)
app.include_router(financial_readiness.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to UpayPulse AI Backend API"}
