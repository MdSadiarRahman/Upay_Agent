import React from 'react';

export const BiasChart = ({ attribute, data }) => {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <h4 className="font-semibold text-slate-700 capitalize mb-3">{attribute.replace('_', ' ')} Performance</h4>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{item.group}</span>
              <span className="text-slate-500">Acc: {item.accuracy}% | Avg Score: {item.average_score}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-500 h-2.5 rounded-full" 
                style={{ width: `${item.accuracy}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-500 text-right">
        Status: <span className="font-semibold text-emerald-600">Balanced</span>
      </div>
    </div>
  );
};
