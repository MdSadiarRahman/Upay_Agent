from datetime import datetime

class FeedbackLoop:
    def __init__(self):
        self.feedbacks = []
        
    def log_feedback(self, recommendation_id, context, result, status="Successful"):
        """
        Logs feedback for an AI recommendation.
        Example: 
        context: "Launch campaign at 5 PM"
        result: "Sales increased 20%"
        status: "Successful"
        """
        fb = {
            'id': recommendation_id,
            'timestamp': datetime.now().isoformat(),
            'context': context,
            'result': result,
            'status': status
        }
        self.feedbacks.append(fb)
        return fb
        
    def get_summary(self):
        successful = sum(1 for f in self.feedbacks if f['status'] == 'Successful')
        total = len(self.feedbacks)
        return {
            'total_feedback': total,
            'successful': successful,
            'success_rate': (successful / total) * 100 if total > 0 else 0
        }
