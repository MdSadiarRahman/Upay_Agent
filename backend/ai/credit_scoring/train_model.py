import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib
import os
import json

def engineer_features(df):
    df = df.copy()
    # Income Stability Score (0-100)
    df['income_stability_score'] = df['income_stability'] * 100
    
    # Savings Ratio
    df['savings_ratio'] = df['savings_amount'] / np.maximum(1, df['monthly_income'])
    
    # Payment Reliability Score
    df['payment_reliability_score'] = (df['bill_payment_history'] * 100) - (df['late_payment_count'] * 10)
    df['payment_reliability_score'] = df['payment_reliability_score'].clip(0, 100)
    
    # Digital Adoption Score
    total_tx = np.maximum(1, df['transaction_frequency'])
    df['digital_adoption_score'] = (df['digital_payment_frequency'] / total_tx) * 100
    
    # Cash Dependency Score
    df['cash_dependency_score'] = (df['cash_out_frequency'] / total_tx) * 100
    
    return df

def train_and_evaluate():
    print("Loading dataset...")
    df = pd.read_csv('../../dataset/customer_transactions.csv')
    
    print("Engineering features...")
    df = engineer_features(df)
    
    features = [
        'monthly_income', 'monthly_expense', 'savings_amount', 'transaction_frequency',
        'average_transaction_amount', 'cash_out_frequency', 'digital_payment_frequency',
        'bill_payment_history', 'late_payment_count', 'income_stability',
        'income_stability_score', 'savings_ratio', 'payment_reliability_score',
        'digital_adoption_score', 'cash_dependency_score'
    ]
    
    X = df[features]
    y = df['financial_label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'XGBoost': XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    
    results = []
    
    print("Training models...")
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_prob = model.predict_proba(X_test_scaled)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_prob)
        
        results.append({
            'Model': name,
            'Accuracy': round(acc * 100, 1),
            'Precision': round(prec * 100, 1),
            'Recall': round(rec * 100, 1),
            'F1': round(f1 * 100, 1),
            'AUC': round(auc, 2)
        })
        print(f"{name} -> Accuracy: {acc*100:.1f}%, AUC: {auc:.2f}")

    best_model = models['XGBoost'] # Requirement asks for XGBoost to be final model
    
    os.makedirs('../../ai/models', exist_ok=True)
    joblib.dump(best_model, '../../ai/models/xgboost_credit_model.pkl')
    joblib.dump(scaler, '../../ai/models/scaler.pkl')
    
    # Save feature names for explanation
    with open('../../ai/models/features.json', 'w') as f:
        json.dump(features, f)
        
    with open('../../ai/models/evaluation_results.json', 'w') as f:
        json.dump(results, f, indent=4)
        
    print("Model and scaler saved to backend/ai/models/")

if __name__ == "__main__":
    train_and_evaluate()
