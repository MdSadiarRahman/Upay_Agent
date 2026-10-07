import pandas as pd
from .model import FinancialReadinessModel
from ..responsible_ai.data_validation import DataValidator
from ..responsible_ai.security import SecurityAuditService
from ..responsible_ai.privacy import PrivacyManager
from ..human_review.risk_escalation import RiskEscalator

def get_financial_readiness_score(customer_data, user_id="system", model_path="model.pkl"):
    """
    customer_data: dict containing Income, Expense, Savings, Transactions, LatePayment
    """
    # 1. Privacy Manager: Anonymize data
    privacy = PrivacyManager()
    if not privacy.check_consent(user_id, "ai_scoring"):
        return None # Require consent
    
    clean_data = privacy.anonymize_data(customer_data)
    
    # 2. Data Validation: Check health
    validator = DataValidator()
    if not validator.validate_input_schema(clean_data):
        return None # Invalid data
        
    df = pd.DataFrame([clean_data])
    model = FinancialReadinessModel()
    model.load(model_path)
    score = model.predict(df)[0]
    final_score = min(max(int(round(score)), 0), 100)
    
    # 3. Security Audit: Log the AI decision
    audit = SecurityAuditService()
    audit.log_ai_decision(
        user_id=user_id,
        action="calculate_financial_readiness",
        decision=str(final_score),
        confidence=0.92 # Dummy confidence for now
    )
    
    # 4. Human Review: Escalate if high risk
    escalator = RiskEscalator()
    risk_level = escalator.evaluate_risk(final_score, "financial_readiness")
    if risk_level in ["HIGH", "CRITICAL"]:
        escalator.escalate_to_human(user_id, final_score, risk_level)
    
    return final_score

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
