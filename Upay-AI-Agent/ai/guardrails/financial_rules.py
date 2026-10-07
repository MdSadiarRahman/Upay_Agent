class FinancialRules:
    @staticmethod
    def validate_query(query: str) -> bool:
        """Returns True if the query is safe, False if it violates financial rules."""
        query = query.lower()
        if "approve" in query and "loan" in query:
            return False
        if "guarantee" in query and "return" in query:
            return False
        return True

    @staticmethod
    def validate_response(response: str) -> bool:
        """Returns True if the response is safe, False if it violates financial rules."""
        response = response.lower()
        forbidden_phrases = [
            "your loan is approved",
            "i can approve your loan",
            "guaranteed return",
            "100% risk free"
        ]
        return not any(phrase in response for phrase in forbidden_phrases)

    @staticmethod
    def get_financial_block_message() -> str:
        return "No. UpayPulse AI provides financial insights only. Final decisions require authorized review."
