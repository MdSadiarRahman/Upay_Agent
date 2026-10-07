import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface AIAlert {
  id: string;
  type: 'Warning' | 'Critical' | 'Info';
  model: string;
  message: string;
  details?: Record<string, string>;
  action: string;
  timestamp: string;
}

export const AIAlertPanel: React.FC<{ alerts: AIAlert[] }> = ({ alerts }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        AI Alert System
      </h3>
      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className="p-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{alert.model}</span>
                <span className="text-[10px] text-slate-500">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200 font-medium mb-1.5">{alert.message}</p>
              
              {alert.details && (
                <div className="flex gap-4 text-[10px] text-slate-600 dark:text-slate-400 mb-2">
                  {Object.entries(alert.details).map(([k, v]) => (
                    <span key={k}>{k}: <strong className="text-slate-900 dark:text-slate-200">{v}</strong></span>
                  ))}
                </div>
              )}
              
              <div className="inline-block mt-1 px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-semibold cursor-pointer hover:bg-slate-50 transition">
                Action: {alert.action}
              </div>
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center py-6 text-slate-500 text-xs">
            No active alerts detected.
          </div>
        )}
      </div>
    </div>
  );
};
