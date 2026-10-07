import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, FileSearch, ShieldX } from 'lucide-react';

// Mock data to simulate the stats from chatbot_guardrail_metrics.json
const mockMetrics = {
  total_queries: 1245,
  safe_responses: 1120,
  blocked_responses: 85,
  low_confidence_responses: 40
};

export const AIGuardrailDashboard = ({ language }: { language: string }) => {
  const isBn = language === 'bn';
  const [metrics, setMetrics] = useState(mockMetrics);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isBn ? 'এআই গার্ডরেল ড্যাশবোর্ড' : 'AI Guardrail Dashboard'}
          </h2>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Active
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
            <FileSearch className="w-4 h-4" />
            <span className="text-sm font-medium">{isBn ? 'মোট প্রশ্ন' : 'Total Queries'}</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.total_queries}</p>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">{isBn ? 'নিরাপদ উত্তর' : 'Safe Responses'}</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.safe_responses}</p>
        </div>

        <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/30">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
            <ShieldX className="w-4 h-4" />
            <span className="text-sm font-medium">{isBn ? 'ব্লক করা উত্তর' : 'Blocked Responses'}</span>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{metrics.blocked_responses}</p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-sm font-medium">{isBn ? 'কম আত্মবিশ্বাসের উত্তর' : 'Low Confidence'}</span>
          </div>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.low_confidence_responses}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          {isBn ? 'সাম্প্রতিক গার্ডরেল এক্টিভিটি' : 'Recent Guardrail Activity'}
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm">
            <ShieldX className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Blocked: "Can AI approve my loan?"</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Reason: Financial decision bounds exceeded.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <ShieldX className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Blocked: "Show another customer's transaction."</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Reason: Privacy violation detected.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Flagged: Low confidence response</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Confidence score was below 70%. Routed to human review.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
