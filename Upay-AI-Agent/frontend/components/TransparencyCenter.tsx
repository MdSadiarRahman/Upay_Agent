import React from 'react';

export const TransparencyCenter = ({ score, positiveFactors, negativeFactors }) => {
  return (
    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mt-4">
      <h3 className="text-lg font-bold mb-4">Why This Score?</h3>
      <div className="mb-4">
        <h4 className="font-semibold text-emerald-600">Positive Factors:</h4>
        <ul className="list-disc pl-5">
          {positiveFactors.map(factor => (
            <li key={factor.feature}>✓ {factor.feature}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-rose-600">Improvement Areas:</h4>
        <ul className="list-disc pl-5">
          {negativeFactors.map(factor => (
            <li key={factor.feature}>⚠ {factor.feature}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6 text-xs text-slate-500 border-t pt-4">
        AI provides financial insights only. Final loan decisions are made by authorized institutions.
      </div>
    </div>
  );
};
