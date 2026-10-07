import React, { useState, useEffect } from 'react';
import { FinancialProfileCard } from './FinancialProfileCard';
import { CustomerSegmentCard } from './CustomerSegmentCard';
import { PersonalizedRecommendation } from './PersonalizedRecommendation';
import { FinancialInsightChart } from './FinancialInsightChart';
import { BrainCircuit } from 'lucide-react';

// Mocked response from our Python backend: ai/customer_intelligence/personalization.py
const mockBackendData = {
  profile: {
    savings_rate: 10.0,
    food_expense_ratio: 30.0,
    high_transaction_user: true,
    financial_health_score: 65
  },
  segment: "Growing User",
  advice: [
    "Your food expenses are slightly high. Reducing food delivery twice per week can save approximately ৳1500 monthly."
  ],
  next_best_action: "Reduce unnecessary spending and increase monthly savings target.",
  personalized_offer: "Healthcare discount available at nearby pharmacy."
};

export const CustomerIntelligenceCenter = () => {
  const [data, setData] = useState<typeof mockBackendData | null>(null);

  useEffect(() => {
    // Simulate API call to the personalization engine
    const timer = setTimeout(() => {
      setData(mockBackendData);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse">
        <BrainCircuit className="w-12 h-12 text-indigo-500 mb-4 animate-spin-slow" />
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Generating AI Customer Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
          <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Customer Intelligence</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Personalized profile & recommendations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <FinancialProfileCard 
            userId="C102"
            savingsRate={data.profile.savings_rate}
            foodExpenseRatio={data.profile.food_expense_ratio}
            healthScore={data.profile.financial_health_score}
          />
        </div>
        <div className="md:col-span-4">
          <CustomerSegmentCard segment={data.segment} />
        </div>
        <div className="md:col-span-4">
          <FinancialInsightChart 
            savingsRate={data.profile.savings_rate}
            foodExpenseRatio={data.profile.food_expense_ratio}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="h-full">
          <PersonalizedRecommendation 
            advice={data.advice}
            nextBestAction={data.next_best_action}
            offer={data.personalized_offer}
          />
        </div>
      </div>
    </div>
  );
};
