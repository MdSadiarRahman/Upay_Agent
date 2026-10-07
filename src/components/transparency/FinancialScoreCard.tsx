import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const FinancialScoreCard = ({ score }: { score: number }) => {
  const isHighRisk = score < 60;
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Financial Readiness Score</h2>
        <ShieldCheck className="w-6 h-6 text-emerald-500" />
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-5xl font-black text-slate-900 dark:text-white">{score}</span>
        <span className="text-xl font-bold text-slate-500">/100</span>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Risk Level:</span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
          score >= 80 ? 'bg-emerald-100 text-emerald-700' : 
          score >= 60 ? 'bg-amber-100 text-amber-700' : 
          'bg-rose-100 text-rose-700'
        }`}>
          {score >= 80 ? 'Low' : score >= 60 ? 'Medium' : 'High'}
        </span>
      </div>
      
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>AI provides financial insights only. Final financial decisions must be made by authorized financial institutions.</p>
      </div>
    </div>
  );
};
