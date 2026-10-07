from typing import Dict, Any, List

class PrivacyManager:
    """
    Handles data anonymization, consent management, and permission checks
    for the AI system to ensure user privacy.
    """
    def __init__(self):
        self.user_consents = {}

    def update_consent(self, user_id: str, permissions: Dict[str, bool]):
        self.user_consents[user_id] = permissions
        return {"status": "success", "user_id": user_id, "permissions": permissions}

    def has_permission(self, user_id: str, required_feature: str) -> bool:
        if user_id not in self.user_consents:
            return False
        return self.user_consents[user_id].get(required_feature, False)

    def anonymize_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Anonymizes sensitive user data before AI processing."""
        anonymized = data.copy()
        
        # Remove PII (Personally Identifiable Information)
        pii_fields = ["name", "email", "phone", "address", "ssn", "nid"]
        for field in pii_fields:
            if field in anonymized:
                del anonymized[field]
                
        # Hash or mask identifier
        if "user_id" in anonymized:
            anonymized["user_id"] = f"ANON_{hash(anonymized['user_id']) % 10000}"
            
        return anonymized
