import pandas as pd
import numpy as np
import os

def generate_data(num_records=1000):
    np.random.seed(42)
    
    customer_ids = [f"C{str(i).zfill(3)}" for i in range(1, num_records + 1)]
    monthly_incomes = np.random.normal(50000, 20000, num_records)
    monthly_incomes = np.clip(monthly_incomes, 10000, 200000)
    
    # Expense is some fraction of income
    expense_ratios = np.random.uniform(0.4, 0.95, num_records)
    monthly_expenses = monthly_incomes * expense_ratios
    
    # Savings is roughly income - expense, plus some randomness
    savings_amounts = np.maximum(0, monthly_incomes - monthly_expenses) * np.random.uniform(0.8, 1.2, num_records)
    
    transaction_frequencies = np.random.poisson(30, num_records)
    average_transaction_amounts = monthly_expenses / np.maximum(1, transaction_frequencies)
    
    cash_out_frequencies = np.random.poisson(5, num_records)
    digital_payment_frequencies = np.maximum(0, transaction_frequencies - cash_out_frequencies)
    
    bill_payment_histories = np.random.uniform(0.5, 1.0, num_records)
    late_payment_counts = np.random.poisson(1, num_records)
    income_stabilities = np.random.uniform(0.3, 1.0, num_records)
    
    # Target label: 1 if good, 0 if risky
    # High savings, high income stability, low late payments -> good
    scores = (
        (savings_amounts / monthly_incomes) * 100
        + (income_stabilities * 50)
        + (bill_payment_histories * 30)
        - (late_payment_counts * 20)
        - (cash_out_frequencies * 2)
    )
    
    # Normalize score roughly to see what it is
    threshold = np.percentile(scores, 40) # Bottom 40% are 0, top 60% are 1
    financial_labels = (scores >= threshold).astype(int)

    df = pd.DataFrame({
        'customer_id': customer_ids,
        'age': np.random.randint(18, 65, num_records),
        'monthly_income': np.round(monthly_incomes),
        'monthly_expense': np.round(monthly_expenses),
        'savings_amount': np.round(savings_amounts),
        'transaction_frequency': transaction_frequencies,
        'average_transaction_amount': np.round(average_transaction_amounts),
        'cash_out_frequency': cash_out_frequencies,
        'digital_payment_frequency': digital_payment_frequencies,
        'bill_payment_history': bill_payment_histories,
        'late_payment_count': late_payment_counts,
        'income_stability': income_stabilities,
        'financial_label': financial_labels
    })

    os.makedirs('dataset', exist_ok=True)
    df.to_csv('dataset/customer_transactions.csv', index=False)
    print("Dataset generated at dataset/customer_transactions.csv")

if __name__ == "__main__":
    generate_data()
