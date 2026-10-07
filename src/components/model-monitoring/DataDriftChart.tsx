import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  drift_score: number;
}

interface DataDriftChartProps {
  data: DataPoint[];
  threshold?: number;
}

export const DataDriftChart: React.FC<DataDriftChartProps> = ({ data, threshold = 0.2 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Data Drift Detection</h3>
        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
          Threshold: {threshold}
        </span>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="date" tick={{fontSize: 10}} stroke="#64748b" />
            <YAxis tick={{fontSize: 10}} stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line type="monotone" dataKey="drift_score" stroke="#f59e0b" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} name="Drift Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
