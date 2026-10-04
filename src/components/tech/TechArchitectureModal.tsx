import React, { useState } from 'react';
import {
  X,
  Cpu,
  Database,
  Server,
  Map,
  Sparkles,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { DATABASE_SCHEMA_DDL } from '../../db/schemaDefinition';
import { Language } from '../../types';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'backend_api' | 'dataset_ml' | 'database' | 'gemini_ai' | 'google_maps' | 'frontend'>('dataset_ml');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-t-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isBn ? 'উপায়পালস এআই – টেকনিক্যাল ও ডাটা সায়েন্স কনসোল' : 'UpayPulse AI — Tech & Data Architecture'}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                  ML-Ready
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'এমএফএস ডাটা আর্কিটেকচার, ফিচার ইঞ্জিনিয়ারিং, মডেল সাপোর্ট ও এপিআই' : 'MFS Connected Entities, Feature Engineering Pipeline, and Model Training Data'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tech Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'dataset_ml', label: 'Dataset & ML Architecture', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'backend_api', label: 'Backend API Ready', icon: <Server className="w-3.5 h-3.5" /> },
            { id: 'database', label: 'Database Schema (SQL)', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'gemini_ai', label: 'Gemini AI Pipeline', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'google_maps', label: 'Google Maps Points', icon: <Map className="w-3.5 h-3.5" /> },
            { id: 'frontend', label: 'Component Tree', icon: <Cpu className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 0: DATASET & ML ARCHITECTURE */}
        {activeTab === 'dataset_ml' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-2xl space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 block">Connected FinTech MFS Entities (6 Tables)</span>
              <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                Replaces isolated mock state with realistic relational data flows linking customers, agents, transactions, merchants, campaigns, and regional location pressures.
              </p>
            </div>

            {/* 6 Entities Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">1. Customers</span>
                <span className="text-[10px] text-slate-500 block">15 fields • Wallet, Cashout Freq, Risk Tier</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Feat: CashOutAlternativeScore</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">2. Agents</span>
                <span className="text-[10px] text-slate-500 block">18 fields • Cash/Float, Footfall, Failures</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Feat: DepletionRate & RiskScore</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">3. Transactions</span>
                <span className="text-[10px] text-slate-500 block">10 fields • Time-series, 6 Scenarios</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Feat: NetCashDelta & DayType</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">4. Merchants</span>
                <span className="text-[10px] text-slate-500 block">16 fields • Sales, Digital vs Cash Split</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Feat: DigitalAdoptionRate</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">5. Campaigns</span>
                <span className="text-[10px] text-slate-500 block">14 fields • Budget, Margin Safety</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Feat: SalesImpactMultiplier</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">6. Locations</span>
                <span className="text-[10px] text-slate-500 block">9 fields • Coordinates, Population</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Feat: CashPressureIndex</span>
              </div>
            </div>

            {/* AI Agent Machine Learning Targets */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">AI Agent Model Training Specifications:</span>
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <div>• <strong>Agent Liquidity Prediction:</strong> Target <code className="text-amber-600 dark:text-amber-400 font-mono">future_cash_shortage_4h</code> via XGBoost / Time Series (features: depletion rate, day type multiplier, queue length, footfall).</div>
                <div>• <strong>PartnerScore Rebalancing:</strong> Exact analytical formula combining 4 normalized sub-scores (0.45 Surplus + 0.30 Distance + 0.15 Reliability + 0.10 Operating Hours).</div>
                <div>• <strong>Merchant Booster AI:</strong> Target <code className="text-blue-600 dark:text-blue-400 font-mono">incremental_sales_lift</code> with margin guardrail constraint (&lt; 8% discount to protect 12-15% retail margin).</div>
                <div>• <strong>Customer Smart Offer AI:</strong> Multi-factor ranking: 0.40 Distance + 0.30 Category + 0.20 Intent + 0.10 Fatigue.</div>
                <div>• <strong>Fraud Detection AI:</strong> Isolation Forest & velocity thresholding flagging anomalies without irreversible automated account freezing.</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: BACKEND API READY */}
        {activeTab === 'backend_api' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white text-xs block">Production REST / Microservice Endpoints</span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Standardized REST JSON endpoints integrated with Bearer token authentication & idempotency headers.
              </p>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span><strong className="text-emerald-600 dark:text-emerald-400">POST</strong> /api/v1/auth/login</span>
                <span className="text-slate-500">MFS Pin Authentication</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span><strong className="text-blue-600 dark:text-blue-400">GET</strong> /api/v1/agents/:id/liquidity</span>
                <span className="text-slate-500">Telemetry & 4h forecast</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span><strong className="text-purple-600 dark:text-purple-400">POST</strong> /api/v1/rebalance/authorize</span>
                <span className="text-slate-500">Supervisor PIN verification</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span><strong className="text-emerald-600 dark:text-emerald-400">POST</strong> /api/v1/merchants/campaigns</span>
                <span className="text-slate-500">AI Margin-Safe Campaign launch</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span><strong className="text-amber-600 dark:text-amber-400">POST</strong> /api/v1/routes/zero-cash-plan</span>
                <span className="text-slate-500">Routing polyline & savings engine</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DATABASE SCHEMA */}
        {activeTab === 'database' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">PostgreSQL / Cloud SQL Relational DDL</span>
              <button
                onClick={() => handleCopy(DATABASE_SCHEMA_DDL)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy DDL'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-72">
              {DATABASE_SCHEMA_DDL}
            </pre>
          </div>
        )}

        {/* TAB 3: GEMINI AI INTEGRATION */}
        {activeTab === 'gemini_ai' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-2xl space-y-1.5 text-purple-900 dark:text-purple-200">
              <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Google Gen AI SDK & Conversational AI Engine (`@google/genai`)</span>
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-purple-100/90">
                Connected with `gemini-3.8-flash` model and dual-role fintech chat architecture (`fintechChatEngine.ts`). Grounded with Upay Privacy Policy, 17 platform features, and Responsible AI guardrails (human-in-the-loop, zero autonomous fund transfers).
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <span className="text-slate-400 block font-sans font-bold text-xs">SDK Usage Pattern:</span>
              <div className="text-emerald-400">import &#123; GoogleGenAI &#125; from '@google/genai';</div>
              <div className="text-slate-300">const ai = new GoogleGenAI(&#123; apiKey: process.env.GEMINI_API_KEY &#125;);</div>
              <div className="text-slate-300">const res = await ai.models.generateContent(&#123; model: 'gemini-3.8-flash', contents &#125;);</div>
            </div>
          </div>
        )}

        {/* TAB 4: GOOGLE MAPS INTEGRATION */}
        {activeTab === 'google_maps' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl space-y-1.5 text-blue-900 dark:text-blue-200">
              <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <Map className="w-4 h-4 text-blue-500" />
                <span>Google Maps Platform Geolocation & Routing Architecture</span>
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-blue-100/90">
                Calibrated to Dinajpur Sadar center (25.6279° N, 88.6332° E). Provides live distance computation using Haversine algorithm and generates walking Directions API URLs for the Zero-Cash Shopping Route.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Agent Sadar-14:</span>
                <span className="text-slate-900 dark:text-white font-bold">25.6281° N, 88.6335° E</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 block">Rahman Pharmacy:</span>
                <span className="text-slate-900 dark:text-white font-bold">25.6272° N, 88.6321° E</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMPONENT HIERARCHY */}
        {activeTab === 'frontend' && (
          <div className="space-y-2 text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">Modular Frontend Component Tree</span>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div>src/</div>
              <div>  context/AuthContext.tsx (Customer & Business session state)</div>
              <div>  components/auth/LoginPage.tsx (Dual-portal gateway)</div>
              <div>  components/dashboards/CustomerDashboard.tsx (Mobile-first wallet)</div>
              <div>  components/dashboards/BusinessDashboard.tsx (Agent/Merchant/Ops)</div>
              <div>  components/AgentLiquidityRadar.tsx (Demand & rebalancing)</div>
              <div>  components/MerchantBooster.tsx (Growth & campaigns)</div>
              <div>  components/PressureMap.tsx (NOC SVG visualizer)</div>
              <div>  components/ResponsibleAIPanel.tsx (Governance & fraud queue)</div>
              <div>  services/ (Gemini AI & Google Maps integration layer)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
