class CustomerProfileBuilder:
    def __init__(self, user_data):
        self.user_data = user_data

    def build_profile(self):
        """
        Builds a Customer 360 Financial Profile.
        user_data example:
        {
            'income': 50000,
            'food_expense': 15000,
            'savings': 5000,
            'transactions_per_month': 45
        }
        """
        income = self.user_data.get('income', 1)
        savings = self.user_data.get('savings', 0)
        food_expense = self.user_data.get('food_expense', 0)
        
        savings_rate = savings / income
        food_ratio = food_expense / income

        profile = {
            'savings_rate': round(savings_rate * 100, 2),
            'food_expense_ratio': round(food_ratio * 100, 2),
            'high_transaction_user': self.user_data.get('transactions_per_month', 0) > 30,
            'financial_health_score': self._calculate_health_score(savings_rate, food_ratio)
        }
        return profile

    def _calculate_health_score(self, savings_rate, food_ratio):
        score = 50 # Base score
        
        # Savings impact
        if savings_rate >= 0.2:
            score += 30
        elif savings_rate >= 0.1:
            score += 15
            
        # Expense impact
        if food_ratio > 0.4:
            score -= 15
        elif food_ratio <= 0.2:
            score += 15
            
        return min(max(score, 0), 100)
