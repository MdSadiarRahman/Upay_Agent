import React from 'react';
import { FileText, ShieldAlert } from 'lucide-react';

export const AuditLogCard = ({ logs }: { logs: any[] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          AI Audit Logging
        </h3>
        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded font-bold">
          System Record
        </span>
      </div>
      
      <div className="space-y-4">
        {logs.map((log, idx) => (
          <div key={idx} className="text-xs p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-slate-500">Prediction ID:</span> <span className="font-mono font-bold">{log.id}</span></div>
              <div><span className="text-slate-500">User:</span> <span className="font-bold">{log.user}</span></div>
              <div><span className="text-slate-500">Date:</span> <span className="font-bold">{log.date}</span></div>
              <div><span className="text-slate-500">Score:</span> <span className="font-bold text-emerald-600">{log.score}</span></div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
              <span className="text-slate-500 block mb-1">Features Used:</span>
              <div className="flex gap-1 flex-wrap">
                {log.features.map((f: string) => <span key={f} className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded shadow-sm">{f}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <span className="text-sm font-bold text-blue-700 dark:text-blue-400 block">Human Oversight Required</span>
          <span className="text-xs text-blue-600 dark:text-blue-300">AI assists decision-making but does not make final financial decisions.</span>
        </div>
      </div>
    </div>
  );
};
