import pandas as pd
from xgboost import XGBRegressor
import joblib

class FinancialReadinessModel:
    def __init__(self):
        self.model = XGBRegressor(n_estimators=100, learning_rate=0.05, max_depth=3)

    def train(self, X, y):
        self.model.fit(X, y)
        
    def save(self, filepath="model.pkl"):
        joblib.dump(self.model, filepath)

    def load(self, filepath="model.pkl"):
        self.model = joblib.load(filepath)

    def predict(self, X):
        return self.model.predict(X)
