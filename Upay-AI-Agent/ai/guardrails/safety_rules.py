from .financial_rules import FinancialRules
from .privacy_rules import PrivacyRules

class AIGuardrailSystem:
    """Master guardrail system validating queries and responses."""
    def __init__(self):
        self.financial = FinancialRules()
        self.privacy = PrivacyRules()

    def check_query(self, query: str) -> dict:
        if not self.privacy.validate_query(query):
            return {"safe": False, "reason": "privacy", "message": self.privacy.get_privacy_block_message()}
            
        if not self.financial.validate_query(query):
            return {"safe": False, "reason": "financial", "message": self.financial.get_financial_block_message()}
            
        return {"safe": True, "reason": None, "message": ""}

    def check_response(self, response: str) -> dict:
        if not self.privacy.validate_response(response):
            return {"safe": False, "reason": "privacy", "message": self.privacy.get_privacy_block_message()}
            
        if not self.financial.validate_response(response):
            return {"safe": False, "reason": "financial", "message": self.financial.get_financial_block_message()}
            
        return {"safe": True, "reason": None, "message": ""}
