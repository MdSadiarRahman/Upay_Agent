import React from 'react';
import { FinancialScoreCard } from './FinancialScoreCard';
import { ExplanationCard } from './ExplanationCard';
import { FeatureImportanceChart } from './FeatureImportanceChart';
import { AuditLogCard } from './AuditLogCard';
import { Shield } from 'lucide-react';

export const TransparencyCenter = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  const dummyData = {
    score: 82,
    features: [
      { name: "Income Stability", value: 85, color: "bg-emerald-500" },
      { name: "Payment History", value: 75, color: "bg-emerald-400" },
      { name: "Savings Behavior", value: 55, color: "bg-amber-400" },
      { name: "Cash Dependency", value: 35, color: "bg-rose-400" }
    ],
    positiveFactors: [
      { desc: "Stable income pattern", impact: 25 },
      { desc: "Regular transaction behavior", impact: 20 },
      { desc: "Good payment history", impact: 15 }
    ],
    riskFactors: [
      { desc: "Low savings ratio", impact: 10 },
      { desc: "High cash withdrawal frequency", impact: 8 }
    ],
    geminiExplanation: "Your financial readiness score is strong because you have stable income and consistent transaction behavior. You can improve further by increasing savings and reducing unnecessary cash withdrawals.",
    logs: [
      {
        id: "AI-10245",
        user: "Customer_102",
        date: "04 October 2026",
        score: 82,
        features: ["Income", "Transactions", "Savings", "Payment History"]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-500" />
          {isBn ? 'এআই ট্রান্সপারেন্সি সেন্টার' : 'AI Transparency Center'}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isBn 
            ? 'আপনার আর্থিক রেডিয়েন্স স্কোর এবং এআই মূল্যায়ন কীভাবে কাজ করে তা বুঝুন।' 
            : 'Understand how AI calculates your financial readiness and risks.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <FinancialScoreCard score={dummyData.score} />
          <FeatureImportanceChart features={dummyData.features} />
          <AuditLogCard logs={dummyData.logs} />
        </div>
        
        <div className="lg:col-span-2">
          <ExplanationCard 
            positiveFactors={dummyData.positiveFactors}
            riskFactors={dummyData.riskFactors}
            geminiExplanation={dummyData.geminiExplanation}
          />
        </div>
      </div>
    </div>
  );
};
