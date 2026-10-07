import json
import os
from datetime import datetime
from typing import Dict, Any

class AuditService:
    def __init__(self, log_dir: str = "logs"):
        self.log_dir = log_dir
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)
        self.audit_file = os.path.join(self.log_dir, "human_review_audit_log.jsonl")

    def log_review_action(self, prediction_id: str, action: str, details: Dict[str, Any], user_id: str = "system"):
        """Logs any action taken during the human review process."""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "prediction_id": prediction_id,
            "action": action,
            "user_id": user_id,
            "details": details
        }
        
        with open(self.audit_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(log_entry) + "\n")
            
        return log_entry

    def get_audit_trail(self, prediction_id: str) -> list:
        """Retrieves the audit trail for a specific prediction ID."""
        trail = []
        if not os.path.exists(self.audit_file):
            return trail
            
        with open(self.audit_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    entry = json.loads(line)
                    if entry.get("prediction_id") == prediction_id:
                        trail.append(entry)
        return trail
