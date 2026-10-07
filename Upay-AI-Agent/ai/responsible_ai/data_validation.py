from typing import Dict, Any, List

class DataValidationService:
    """
    Validates data quality before feeding it to AI models.
    Checks for missing values, outliers, and ensures dataset health.
    """
    def __init__(self):
        pass

    def validate_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates individual data records and computes a health score.
        """
        missing_fields = []
        outliers = []
        
        # 1. Missing Values Check
        expected_fields = ["monthly_income", "transactions_count", "savings_ratio", "payment_history"]
        for field in expected_fields:
            if field not in data or data[field] is None:
                missing_fields.append(field)
                
        # 2. Basic Outlier Check (Rule-based example)
        if data.get("monthly_income", 0) > 10000000:  # Example: 10M BDT might be an outlier for a regular user
            outliers.append("monthly_income (unusually high)")
        if data.get("savings_ratio", 0) < 0 or data.get("savings_ratio", 0) > 100:
            outliers.append("savings_ratio (must be 0-100)")
            
        # 3. Calculate Health Score
        base_score = 100
        penalty_per_missing = 15
        penalty_per_outlier = 10
        
        health_score = base_score - (len(missing_fields) * penalty_per_missing) - (len(outliers) * penalty_per_outlier)
        health_score = max(0, min(100, health_score))
        
        return {
            "health_score": health_score,
            "is_valid": health_score >= 80,
            "missing_fields": missing_fields,
            "outliers": outliers
        }

    def aggregate_dataset_health(self, dataset: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Evaluates health of a batch dataset."""
        if not dataset:
            return {"dataset_health_score": 0, "completeness": 0, "outlier_rate": 0, "duplicate_rate": 0}
            
        total_records = len(dataset)
        valid_records = 0
        total_outliers = 0
        
        for record in dataset:
            validation = self.validate_data(record)
            if validation["is_valid"]:
                valid_records += 1
            if validation["outliers"]:
                total_outliers += 1
                
        completeness = (valid_records / total_records) * 100
        outlier_rate = (total_outliers / total_records) * 100
        duplicate_rate = 0.5  # Mocked duplicate calculation
        
        health_score = (completeness * 0.8) + ((100 - outlier_rate) * 0.1) + ((100 - duplicate_rate) * 0.1)
        
        return {
            "dataset_health_score": round(health_score, 1),
            "completeness": round(completeness, 1),
            "outlier_rate": round(outlier_rate, 1),
            "duplicate_rate": round(duplicate_rate, 1)
        }
