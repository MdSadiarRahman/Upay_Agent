import React, { useState } from 'react';
import {
  Store,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  HelpCircle,
  Scale,
  Share2,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { Agent, Language } from '../types';
import { calculatePartnerScore, formatTaka } from '../utils/algorithms';

interface AgentLiquidityRadarProps {
  language: Language;
  agents: Agent[];
  selectedAgentId: string;
  onSelectAgentId: (id: string) => void;
  onRequestRebalance: (targetAgent: Agent) => void;
}

export const AgentLiquidityRadar: React.FC<AgentLiquidityRadarProps> = ({
  language,
  agents,
  selectedAgentId,
  onSelectAgentId,
  onRequestRebalance,
}) => {
  const isBn = language === 'bn';
  const [forecastHorizon, setForecastHorizon] = useState<'2h' | '4h' | '24h'>('4h');
  const [showFormulaExplainer, setShowFormulaExplainer] = useState(false);

  // Currently focused agent
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  // Other agents as potential rebalance candidates
  const candidatePartners = agents
    .filter((a) => a.id !== currentAgent.id && a.status !== 'closed')
    .map((partner) => {
      const distance = partner.distanceFromTargetKm || 1.0;
      const { totalScore, breakdown } = calculatePartnerScore(
        partner.surplusAmount,
        currentAgent.expectedShortage || 20000,
        distance,
        partner.reliabilityScore,
        true
      );

      const suggestedAmount = Math.min(
        partner.surplusAmount > 0 ? partner.surplusAmount : 0,
        Math.round((currentAgent.expectedShortage || 24000) * (totalScore / 100))
      );

      return {
        agent: partner,
        score: totalScore,
        breakdown,
        distance,
        suggestedAmount,
      };
    })
    .sort((a, b) => b.score - a.score);

  // Demand multiplier based on horizon
  const horizonMultiplier = forecastHorizon === '2h' ? 0.55 : forecastHorizon === '4h' ? 1.0 : 2.8;
  const projectedDemand = Math.round(currentAgent.predictedDemandNext4h * horizonMultiplier);

  // Hourly timeline labels
  const timeLabels = ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];
  const timeLabelsBn = ['বিকাল ৩:০০', 'বিকাল ৪:০০', 'বিকাল ৫:০০', 'সন্ধ্যা ৬:০০', 'সন্ধ্যা ৭:০০', 'রাত ৮:০০', 'রাত ৯:০০', 'রাত ১০:০০'];

  return (
    <div className="space-y-6">
      {/* 1. AGENT OVERVIEW SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Agent ID: {currentAgent.id.toUpperCase()}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  currentAgent.shortageRisk >= 75
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse'
                    : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  {currentAgent.shortageRisk >= 75
                    ? (isBn ? 'ঝুঁকি সূচক: সংকটজনক' : 'Liquidity Risk: High')
                    : (isBn ? 'ঝুঁকি সূচক: নিরাপদ' : 'Liquidity Risk: Nominal')}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {isBn ? currentAgent.nameBn : currentAgent.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? currentAgent.locationNameBn : currentAgent.locationName}
              </p>
            </div>
          </div>

          {/* Agent Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isBn ? 'এজেন্ট নির্বাচন:' : 'Select Agent:'}
            </span>
            <select
              value={currentAgent.id}
              onChange={(e) => onSelectAgentId(e.target.value)}
              className="bg-transparent text-xs font-bold text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                  {isBn ? ag.nameBn : ag.name} ({ag.shortageRisk}% {isBn ? 'ঝুঁকি' : 'risk'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5 Core Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'নগদ ক্যাশ ব্যালেন্স' : 'Available Physical Cash'}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{formatTaka(currentAgent.currentCash, isBn)}</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-0.5">{isBn ? 'কাউন্টার নগদ তহবিল' : 'In-vault currency'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'ডিজিটাল ই-ফ্লোট' : 'Digital e-Float'}</span>
            <span className="text-lg font-black text-amber-700 dark:text-amber-300 font-mono">{formatTaka(currentAgent.currentEFloat, isBn)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{isBn ? 'এমএফএস নেটওয়ার্ক ব্যালেন্স' : 'Network Float'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'দৈনিক লেনদেন ভলিউম' : "Daily Volume Processed"}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{formatTaka(currentAgent.currentCash + 36000, isBn)}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{isBn ? '৩৯টি অনুমোদিত লেনদেন' : '39 verified txns'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'কমিশন উপার্জন' : "Agent Commission"}</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatTaka(840, isBn)}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 block mt-0.5">{isBn ? '+১২% বেসলাইনের চেয়ে বেশি' : '+12% vs baseline'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'লিকুইডিটি ঘাটতি ঝুঁকি' : 'Shortage Deficit Risk'}</span>
            <span className={`text-lg font-black font-mono ${currentAgent.shortageRisk >= 75 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {currentAgent.shortageRisk}% {currentAgent.shortageRisk >= 75 ? 'CRITICAL' : 'SAFE'}
            </span>
            <span className="text-[10px] text-rose-500 block mt-0.5">
              {currentAgent.expectedShortage > 0 ? `-${formatTaka(currentAgent.expectedShortage, isBn)}` : 'Stable Reserve'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. AI LIQUIDITY RADAR SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
              {isBn ? 'প্রেডিক্টিভ ডিমান্ড ফোরকাস্ট' : 'Predictive Demand Engine'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>{isBn ? 'এআই লিকুইডিটি রাডার ও ক্যাশ পূর্বাভাস' : 'AI Liquidity Radar & Cash Depletion Forecast'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'আগামী ঘণ্টার লেনদেন চাপ পূর্বাভাস দিয়ে গ্রাহক ভোগান্তির আগেই ক্যাশ ঘাটতি প্রতিরোধ করুন।'
                : 'AI-powered liquidity forecasting to prevent cash shortages before they impact customers.'}
            </p>
          </div>

          {/* Forecast Horizon Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 px-2 font-medium">{isBn ? 'সময়সীমা:' : 'Horizon:'}</span>
            {(['2h', '4h', '24h'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setForecastHorizon(h)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  forecastHorizon === h ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Warning Banner: Cash may finish within 4 hours */}
        {currentAgent.shortageRisk >= 75 && (
          <div className="p-4 bg-gradient-to-r from-rose-500/15 via-rose-50 to-white dark:via-rose-950/40 dark:to-slate-900 border border-rose-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-rose-700 dark:text-rose-300 text-sm">
                  {isBn ? 'সতর্কতা: আগামী ৪ ঘণ্টার মধ্যে নগদ তহবিল শেষ হতে পারে!' : 'Liquidity Alert: Cash depletion projected within 4 hours'}
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-200/80 mt-0.5">
                  {isBn
                    ? `আনুমানিক পিক আওয়ার ${currentAgent.peakWindowBn}-এ প্রত্যাশিত চাহিদা ${projectedDemand.toLocaleString()} টাকা, ঘাটতি হতে পারে ${currentAgent.expectedShortage.toLocaleString()} টাকা।`
                    : `Peak demand window will cause an estimated ৳ ${currentAgent.expectedShortage.toLocaleString()} cash shortage without cluster rebalancing.`}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRequestRebalance(currentAgent)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shrink-0 shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'রিব্যালেন্সিং পার্টনার দেখুন' : 'Explore Rebalancing Partners'}</span>
            </button>
          </div>
        )}

        {/* Depletion Curve Visual */}
        <div className="space-y-3 pt-2">
          {currentAgent.hourlyDemand.map((demand, idx) => {
            const projectedCash = currentAgent.hourlyCashProjected[idx];
            const isNegative = projectedCash <= 0;
            const maxDemand = Math.max(...currentAgent.hourlyDemand);
            const barWidth = Math.min(100, Math.round((demand / maxDemand) * 100));

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 w-24">
                    {isBn ? timeLabelsBn[idx] : timeLabels[idx]}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {isBn ? 'প্রত্যাশিত চাহিদা:' : 'Demand:'} <strong className="text-slate-900 dark:text-white font-mono">{formatTaka(demand, isBn)}</strong>
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isNegative ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isBn ? 'প্রত্যাশিত ক্যাশ: ' : 'Projected Cash: '}
                    {formatTaka(projectedCash, isBn)}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800">
                  <div
                    style={{ width: `${barWidth}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isNegative
                        ? 'bg-gradient-to-r from-red-600 to-red-400 animate-pulse'
                        : 'bg-gradient-to-r from-amber-500 to-amber-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. AGENT REBALANCING ENGINE (PartnerScore Ranking) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30">
              {isBn ? 'অ্যালগরিদমিক পিয়ার ম্যাচিং' : 'Algorithmic Peer Matching'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>{isBn ? 'এজেন্ট রিব্যালেন্সিং ইঞ্জিন (PartnerScore)' : 'Agent Rebalancing Engine'}</span>
            </h2>
          </div>

          <button
            onClick={() => setShowFormulaExplainer(!showFormulaExplainer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>{isBn ? 'সূত্র দেখুন (Formula)' : 'View Formula'}</span>
          </button>
        </div>

        {/* Highlighted PartnerScore Formula */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-purple-300 dark:border-purple-500/30 text-xs space-y-1">
          <div className="flex items-center justify-between text-purple-800 dark:text-purple-300 font-bold font-mono">
            <span>Score = 0.45 Surplus + 0.30 Distance + 0.15 Reliability + 0.10 Operating Hour</span>
            <span className="text-[10px] text-slate-500">Scale: 0-100</span>
          </div>
          {showFormulaExplainer && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-400 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>• <strong>উদ্বৃত্ত (45%):</strong> налич ক্যাশ কভারেজ</div>
              <div>• <strong>দূরত্ব (30%):</strong> পৌঁছানোর গতি</div>
              <div>• <strong>নির্ভরযোগ্যতা (15%):</strong> ট্র্যাক রেকর্ড</div>
              <div>• <strong>সময় (10%):</strong> খোলা থাকার নিশ্চয়তা</div>
            </div>
          )}
        </div>

        {/* Recommended Agents Cards */}
        <div className="space-y-3">
          {candidatePartners.map((item, index) => (
            <div
              key={item.agent.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <span className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                  index === 0
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  #{index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{isBn ? item.agent.nameBn : item.agent.name}</h3>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 font-bold">
                      PartnerScore: {item.score}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>দূরত্ব: <strong className="text-slate-800 dark:text-slate-200">{item.distance} কিমি</strong></span>
                    <span>•</span>
                    <span>উদ্বৃত্ত: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formatTaka(item.agent.surplusAmount, isBn)}</strong></span>
                    <span>•</span>
                    <span>নির্ভরযোগ্যতা: <strong className="text-amber-600 dark:text-amber-300">{item.agent.reliabilityScore}%</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-500 block">{isBn ? 'প্রস্তাবিত বরাদ্দ' : 'Suggested Allocation'}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatTaka(item.suggestedAmount, isBn)}</span>
                </div>
                <button
                  onClick={() => onRequestRebalance(currentAgent)}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isBn ? 'অনুরোধ পাঠান' : 'Request'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. REBALANCE APPROVAL WORKFLOW & RESPONSIBLE NOTICE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-500" />
          <span>{isBn ? 'অনুমোদিত রিব্যালেন্সিং কার্যপ্রণালী (Approval Workflow)' : 'Authorized Rebalancing Workflow'}</span>
        </h2>

        {/* Step-by-Step Interactive Breadcrumb */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">ধাপ ১</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">AI Recommendation</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block">ধাপ ২</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">Agent Request</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">ধাপ ৩</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">Approval Modal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">ধাপ ৪</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">PIN Verification</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block">ধাপ ৫</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5 block">Audit Trail</span>
            </div>
          </div>
        </div>

        {/* Critical Non-Autonomous Callout */}
        <div className="p-3.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
          <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{isBn ? 'কঠোর নিয়ন্ত্রক নীতি (Strict Principle):' : 'Core Regulatory Principle:'}</span>
          </span>
          <p className="text-slate-700 dark:text-amber-100/90 leading-relaxed text-[11px]">
            {isBn
              ? 'এআই কখনোই স্বয়ংক্রিয়ভাবে ব্যাংক অ্যাকাউন্ট থেকে টাকা ট্রান্সফার করে না। এটি কেবল ডিসিশন সাপোর্ট ও পার্টনার ম্যাচিং প্রদান করে। প্রতিটি রিব্যালেন্সিংয়ে দায়িত্বপ্রাপ্ত এরিয়া সুপারের পিন ভেরিফিকেশন ও ক্রিপ্টোগ্রাফিক অডিট ট্রেইল বাধ্যতামূলক।'
              : 'AI never transfers money automatically. It provides decision ranking, requiring human-in-the-loop supervisor PIN authentication with immutable audit trails.'}
          </p>
        </div>
      </div>

      {/* 5. AGENT QUEUE PREDICTOR SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
              {isBn ? 'ক্রাউড স্মুথিং' : 'Crowd Smoothing'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>{isBn ? 'এজেন্ট কিউ প্রেডিক্টর (Queue Predictor)' : 'Agent Queue Predictor'}</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Current Waiting Time */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-red-200 dark:border-red-500/30 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{isBn ? 'বর্তমান গড় অপেক্ষার সময়:' : 'Current Wait Time:'}</span>
            <span className="text-2xl font-black font-mono text-red-500 dark:text-red-400">{currentAgent.avgWaitTimeMin} {isBn ? 'মিনিট' : 'mins'}</span>
            <span className="text-[10px] text-slate-500 block">{currentAgent.queueLength} {isBn ? 'জন লাইনে দাঁড়ানো' : 'people waiting'}</span>
          </div>

          {/* Alternative Nearby Agent */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{isBn ? 'নিকটবর্তী বিকল্প এজেন্ট:' : 'Alternative Nearby Agent:'}</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 block">সদর-০৯ (ভুঁইয়া ব্রাদার্স)</span>
            <span className="text-xs text-slate-500 dark:text-slate-300 font-mono">০.৭ কিমি • মাত্র ৪ মিনিট অপেক্ষা</span>
          </div>

          {/* Expected Service Time */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{isBn ? 'প্রতি লেনদেনের গড় সময়:' : 'Expected Service Time:'}</span>
            <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-300">~২.৫ {isBn ? 'মিনিট' : 'mins'}</span>
            <span className="text-[10px] text-slate-500 block">{isBn ? 'স্বাভাবিক ক্যাশ-আউট ট্রাফিক' : 'Normal cash-out traffic'}</span>
          </div>
        </div>

        {/* Dynamic Queue Reroute Alert */}
        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            {isBn
              ? `অতিরিক্ত ভিড় শনাক্ত: আশপাশের গ্রাহকদের স্বয়ংক্রিয়ভাবে সদর-০৯ এজেন্টে (০.৭ কিমি, ৪ মিনিট অপেক্ষা) যাওয়ার জন্য অ্যাপে নোটিফিকেশন পাঠানো হচ্ছে।`
              : `High queue delay detected. Automated app nudges rerouting nearby customers to Sadar-09 (0.7 km, 4m wait).`}
          </span>
        </div>
      </div>
    </div>
  );
};
