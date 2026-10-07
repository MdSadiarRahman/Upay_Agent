import React from 'react';
import { Target, Zap, Gift } from 'lucide-react';

interface PersonalizedRecommendationProps {
  advice: string[];
  nextBestAction: string;
  offer?: string | null;
}

export const PersonalizedRecommendation: React.FC<PersonalizedRecommendationProps> = ({ advice, nextBestAction, offer }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-2xl p-5 shadow-sm h-full">
      <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-500" />
        AI Personalized Guidance
      </h3>
      
      <div className="space-y-4">
        <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-white dark:border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Financial Advice</span>
          <ul className="space-y-1.5">
            {advice.map((item, idx) => (
              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">•</span> {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-indigo-100/50 dark:bg-indigo-900/40 rounded-xl p-3 border border-indigo-200/50 dark:border-indigo-700/30">
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Next Best Action</span>
          </div>
          <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">{nextBestAction}</p>
        </div>
        
        {offer && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Smart Offer</span>
            </div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{offer}</p>
          </div>
        )}
      </div>
    </div>
  );
};
