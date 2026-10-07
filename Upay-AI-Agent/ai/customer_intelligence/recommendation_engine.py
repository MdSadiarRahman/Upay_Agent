class RecommendationEngine:
    @staticmethod
    def generate_advice(profile, segment, user_data):
        advice = []
        next_best_action = ""
        
        food_expense = user_data.get('food_expense', 0)
        
        if segment == "Smart Saver":
            advice.append("Great job maintaining a high savings rate!")
            next_best_action = "Invest in long-term deposit schemes."
            
        elif segment == "High Spending User":
            advice.append("Your expenses are high compared to savings.")
            next_best_action = "Set up an automatic monthly savings goal."
            
        elif segment == "Growing User":
            if profile.get('food_expense_ratio', 0) > 25.0:
                potential_savings = int(food_expense * 0.1) # 10% reduction
                advice.append(f"Your food expenses are slightly high. Reducing food delivery twice per week can save approximately ৳{potential_savings} monthly.")
            else:
                advice.append("Your financial habits are improving.")
            next_best_action = "Reduce unnecessary spending and increase monthly savings target."
            
        elif segment == "Cash Dependent User":
            advice.append("You could save more by using digital payments instead of cash-outs.")
            next_best_action = "Find a nearby digital merchant for your next payment."
            
        return {
            'advice': advice,
            'next_best_action': next_best_action
        }
