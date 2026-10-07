class PrivacyRules:
    @staticmethod
    def validate_query(query: str) -> bool:
        query = query.lower()
        if "another customer" in query or "other users" in query or "social security" in query:
            return False
        return True

    @staticmethod
    def validate_response(response: str) -> bool:
        # A simple check for private info leakage
        # In a real app, use NER to detect PII
        if "ssn" in response.lower() or "credit card number" in response.lower():
            return False
        return True

    @staticmethod
    def get_privacy_block_message() -> str:
        return "I cannot provide private user information."
