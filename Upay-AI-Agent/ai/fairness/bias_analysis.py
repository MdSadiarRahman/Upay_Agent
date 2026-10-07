def identify_biased_features(feature_importances, sensitive_features):
    biased_features = []
    for feature, importance in feature_importances.items():
        if feature in sensitive_features and importance > 10.0:
            biased_features.append({
                "feature": feature,
                "importance": importance,
                "alert": f"High influence detected for sensitive feature: {feature}"
            })
    return biased_features

def check_group_disparities(group_metrics_list, threshold=5.0):
    alerts = []
    for metric_set in group_metrics_list:
        scores = [g['average_score'] for g in metric_set['data']]
        if not scores:
            continue
        max_score = max(scores)
        min_score = min(scores)
        diff = max_score - min_score
        
        if diff > threshold:
            alerts.append({
                "attribute": metric_set['attribute'],
                "difference": round(diff, 2),
                "message": f"Prediction difference detected between {metric_set['attribute']} groups."
            })
    return alerts
