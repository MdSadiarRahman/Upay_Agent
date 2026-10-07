import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ReadinessResponse {
  score: number;
  risk_level: string;
  confidence: number;
  explanation: {
    positive_factors: string[];
    risk_factors: string[];
  };
  gemini_explanation: string;
}

interface MetricResult {
  Model: string;
  Accuracy: number;
  Precision: number;
  Recall: number;
  F1: number;
  AUC: number;
}

export const FinancialReadinessSection: React.FC = () => {
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Assuming test customer data for demo purposes
        const reqData = {
          income: 70000,
          expense: 35000,
          savings: 20000,
          transactions: 60,
          cash_out: 5,
          digital_payment: 20,
          late_payment: 0,
          bill_payment_history: 0.9,
          income_stability: 0.8
        };

        const res = await axios.post('http://localhost:8000/api/financial-readiness/predict', reqData);
        setReadiness(res.data);

        const metricsRes = await axios.get('http://localhost:8000/api/financial-readiness/metrics');
        if (metricsRes.data && metricsRes.data.models) {
          setMetrics(metricsRes.data.models);
        }
      } catch (err) {
        console.error("Error fetching financial readiness", err);
        setError("Failed to load ML financial readiness data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4 bg-white rounded-xl shadow-sm text-center">Analyzing financial profile using ML...</div>;
  }

  if (error || !readiness) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-xl shadow-sm">{error}</div>;
  }

  const bestModel = metrics.find(m => m.Model === 'XGBoost') || metrics[0];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-sm overflow-hidden text-white">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold">AI Financial Readiness Assessment</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm mb-1">Financial Readiness Score</p>
              <div className="text-4xl font-bold">{readiness.score}<span className="text-xl text-blue-200">/100</span></div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm mb-1">Risk Level</p>
              <div className="flex items-center gap-2">
                {readiness.risk_level === 'Low' ? <CheckCircle className="w-8 h-8 text-green-300" /> : <AlertTriangle className="w-8 h-8 text-yellow-300" />}
                <span className="text-3xl font-bold">{readiness.risk_level}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-blue-100 text-sm mb-1">Model Confidence</p>
              <div className="text-3xl font-bold">{(readiness.confidence * 100).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Why This Score?
          </h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-green-600 mb-2 uppercase tracking-wider">Positive Factors</h4>
              <ul className="space-y-2">
                {readiness.explanation.positive_factors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
                {readiness.explanation.positive_factors.length === 0 && <li className="text-gray-500 text-sm">None detected</li>}
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-red-500 mb-2 uppercase tracking-wider">Risk Factors</h4>
              <ul className="space-y-2">
                {readiness.explanation.risk_factors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    <span>{factor}</span>
                  </li>
                ))}
                {readiness.explanation.risk_factors.length === 0 && <li className="text-gray-500 text-sm">None detected</li>}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">AI Assistant Explanation</h4>
            <p className="text-blue-900 text-sm leading-relaxed">{readiness.gemini_explanation}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            Model Performance Dashboard
          </h3>
          
          {bestModel ? (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-50 text-indigo-800 rounded-lg font-medium text-center mb-4">
                Selected Final Model: {bestModel.Model}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                  <div className="text-2xl font-bold text-gray-800">{bestModel.Accuracy}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">Precision</div>
                  <div className="text-2xl font-bold text-gray-800">{bestModel.Precision}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">Recall</div>
                  <div className="text-2xl font-bold text-gray-800">{bestModel.Recall}%</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">AUC Score</div>
                  <div className="text-2xl font-bold text-indigo-600">{bestModel.AUC.toFixed(2)}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Metrics evaluated on synthetic validation dataset using transactions history.
              </p>
            </div>
          ) : (
             <p className="text-gray-500">Model metrics not available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
