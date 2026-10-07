import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class PatternDetector:
    def __init__(self):
        # In a real scenario, this would load historical data models
        pass
        
    def detect_spending_patterns(self, user_data: Dict[str, Any], historical_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detects anomalous spending patterns such as:
        - Expense increase
        - Category changes
        - Unusual spending
        """
        patterns = []
        try:
            current_expenses = user_data.get('total_expenses', 0)
            avg_historical = sum([d.get('total_expenses', 0) for d in historical_data]) / max(len(historical_data), 1)
            
            if current_expenses > avg_historical * 1.2:
                increase_percent = int(((current_expenses / avg_historical) - 1) * 100)
                patterns.append({
                    "pattern_type": "expense_increase",
                    "severity": "high" if increase_percent > 40 else "medium",
                    "description": f"Total expenses increased {increase_percent}% compared to your average.",
                    "metadata": {"increase_percent": increase_percent}
                })
                
            current_breakdown = user_data.get('expense_breakdown', {})
            # Simplified historical breakdown comparison
            for category, amount in current_breakdown.items():
                if amount > 5000: # Arbitrary threshold for "unusual" in this context
                    patterns.append({
                        "pattern_type": "unusual_spending",
                        "severity": "medium",
                        "description": f"Unusually high spending in {category} category.",
                        "metadata": {"category": category, "amount": amount}
                    })
                    
            return patterns
        except Exception as e:
            logger.error(f"Error in pattern detection: {str(e)}")
            return []
