import React from 'react';
import { AlertTriangle, TrendingUp, Info, CheckCircle2 } from 'lucide-react';

export interface AlertData {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
}

interface Props {
  alert: AlertData;
}

export const FinancialAlertCard: React.FC<Props> = ({ alert }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'danger': return <TrendingUp className="w-5 h-5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (alert.type) {
      case 'danger': return 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/50 text-rose-900 dark:text-rose-100';
      case 'warning': return 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/50 text-amber-900 dark:text-amber-100';
      case 'success': return 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-100';
      default: return 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-900/50 text-blue-900 dark:text-blue-100';
    }
  };

  return (
    <div className={`p-4 rounded-2xl border ${getStyles()} flex items-start gap-3`}>
      <div className="shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
        <p className="text-xs opacity-80 leading-relaxed">{alert.message}</p>
      </div>
    </div>
  );
};
