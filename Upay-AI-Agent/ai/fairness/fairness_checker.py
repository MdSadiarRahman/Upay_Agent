import pandas as pd
from ai.fairness.fairness_metrics import calculate_group_performance, calculate_fairness_score
from ai.fairness.bias_analysis import identify_biased_features, check_group_disparities

class FairnessChecker:
    def __init__(self, protected_attributes=None):
        self.protected_attributes = protected_attributes or ["age_group", "location_group", "income_group"]
        
    def evaluate_fairness(self, dataset_path, score_col="financial_score"):
        try:
            df = pd.read_csv(dataset_path)
        except Exception as e:
            return {"error": str(e)}
            
        report = {
            "fairness_score": 0,
            "status": "UNKNOWN",
            "group_performance": [],
            "alerts": []
        }
        
        # Calculate group performance
        for attr in self.protected_attributes:
            if attr in df.columns:
                metrics = calculate_group_performance(df, attr, score_col)
                report["group_performance"].append({
                    "attribute": attr,
                    "data": metrics
                })
                
        # Disparities
        alerts = check_group_disparities(report["group_performance"])
        report["alerts"].extend(alerts)
        
        # Calculate global fairness score
        f_score = calculate_fairness_score(df, self.protected_attributes, score_col)
        report["fairness_score"] = f_score
        
        if len(alerts) > 0:
            report["status"] = "WARNING"
        elif f_score >= 90:
            report["status"] = "FAIR"
        elif f_score >= 80:
            report["status"] = "ACCEPTABLE"
        else:
            report["status"] = "BIASED"
            
        return report
