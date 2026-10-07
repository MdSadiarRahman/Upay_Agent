from typing import Dict, List, Any

class SmartAlertGenerator:
    def __init__(self):
        pass
        
    def generate_alerts(self, user_data: Dict[str, Any], patterns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Create alerts for:
        - High spending
        - Low balance
        - Upcoming bills
        - Saving opportunities
        """
        alerts = []
        
        balance = user_data.get('balance', 0)
        if balance < 1000:
            alerts.append({
                "alert_id": "alert_low_balance",
                "type": "warning",
                "title": "Low Balance Alert",
                "message": f"Your current balance is critically low: ৳{balance}. Consider adding funds.",
                "priority": "high"
            })
            
        for pattern in patterns:
            if pattern['pattern_type'] == 'expense_increase':
                alerts.append({
                    "alert_id": f"alert_high_spending_{pattern['metadata'].get('increase_percent', 0)}",
                    "type": "danger",
                    "title": "High Spending Detected",
                    "message": pattern['description'],
                    "priority": "high" if pattern['severity'] == 'high' else "medium"
                })
                
        # Mock upcoming bill
        if balance > 0:
            alerts.append({
                "alert_id": "alert_upcoming_bill",
                "type": "info",
                "title": "Upcoming Bill",
                "message": "Electricity bill (৳1500) is due in 3 days.",
                "priority": "medium"
            })
            
        # Saving opportunity
        alerts.append({
            "alert_id": "alert_saving_opp",
            "type": "success",
            "title": "Saving Opportunity",
            "message": "You haven't used your Dining budget this week. Transfer to savings?",
            "priority": "low"
        })
            
        return alerts
