import json
import datetime
import os

class AuditLogger:
    def __init__(self, log_file="audit_log.json"):
        self.log_file = log_file
        
    def log_decision(self, user_id, features, score, explanation, reviewer_status="Pending Human Review"):
        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "user_id": user_id,
            "features_used": features,
            "model_output": score,
            "explanation_generated": explanation,
            "reviewer_status": reviewer_status
        }
        
        logs = []
        if os.path.exists(self.log_file):
            with open(self.log_file, "r") as f:
                try:
                    logs = json.load(f)
                except:
                    pass
                    
        logs.append(log_entry)
        
        with open(self.log_file, "w") as f:
            json.dump(logs, f, indent=4)
            
        return log_entry
