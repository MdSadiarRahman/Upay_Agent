import shap

class ShapExplainer:
    def __init__(self, model):
        self.model = model
        self.explainer = shap.TreeExplainer(model)
        
    def get_shap_values(self, X):
        return self.explainer.shap_values(X)
        
    def get_feature_contributions(self, X, feature_names):
        shap_values = self.get_shap_values(X)
        contributions = []
        
        if len(X.shape) == 1 or X.shape[0] == 1:
            values = shap_values[0] if len(shap_values.shape) > 1 else shap_values
            for name, val in zip(feature_names, values):
                contributions.append({
                    "feature": name,
                    "contribution": float(val)
                })
        return contributions
