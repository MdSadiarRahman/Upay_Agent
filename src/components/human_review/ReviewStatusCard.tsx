import React from 'react';
import { UserCheck, Clock, AlertCircle, FileWarning, CheckCircle2 } from 'lucide-react';

export const ReviewStatusCard = ({
  score,
  riskLevel,
  status,
  customer
}: {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'AI Analysis Completed' | 'Human Review Pending' | 'Approved for Further Processing' | 'Requires Additional Information' | 'Completed';
  customer: string;
}) => {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'AI Analysis Completed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'Human Review Pending': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'Approved for Further Processing': return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'Requires Additional Information': return 'text-rose-600 bg-rose-100 border-rose-200';
      case 'Completed': return 'text-slate-600 bg-slate-100 border-slate-200';
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'AI Analysis Completed': return <CheckCircle2 className="w-5 h-5" />;
      case 'Human Review Pending': return <Clock className="w-5 h-5" />;
      case 'Approved for Further Processing': return <UserCheck className="w-5 h-5" />;
      case 'Requires Additional Information': return <FileWarning className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {getStatusIcon(status)}
          <span className="text-lg">Review Status</span>
        </h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Customer ID</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">{customer}</span>
        </div>
        <div className="flex justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">AI Financial Score</span>
          <span className="font-bold text-slate-900 dark:text-white">{score}/100</span>
        </div>
        <div className="flex justify-between pb-3">
          <span className="text-slate-500">Risk Level</span>
          <span className={`font-bold ${riskLevel === 'Low' ? 'text-emerald-500' : riskLevel === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
};
