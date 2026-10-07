import React from 'react';
import { Users, Sparkles } from 'lucide-react';

interface CustomerSegmentCardProps {
  segment: string;
}

export const CustomerSegmentCard: React.FC<CustomerSegmentCardProps> = ({ segment }) => {
  
  const getSegmentColor = (segmentName: string) => {
    switch (segmentName) {
      case 'Smart Saver': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/30';
      case 'High Spending User': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-800/30';
      case 'Growing User': return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800/30';
      case 'Cash Dependent User': return 'text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-800/30';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-800/30';
    }
  };

  return (
    <div className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-center items-center h-full text-center ${getSegmentColor(segment)}`}>
      <Users className="w-10 h-10 mb-3 opacity-80" />
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">AI Segment</span>
      <h2 className="text-xl font-black flex items-center gap-2">
        {segment}
        <Sparkles className="w-4 h-4" />
      </h2>
    </div>
  );
};
