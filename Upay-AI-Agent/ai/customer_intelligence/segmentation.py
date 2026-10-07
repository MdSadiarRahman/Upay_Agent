class CustomerSegmentation:
    @staticmethod
    def get_segment(profile):
        """
        Segments:
        1. Smart Saver (High savings, balanced spending)
        2. High Spending User (High transactions, low savings)
        3. Growing User (Moderate savings, high specific category expense)
        4. Cash Dependent User (Low digital transactions)
        """
        savings_rate = profile.get('savings_rate', 0)
        food_ratio = profile.get('food_expense_ratio', 0)
        high_trx = profile.get('high_transaction_user', False)
        
        if savings_rate >= 20.0 and food_ratio <= 30.0:
            return "Smart Saver"
        
        if savings_rate < 5.0 and high_trx:
            return "High Spending User"
            
        if savings_rate >= 5.0 and savings_rate < 20.0 and food_ratio > 25.0:
            return "Growing User"
            
        if not high_trx and savings_rate < 10.0:
            return "Cash Dependent User"
            
        return "Growing User" # Default
