import pandas as pd

def load_data(filepath):
    return pd.read_csv(filepath)

def preprocess_data(df):
    features = ["Income", "Expense", "Savings", "Transactions", "LatePayment"]
    X = df[features]
    if "Score" in df.columns:
        y = df["Score"]
        return X, y
    return X, None
