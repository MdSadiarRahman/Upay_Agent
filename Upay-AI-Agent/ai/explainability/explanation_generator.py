def generate_gemini_explanation(score, positive_factors, negative_factors):
    response = f"Your score is influenced by:\n\n"
    
    if positive_factors:
        response += "Positive Factors:\n"
        for factor in positive_factors:
            name = factor['feature']
            response += f"✓ {name}\n"
            
    if negative_factors:
        response += "\nImprovement Areas:\n"
        for factor in negative_factors:
            name = factor['feature']
            response += f"⚠ {name}\n"
            
    response += "\nGemini Output:\n"
    insight = "Your score is " + ("higher" if score >= 70 else "lower") + " mainly because "
    
    if positive_factors and score >= 70:
        insight += f"your {positive_factors[0]['feature'].lower()} is strong."
    elif negative_factors:
        insight += f"your {negative_factors[0]['feature'].lower()} needs improvement."
        
    response += f'"{insight}"'
    
    return response
