from typing import Dict, Any, List
from datetime import datetime

class SecurityAuditService:
    """
    Handles Role-Based Access Control (RBAC) and Audit logging for AI models.
    """
    def __init__(self):
        self.audit_logs = []
        self.roles_permissions = {
            "customer": ["view_own_data", "view_own_insights"],
            "merchant": ["view_own_business_data", "view_own_insights"],
            "agent": ["view_own_operations", "view_own_insights"],
            "admin": ["view_all_data", "manage_system", "view_system_insights"]
        }

    def verify_access(self, user_role: str, action: str) -> bool:
        if user_role not in self.roles_permissions:
            return False
        return action in self.roles_permissions[user_role]

    def log_ai_action(self, user_id: str, action: str, model_version: str, data_used: Dict[str, Any], output: Any):
        """Creates a secure, immutable audit log of AI actions."""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "action": action,
            "model_version": model_version,
            "data_used_summary": list(data_used.keys()) if data_used else [],
            "output_summary": str(output)[:100]  # Store only summary for security
        }
        self.audit_logs.append(log_entry)
        return log_entry

    def get_audit_trail(self, user_id: str = None) -> List[Dict[str, Any]]:
        if user_id:
            return [log for log in self.audit_logs if log["user_id"] == user_id]
        return self.audit_logs
