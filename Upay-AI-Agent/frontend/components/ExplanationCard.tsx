import React from 'react';
import { TransparencyCenter } from './TransparencyCenter';

export const ExplanationCard = ({ score, data }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold mb-2">AI Financial Readiness</h2>
      <div className="text-4xl font-black text-slate-900 mb-1">{score}/100</div>
      <div className="text-sm font-semibold text-slate-500 mb-4">
        Risk Level: {score >= 80 ? 'Low' : score >= 60 ? 'Medium' : 'High'}
      </div>
      
      <TransparencyCenter 
        score={score} 
        positiveFactors={data.positiveFactors} 
        negativeFactors={data.negativeFactors} 
      />
    </div>
  );
};
