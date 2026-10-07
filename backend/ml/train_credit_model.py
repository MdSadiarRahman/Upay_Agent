import os
import json
import numpy as np

def train_and_evaluate():
    print("Generating synthetic data...")
    # Simulate generating data and training models
    
    # Advanced Model (XGBoost) - simulated metrics
    metrics = {
        'baseline': {
            'accuracy': 0.72,
            'precision': 0.68,
            'recall': 0.65,
            'auc': 0.75
        },
        'xgboost': {
            'accuracy': 0.89,
            'precision': 0.86,
            'recall': 0.84,
            'auc': 0.93
        }
    }
    
    # Simulate ROC Curve Data for XGBoost
    roc_data = []
    for i in range(50):
        fpr = i / 49.0
        # ROC curve for AUC ~0.93
        tpr_xgb = 1 - (1 - fpr) ** 4
        # ROC curve for AUC ~0.75
        tpr_lr = 1 - (1 - fpr) ** 1.5
        roc_data.append({
            'fpr': round(fpr, 3),
            'tpr_xgb': round(tpr_xgb, 3),
            'tpr_lr': round(tpr_lr, 3)
        })
        
    metrics['roc_curve'] = roc_data
    
    # Simulated Feature Importance
    metrics['feature_importance'] = [
        {'name': 'cash_flow_ratio', 'importance': 0.35},
        {'name': 'return_rate', 'importance': 0.25},
        {'name': 'account_age_months', 'importance': 0.15},
        {'name': 'monthly_expenses', 'importance': 0.12},
        {'name': 'monthly_revenue', 'importance': 0.08},
        {'name': 'active_days', 'importance': 0.03},
        {'name': 'transaction_count', 'importance': 0.02}
    ]
    
    # Save outputs
    output_dir = os.path.dirname(os.path.abspath(__file__))
    
    with open(os.path.join(output_dir, 'model_metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=2)
        
    print("Training complete. Simulated models and metrics saved.")

if __name__ == "__main__":
    train_and_evaluate()
