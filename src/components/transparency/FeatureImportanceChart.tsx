import React from 'react';

export const FeatureImportanceChart = ({ features }: { features: any[] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4">Financial Factors</h3>
      <div className="space-y-4">
        {features.map((f, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">{f.name}</span>
              <span className="font-bold text-slate-900 dark:text-white">{f.value}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${f.color || 'bg-amber-400'}`} 
                style={{ width: `${f.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
