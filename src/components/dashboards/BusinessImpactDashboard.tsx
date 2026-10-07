import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, ComposedChart, Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Percent, Star, ShieldCheck } from 'lucide-react';

const conversionData = [
  { step: 'Viewed Offer', count: 5000 },
  { step: 'Started Application', count: 3200 },
  { step: 'Approved by AI', count: 2100 },
  { step: 'Loan Disbursed', count: 1850 },
];

const retentionData = [
  { month: 'Jan', retention: 85, active: 4000 },
  { month: 'Feb', retention: 88, active: 4200 },
  { month: 'Mar', retention: 87, active: 4500 },
  { month: 'Apr', retention: 91, active: 5100 },
  { month: 'May', retention: 93, active: 5600 },
  { month: 'Jun', retention: 95, active: 6200 },
];

const revenueData = [
  { month: 'Jan', actual: 120000, predicted: 120000 },
  { month: 'Feb', actual: 145000, predicted: 140000 },
  { month: 'Mar', actual: 160000, predicted: 155000 },
  { month: 'Apr', actual: 190000, predicted: 180000 },
  { month: 'May', actual: 210000, predicted: 205000 },
  { month: 'Jun', actual: 245000, predicted: 230000 },
  { month: 'Jul', actual: null, predicted: 260000 },
  { month: 'Aug', actual: null, predicted: 290000 },
];

export const BusinessImpactDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Business Impact & KPIs</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor merchant retention, loan conversion rates, and revenue predictions.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Projected Revenue</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">৳ 2.9M</div>
          <div className="text-xs font-semibold text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +24% from last quarter
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Percent className="w-16 h-16 text-blue-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loan Conversion</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">37%</div>
          <div className="text-xs font-semibold text-blue-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% since AI rollout
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users className="w-16 h-16 text-purple-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Merchant Retention</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">95%</div>
          <div className="text-xs font-semibold text-purple-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Up from 85% in Jan
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="w-16 h-16 text-amber-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">Repayment Quality</h3>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">98.2%</div>
          <div className="text-xs font-semibold text-amber-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Default rate &lt; 1.8%
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Prediction Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Growth & Prediction</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Actual vs AI Predicted Revenue (BDT)</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `৳${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="actual" name="Actual Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                <Line type="monotone" dataKey="predicted" name="AI Predicted Revenue" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Conversion Funnel / Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Loan Conversion Pipeline</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tracking user journey from offer to disbursement</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="step" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                  {
                    conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === conversionData.length - 1 ? '#10b981' : '#3b82f6'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Merchant Retention Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Merchant Retention & Growth</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active merchants vs Retention Rate over 6 months</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={retentionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="active" name="Active Merchants" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="retention" name="Retention Rate (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
