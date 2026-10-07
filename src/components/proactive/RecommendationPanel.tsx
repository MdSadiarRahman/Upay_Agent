import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

export interface RecommendationData {
  id: string;
  title: string;
  description: string;
  actionText: string;
}

interface Props {
  recommendation: RecommendationData;
}

export const RecommendationPanel: React.FC<Props> = ({ recommendation }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-200/50 to-purple-200/50 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">AI Insight</span>
        </div>
        
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{recommendation.title}</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          {recommendation.description}
        </p>
        
        <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          {recommendation.actionText}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
