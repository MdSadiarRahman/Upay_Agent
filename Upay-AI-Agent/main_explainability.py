import pandas as pd
from ai.financial_readiness.model import FinancialReadinessModel
from ai.explainability.shap_explainer import ShapExplainer
from ai.explainability.feature_importance import rank_features
from ai.explainability.explanation_generator import generate_gemini_explanation
from ai.audit.audit_logger import AuditLogger

def main():
    print("--- Loading ML Model ---")
    model_container = FinancialReadinessModel()
    model_container.load("model.pkl")
    
    # Initialize Explainer
    explainer = ShapExplainer(model_container.model)
    audit_logger = AuditLogger(log_file="audit_log.json")
    
    print("--- Testing Explanations ---")
    customer_data = {
        "Income": 60000,
        "Expense": 40000,
        "Savings": 15000,
        "Transactions": 50,
        "LatePayment": 0
    }
    df = pd.DataFrame([customer_data])
    
    # Prediction
    score_raw = model_container.predict(df)[0]
    score = min(max(int(round(score_raw)), 0), 100)
    
    # SHAP Explanations
    features = list(df.columns)
    contributions = explainer.get_feature_contributions(df, features)
    
    pos_factors, neg_factors = rank_features(contributions)
    
    # Gemini Explanation
    explanation = generate_gemini_explanation(score, pos_factors, neg_factors)
    
    # Audit Logging
    audit_logger.log_decision(
        user_id="C102",
        features=customer_data,
        score=score,
        explanation=explanation
    )
    
    print("Customer: C102")
    print(f"Data: {customer_data}")
    print(f"Calculated Score: {score}/100\n")
    print("--- SHAP / Gemini Explanation ---")
    print(explanation)
    print("\n--- Audit Log Created successfully in audit_log.json ---")

if __name__ == "__main__":
    main()
