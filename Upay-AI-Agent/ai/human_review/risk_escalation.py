from typing import Dict, Any

class RiskEscalationManager:
    def __init__(self, risk_threshold: int = 50, medium_risk_threshold: int = 80, confidence_threshold: int = 80):
        self.high_risk_threshold = risk_threshold
        self.medium_risk_threshold = medium_risk_threshold
        self.confidence_threshold = confidence_threshold

    def evaluate_escalation(self, score: int, confidence: int) -> Dict[str, Any]:
        """
        Evaluates whether a decision needs human review based on risk score and AI confidence.
        
        Rules:
        - If score < 50 (High Risk): Mandatory Review
        - If score >= 50 and score <= 80 (Medium Risk): Recommended Review
        - If confidence < 80: Mandatory Review regardless of score
        """
        
        needs_review = False
        escalation_reason = []
        risk_level = "Low"
        
        if score < self.high_risk_threshold:
            needs_review = True
            escalation_reason.append("High Risk Score (Score < 50)")
            risk_level = "High"
        elif score <= self.medium_risk_threshold:
            escalation_reason.append("Medium Risk Score (50-80)")
            risk_level = "Medium"
            # Medium risk might not be strictly mandatory, but recommended
            needs_review = True
            
        if confidence < self.confidence_threshold:
            needs_review = True
            escalation_reason.append(f"Low AI Confidence (Confidence < {self.confidence_threshold}%)")
            
        # Even if score is > 80 (Low Risk), if confidence is low, it still escalates.
        if score > self.medium_risk_threshold and not needs_review:
            risk_level = "Low"
            
        return {
            "requires_human_review": needs_review,
            "risk_level": risk_level,
            "reasons": escalation_reason
        }
