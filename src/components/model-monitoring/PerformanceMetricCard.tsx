import React from 'react';

interface Metric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface PerformanceMetricCardProps {
  modelName: string;
  metrics: Metric[];
}

export const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({ modelName, metrics }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{modelName}</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex flex-col">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</span>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{m.value}</span>
              {m.trend && (
                <span className={`text-[10px] font-bold mb-1 ${
                  m.trend === 'up' ? 'text-emerald-500' : m.trend === 'down' ? 'text-red-500' : 'text-slate-500'
                }`}>
                  {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '-'} {m.trendValue}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
