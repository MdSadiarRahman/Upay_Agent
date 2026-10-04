import React, { useState, useMemo } from 'react';
import {
  Navigation,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Store,
  DollarSign,
  TrendingDown,
  MapPin,
  ExternalLink,
  Layers,
  Radio,
  Clock,
  Compass,
  Zap,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Building2,
  Users,
  Eye,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  QrCode,
  Check,
  Crosshair,
} from 'lucide-react';
import { Agent, Merchant, Language, ScenarioType, RebalanceProposal } from '../types';
import { formatTaka, calculatePartnerScore } from '../utils/algorithms';
import { SCENARIO_PRESETS } from '../data/mockData';
import { MFS_GEO_ENTITIES, calculateGeoDistanceKm, getGoogleMapsRouteUrl } from '../services/googleMapsService';

export type MapRolePerspective = 'agent' | 'merchant' | 'supervisor';

interface PressureMapProps {
  language: Language;
  agents: Agent[];
  merchants: Merchant[];
  activeScenario: ScenarioType;
  setActiveScenario: (scenario: ScenarioType) => void;
  onSelectAgent: (agentId: string) => void;
  onSelectMerchant: (merchantId: string) => void;
  onRequestRebalance: (targetAgent: Agent) => void;
  approvedRebalances: RebalanceProposal[];
  userRole?: string;
  onOpenMicroMerchantModal?: () => void;
}

export const PressureMap: React.FC<PressureMapProps> = ({
  language,
  agents,
  merchants,
  activeScenario,
  setActiveScenario,
  onSelectAgent,
  onSelectMerchant,
  onRequestRebalance,
  approvedRebalances,
  userRole = 'agent',
  onOpenMicroMerchantModal,
}) => {
  const isBn = language === 'bn';

  // Determine initial perspective based on userRole
  const initialPerspective: MapRolePerspective =
    userRole === 'merchant' ? 'merchant' : userRole === 'operator' ? 'supervisor' : 'agent';

  // 1. Perspective Switcher State (Agent vs Merchant vs Supervisor)
  const [activePerspective, setActivePerspective] = useState<MapRolePerspective>(initialPerspective);

  // 2. Selected Entity for Inspector
  const [selectedEntityId, setSelectedEntityId] = useState<string>('sadar-14');
  const [mapMode, setMapMode] = useState<'svg_radar' | 'geo_inspector'>('svg_radar');
  const [showPaths, setShowPaths] = useState<boolean>(true);
  const [showMerchants, setShowMerchants] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);

  // Key entities
  const targetAgent = agents.find((a) => a.id === 'sadar-14') || agents[0];
  const partner09 = agents.find((a) => a.id === 'sadar-09');
  const partner11 = agents.find((a) => a.id === 'sadar-11');
  const anchorMerchant = merchants.find((m) => m.id === 'merch-01') || merchants[0];

  const selectedAgent = agents.find((a) => a.id === selectedEntityId);
  const selectedMerchant = merchants.find((m) => m.id === selectedEntityId);

  // Calculations for Supervisor Overview
  const totalCashAtRisk = agents.reduce((acc, a) => acc + (a.expectedShortage || 0), 0);
  const totalSurplusAvailable = agents.reduce((acc, a) => acc + (a.surplusAmount || 0), 0);
  const scenarioData = SCENARIO_PRESETS[activeScenario];

  // Helper for agent node styles in Supervisor view
  const getAgentNodeStyle = (agent: Agent) => {
    if (agent.status === 'closed') {
      return { fill: '#64748b', stroke: '#94a3b8', pulse: false, label: isBn ? 'বন্ধ' : 'Closed' };
    }
    if (agent.shortageRisk >= 75) {
      return { fill: '#ef4444', stroke: '#f87171', pulse: true, label: isBn ? 'তীব্র সংকট' : 'Critical Deficit' };
    }
    if (agent.shortageRisk >= 40) {
      return { fill: '#eab308', stroke: '#facc15', pulse: false, label: isBn ? 'চাহিদা বাড়ছে' : 'Rising Demand' };
    }
    if (agent.surplusAmount > 10000) {
      return { fill: '#a855f7', stroke: '#c084fc', pulse: false, label: isBn ? 'উদ্বৃত্ত হাব' : 'Surplus Hub' };
    }
    return { fill: '#10b981', stroke: '#34d399', pulse: false, label: isBn ? 'নিরাপদ লিকুইডিটি' : 'Safe' };
  };

  // Google directions URL helper
  const getSelectedEntityDirections = () => {
    const origin = MFS_GEO_ENTITIES['sadar-14'];
    const destination = selectedMerchant
      ? (MFS_GEO_ENTITIES[selectedMerchant.id] || MFS_GEO_ENTITIES['merch-01'])
      : (MFS_GEO_ENTITIES[selectedAgent?.id || 'sadar-09'] || MFS_GEO_ENTITIES['sadar-09']);
    return getGoogleMapsRouteUrl(origin, destination);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. TOP STRUCTURED PERSPECTIVE SWITCHER TABS */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Header Title & Role Perspective Description */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-sm">
                <Compass className="w-5 h-5 text-slate-950" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isBn ? 'বিজনেস জিআইএস ইন্টেলিজেন্স ম্যাপ' : 'Business GIS Intelligence Map'}</span>
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 rounded-full border border-amber-400/30 uppercase tracking-wide">
                {activePerspective.toUpperCase()} {isBn ? 'মোড' : 'MODE'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activePerspective === 'agent'
                ? isBn
                  ? 'এজেন্ট দৃষ্টিভঙ্গি: ক্যাশ ফুরিয়ে যাওয়ার গতি, নিকটস্থ উদ্বৃত্ত পার্টনার ও পিয়ার-টু-পিয়ার রি-ব্যালেন্সিং রাডার।'
                  : 'Agent View: Cash depletion rate, safe runway hours, and peer-to-peer liquidity rebalancing radar.'
                : activePerspective === 'merchant'
                ? isBn
                  ? 'মার্চেন্ট দৃষ্টিভঙ্গি: ৫০০মি ও ১.২কিমি কাস্টমার ফুটফল এলাকা, পাশের এজেন্টের ক্যাশআউট জ্যাম ও ডিজিটাল অফার জোন।'
                  : 'Merchant View: 500m & 1.2km footfall catchment radius, nearby ATM/agent diversion, and QR campaign zones.'
                : isBn
                ? 'সুপারভাইজার দৃষ্টিভঙ্গি: সমগ্র দিনাজপুর সদর ক্লাস্টারের ম্যাক্রো লিকুইডিটি হিটম্যাপ, ফ্রড নজরদারি ও ডিসপ্যাচ অডিট।'
                : 'Supervisor View: Macro cluster liquidity heatmap, cash-at-risk monitoring, and network dispatch governance.'}
            </p>
          </div>

          {/* Perspective Toggle Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* 1. AGENT TAB */}
            <button
              onClick={() => {
                setActivePerspective('agent');
                setSelectedEntityId('sadar-14');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activePerspective === 'agent'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{isBn ? '১. এজেন্ট লিকুইডিটি' : '1. Agent P2P'}</span>
            </button>

            {/* 2. MERCHANT TAB */}
            <button
              onClick={() => {
                setActivePerspective('merchant');
                setSelectedEntityId('merch-01');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activePerspective === 'merchant'
                  ? 'bg-purple-600 text-white shadow-md font-black scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{isBn ? '২. মার্চেন্ট গ্রোথ' : '2. Merchant Footfall'}</span>
            </button>

            {/* 3. SUPERVISOR TAB */}
            <button
              onClick={() => {
                setActivePerspective('supervisor');
                setSelectedEntityId('sadar-14');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                activePerspective === 'supervisor'
                  ? 'bg-blue-600 text-white shadow-md font-black scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isBn ? '৩. ক্লাস্টার সুপারভাইজার' : '3. Cluster NOC'}</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Scenario Selector & Map Mode */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Scenario Buttons for Real-time stress-testing */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>{isBn ? 'লাইভ সিনারিও:' : 'Live Scenario:'}</span>
            </span>
            {(Object.keys(SCENARIO_PRESETS) as ScenarioType[]).map((scKey) => {
              const sc = SCENARIO_PRESETS[scKey];
              const isCurrent = activeScenario === scKey;
              return (
                <button
                  key={scKey}
                  onClick={() => setActiveScenario(scKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isBn ? sc.titleBn.split(' ')[0] : sc.titleEn.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* View Mode & Layer Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setMapMode('svg_radar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  mapMode === 'svg_radar'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3 h-3" />
                <span>{isBn ? 'এনওসি রাডার' : 'Radar'}</span>
              </button>
              <button
                onClick={() => setMapMode('geo_inspector')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                  mapMode === 'geo_inspector'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>{isBn ? 'জিপিএস গ্রিড' : 'GPS Grid'}</span>
              </button>
            </div>

            <label className="flex items-center gap-1 cursor-pointer text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
              <input
                type="checkbox"
                checked={showPaths}
                onChange={(e) => setShowPaths(e.target.checked)}
                className="rounded border-slate-400 text-amber-500 focus:ring-0"
              />
              <span>{isBn ? 'রুট ভেক্টর' : 'Routes'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN MAP CANVAS + ROLE-SPECIFIC INSPECTOR SIDEBAR */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map Viewport (8 Columns on desktop) */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-3xl p-4 relative overflow-hidden shadow-xl min-h-[540px] flex flex-col justify-between">
          {/* Top Floating Watermark HUD */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-xs flex items-center gap-2.5 shadow-lg">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-ping ${
                activePerspective === 'agent'
                  ? 'bg-amber-400'
                  : activePerspective === 'merchant'
                  ? 'bg-purple-500'
                  : 'bg-blue-500'
              }`}
            />
            <div>
              <span className="font-extrabold text-white block">
                {activePerspective === 'agent'
                  ? isBn
                    ? 'এজেন্ট সদর-১৪ (শহিদ টেলিকম) লিকুইডিটি রাডার'
                    : 'Agent Sadar-14 Liquidity & P2P Swap Hub'
                  : activePerspective === 'merchant'
                  ? isBn
                    ? 'রহমান ফার্মেসি (মার্চেন্ট-০১) ফুটফল ও অফার জোন'
                    : 'Rahman Pharmacy Footfall & QR Catchment'
                  : isBn
                  ? 'দিনাজপুর সেন্ট্রাল ক্লাস্টার সুপারভাইজার এনওসি'
                  : 'Dinajpur Central Cluster Supervisor NOC'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                25.6279° N, 88.6332° E • Sadar Bazar Zone
              </span>
            </div>
          </div>

          {/* SVG Canvas vs Geolocation Grid */}
          {mapMode === 'svg_radar' ? (
            <>
              {/* Radial GIS Grid Background */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#64748b 1px, #020617 1px)',
                  backgroundSize: '36px 36px',
                  backgroundPosition: '0 0, 18px 18px',
                }}
              />

              <div className="relative w-full h-[470px] my-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <filter id="red-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ef4444" floodOpacity="0.8" />
                    </filter>
                    <filter id="purple-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#a855f7" floodOpacity="0.7" />
                    </filter>
                    <filter id="amber-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#f59e0b" floodOpacity="0.8" />
                    </filter>
                  </defs>

                  {/* Road Network Vectors */}
                  <g stroke="#334155" strokeWidth="1.0" strokeLinecap="round" opacity="0.5">
                    <line x1="5" y1="64" x2="95" y2="64" />
                    <line x1="24" y1="64" x2="38" y2="46" />
                    <line x1="38" y1="46" x2="55" y2="38" />
                    <line x1="55" y1="38" x2="80" y2="42" />
                    <line x1="38" y1="46" x2="49" y2="58" />
                    <line x1="49" y1="58" x2="70" y2="55" />
                  </g>

                  {/* Landmarks Text */}
                  <g fontSize="2" fill="#475569" fontWeight="bold">
                    <text x="16" y="70">গণেশতলা মোড়</text>
                    <text x="34" y="42">হাসপাতাল মোড়</text>
                    <text x="56" y="34">স্টেশন রোড</text>
                    <text x="50" y="63">সদর বাজার</text>
                  </g>

                  {/* ========================================================= */}
                  {/* PERSPECTIVE 1: AGENT P2P LIQUIDITY RADAR LAYERS */}
                  {/* ========================================================= */}
                  {activePerspective === 'agent' && (
                    <>
                      {/* Agent Shortage Deficit Warning Radius */}
                      <circle
                        cx={targetAgent.coords.x}
                        cy={targetAgent.coords.y}
                        r="16"
                        fill="#ef4444"
                        fillOpacity="0.12"
                        stroke="#ef4444"
                        strokeOpacity="0.5"
                        strokeWidth="0.6"
                        strokeDasharray="2 1"
                        className="animate-pulse"
                      />
                      <circle
                        cx={targetAgent.coords.x}
                        cy={targetAgent.coords.y}
                        r="26"
                        fill="#f59e0b"
                        fillOpacity="0.04"
                        stroke="#f59e0b"
                        strokeOpacity="0.3"
                        strokeWidth="0.4"
                      />

                      {/* Rebalancing Flow Vectors from Donor Agents */}
                      {showPaths && partner09 && (
                        <g>
                          <line
                            x1={partner09.coords.x}
                            y1={partner09.coords.y}
                            x2={targetAgent.coords.x}
                            y2={targetAgent.coords.y}
                            stroke="#c084fc"
                            strokeWidth="1.2"
                            strokeDasharray="2.5 1.5"
                            className="animate-pulse"
                          />
                          {/* Transfer Badge on Path */}
                          <rect
                            x={(partner09.coords.x + targetAgent.coords.x) / 2 - 8}
                            y={(partner09.coords.y + targetAgent.coords.y) / 2 - 3.5}
                            width="16"
                            height="3.5"
                            rx="1.5"
                            fill="#0f172a"
                            stroke="#a855f7"
                            strokeWidth="0.3"
                          />
                          <text
                            x={(partner09.coords.x + targetAgent.coords.x) / 2}
                            y={(partner09.coords.y + targetAgent.coords.y) / 2 - 1.2}
                            fill="#f3e8ff"
                            fontSize="1.8"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            ৳ ২৫,০০০ (০.৭ কিমি)
                          </text>
                        </g>
                      )}

                      {showPaths && partner11 && (
                        <g>
                          <line
                            x1={partner11.coords.x}
                            y1={partner11.coords.y}
                            x2={targetAgent.coords.x}
                            y2={targetAgent.coords.y}
                            stroke="#c084fc"
                            strokeWidth="0.8"
                            strokeDasharray="2 1.5"
                          />
                          <text
                            x={(partner11.coords.x + targetAgent.coords.x) / 2}
                            y={(partner11.coords.y + targetAgent.coords.y) / 2 - 1.5}
                            fill="#e9d5ff"
                            fontSize="1.8"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            ৳ ৯,০০০ (১.১ কিমি)
                          </text>
                        </g>
                      )}
                    </>
                  )}

                  {/* ========================================================= */}
                  {/* PERSPECTIVE 2: MERCHANT FOOTFALL & CASHLESS LAYERS */}
                  {/* ========================================================= */}
                  {activePerspective === 'merchant' && (
                    <>
                      {/* 500m Walk Geofence */}
                      <circle
                        cx={anchorMerchant.coords.x}
                        cy={anchorMerchant.coords.y}
                        r="14"
                        fill="#8b5cf6"
                        fillOpacity="0.12"
                        stroke="#8b5cf6"
                        strokeOpacity="0.6"
                        strokeWidth="0.6"
                      />
                      {/* 1.2km Drive/Cycle Radius */}
                      <circle
                        cx={anchorMerchant.coords.x}
                        cy={anchorMerchant.coords.y}
                        r="25"
                        fill="#3b82f6"
                        fillOpacity="0.05"
                        stroke="#3b82f6"
                        strokeOpacity="0.3"
                        strokeWidth="0.4"
                        strokeDasharray="2 2"
                      />

                      {/* Cash-Out Diversion Arrow from crowded agent to Merchant */}
                      <g>
                        <line
                          x1={targetAgent.coords.x}
                          y1={targetAgent.coords.y}
                          x2={anchorMerchant.coords.x}
                          y2={anchorMerchant.coords.y}
                          stroke="#38bdf8"
                          strokeWidth="1.0"
                          strokeDasharray="1.5 1"
                          className="animate-pulse"
                        />
                        <rect
                          x={(targetAgent.coords.x + anchorMerchant.coords.x) / 2 - 9}
                          y={(targetAgent.coords.y + anchorMerchant.coords.y) / 2 - 3}
                          width="18"
                          height="3.2"
                          rx="1.5"
                          fill="#0f172a"
                          stroke="#38bdf8"
                          strokeWidth="0.3"
                        />
                        <text
                          x={(targetAgent.coords.x + anchorMerchant.coords.x) / 2}
                          y={(targetAgent.coords.y + anchorMerchant.coords.y) / 2 - 1}
                          fill="#7dd3fc"
                          fontSize="1.7"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          ক্যাশআউট ডাইভার্সন (-১.৪% ফি)
                        </text>
                      </g>
                    </>
                  )}

                  {/* ========================================================= */}
                  {/* PERSPECTIVE 3: SUPERVISOR CLUSTER NOC LAYERS */}
                  {/* ========================================================= */}
                  {activePerspective === 'supervisor' && (
                    <>
                      {/* Zonal Catchment Boundaries */}
                      <polygon
                        points="10,50 45,35 45,80 15,80"
                        fill="#ef4444"
                        fillOpacity="0.04"
                        stroke="#ef4444"
                        strokeWidth="0.3"
                        strokeDasharray="2 2"
                      />
                      <polygon
                        points="48,30 85,30 85,75 50,75"
                        fill="#8b5cf6"
                        fillOpacity="0.04"
                        stroke="#8b5cf6"
                        strokeWidth="0.3"
                        strokeDasharray="2 2"
                      />
                      <text x="22" y="76" fill="#ef4444" fontSize="1.8" fontWeight="bold">
                        জোন ০১: ঘাটতি ঝুঁকিপূর্ণ
                      </text>
                      <text x="60" y="72" fill="#8b5cf6" fontSize="1.8" fontWeight="bold">
                        জোন ০২: লিকুইডিটি উদ্বৃত্ত
                      </text>
                    </>
                  )}

                  {/* Agent Nodes (Rendered for all modes, highlighted based on mode) */}
                  {agents.map((agent) => {
                    const style = getAgentNodeStyle(agent);
                    const isSelected = selectedEntityId === agent.id;
                    const isAnchorAgent = agent.id === 'sadar-14';

                    return (
                      <g
                        key={agent.id}
                        transform={`translate(${agent.coords.x}, ${agent.coords.y})`}
                        onClick={() => {
                          setSelectedEntityId(agent.id);
                          onSelectAgent(agent.id);
                        }}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        {/* Outer Pulse */}
                        {isAnchorAgent && (
                          <circle r="6" fill="#f59e0b" fillOpacity="0.2" className="animate-ping" />
                        )}

                        {/* Node Circle */}
                        <circle
                          r={isSelected ? 4.2 : 3.4}
                          fill={style.fill}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? 0.9 : 0.5}
                          filter={agent.shortageRisk >= 75 ? 'url(#red-glow)' : undefined}
                        />

                        {/* Label Badge */}
                        <text
                          x="0"
                          y="1.1"
                          textAnchor="middle"
                          fontSize="2"
                          fill="#ffffff"
                          fontWeight="bold"
                        >
                          {agent.id.replace('sadar-', 'S')}
                        </text>

                        {/* Name Under Pin */}
                        <text
                          x="0"
                          y="6"
                          textAnchor="middle"
                          fontSize="1.8"
                          fill={isSelected ? '#facc15' : '#e2e8f0'}
                          fontWeight="bold"
                        >
                          {isBn ? agent.nameBn.slice(0, 12) : agent.name.slice(0, 12)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Merchant Nodes */}
                  {showMerchants &&
                    merchants.map((merchant) => {
                      const isSelected = selectedEntityId === merchant.id;
                      const isAnchor = merchant.id === 'merch-01';

                      return (
                        <g
                          key={merchant.id}
                          transform={`translate(${merchant.coords.x}, ${merchant.coords.y})`}
                          onClick={() => {
                            setSelectedEntityId(merchant.id);
                            onSelectMerchant(merchant.id);
                          }}
                          className="cursor-pointer transition-transform hover:scale-125"
                        >
                          {isAnchor && activePerspective === 'merchant' && (
                            <circle r="6" fill="#8b5cf6" fillOpacity="0.25" className="animate-ping" />
                          )}

                          <circle
                            r={isSelected ? 3.8 : 3}
                            fill="#8b5cf6"
                            stroke="#ffffff"
                            strokeWidth={isSelected ? 0.8 : 0.4}
                          />

                          <text
                            x="0"
                            y="1"
                            textAnchor="middle"
                            fontSize="1.9"
                            fill="#ffffff"
                            fontWeight="bold"
                          >
                            M
                          </text>

                          {/* Merchant Shop Name */}
                          <text
                            x="0"
                            y="5.5"
                            textAnchor="middle"
                            fontSize="1.7"
                            fill="#c4b5fd"
                            fontWeight="bold"
                          >
                            {isBn ? merchant.nameBn.slice(0, 12) : merchant.name.slice(0, 12)}
                          </text>
                        </g>
                      );
                    })}
                </svg>
              </div>
            </>
          ) : (
            /* Geolocation Grid View */
            <div className="space-y-4 my-auto p-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                {Object.entries(MFS_GEO_ENTITIES).map(([key, loc]) => {
                  const dist = calculateGeoDistanceKm(MFS_GEO_ENTITIES['sadar-14'], loc);
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedEntityId(key)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        selectedEntityId === key
                          ? 'bg-slate-900 border-amber-400 text-white shadow-lg'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-xs">
                          {isBn ? loc.nameBn : loc.name}
                        </span>
                        <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          {dist === 0 ? 'Anchor' : `${dist} km`}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-400 mt-1">
                        GPS: {loc.lat.toFixed(4)}° N, {loc.lng.toFixed(4)}° E
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  {isBn
                    ? 'নির্বাচিত পয়েন্টের জন্য গুগল ম্যাপস ডিরেকশন:'
                    : 'Open external Google Maps walking directions for selected node:'}
                </span>
                <a
                  href={getSelectedEntityDirections()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>
          )}

          {/* Bottom Dynamic Strip across all modes */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-red-500/20 text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400">
                  {activePerspective === 'agent'
                    ? isBn ? 'এজেন্টের সম্ভাব্য ঘাটতি' : 'Agent Shortage'
                    : isBn ? 'মোট ঝুঁকিতে থাকা ক্যাশ' : 'Cash at Risk'}
                </p>
                <p className="font-bold text-red-400 font-mono">
                  {formatTaka(targetAgent.expectedShortage, isBn)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-500/20 text-purple-400">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400">
                  {activePerspective === 'agent'
                    ? isBn ? 'কাছের ডোনার উদ্বৃত্ত' : 'Nearby Surplus'
                    : isBn ? 'ক্লাস্টার উদ্বৃত্ত লিকুইডিটি' : 'Cluster Surplus'}
                </p>
                <p className="font-bold text-purple-300 font-mono">
                  {formatTaka(
                    (partner09?.surplusAmount || 0) + (partner11?.surplusAmount || 0),
                    isBn
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-500/20 text-blue-400">
                <TrendingDown className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400">
                  {activePerspective === 'merchant'
                    ? isBn ? 'ডিজিটাল কিউআর বিক্রয়' : 'Digital QR Sales'
                    : isBn ? 'ক্যাশআউট ডাইভার্সন' : 'Cashout Shift'}
                </p>
                <p className="font-bold text-blue-300 font-mono">
                  {activePerspective === 'merchant'
                    ? formatTaka(anchorMerchant.dailySales, isBn)
                    : '~২২% ডায়ভার্ট'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400">
                  {activePerspective === 'supervisor'
                    ? isBn ? 'ক্লাস্টার অডিট' : 'NOC Audit'
                    : isBn ? 'নেটওয়ার্ক হেলথ' : 'Network Health'}
                </p>
                <p className="font-bold text-emerald-400">
                  {isBn ? 'সক্রিয় ও সুরক্ষিত' : 'Verified Secure'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail / Role-Specific Inspector Sidebar (4 Columns on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          {/* ================================================================= */}
          {/* PERSPECTIVE 1 SIDEBAR: AGENT P2P LIQUIDITY INSPECTOR */}
          {/* ================================================================= */}
          {activePerspective === 'agent' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30 uppercase">
                    {isBn ? 'এজেন্ট রাডার ইনস্পেক্টর' : 'Agent Radar Inspector'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                    {isBn ? targetAgent.nameBn : targetAgent.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {targetAgent.locationName}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-sm">
                  S-14
                </div>
              </div>

              {/* Balances Card */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    {isBn ? 'হাতে নগদ ক্যাশ' : 'Physical Cash'}
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                    {formatTaka(targetAgent.currentCash, isBn)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    {isBn ? 'ডিজিটাল ই-ফ্লোট' : 'Current E-Float'}
                  </span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                    {formatTaka(targetAgent.currentEFloat, isBn)}
                  </span>
                </div>
              </div>

              {/* Forecast Alert */}
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-red-700 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{isBn ? 'ক্যাশ রানঅ্যাওয়ে সতর্কতা (১ ঘণ্টা ৪৫ মিনিট)' : 'Cash Runaway Warning'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {isBn
                    ? `বর্তমান ক্যাশ বার্ন-রেট ৳ ${targetAgent.cashDepletionRate}/ঘণ্টা। আগামী ৪ ঘণ্টায় ৳ ${formatTaka(targetAgent.expectedShortage, true)} ক্যাশ ঘাটতির আশঙ্কা রয়েছে।`
                    : `Burn-rate is ৳ ${targetAgent.cashDepletionRate}/hour. Projected shortage of ৳ ${targetAgent.expectedShortage} within 4 hours.`}
                </p>
              </div>

              {/* Recommended Rebalance Partner */}
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-purple-900 dark:text-purple-300">
                  <span>{isBn ? 'সেরা সোয়াপ পার্টনার (এআই রিকমেন্ডেড)' : 'Best P2P Donor (AI Matched)'}</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900/60 font-mono text-[10px]">
                    Score 92
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {partner09?.nameBn}
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                    +৳ ২০,০০০ উদ্বৃত্ত
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'দূরত্ব: ০.৭ কিমি • হাঁটার সময়: ৬ মিনিট' : 'Distance: 0.7 km • Walk: 6 min'}
                </p>
              </div>

              <button
                onClick={() => onRequestRebalance(targetAgent)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 cursor-pointer active:scale-95 transition"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>{isBn ? 'পিয়ার রি-ব্যালেন্সিং অনুরোধ পাঠান' : 'Request P2P Rebalance'}</span>
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* PERSPECTIVE 2 SIDEBAR: MERCHANT HYPERLOCAL FOOTFALL INSPECTOR */}
          {/* ================================================================= */}
          {activePerspective === 'merchant' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 uppercase">
                    {isBn ? 'মার্চেন্ট ক্যাচমেন্ট ইনস্পেক্টর' : 'Merchant Catchment Inspector'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                    {isBn ? anchorMerchant.nameBn : anchorMerchant.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {anchorMerchant.location}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                  <QrCode className="w-5 h-5" />
                </div>
              </div>

              {/* Retail Stats */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    {isBn ? 'দৈনিক ডিজিটাল বিক্রয়' : 'Digital QR Sales'}
                  </span>
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                    {formatTaka(anchorMerchant.dailySales, isBn)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    {isBn ? 'ডিজিটাল অ্যাডপশন রেট' : 'Digital QR Share'}
                  </span>
                  <span className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">
                    {anchorMerchant.digitalAdoptionRate}%
                  </span>
                </div>
              </div>

              {/* Geofence Footfall Insight */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{isBn ? 'কাস্টমার পদচারণা (ফুটফল: ৪২০ জন/দিন)' : 'Footfall Insight (420/day)'}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {isBn
                    ? '৫০০ মিটার ব্যাসার্ধে প্রতিদিন ৪২০ জন নিয়মিত যাতায়াত করেন। কাছের এজেন্টের লম্বা লাইনে থাকা গ্রাহকদের ক্যাশআউট চার্জ বাঁচিয়ে আপনার দোকানে কিউআরে কেনাকাটা করাতে উৎসাহিত করুন।'
                    : '420 daily pedestrians within 500m radius. Bypass agent queues by offering digital QR discounts directly.'}
                </p>
              </div>

              {/* Active Offer Details */}
              {anchorMerchant.activeOffers?.[0] && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300">
                    <span>{isBn ? 'সক্রিয় কিউআর প্রোমোশন' : 'Live Promotion'}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">সক্রিয়</span>
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {isBn ? anchorMerchant.activeOffers[0].titleBn : anchorMerchant.activeOffers[0].title}
                  </p>
                </div>
              )}

              <button
                onClick={onOpenMicroMerchantModal}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 cursor-pointer active:scale-95 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isBn ? 'নতুন জিও-ফেন্সড অফার চালু করুন' : 'Launch Geofenced Offer'}</span>
              </button>
            </div>
          )}

          {/* ================================================================= */}
          {/* PERSPECTIVE 3 SIDEBAR: SUPERVISOR CLUSTER NOC INSPECTOR */}
          {/* ================================================================= */}
          {activePerspective === 'supervisor' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 uppercase">
                    {isBn ? 'সুপারভাইজার ক্লাস্টার হেড' : 'Supervisor Cluster Head'}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">
                    {isBn ? 'দিনাজপুর সেন্ট্রাল ক্লাস্টার' : 'Dinajpur Central Cluster'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? '৫টি সক্রিয় এজেন্ট • ৪টি কী মার্চেন্ট' : '5 Active Agents • 4 Key Merchants'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Macro Deficit vs Surplus */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    {isBn ? 'ক্লাস্টার ঘাটতি ঝুঁকি' : 'Total Cash at Risk'}
                  </span>
                  <span className="text-base font-black text-red-500 font-mono">
                    {formatTaka(totalCashAtRisk, isBn)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold uppercase">
                    {isBn ? 'মোট উদ্বৃত্ত ক্যাশ' : 'Available Surplus'}
                  </span>
                  <span className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">
                    {formatTaka(totalSurplusAvailable, isBn)}
                  </span>
                </div>
              </div>

              {/* Stress-Test Scenario Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/30 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-300">
                  <span>{isBn ? 'সক্রিয় সিনারিও স্ট্রেস-টেস্ট' : 'Live Stress Test'}</span>
                  <span className="font-mono text-[10px] bg-amber-400/20 px-2 py-0.5 rounded">
                    {activeScenario}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {isBn ? scenarioData.subtitleBn : scenarioData.subtitleEn}
                </p>
              </div>

              {/* Network Anomaly & Compliance Status */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isBn ? 'বাংলাদেশ ব্যাংক এমএফএস গাইডলাইন' : 'BB MFS Compliance'}
                  </span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>১০০% কমপ্লায়েন্ট</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isBn
                    ? 'সকল রি-ব্যালেন্সিং ট্রেইলে ক্রিপ্টোগ্রাফিক হ্যাশ অডিট ও সুপারভাইজার অনুমোদন সংরক্ষিত।'
                    : 'All rebalance trails are cryptographically audited with supervisor PIN.'}
                </p>
              </div>

              <button
                onClick={() => onRequestRebalance(targetAgent)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isBn ? 'ক্লাস্টার রি-ব্যালেন্সিং অনুমোদন' : 'Authorize Network Dispatch'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
