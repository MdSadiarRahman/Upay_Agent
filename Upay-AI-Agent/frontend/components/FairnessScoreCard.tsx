import React from 'react';

export const FairnessScoreCard = ({ score, status }) => {
  const isFair = score >= 90;
  const isWarning = score < 80;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between">
      <div>
        <h3 className="text-slate-400 font-semibold mb-1">AI Fairness Score</h3>
        <div className="text-5xl font-black">{score}<span className="text-2xl text-slate-500 font-medium">/100</span></div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-slate-400">Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
            isFair ? 'bg-emerald-500/20 text-emerald-400' : 
            isWarning ? 'bg-rose-500/20 text-rose-400' : 
            'bg-amber-500/20 text-amber-400'
          }`}>
            {status}
          </span>
        </div>
        <p className="text-sm mt-2 text-slate-300">
          {isFair ? "No significant bias detected across monitored demographic groups." : 
           "Potential bias detected. Review recommended."}
        </p>
      </div>
    </div>
  );
};
