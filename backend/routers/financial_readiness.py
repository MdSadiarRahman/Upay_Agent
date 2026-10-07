from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import joblib
import numpy as np
import json
import os
import google.generativeai as genai
import shap


router = APIRouter(prefix="/api/financial-readiness", tags=["Financial Readiness"])

# Load models
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../ai/models/xgboost_credit_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../ai/models/scaler.pkl')
FEATURES_PATH = os.path.join(os.path.dirname(__file__), '../ai/models/features.json')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    with open(FEATURES_PATH, 'r') as f:
        feature_names = json.load(f)
except Exception as e:
    print(f"Warning: ML models not found. Run train_model.py first. Error: {e}")
    model = None
    scaler = None
    feature_names = []

class ReadinessRequest(BaseModel):
    income: float
    expense: float
    savings: float
    transactions: int
    cash_out: int = 5
    digital_payment: int = 20
    late_payment: int = 0
    bill_payment_history: float = 0.9
    income_stability: float = 0.8

class ReadinessResponse(BaseModel):
    score: int
    risk_level: str
    confidence: float
    explanation: dict
    gemini_explanation: str

@router.post("/predict", response_model=ReadinessResponse)
async def predict_readiness(req: ReadinessRequest):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="ML model is not loaded.")
        
    # Feature engineering for input
    income_stability_score = req.income_stability * 100
    savings_ratio = req.savings / max(1, req.income)
    payment_reliability_score = max(0, min(100, (req.bill_payment_history * 100) - (req.late_payment * 10)))
    total_tx = max(1, req.transactions)
    digital_adoption_score = (req.digital_payment / total_tx) * 100
    cash_dependency_score = (req.cash_out / total_tx) * 100
    
    avg_tx_amount = req.expense / total_tx
    
    features_dict = {
        'monthly_income': req.income,
        'monthly_expense': req.expense,
        'savings_amount': req.savings,
        'transaction_frequency': req.transactions,
        'average_transaction_amount': avg_tx_amount,
        'cash_out_frequency': req.cash_out,
        'digital_payment_frequency': req.digital_payment,
        'bill_payment_history': req.bill_payment_history,
        'late_payment_count': req.late_payment,
        'income_stability': req.income_stability,
        'income_stability_score': income_stability_score,
        'savings_ratio': savings_ratio,
        'payment_reliability_score': payment_reliability_score,
        'digital_adoption_score': digital_adoption_score,
        'cash_dependency_score': cash_dependency_score
    }
    
    # Ensure order matches training
    x_input = np.array([features_dict[f] for f in feature_names]).reshape(1, -1)
    
    # Scale
    x_scaled = scaler.transform(x_input)
    
    # Predict
    prob = float(model.predict_proba(x_scaled)[0][1])  # Probability of class 1 (good)
    score = int(prob * 100)
    
    if score >= 80:
        risk_level = "Low"
    elif score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"
        
    try:
        explainer = shap.Explainer(model)
        # For tree models, explainer returns (num_samples, num_features) usually.
        shap_values = explainer(x_scaled)
        vals = shap_values.values[0]
        
        if len(vals.shape) > 1:
            vals = vals[:, 1]
            
        feature_contributions = list(zip(feature_names, vals))
        feature_contributions.sort(key=lambda x: x[1], reverse=True)
        
        positive_factors = [f"{feat.replace('_', ' ').title()} (+{round(val, 2)})" for feat, val in feature_contributions if val > 0.01][:3]
        risk_factors = [f"{feat.replace('_', ' ').title()} ({round(val, 2)})" for feat, val in reversed(feature_contributions) if val < -0.01][:3]
        
        explanation = {
            "positive_factors": positive_factors if positive_factors else ["Good overall financial profile"],
            "risk_factors": risk_factors if risk_factors else ["No significant risk factors"]
        }
    except Exception as e:
        print(f"SHAP explanation failed: {e}")
        explanation = {
            "positive_factors": ["Stable profile based on available features"],
            "risk_factors": []
        }
        
    # Generate human explanation using Gemini
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    You are a financial AI explainer. Explain this Machine Learning prediction to the user in a very simple, short, and encouraging way.
    
    ML Score: {score}/100
    Risk Level: {risk_level}
    Positive Factors: {', '.join(explanation['positive_factors'])}
    Risk Factors: {', '.join(explanation['risk_factors'])}
    
    Do NOT mention that you are an AI generating this. Just write the explanation. Keep it under 2 sentences.
    Example: "Your financial readiness score is high because your income is stable and your payment behavior is consistent. You can improve further by increasing savings."
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        gemini_explanation = response.text.strip()
    except Exception as e:
        gemini_explanation = f"Your score is {score}/100. Keep maintaining a good balance and savings."

    return ReadinessResponse(
        score=score,
        risk_level=risk_level,
        confidence=prob,
        explanation=explanation,
        gemini_explanation=gemini_explanation
    )

@router.get("/metrics")
async def get_metrics():
    # Returns the saved evaluation results for the Model Performance Dashboard
    eval_path = os.path.join(os.path.dirname(__file__), '../ai/models/evaluation_results.json')
    try:
        with open(eval_path, 'r') as f:
            results = json.load(f)
        return {"models": results}
    except Exception as e:
        return {"models": []}
