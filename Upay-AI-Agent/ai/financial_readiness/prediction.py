import pandas as pd
from .model import FinancialReadinessModel

def get_financial_readiness_score(customer_data, model_path="model.pkl"):
    """
    customer_data: dict containing Income, Expense, Savings, Transactions, LatePayment
    """
    df = pd.DataFrame([customer_data])
    model = FinancialReadinessModel()
    model.load(model_path)
    score = model.predict(df)[0]
    return min(max(int(round(score)), 0), 100)

def get_risk_factors(customer_data):
    positive = []
    improvement = []
    
    if customer_data["LatePayment"] == 0:
        positive.append("Good payment history")
    else:
        improvement.append("Reduce late payments")
        
    if customer_data["Savings"] >= customer_data["Income"] * 0.2:
        positive.append("Strong savings habit")
    else:
        improvement.append("Increase emergency savings")
        
    if customer_data["Transactions"] > 30:
        positive.append("Consistent transaction behavior")
    
    if customer_data["Expense"] > customer_data["Income"] * 0.8:
        improvement.append("Reduce unnecessary expenses")
        
    return positive, improvement
