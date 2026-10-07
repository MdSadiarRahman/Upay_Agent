import React, { useState, useEffect } from 'react';
import { FinancialAlertCard, AlertData } from './FinancialAlertCard';
import { RecommendationPanel, RecommendationData } from './RecommendationPanel';
import { Sparkles, BellRing } from 'lucide-react';

export const ProactiveInsights: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the proactive AI backend analysis
    const fetchProactiveData = () => {
      setTimeout(() => {
        setAlerts([
          {
            id: 'alert_1',
            type: 'danger',
            title: 'High Spending Detected',
            message: 'Food expenses increased 40% this month compared to your average.'
          },
          {
            id: 'alert_2',
            type: 'info',
            title: 'Upcoming Bill',
            message: 'Electricity bill (৳1500) is due in 3 days.'
          }
        ]);
        
        setRecommendations([
          {
            id: 'rec_1',
            title: 'Reduce Unnecessary Spending',
            description: 'You can save ৳1200/month by reducing unnecessary spending in Food.',
            actionText: 'Set a Budget'
          },
          {
            id: 'rec_2',
            title: 'Automate Your Savings',
            description: 'You have excess liquidity this week. Consider setting up an auto-save rule.',
            actionText: 'Setup Auto-Save'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchProactiveData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-blue-200" />
              Proactive AI Assistant
            </h2>
            <p className="text-blue-100 text-sm max-w-md">
              I constantly monitor your financial patterns to provide timely alerts and personalized recommendations. I don't make decisions for you—I give you the insights to make better ones.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BellRing className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Financial Alerts</h3>
          </div>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-500">No active alerts at this time.</p>
            ) : (
              alerts.map(alert => <FinancialAlertCard key={alert.id} alert={alert} />)
            )}
          </div>
        </div>

        {/* Recommendations Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-sm text-slate-500">No new recommendations today.</p>
            ) : (
              recommendations.map(rec => <RecommendationPanel key={rec.id} recommendation={rec} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
