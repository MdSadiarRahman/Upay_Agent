import React from 'react';
import { Target } from 'lucide-react';

interface PredictionAccuracyCardProps {
  modelName: string;
  prediction: string;
  actual: string;
  status: 'Correct Prediction' | 'Incorrect Prediction' | 'Pending';
}

export const PredictionAccuracyCard: React.FC<PredictionAccuracyCardProps> = ({ modelName, prediction, actual, status }) => {
  const statusColor = status === 'Correct Prediction' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : status === 'Incorrect Prediction' ? 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                    : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-4 h-4 text-blue-500" />
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{modelName}</h4>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
          <span className="block text-slate-500 dark:text-slate-400 mb-1">Prediction:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{prediction}</span>
        </div>
        <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
          <span className="block text-slate-500 dark:text-slate-400 mb-1">Actual:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{actual}</span>
        </div>
      </div>
      <div className={`mt-1 inline-flex self-start px-2.5 py-1 rounded-md text-[10px] font-bold ${statusColor}`}>
        {status}
      </div>
    </div>
  );
};
