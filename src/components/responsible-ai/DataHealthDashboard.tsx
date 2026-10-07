import React from 'react';
import { Database, AlertTriangle, CheckCircle, DatabaseZap } from 'lucide-react';

export const DataHealthDashboard = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DatabaseZap className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'ডেটা কোয়ালিটি ও ভ্যালিডেশন' : 'Data Health & Quality'}
          </h2>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase flex items-center gap-1">
          <CheckCircle className="w-3 h-3" /> Validated
        </span>
      </div>

      <div className="flex items-center justify-center py-4 mb-4">
        <div className="text-center">
          <p className="text-5xl font-black text-slate-900 dark:text-white mb-1">98<span className="text-2xl text-slate-400">/100</span></p>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Dataset Health Score</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 mb-1">Completeness</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">99%</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 mb-1">Duplicates</p>
          <p className="text-lg font-bold text-emerald-500">0.5%</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 mb-1">Outliers</p>
          <p className="text-lg font-bold text-amber-500">1.5%</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-start gap-2">
        <Database className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <p>AI predictions are only as good as the data. Clean, balanced, and complete datasets prevent algorithmic bias and hallucinations.</p>
      </div>
    </div>
  );
};
