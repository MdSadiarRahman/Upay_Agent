from typing import Dict, Any, List
import random

class ExplainableAI:
    """
    Module 1: Explainable AI
    Implements SHAP/LIME based explanation generation.
    Returns Score, Positive Factors, and Negative Factors.
    """
    
    def __init__(self, model_version: str = "XGBoost v1"):
        self.model_version = model_version
        
    def generate_explanation(self, customer_data: Dict[str, Any], generated_score: float) -> Dict[str, Any]:
        """
        Simulates generating SHAP/LIME feature importance explanations.
        In a real scenario, this would use the shap or lime python packages against the ML model.
        """
        
        # Example positive and negative factors
        factors = [
            {"feature": "Income Stability", "impact": 25, "type": "positive"},
            {"feature": "Payment History", "impact": 20, "type": "positive"},
            {"feature": "Transaction Pattern", "impact": 15, "type": "positive"},
            {"feature": "Low Savings", "impact": -10, "type": "negative"},
            {"feature": "High Cash Withdrawal", "impact": -8, "type": "negative"},
            {"feature": "Credit Utilization", "impact": -5, "type": "negative"},
            {"feature": "Account Age", "impact": 10, "type": "positive"}
        ]
        
        # Select some factors based on data to simulate dynamic explainability
        positive_factors = [f for f in factors if f["type"] == "positive"]
        negative_factors = [f for f in factors if f["type"] == "negative"]
        
        # Randomly select to simulate different profiles
        selected_positive = random.sample(positive_factors, min(3, len(positive_factors)))
        selected_negative = random.sample(negative_factors, min(2, len(negative_factors)))
        
        return {
            "score": generated_score,
            "model": self.model_version,
            "positive_factors": selected_positive,
            "negative_factors": selected_negative,
            "interpretation": f"Score is primarily driven by {selected_positive[0]['feature']} and offset by {selected_negative[0]['feature']}."
        }
