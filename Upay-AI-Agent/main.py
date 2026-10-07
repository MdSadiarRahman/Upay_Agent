from ai.financial_readiness.preprocessing import load_data, preprocess_data
from ai.financial_readiness.model import FinancialReadinessModel
from ai.financial_readiness.prediction import get_financial_readiness_score, get_risk_factors
from ai.financial_readiness.explanation import mock_gemini_explanation
import os

def main():
    print("--- Training ML Model ---")
    data_path = os.path.join("dataset", "customer_financial_data.csv")
    df = load_data(data_path)
    X, y = preprocess_data(df)
    
    model = FinancialReadinessModel()
    model.train(X, y)
    model.save("model.pkl")
    print("Model trained and saved successfully.\n")

    print("--- Testing Predictions ---")
    customer_a = {
        "Income": 60000,
        "Expense": 40000,
        "Savings": 15000,
        "Transactions": 40,
        "LatePayment": 0
    }
    
    customer_b = {
        "Income": 30000,
        "Expense": 28000,
        "Savings": 2000,
        "Transactions": 20,
        "LatePayment": 3
    }
    
    for name, data in [("Customer A", customer_a), ("Customer B", customer_b)]:
        score = get_financial_readiness_score(data, "model.pkl")
        pos_factors, imp_areas = get_risk_factors(data)
        explanation = mock_gemini_explanation(score, pos_factors, imp_areas)
        
        print(f"Results for {name}:")
        print(f"Data: {data}")
        print(f"Calculated ML Readiness Score: {score}/100")
        print("\n--- Gemini Explanation ---")
        print(explanation)
        print("--------------------------------------------------\n")

if __name__ == "__main__":
    main()
