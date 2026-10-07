import uuid
from typing import Dict, Any, List
from datetime import datetime

class ReviewWorkflow:
    def __init__(self):
        self.pending_reviews = {}
        self.completed_reviews = {}
        
    def submit_for_review(self, prediction_id: str, data: Dict[str, Any], score: int, confidence: int, explanation: str, risk_level: str) -> Dict[str, Any]:
        """Submits an AI prediction for human review."""
        review_task = {
            "prediction_id": prediction_id,
            "data": data,
            "score": score,
            "confidence": confidence,
            "explanation": explanation,
            "risk_level": risk_level,
            "status": "Human Review Pending",
            "timestamp": datetime.now().isoformat(),
            "reviewer": "Pending Assignment"
        }
        self.pending_reviews[prediction_id] = review_task
        return review_task

    def assign_reviewer(self, prediction_id: str, reviewer_id: str) -> bool:
        """Assigns a reviewer to a pending task."""
        if prediction_id in self.pending_reviews:
            self.pending_reviews[prediction_id]["reviewer"] = reviewer_id
            self.pending_reviews[prediction_id]["status"] = "In Progress"
            return True
        return False

    def complete_review(self, prediction_id: str, final_decision: str, review_notes: str, reviewer_id: str) -> Dict[str, Any]:
        """Completes a human review and logs the final decision."""
        if prediction_id in self.pending_reviews:
            task = self.pending_reviews.pop(prediction_id)
            task["status"] = final_decision
            task["review_notes"] = review_notes
            task["reviewer"] = reviewer_id
            task["completed_at"] = datetime.now().isoformat()
            self.completed_reviews[prediction_id] = task
            return task
        raise ValueError(f"Review task {prediction_id} not found in pending queue.")

    def get_pending_reviews(self) -> List[Dict[str, Any]]:
        return list(self.pending_reviews.values())
