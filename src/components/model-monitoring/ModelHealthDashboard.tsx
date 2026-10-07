import React, { useState } from 'react';
import { Activity, CheckCircle, Search, ShieldCheck } from 'lucide-react';
import { PerformanceMetricCard } from './PerformanceMetricCard';
import { DataDriftChart } from './DataDriftChart';
import { PredictionAccuracyCard } from './PredictionAccuracyCard';
import { AIAlertPanel, AIAlert } from './AIAlertPanel';

export const ModelHealthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drift' | 'predictions' | 'alerts'>('overview');

  const driftData = [
    { date: '01-10', drift_score: 0.08 },
    { date: '02-10', drift_score: 0.10 },
    { date: '03-10', drift_score: 0.12 },
    { date: '04-10', drift_score: 0.15 },
    { date: '05-10', drift_score: 0.18 },
    { date: '06-10', drift_score: 0.22 },
    { date: '07-10', drift_score: 0.35 },
  ];

  const alerts: AIAlert[] = [
    {
      id: 'alert_1',
      type: 'Warning',
      model: 'Financial Readiness Model',
      message: 'Model performance decreased significantly.',
      details: { Previous: '92%', Current: '78%' },
      action: 'Review training data',
      timestamp: new Date().toISOString()
    }
  ];

  const models = [
    {
      name: 'Financial Readiness Model',
      status: 'Warning',
      accuracy: '78%',
      lastValidation: '2026-10-07',
      score: '7.8/10'
    },
    {
      name: 'Agent Liquidity Model',
      status: 'Healthy',
      accuracy: '91%',
      lastValidation: '2026-10-07',
      score: '9.1/10'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            AI Model Monitoring & Intelligence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continuous evaluation of AI health, data drift, and prediction quality.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          {[
            { id: 'overview', label: 'Health Overview' },
            { id: 'drift', label: 'Data Drift' },
            { id: 'predictions', label: 'Predictions' },
            { id: 'alerts', label: 'Alerts' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map(m => (
              <div key={m.name} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">Last Validated: {m.lastValidation}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    m.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {m.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Accuracy</span>
                    <span className={`text-xl font-bold ${m.status === 'Warning' ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>{m.accuracy}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Performance Score</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{m.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PerformanceMetricCard 
              modelName="Financial Readiness Metrics" 
              metrics={[
                { label: 'Accuracy', value: '78%', trend: 'down', trendValue: '14%' },
                { label: 'Precision', value: '75%', trend: 'down', trendValue: '12%' },
                { label: 'Recall', value: '79%', trend: 'down', trendValue: '10%' },
                { label: 'F1 Score', value: '77%', trend: 'down', trendValue: '11%' }
              ]} 
            />
            <PerformanceMetricCard 
              modelName="Agent Liquidity Metrics" 
              metrics={[
                { label: 'Accuracy', value: '91%', trend: 'neutral', trendValue: '0%' },
                { label: 'Precision', value: '89%', trend: 'up', trendValue: '1%' },
                { label: 'Recall', value: '93%', trend: 'up', trendValue: '2%' },
                { label: 'F1 Score', value: '91%', trend: 'neutral', trendValue: '0%' }
              ]} 
            />
          </div>
        </div>
      )}

      {activeTab === 'drift' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Financial Readiness Data Drift</h3>
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200">Average Transaction Amount</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">35% Change</span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div><span className="text-slate-500">Baseline:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">৳ 3,000</span></div>
                    <div><span className="text-slate-500">Current:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">৳ 8,000</span></div>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Monthly Transaction Frequency</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">5% Change</span>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div><span className="text-slate-500">Baseline:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">40</span></div>
                    <div><span className="text-slate-500">Current:</span> <span className="font-semibold text-slate-700 dark:text-slate-300">42</span></div>
                  </div>
                </div>
              </div>
            </div>
            <DataDriftChart data={driftData} threshold={0.2} />
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Predictions Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PredictionAccuracyCard 
              modelName="Agent Liquidity Model"
              prediction="High shortage risk (82% prob)"
              actual="Shortage occurred at 5 PM"
              status="Correct Prediction"
            />
            <PredictionAccuracyCard 
              modelName="Merchant Growth Booster"
              prediction="Launch campaign at 5 PM"
              actual="Sales increased 20%"
              status="Correct Prediction"
            />
            <PredictionAccuracyCard 
              modelName="Financial Readiness Model"
              prediction="Ready for SME Loan"
              actual="Defaulted first payment"
              status="Incorrect Prediction"
            />
            <PredictionAccuracyCard 
              modelName="Customer Zero-Cash Model"
              prediction="Will visit grocery store"
              actual="Pending verification"
              status="Pending"
            />
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <AIAlertPanel alerts={alerts} />
      )}
    </div>
  );
};
