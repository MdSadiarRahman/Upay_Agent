import React from 'react';
import { Lock, UserCheck, Key, ShieldAlert } from 'lucide-react';

export const SecurityCenter = ({ language }: { language: string }) => {
  const isBn = language === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-emerald-500" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isBn ? 'সিকিউরিটি এবং এক্সেস কন্ট্রোল' : 'Security & RBAC'}
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
            <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are authenticated as a <strong>Customer</strong>. You only have access to your own anonymized data (ID: C102). Merchants and Agents cannot see your individual transactions.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
            <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Data Encryption</h3>
            <p className="text-xs text-slate-500 mt-1">
              All data transmitted to AI models is end-to-end encrypted. Persistent data is protected with AES-256 encryption at rest.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Immutable Audit Logs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Every AI action is logged in a secure audit trail for regulatory compliance. System administrators can trace prediction logic and data usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
