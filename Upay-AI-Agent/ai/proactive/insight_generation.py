from typing import Dict, List, Any

class InsightGenerator:
    def __init__(self):
        pass
        
    def generate_recommendations(self, user_data: Dict[str, Any], patterns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate personalized suggestions based on behavior analysis.
        The AI should not make financial decisions, only provide insights.
        """
        recommendations = []
        
        # Example logic based on detected patterns
        for pattern in patterns:
            if pattern['pattern_type'] == 'unusual_spending':
                category = pattern['metadata'].get('category', 'unknown')
                recommendations.append({
                    "rec_id": f"rec_reduce_{category}",
                    "title": "Reduce Unnecessary Spending",
                    "description": f"You can save ৳1200/month by reducing unnecessary spending in {category}.",
                    "action_text": "Set a Budget",
                    "action_type": "budget_setup"
                })
                
        # Default insights if no extreme patterns
        if not recommendations:
            recommendations.append({
                "rec_id": "rec_general_savings",
                "title": "Automate Your Savings",
                "description": "Consider setting up an auto-save rule for 10% of your income.",
                "action_text": "Setup Auto-Save",
                "action_type": "auto_save"
            })
            
        return recommendations
