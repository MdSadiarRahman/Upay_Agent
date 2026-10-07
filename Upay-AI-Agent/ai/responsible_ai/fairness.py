from typing import Dict, Any, List

class FairnessMonitor:
    """
    Module 3: Fairness Monitoring
    Analyzes demographic fairness across Age, Location, and Income groups.
    Generates a Fairness Score and Bias Detection Report.
    """
    
    def __init__(self):
        # Disparate impact thresholds
        self.fairness_threshold = 0.8 

    def evaluate_fairness(self, batch_predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Evaluates fairness across different groups.
        """
        
        # In a real implementation, this would compute the disparate impact ratio,
        # equal opportunity difference, demographic parity, etc.
        # This simulates the output of an evaluation.
        
        age_bias_score = 0.95  # 1.0 is perfectly fair
        location_bias_score = 0.92
        income_bias_score = 0.85
        
        overall_fairness = (age_bias_score + location_bias_score + income_bias_score) / 3
        
        report = {
            "overall_fairness_score": round(overall_fairness * 100, 2),
            "status": "Fair" if overall_fairness >= self.fairness_threshold else "Review Required",
            "bias_metrics": {
                "age_bias": "Low" if age_bias_score >= 0.9 else ("Medium" if age_bias_score >= 0.8 else "High"),
                "location_bias": "Low" if location_bias_score >= 0.9 else ("Medium" if location_bias_score >= 0.8 else "High"),
                "income_bias": "Low" if income_bias_score >= 0.9 else ("Medium" if income_bias_score >= 0.8 else "High")
            },
            "recommendations": []
        }
        
        if income_bias_score < 0.9:
            report["recommendations"].append("Monitor income-based rejection rates. Possible algorithmic bias detected.")
            
        return report
