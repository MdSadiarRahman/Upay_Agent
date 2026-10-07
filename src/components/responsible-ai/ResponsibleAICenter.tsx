import React from 'react';
import { PrivacyCenter } from './PrivacyCenter';
import { SecurityCenter } from './SecurityCenter';
import { DataHealthDashboard } from './DataHealthDashboard';
import { FairnessMonitoring } from '../../../Upay-AI-Agent/frontend/components/FairnessMonitoring';
import { TransparencyCenter } from '../transparency/TransparencyCenter';
import { HumanReviewCenter } from '../human_review/HumanReviewCenter';
import { AIGuardrailDashboard } from './AIGuardrailDashboard';
import { ShieldCheck } from 'lucide-react';

export const ResponsibleAICenter = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="bg-gradient-to-r from-emerald-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-black mb-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            {isBn ? 'রেসপন্সিবল এআই ফ্রেমওয়ার্ক' : 'Responsible AI Framework'}
          </h1>
          <p className="text-emerald-100 text-lg">
            {isBn 
              ? 'উপায়পালস এআই নির্ভরযোগ্য, নিরাপদ এবং ব্যাখ্যাযোগ্য প্রযুক্তি দ্বারা চালিত।' 
              : 'UpayPulse AI is powered by trustworthy, secure, and explainable technology. Ensuring fairness, privacy, and human control.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          1. Transparency & Explainability
        </h2>
        <TransparencyCenter language={language} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 border-b border-slate-200 dark:border-slate-800 pb-2 mt-8">
          2. Fairness & Bias Prevention
        </h2>
        <FairnessMonitoring />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 border-b border-slate-200 dark:border-slate-800 pb-2 mt-8">
          3. Privacy, Security & Data Health
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PrivacyCenter language={language} />
          <SecurityCenter language={language} />
          <DataHealthDashboard language={language} />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 border-b border-slate-200 dark:border-slate-800 pb-2 mt-8">
          4. AI Safety & Guardrails
        </h2>
        <AIGuardrailDashboard language={language} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white px-2 border-b border-slate-200 dark:border-slate-800 pb-2 mt-8">
          5. Human Oversight
        </h2>
        <HumanReviewCenter language={language} />
      </div>
    </div>
  );
};
