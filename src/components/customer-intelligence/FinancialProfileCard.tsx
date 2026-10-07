import React from 'react';
import { User, Activity, Wallet } from 'lucide-react';

interface FinancialProfileCardProps {
  userId: string;
  savingsRate: number;
  foodExpenseRatio: number;
  healthScore: number;
}

export const FinancialProfileCard: React.FC<FinancialProfileCardProps> = ({ userId, savingsRate, foodExpenseRatio, healthScore }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <User className="w-24 h-24" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-500" />
        Customer 360 Profile: {userId}
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Financial Health Score</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{healthScore}/100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${healthScore}%` }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Savings Rate</span>
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{savingsRate}%</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 mb-1 text-slate-500 dark:text-slate-400">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">Food Expense Ratio</span>
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{foodExpenseRatio}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
