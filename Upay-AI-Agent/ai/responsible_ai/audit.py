import json
import uuid
from datetime import datetime
from typing import Dict, Any, List

class AuditLogger:
    """
    Module 4: Audit Logging
    Creates an audit system that stores:
    Prediction ID, Customer ID, Model Version, Features Used, Generated Score, Explanation, Reviewer, Timestamp
    """
    def __init__(self, log_path: str = "audit_logs.jsonl"):
        self.log_path = log_path

    def log_decision(
        self,
        prediction_id: str,
        customer_id: str,
        model_version: str,
        features_used: Dict[str, Any],
        generated_score: float,
        explanation: Dict[str, Any],
        reviewer: str = "Pending",
        status: str = "Pending Review"
    ) -> Dict[str, Any]:
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "prediction_id": prediction_id,
            "customer_id": customer_id,
            "model_version": model_version,
            "features_used": features_used,
            "generated_score": generated_score,
            "explanation": explanation,
            "reviewer": reviewer,
            "status": status
        }
        
        with open(self.log_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
            
        return log_entry

    def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        logs = []
        try:
            with open(self.log_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        logs.append(json.loads(line))
        except FileNotFoundError:
            return logs
            
        return logs[-limit:]
