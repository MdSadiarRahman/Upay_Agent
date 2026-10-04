import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Bot,
  ArrowRight,
  HelpCircle,
  ShieldAlert,
  Scale,
  Search,
} from 'lucide-react';
import { Language, AuditLogEntry, FraudAnomaly } from '../types';
import { routeAndProcessQuery, OrchestratorResult } from '../services/aiOrchestrator';

interface ResponsibleAIPanelProps {
  language: Language;
  auditLogs: AuditLogEntry[];
  anomalies: FraudAnomaly[];
  onResolveAnomaly: (id: string, action: 'cleared' | 'restricted') => void;
}

export const ResponsibleAIPanel: React.FC<ResponsibleAIPanelProps> = ({
  language,
  auditLogs,
  anomalies,
  onResolveAnomaly,
}) => {
  const isBn = language === 'bn';
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // AI Orchestrator Query State
  const [orchestratorQuery, setOrchestratorQuery] = useState<string>('When will cash finish?');
  const [orchestratorResult, setOrchestratorResult] = useState<OrchestratorResult>(() =>
    routeAndProcessQuery('When will cash finish?')
  );

  const samplePrompts = [
    { text: 'Where can I get discount?', label: 'Customer Query' },
    { text: 'When will cash finish?', label: 'Liquidity Agent' },
    { text: 'Detect multiple account abuse', label: 'Risk / Fraud' },
    { text: 'How to boost merchant sales in afternoon?', label: 'Merchant Growth' },
  ];

  const handleRunOrchestrator = (queryText: string) => {
    setOrchestratorQuery(queryText);
    const result = routeAndProcessQuery(queryText);
    setOrchestratorResult(result);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter = filterType === 'all' || log.eventType === filterType;
    const matchesSearch =
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detailsBn.includes(searchQuery) ||
      log.detailsEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
                  {isBn ? 'এআই ইন্টেলিজেন্স লেয়ার ও গভর্নেন্স' : 'AI Intelligence Layer & Governance'}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {isBn ? 'রেসপন্সিবল এআই, প্রতারণা প্রতিরোধ ও ক্রিপ্টোগ্রাফিক অডিট' : 'Responsible AI, Fraud Defense & Cryptographic Audit'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn
                  ? 'মাল্টি-এজেন্ট রাউটিং, ব্যাখ্যামূলক সিদ্ধান্ত গ্রহণ এবং নন-কাস্টডিয়াল রিভিউ কিউ।'
                  : 'Multi-agent routing, explainable recommendations, and non-custodial fraud queues.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isBn ? 'বাংলাদেশ ব্যাংক এমএফএস নীতিমালা সম্মত' : 'MFS Regulatory Compliant'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 1. AI ORCHESTRATOR AGENT SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
              Multi-Agent Orchestrator
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>{isBn ? 'মাল্টি-এজেন্ট অর্কেস্ট্রেটর লেয়ার' : 'AI Orchestrator Routing Layer'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'ব্যবহারকারীর উদ্দেশ্য বুঝে সঠিক বিশেষজ্ঞ এজেন্টে (গ্রাহক, লিকুইডিটি, ঝুঁকি, মার্চেন্ট) স্বয়ংক্রিয়ভাবে রাউট করে।'
                : 'Interprets user intent and routes to Customer, Liquidity, Risk, or Merchant Growth Agent.'}
            </p>
          </div>
          <span className="font-mono text-xs text-purple-800 dark:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-xl border border-purple-500/20 font-bold">
            4 Specialized Agents Active
          </span>
        </div>

        {/* 4 Agent Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className={`p-3 rounded-2xl border text-center transition ${
            orchestratorResult.routedTo === 'customer_agent'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md border-amber-400'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-80">Agent 1</span>
            <span>Customer Agent</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center transition ${
            orchestratorResult.routedTo === 'risk_agent'
              ? 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300 font-bold shadow-md'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-80">Agent 2</span>
            <span>Risk & Fraud Agent</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center transition ${
            orchestratorResult.routedTo === 'liquidity_agent'
              ? 'bg-purple-500/20 border-purple-400 text-purple-800 dark:text-purple-300 font-bold shadow-md'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-80">Agent 3</span>
            <span>Liquidity Agent</span>
          </div>

          <div className={`p-3 rounded-2xl border text-center transition ${
            orchestratorResult.routedTo === 'merchant_growth_agent'
              ? 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300 font-bold shadow-md'
              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            <span className="block text-[10px] opacity-80">Agent 4</span>
            <span>Merchant Growth Agent</span>
          </div>
        </div>

        {/* Live Query Tester */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">{isBn ? 'নমুনা প্রশ্নসমূহ:' : 'Sample Prompts:'}</span>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRunOrchestrator(p.text)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>"{p.text}"</span>
                <span className="text-[9px] text-slate-400 font-mono">({p.label})</span>
              </button>
            ))}
          </div>

          {/* Interactive Routing Output Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-500">User Query:</span>
                <span className="font-bold text-slate-900 dark:text-white">"{orchestratorQuery}"</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-purple-700 dark:text-purple-300 font-bold">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>{orchestratorResult.agentNameEn}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">({Math.round(orchestratorResult.confidence * 100)}% match)</span>
              </div>
            </div>

            {/* Answer */}
            <div className="space-y-1">
              <span className="text-slate-500 font-semibold block text-[11px]">
                {isBn ? 'এজেন্ট উত্তর:' : 'Agent Response:'}
              </span>
              <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {isBn ? orchestratorResult.answerBn : orchestratorResult.answerEn}
              </p>
            </div>

            {/* Explainability Breakdown */}
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl space-y-2">
              <span className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5 text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>{isBn ? orchestratorResult.explainability.primaryReasonBn : orchestratorResult.explainability.primaryReasonEn}</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                {orchestratorResult.explainability.factors.map((f, i) => (
                  <div key={i} className="flex justify-between items-center bg-white dark:bg-slate-950/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                    <span className="text-slate-700 dark:text-slate-300">{isBn ? f.factorBn : f.factorEn}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0 ml-2">{f.impact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RESPONSIBLE AI EXPLAINABILITY & TRANSPARENCY CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-500" />
          <span>{isBn ? 'রেসপন্সিবল এআই ও স্বচ্ছতা মডেল (Explainable AI Model)' : 'Responsible AI & Explainability Engine'}</span>
        </h2>

        {/* Concrete Example: Why suggested Agent B? */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-amber-300 dark:border-amber-500/30 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-1.5">
              <span>{isBn ? 'বাস্তব উদাহরণ: কেন এজেন্ট বি (সদর-০৯) কে বেছে নেওয়া হলো?' : 'Example: Why suggested Agent B (Sadar-09)?'}</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-[11px]">
              PartnerScore: 94.2/100
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isBn
              ? 'মডেলটি কোনো ব্ল্যাক-বক্স নয়; এটি ৪টি সুস্পষ্ট গাণিতিক ওয়েটেডের ভিত্তিতে সিদ্ধান্ত প্রদর্শন করে:'
              : 'The model provides complete algorithmic explainability across 4 transparent mathematical weights:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 font-mono">0.45 Surplus</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">২০,০০০ টাকা উদ্বৃত্ত</span>
              <p className="text-[10px] text-slate-400 mt-1">পূর্ণ ঘাটতি মেটাতে সক্ষম</p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 font-mono">0.30 Distance</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">০.৭ কিমি দূরত্ব</span>
              <p className="text-[10px] text-slate-400 mt-1">সবচেয়ে কম যাতায়াত সময়</p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 font-mono">0.15 Reliability</span>
              <span className="font-bold text-amber-600 dark:text-amber-300 text-sm mt-0.5 block">৯৮% নির্ভরযোগ্যতা</span>
              <p className="text-[10px] text-slate-400 mt-1">অতীত রিব্যালেন্স রেকর্ড</p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] text-slate-500 font-mono">0.10 Operating Hours</span>
              <span className="font-bold text-purple-700 dark:text-purple-300 text-sm mt-0.5 block">রাত ১১:০০ পর্যন্ত খোলা</span>
              <p className="text-[10px] text-slate-400 mt-1">পিক সময়ে সেবা নিশ্চয়তা</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FRAUD DETECTION & HUMAN REVIEW QUEUE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30">
              Responsible Fraud Defense
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>{isBn ? 'প্রতারণা শনাক্তকরণ ও মানবীয় পর্যালোচনা কিউ (Human Review Queue)' : 'Fraud Detection & Human Review Queue'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'অযাচিত স্বয়ংক্রিয় একাউন্ট ব্যান না করে সন্দেহজনক আচরণ মানবীয় পর্যালোচনার জন্য পাঠানো হয়।'
                : 'Detects velocity spikes and promo abuse without irreversible automated account blocking.'}
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-amber-400/20 text-amber-800 dark:text-amber-300 font-mono">
            {anomalies.filter((a) => a.status === 'under_review').length} {isBn ? 'টি পর্যালোচনাধীন' : 'Pending Review'}
          </span>
        </div>

        {/* Core Non-Auto-Block Safeguard Banner */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>
            {isBn
              ? 'আইনি মূলনীতি: ভুল পজিটিভের কারণে নিরীহ গ্রাহকের আর্থিক ক্ষতি এড়াতে সরাসরি ব্লক না করে সুপারভাইজার পর্যালোচনায় পাঠানো বাধ্যতামূলক।'
              : 'Enforced Principle: Automated account blocking is strictly prohibited. Suspicious activities are routed to human review.'}
          </span>
        </div>

        {/* Anomaly Review Cards */}
        <div className="space-y-3">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                anom.status === 'cleared'
                  ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-slate-50 dark:bg-slate-950 border-amber-300 dark:border-amber-500/40 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-amber-400/20 text-amber-800 dark:text-amber-300 font-mono">
                    {anom.type.replace('_', ' ')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{anom.involvedEntity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{anom.timestamp}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-700 dark:text-red-400">
                    Risk Score: {anom.riskScore}%
                  </span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {isBn ? anom.descriptionBn : anom.descriptionEn}
              </p>

              {anom.status === 'under_review' ? (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => onResolveAnomaly(anom.id, 'cleared')}
                    className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {isBn ? 'অনুমোদন ও নিষ্পত্তি' : 'Approve & Clear'}
                  </button>
                  <button
                    onClick={() => onResolveAnomaly(anom.id, 'restricted')}
                    className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    {isBn ? 'রেট লিমিট প্রয়োগ' : 'Apply Rate Limit'}
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সুপারভাইজার কর্তৃক নিষ্পত্তিকৃত' : 'Resolved by Human Supervisor'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. IMMUTABLE AUDIT TRAIL LOGS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>{isBn ? 'ট্যাম্পার-প্রুফ ক্রিপ্টোগ্রাফিক অডিট ট্রেইল' : 'Cryptographic Audit Trail'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'সিস্টেমের প্রতিটি অনুমোদন ও আর্থিক ঘটনার অপরিবর্তনীয় ডিজিটাল লেজার।' : 'Tamper-evident system activity ledger.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isBn ? 'হ্যাশ দিয়ে খুঁজুন...' : 'Search hash...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 w-36"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1"
            >
              <option value="all">{isBn ? 'সকল ইভেন্ট' : 'All'}</option>
              <option value="rebalance_approved">{isBn ? 'রিব্যালেন্সিং' : 'Rebalances'}</option>
              <option value="campaign_launched">{isBn ? 'ক্যাম্পেইন' : 'Campaigns'}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">{isBn ? 'সময়' : 'Time'}</th>
                <th className="py-2.5 px-3">{isBn ? 'ইভেন্ট' : 'Event'}</th>
                <th className="py-2.5 px-3">{isBn ? 'বিবরণ' : 'Details'}</th>
                <th className="py-2.5 px-3">{isBn ? 'কর্তৃপক্ষ' : 'Actor'}</th>
                <th className="py-2.5 px-3">{isBn ? 'অডিট হ্যাশ' : 'Audit Hash'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-bold text-slate-900 dark:text-white">{isBn ? log.titleBn : log.titleEn}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 text-[11px] max-w-xs">{isBn ? log.detailsBn : log.detailsEn}</td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{log.actor}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-purple-700 dark:text-purple-300 text-[11px] whitespace-nowrap">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
