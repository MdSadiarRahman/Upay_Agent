def generate_explanation_prompt(score, positive_factors, improvement_areas):
    prompt = f"""You are a financial explanation assistant for UpayPulse AI.

Given this financial readiness score and factors, explain the reasons clearly to the customer.
Do not approve or reject loans. Only provide insights.

Input:
Score: {score}/100
Positive Factors: {', '.join(positive_factors) if positive_factors else 'None'}
Improvement Areas: {', '.join(improvement_areas) if improvement_areas else 'None'}

Output requirement:
Start with "Your financial readiness score is {score}/100 because:"
List the positive factors and improvement areas in bullet points.
Add a disclaimer: "This is not a loan approval decision. Final decision must be made by authorized financial institutions."
"""
    return prompt

def mock_gemini_explanation(score, positive_factors, improvement_areas):
    response = f"Your financial readiness score is {score}/100 because:\n\n"
    if positive_factors:
        response += "Positive Factors:\n"
        for factor in positive_factors:
            response += f"- {factor}\n"
    if improvement_areas:
        response += "\nImprovement Areas:\n"
        for area in improvement_areas:
            response += f"- {area}\n"
            
    response += "\nThis is not a loan approval decision. Final decision must be made by authorized financial institutions."
    return response
