import React from 'react';
import { History, CheckCircle2, User, Cpu } from 'lucide-react';

export const AuditTimeline = ({
  auditLog
}: {
  auditLog: {
    predictionId: string;
    userId: string;
    score: number;
    confidence: number;
    explanation: string;
    reviewer: string;
    status: string;
    timestamp: string;
  }
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-slate-400" />
        <span className="text-lg">Audit Log & Timeline</span>
      </h3>
      
      <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
        
        {/* Step 1: Data Collection & Processing */}
        <div className="relative pl-6">
          <span className="absolute -left-3.5 bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <Cpu className="w-4 h-4 text-slate-400" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold mb-1">{auditLog.timestamp}</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">AI Analysis</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Prediction ID: {auditLog.predictionId} | Score: {auditLog.score}
            </span>
          </div>
        </div>

        {/* Step 2: Explanation Generation */}
        <div className="relative pl-6">
          <span className="absolute -left-3.5 bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <Cpu className="w-4 h-4 text-emerald-500" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold mb-1">Generated Insight</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Explanation Provided</span>
            <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 text-xs text-slate-700 dark:text-slate-300 italic">
              "{auditLog.explanation}"
            </div>
          </div>
        </div>

        {/* Step 3: Human Review */}
        <div className="relative pl-6">
          <span className="absolute -left-3.5 bg-white dark:bg-slate-900 p-1 rounded-full border border-amber-400">
            <User className="w-4 h-4 text-amber-500" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold mb-1">Current State</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Human Review</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Status: <span className="font-bold text-amber-600">{auditLog.status}</span>
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Reviewer: {auditLog.reviewer}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
