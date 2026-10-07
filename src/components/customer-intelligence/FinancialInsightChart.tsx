import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface FinancialInsightChartProps {
  savingsRate: number;
  foodExpenseRatio: number;
}

export const FinancialInsightChart: React.FC<FinancialInsightChartProps> = ({ savingsRate, foodExpenseRatio }) => {
  const otherRatio = Math.max(0, 100 - savingsRate - foodExpenseRatio);
  
  const data = [
    { name: 'Savings', value: savingsRate, color: '#10b981' },
    { name: 'Food Expense', value: foodExpenseRatio, color: '#f59e0b' },
    { name: 'Other Expenses', value: otherRatio, color: '#64748b' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-purple-500" />
        Spending Breakdown
      </h3>
      
      <div className="flex-1 min-h-[150px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${value}%`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-3 mt-2 flex-wrap">
        {data.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
