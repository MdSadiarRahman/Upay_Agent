from datetime import datetime

class AIAlertSystem:
    def __init__(self):
        self.alerts = []
        
    def check_accuracy_drop(self, model_name, prev_accuracy, current_accuracy, threshold=5.0):
        if prev_accuracy - current_accuracy > threshold:
            alert = {
                'id': f"alert_{len(self.alerts) + 1}",
                'timestamp': datetime.now().isoformat(),
                'type': 'Warning',
                'model': model_name,
                'message': 'Model performance decreased.',
                'details': {
                    'Previous': f"{prev_accuracy}%",
                    'Current': f"{current_accuracy}%"
                },
                'action': 'Review training data.'
            }
            self.alerts.append(alert)
            return alert
        return None
        
    def add_custom_alert(self, level, model_name, message, action):
        alert = {
            'id': f"alert_{len(self.alerts) + 1}",
            'timestamp': datetime.now().isoformat(),
            'type': level,
            'model': model_name,
            'message': message,
            'action': action
        }
        self.alerts.append(alert)
        return alert

    def get_recent_alerts(self, limit=10):
        return self.alerts[-limit:]
