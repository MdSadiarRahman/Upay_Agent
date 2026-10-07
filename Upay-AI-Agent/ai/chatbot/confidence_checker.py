class ConfidenceChecker:
    @staticmethod
    def calculate_confidence(query: str, retrieved_chunks: list, generated_response: str) -> int:
        """
        Calculates a mock confidence score from 0-100 based on the relevance of the retrieved chunks.
        In a real RAG system, you'd use cross-encoders or log-probabilities from the LLM.
        """
        if not retrieved_chunks:
            return 20 # Low confidence without knowledge grounding
            
        # For our simple simulation, we'll use the retrieval score
        max_retrieval_score = max([chunk['score'] for chunk in retrieved_chunks])
        
        # Scale score to 0-100 (assuming retrieval score is roughly between 0-1)
        base_confidence = min(int(max_retrieval_score * 100 + 40), 95)
        
        # Give a boost if it's a known question
        if "what is upaypulse ai" in query.lower():
            return 98
            
        return base_confidence
