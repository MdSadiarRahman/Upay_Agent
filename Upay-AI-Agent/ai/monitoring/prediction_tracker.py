class PredictionTracker:
    def __init__(self):
        self.predictions = []

    def log_prediction(self, model_name, prediction_id, prediction_value):
        self.predictions.append({
            'id': prediction_id,
            'model': model_name,
            'prediction': prediction_value,
            'actual': None,
            'status': 'Pending'
        })
        
    def resolve_actual(self, prediction_id, actual_value):
        for p in self.predictions:
            if p['id'] == prediction_id:
                p['actual'] = actual_value
                
                # Simple evaluation
                if p['prediction'] == actual_value:
                    p['status'] = 'Correct Prediction'
                else:
                    p['status'] = 'Incorrect Prediction'
                return p
        return None

    def get_accuracy_report(self, model_name):
        model_preds = [p for p in self.predictions if p['model'] == model_name and p['status'] != 'Pending']
        if not model_preds:
            return {'model': model_name, 'accuracy': 0.0, 'total_resolved': 0}
            
        correct = sum(1 for p in model_preds if p['status'] == 'Correct Prediction')
        return {
            'model': model_name,
            'accuracy': (correct / len(model_preds)) * 100,
            'total_resolved': len(model_preds)
        }
