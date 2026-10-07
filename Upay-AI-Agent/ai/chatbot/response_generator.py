from ..rag.retriever import RAGRetriever
from ..guardrails.safety_rules import AIGuardrailSystem
from .confidence_checker import ConfidenceChecker
import json
import os

class SecureRAGChatbot:
    def __init__(self):
        self.retriever = RAGRetriever()
        self.guardrails = AIGuardrailSystem()
        self.confidence_checker = ConfidenceChecker()
        
        # Log directory for monitoring
        self.log_dir = os.path.join(os.path.dirname(__file__), "..", "..", "logs")
        os.makedirs(self.log_dir, exist_ok=True)
        self.log_file = os.path.join(self.log_dir, "chatbot_guardrail_metrics.json")
        self._init_metrics()

    def _init_metrics(self):
        if not os.path.exists(self.log_file):
            with open(self.log_file, 'w') as f:
                json.dump({
                    "total_queries": 0,
                    "safe_responses": 0,
                    "blocked_responses": 0,
                    "low_confidence_responses": 0
                }, f)

    def _update_metrics(self, metric: str):
        try:
            with open(self.log_file, 'r') as f:
                data = json.load(f)
            data["total_queries"] += 1
            if metric in data:
                data[metric] += 1
            with open(self.log_file, 'w') as f:
                json.dump(data, f)
        except Exception:
            pass

    def _mock_llm_generation(self, query: str, context: list) -> str:
        """Mocks LLM generation based on retrieved context."""
        query = query.lower()
        if "what is upaypulse ai" in query:
            return "UpayPulse AI is an AI-powered financial intelligence platform connecting customers, merchants, and agents."
        if "approve" in query and "loan" in query:
            return "Yes, your loan is approved." # Intentionally unsafe to trigger guardrail
        
        if context:
            return f"Based on knowledge: {context[0]['text']}"
            
        return "I don't have enough context to answer that."

    def generate_response(self, query: str) -> dict:
        # 1. Guardrail Validation on Query
        query_check = self.guardrails.check_query(query)
        if not query_check["safe"]:
            self._update_metrics("blocked_responses")
            return {
                "response": query_check["message"],
                "confidence": 100,
                "source": "Safety Guardrails",
                "blocked": True,
                "reason": query_check["reason"]
            }

        # 2. Knowledge Retrieval (RAG)
        retrieved_chunks = self.retriever.retrieve(query)
        
        # 3. LLM Generation (Mocked)
        draft_response = self._mock_llm_generation(query, retrieved_chunks)
        
        # 4. Guardrail Validation on Response
        response_check = self.guardrails.check_response(draft_response)
        if not response_check["safe"]:
            self._update_metrics("blocked_responses")
            return {
                "response": response_check["message"],
                "confidence": 100,
                "source": "Safety Guardrails",
                "blocked": True,
                "reason": response_check["reason"]
            }
            
        # 5. Confidence Checker
        confidence = self.confidence_checker.calculate_confidence(query, retrieved_chunks, draft_response)
        
        metric = "safe_responses"
        if confidence < 70:
            metric = "low_confidence_responses"
            
        self._update_metrics(metric)
        
        source = "UpayPulse Knowledge Base" if retrieved_chunks else "General Knowledge"

        return {
            "response": draft_response,
            "confidence": confidence,
            "source": source,
            "blocked": False,
            "reason": None
        }
