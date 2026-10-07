import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

export const ExplanationCard = ({ positiveFactors, riskFactors, geminiExplanation }: {
  positiveFactors: any[];
  riskFactors: any[];
  geminiExplanation: string;
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
        Why This Score?
      </h3>
      
      <div>
        <h4 className="font-bold text-emerald-600 flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4" /> Positive Factors
        </h4>
        <ul className="space-y-2">
          {positiveFactors.map((f, idx) => (
            <li key={idx} className="flex justify-between items-center bg-emerald-50/50 dark:bg-emerald-900/10 p-2 rounded-lg text-sm border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-slate-700 dark:text-slate-300">✓ {f.desc}</span>
              <span className="font-bold text-emerald-600">+{f.impact}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-rose-600 flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4" /> Risk Factors
        </h4>
        <ul className="space-y-2">
          {riskFactors.map((f, idx) => (
            <li key={idx} className="flex justify-between items-center bg-rose-50/50 dark:bg-rose-900/10 p-2 rounded-lg text-sm border border-rose-100 dark:border-rose-900/30">
              <span className="text-slate-700 dark:text-slate-300">⚠ {f.desc}</span>
              <span className="font-bold text-rose-600">-{f.impact}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
        <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4" /> AI Recommendation Explanation
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
          "{geminiExplanation}"
        </p>
      </div>
    </div>
  );
};
