from .profile_builder import CustomerProfileBuilder
from .segmentation import CustomerSegmentation
from .recommendation_engine import RecommendationEngine

class PersonalizationSystem:
    def __init__(self, user_data):
        self.user_data = user_data
        
    def generate_intelligence_report(self):
        # 1. Profile Builder
        builder = CustomerProfileBuilder(self.user_data)
        profile = builder.build_profile()
        
        # 2. Segmentation
        segment = CustomerSegmentation.get_segment(profile)
        
        # 3. Personalized Recommendation
        recommendations = RecommendationEngine.generate_advice(profile, segment, self.user_data)
        
        # 4. Personalized Offer
        personalized_offer = None
        if self.user_data.get('frequent_category') == 'medicine':
            personalized_offer = "Healthcare discount available at nearby pharmacy."
        elif segment == "Smart Saver":
            personalized_offer = "Special interest rate on new DPS opening."
            
        return {
            'profile': profile,
            'segment': segment,
            'advice': recommendations['advice'],
            'next_best_action': recommendations['next_best_action'],
            'personalized_offer': personalized_offer,
            'health_score': profile['financial_health_score']
        }
