import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Scale, 
  Users, 
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart4,
  ArrowRight
} from 'lucide-react';

export const ResponsibleAI = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-black tracking-tight">
              {isBn ? 'রেসপন্সিবল এআই ডিসিশন ফ্রেমওয়ার্ক' : 'Responsible AI Decision Framework'}
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            {isBn 
              ? 'এআই শুধুমাত্র অন্তর্দৃষ্টি প্রদান করে। কোনো এআই স্বয়ংক্রিয়ভাবে সিদ্ধান্ত গ্রহণ করে না।' 
              : 'AI provides insights, recommendations, and explanations. AI does NOT make autonomous financial decisions. Human oversight is mandatory.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Module 1: Explainable AI */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
              <BrainCircuit className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'ব্যাখ্যাযোগ্য এআই (Explainable AI)' : '1. Explainable AI'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">SHAP/LIME Feature Importance</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">AI Risk Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">82</span>
                <span className="text-sm font-medium text-slate-500">/100</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Positive Factors
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Income Stability</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+25%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Payment History</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+20%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Transaction Pattern</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+15%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Negative Factors
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">Low Savings</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">-10%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">High Cash Withdrawal</span>
                    <span className="font-medium text-rose-600 dark:text-rose-400">-8%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Human-in-the-Loop */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
              <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'হিউম্যান রিভিউ' : '2. Human-in-the-Loop Review'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Oversight for High-Impact Decisions</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 border-2 border-blue-200 dark:border-blue-800">
                  <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">AI Analysis</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2 border-2 border-emerald-200 dark:border-emerald-800">
                  <BarChart4 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Explanation</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2 border-2 border-amber-400 dark:border-amber-600 ring-4 ring-amber-50 dark:ring-amber-900/20">
                  <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-500">Human Review</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 border-2 border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Final Decision</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Pending Reviews Queue</h3>
              
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">Loan Application #A-992</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400">PENDING REVIEW</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">AI Score: 82 • Requires Risk Officer Approval</p>
                </div>
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                  Review
                </button>
              </div>
              
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-between opacity-75">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white">Credit Limit #C-104</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400">APPROVED</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Reviewed by: Sarah J. (Risk Officer)</p>
                </div>
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition-colors">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Fairness Monitoring */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
              <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'ন্যায্যতা পর্যবেক্ষণ' : '3. Fairness Monitoring'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Bias Detection & Group Analysis</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-100">Overall Fairness</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Model is operating within fair thresholds</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-black text-purple-700 dark:text-purple-400">Fair</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Age Bias</span>
                  <span className="text-xs text-slate-500">Demographic Parity</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Low
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Location Bias</span>
                  <span className="text-xs text-slate-500">Equal Opportunity Diff</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Low
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-white">Income Group Bias</span>
                  <span className="text-xs text-slate-500">Disparate Impact Ratio</span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Monitor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 4: Audit Logging */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <History className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'অডিট লগ' : '4. Audit Logging'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Immutable Decision History</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="space-y-3">
              {[
                { id: 'AI-1025', score: 82, model: 'XGBoost v1', review: 'Pending', time: '10:42 AM', customer: 'CUST-889' },
                { id: 'AI-1024', score: 45, model: 'XGBoost v1', review: 'Auto-Rejected', time: '09:15 AM', customer: 'CUST-312' },
                { id: 'AI-1023', score: 95, model: 'XGBoost v1', review: 'Approved (Sarah J.)', time: 'Yesterday', customer: 'CUST-774' },
              ].map((log, i) => (
                <div key={log.id} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.id}</span>
                      <span className="text-xs text-slate-500">{log.time}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.review === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      log.review === 'Auto-Rejected' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {log.review.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="block text-slate-500 dark:text-slate-400">Score</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{log.score}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 dark:text-slate-400">Model</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{log.model}</span>
                    </div>
                    <div>
                      <span className="block text-slate-500 dark:text-slate-400">Customer</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{log.customer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button className="w-full py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm flex items-center justify-center gap-2">
              <History className="w-4 h-4" /> Export Complete Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
