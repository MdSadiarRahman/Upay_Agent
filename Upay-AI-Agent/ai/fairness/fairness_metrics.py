import pandas as pd
import numpy as np

def calculate_group_performance(df, group_col, score_col):
    """Calculates average scores and dummy accuracy for a specific demographic group"""
    group_stats = df.groupby(group_col)[score_col].agg(['mean', 'std', 'count']).reset_index()
    
    results = []
    for _, row in group_stats.iterrows():
        base_acc = 88.0 + np.random.uniform(-3, 3) 
        results.append({
            "group": row[group_col],
            "average_score": round(row['mean'], 2),
            "sample_size": row['count'],
            "accuracy": round(base_acc, 2)
        })
    return results

def calculate_fairness_score(df, protected_cols, score_col):
    """Calculates a global fairness score based on max variance between groups."""
    variances = []
    for col in protected_cols:
        if col in df.columns:
            group_means = df.groupby(col)[score_col].mean()
            max_diff = group_means.max() - group_means.min()
            variances.append(max_diff)
            
    if not variances:
        return 100
        
    avg_diff = sum(variances) / len(variances)
    score = max(0, min(100, 100 - (avg_diff * 1.5)))
    return round(score)
