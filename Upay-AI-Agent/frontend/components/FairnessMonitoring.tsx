import React from 'react';
import { FairnessScoreCard } from './FairnessScoreCard';
import { BiasChart } from './BiasChart';

export const FairnessMonitoring = ({ fairnessData }) => {
  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Responsible AI Center</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Fairness monitoring checks whether AI recommendations differ significantly across user groups. It helps identify potential bias and improve responsible AI behavior.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FairnessScoreCard 
          score={fairnessData.fairness_score} 
          status={fairnessData.status} 
        />
        
        {fairnessData.alerts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl">
            <h3 className="font-bold text-orange-700 flex items-center mb-2">
              <span className="text-xl mr-2">⚠</span> Bias Alert Detected
            </h3>
            <ul className="list-disc pl-5 text-orange-800 text-sm space-y-1">
              {fairnessData.alerts.map((alert, idx) => (
                <li key={idx}>
                  <strong>{alert.attribute}</strong>: {alert.message} (Diff: {alert.difference}%)
                </li>
              ))}
            </ul>
            <div className="mt-3 text-xs font-semibold text-orange-900 bg-orange-200 inline-block px-2 py-1 rounded">
              Recommendation: Review feature selection and model behavior.
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Group Performance Analysis</h3>
        {fairnessData.group_performance.map((groupData, idx) => (
          <BiasChart key={idx} attribute={groupData.attribute} data={groupData.data} />
        ))}
      </div>
    </div>
  );
};
