import React, { useState } from 'react';
import { Shield, ToggleLeft, ToggleRight, Info } from 'lucide-react';

export const PrivacyCenter = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  const [permissions, setPermissions] = useState({
    spendingAnalysis: true,
    financialInsights: true,
    personalizedRecommendations: false,
    locationServices: false
  });

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-indigo-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isBn ? 'প্রাইভেসি এবং কনসেন্ট সেন্টার' : 'Privacy & Consent Center'}
        </h2>
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-sm text-indigo-800 dark:text-indigo-200">
          <p className="font-bold mb-1">Your Data is Anonymized</p>
          <p>We use Data Minimization techniques. Your name and direct identifiers are stripped before AI processing (e.g., User ID: C102).</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Spending Analysis</h3>
            <p className="text-xs text-slate-500">Allow AI to analyze your transaction history</p>
          </div>
          <button onClick={() => togglePermission('spendingAnalysis')} className="text-indigo-500">
            {permissions.spendingAnalysis ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
          </button>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">AI Financial Insights</h3>
            <p className="text-xs text-slate-500">Enable predictive models to assess financial readiness</p>
          </div>
          <button onClick={() => togglePermission('financialInsights')} className="text-indigo-500">
            {permissions.financialInsights ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
          </button>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Personalized Recommendations</h3>
            <p className="text-xs text-slate-500">Allow tailored loan and savings suggestions</p>
          </div>
          <button onClick={() => togglePermission('personalizedRecommendations')} className="text-indigo-500">
            {permissions.personalizedRecommendations ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
          </button>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Location Services</h3>
            <p className="text-xs text-slate-500">Use location data for merchant insights</p>
          </div>
          <button onClick={() => togglePermission('locationServices')} className="text-indigo-500">
            {permissions.locationServices ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
          </button>
        </div>
      </div>
    </div>
  );
};
