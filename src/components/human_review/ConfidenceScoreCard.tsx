import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';

export const ConfidenceScoreCard = ({ confidence }: { confidence: number }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-500" />
          <span className="text-lg">AI Confidence</span>
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative flex items-center justify-center w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
            <circle
              className={`${confidence > 80 ? 'text-indigo-500' : confidence > 50 ? 'text-amber-500' : 'text-rose-500'}`}
              strokeWidth="10"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * confidence) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{confidence}%</span>
          </div>
        </div>
      </div>

      {confidence < 80 && (
        <div className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 dark:text-rose-300">
            Additional review recommended due to limited confidence.
          </p>
        </div>
      )}
      
      {confidence >= 80 && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-2">
          <Target className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            High AI confidence based on historical pattern matching.
          </p>
        </div>
      )}
    </div>
  );
};
