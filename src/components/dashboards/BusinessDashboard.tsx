import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Bot,
  Menu,
  TrendingUp,
  Scale,
  ArrowLeftRight,
  Sun,
  Moon,
  Wallet,
  HeartPulse,
  Cpu,
  Presentation,
  CheckCircle2,
  Activity,
  Zap,
  QrCode,
  Receipt,
  PlusCircle,
  ShoppingBag,
  ArrowDownLeft,
  Search,
  Copy,
  Check,
  X,
  Store,
  Building2,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import { WalletTransaction } from '../../types/wallet';
import { TransactionReceiptModal } from '../wallet/TransactionReceiptModal';
import { TransactionHistory } from '../wallet/TransactionHistory';
import {
  Agent,
  Merchant,
  Language,
  ScenarioType,
  RebalanceProposal,
  AuditLogEntry,
  FraudAnomaly,
  Offer,
} from '../../types';
import { SCENARIO_PRESETS } from '../../data/mockData';
import { PressureMap } from '../PressureMap';
import { AgentLiquidityRadar } from '../AgentLiquidityRadar';
import { MerchantBooster } from '../MerchantBooster';
import { ResponsibleAIPanel } from '../ResponsibleAIPanel';
import { formatTaka, calculatePartnerScore } from '../../utils/algorithms';
import { FintechChatWidget } from '../chat/FintechChatWidget';
import { SidebarNav } from '../layout/SidebarNav';
import { SettingsPage } from '../settings/SettingsPage';
import { BusinessImpactDashboard } from './BusinessImpactDashboard';

interface BusinessDashboardProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  agents: Agent[];
  merchants: Merchant[];
  auditLogs: AuditLogEntry[];
  anomalies: FraudAnomaly[];
  approvedRebalances: RebalanceProposal[];
  activeScenario: ScenarioType;
  onScenarioChange: (scenario: ScenarioType) => void;
  onOpenPitchAssistant: () => void;
  onOpenProfile: () => void;
  onOpenTechModal?: () => void;
  onRequestRebalance: (targetAgent: Agent) => void;
  onOpenMicroMerchantModal: () => void;
  onAddOfferToMerchant: (merchantId: string, offer: Offer) => void;
  onResolveAnomaly: (id: string, action: 'cleared' | 'restricted') => void;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  language,
  setLanguage,
  agents,
  merchants,
  auditLogs,
  anomalies,
  approvedRebalances,
  activeScenario,
  onScenarioChange,
  onOpenPitchAssistant,
  onOpenProfile,
  onOpenTechModal,
  onRequestRebalance,
  onOpenMicroMerchantModal,
  onAddOfferToMerchant,
  onResolveAnomaly,
}) => {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isBn = language === 'bn';

  // Financial Wallet States from Context
  const {
    merchantBalance,
    agentCashBalance,
    agentEFloatBalance,
    transactions,
    getBusinessStats,
  } = useWallet();

  const isMerchant = user?.role === 'merchant';
  const businessStats = getBusinessStats(user?.associatedEntityId);

  // Modal and transaction states
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<WalletTransaction | null>(null);
  const [showReceiveQrModal, setShowReceiveQrModal] = useState<boolean>(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Selected agent for radar
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    user?.associatedEntityId || 'sadar-14'
  );
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const scenarioData = SCENARIO_PRESETS[activeScenario];
  const totalCashAtRisk = agents.reduce((acc, a) => acc + (a.expectedShortage || 0), 0);
  const totalSurplusAvailable = agents.reduce((acc, a) => acc + (a.surplusAmount || 0), 0);

  // Partner ranking calculation
  const rankedDonors = agents
    .filter((a) => a.id !== currentAgent.id && a.status === 'surplus')
    .map((partner) => {
      const partnerResult = calculatePartnerScore(
        partner.surplusAmount,
        25000,
        partner.distanceFromTargetKm || 1.0,
        partner.reliabilityScore,
        true
      );
      return { partner, score: partnerResult.totalScore };
    })
    .sort((a, b) => b.score - a.score);

  // Action handler from chatbot
  const handleBusinessAction = (actionId: string) => {
    if (actionId === 'view_liquidity' || actionId === 'view_radar' || actionId === 'liquidity_query') {
      setActiveTab('analytics');
    } else if (actionId === 'view_rebalance' || actionId === 'rebalance_query' || actionId === 'rebalance_partners') {
      onRequestRebalance(currentAgent);
    } else if (
      actionId === 'view_campaigns' ||
      actionId === 'open_campaign_builder' ||
      actionId === 'merchant_growth_query' ||
      actionId === 'view_demand_patterns'
    ) {
      setActiveTab('offers');
    } else if (actionId === 'view_responsible_ai') {
      setActiveTab('reports');
    } else if (actionId === 'view_pressure_map') {
      setActiveTab('maps');
    } else if (actionId === 'view_transactions') {
      setActiveTab('transactions');
    } else if (actionId === 'open_settings') {
      setActiveTab('settings');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex selection:bg-amber-400 selection:text-slate-950 font-sans transition-colors">
      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <SidebarNav
        role="business"
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          if (tabId === 'rebalance') {
            onRequestRebalance(currentAgent);
          } else {
            setActiveTab(tabId);
          }
        }}
        language={language}
        setLanguage={setLanguage}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        onLogout={logout}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3 shrink-0 transition-colors">
          <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
            {/* Left: Mobile Drawer Button & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 lg:hidden hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-base">
                  UpayPulse <span className="text-amber-500 font-black">AI</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 uppercase tracking-wider hidden sm:inline">
                  {user?.role?.toUpperCase()} Business Suite
                </span>
              </div>
            </div>

            {/* Right: Live Scenario Selector, AI Assistant, Pitch, Tech Console, Language, Profile */}
            <div className="flex items-center gap-2">
              {/* Scenario Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <label htmlFor="biz-scenario-select" className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
                  {isBn ? 'সিনারিও:' : 'Scenario:'}
                </label>
                <select
                  id="biz-scenario-select"
                  value={activeScenario}
                  onChange={(e) => onScenarioChange(e.target.value as ScenarioType)}
                  aria-label={isBn ? 'সিনারিও নির্বাচন করুন' : 'Select scenario'}
                  className="bg-transparent text-xs font-bold text-amber-700 dark:text-amber-300 focus:outline-none cursor-pointer pr-1"
                >
                  {Object.entries(SCENARIO_PRESETS).map(([key, data]) => (
                    <option key={key} value={key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                      {isBn ? data.titleBn : data.titleEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Assistant Button */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition shadow-sm cursor-pointer"
                title={isBn ? 'এআই বিজনেস অ্যাসিস্ট্যান্ট' : 'AI Business Assistant'}
              >
                <Bot className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">{isBn ? 'বিজনেস এআই' : 'AI Assistant'}</span>
              </button>



              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
                title={isBn ? 'থিম পরিবর্তন' : 'Toggle Theme'}
              >
                {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Language Switch */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    isBn ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    !isBn ? 'bg-amber-400 text-slate-950 font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* User Profile Avatar */}
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-1 sm:px-2.5 transition text-xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                  {user?.name ? user.name[0] : 'B'}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 hidden md:block">
                  {isBn ? user?.nameBn : user?.name}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Business Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-7xl w-full mx-auto">
          {/* Top Cluster Health Overview Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30 shrink-0">
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {isBn ? scenarioData.titleBn : scenarioData.titleEn}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                    {isBn ? 'সক্রিয় সিনারিও' : 'Live Scenario'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn ? scenarioData.subtitleBn : scenarioData.subtitleEn}
                </p>
              </div>
            </div>

            {/* Deficit vs Surplus Stat Tiles */}
            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  {isBn ? 'ঝুঁকিতে থাকা ক্যাশ' : 'Cash at Risk'}
                </span>
                <span className="text-sm sm:text-base font-black text-red-500 dark:text-red-400 font-mono">
                  {formatTaka(totalCashAtRisk, isBn)}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">
                  {isBn ? 'মোট উদ্বৃত্ত লিকুইডিটি' : 'Surplus Liquidity'}
                </span>
                <span className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-300 font-mono">
                  {formatTaka(totalSurplusAvailable, isBn)}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* TAB 1: BUSINESS DASHBOARD (Overview Cards, Liquidity Status & NOC) */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Agent / Merchant Dynamic Overview Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isMerchant ? (
                  <>
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'ব্যবসায়িক ওয়ালেট ব্যালেন্স:' : 'Business Wallet Balance:'}</span>
                        <Wallet className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatTaka(merchantBalance, isBn)}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'ভেরিফাইড মার্চেন্ট ওয়ালেট' : 'Verified Merchant Account'}</span>
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'আজকের বিক্রয় ভলিউম:' : "Today's Sales Volume:"}</span>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatTaka(businessStats.todaySales, isBn)}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {isBn ? 'রিয়েল-টাইম কিউআর কালেকশন' : 'Real-time QR Collection'}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'মোট সফল লেনদেন:' : 'Completed Sales:'}</span>
                        <ShoppingBag className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {businessStats.successfulTxCount} {isBn ? 'টি বিক্রয়' : 'Sales'}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        {isBn ? 'ডিজিটাল কিউআর পেমেন্ট' : 'Digital QR Payments'}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'ডিজিটাল অ্যাডপশন রেট:' : 'Digital Adoption Index:'}</span>
                        <HeartPulse className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                        94% Optimal
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'নগদ ক্যাশ ব্যালেন্স:' : 'Current Cash Balance:'}</span>
                        <Wallet className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatTaka(agentCashBalance, isBn)}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'পর্যাপ্ত ক্যাশ লিকুইডিটি' : 'Sufficient Cash Liquidity'}</span>
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'ডিজিটাল ই-ফ্লোট:' : 'Digital e-Float:'}</span>
                        <Zap className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatTaka(agentEFloatBalance, isBn)}
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {isBn ? 'ক্যাশ-ইনের জন্য প্রস্তুত' : 'Ready for Cash-In'}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'আজকের মোট ভলিউম:' : "Today's Volume:"}</span>
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatTaka(businessStats.totalVolume, isBn)}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        {businessStats.successfulTxCount} {isBn ? 'টি সফল লেনদেন' : 'Successful Transactions'}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">{isBn ? 'লিকুইডিটি স্বাস্থ্য সূচক:' : 'Liquidity Risk Analysis:'}</span>
                        <HeartPulse className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                        92% Optimal
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick Actions & Rebalance Trigger */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? 'ব্যবসায়িক সেবা ও লিকুইডিটি ম্যানেজমেন্ট' : 'Business Financial & Liquidity Suite'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'কিউআর পেমেন্ট গ্রহণ, রিয়েল-টাইম ক্যাশ রিব্যালেন্সিং ও ব্যবসায়িক খতিয়ান' : 'Receive instant QR payments, authorize cluster transfers, and track sales ledger'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReceiveQrModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{isBn ? 'মার্চেন্ট কিউআর কোড' : 'Show Merchant QR'}</span>
                  </button>
                  <button
                    onClick={() => onRequestRebalance(currentAgent)}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer active:scale-[0.98] transition"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>{isBn ? 'রিব্যালেন্সিং অনুমোদন করুন' : 'Authorize Cash Rebalance'}</span>
                  </button>
                </div>
              </div>

              {/* Area Map Overview */}
              <PressureMap
                language={language}
                agents={agents}
                merchants={merchants}
                activeScenario={activeScenario}
                setActiveScenario={onScenarioChange}
                userRole={user?.role}
                onOpenMicroMerchantModal={onOpenMicroMerchantModal}
                onSelectAgent={(id) => {
                  setSelectedAgentId(id);
                  setActiveTab('analytics');
                }}
                onSelectMerchant={() => {
                  setActiveTab('offers');
                }}
                onRequestRebalance={onRequestRebalance}
                approvedRebalances={approvedRebalances}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: TRANSACTIONS & REBALANCING LOG */}
          {/* ================================================================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fade-in">
              <TransactionHistory
                language={language}
                role={isMerchant ? 'merchant' : 'agent'}
                entityId={user?.associatedEntityId}
                onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
                title={
                  isBn
                    ? isMerchant
                      ? 'মার্চেন্ট পেমেন্ট ও বিক্রয় লেজার'
                      : 'এজেন্ট ক্যাশ-ফ্লো ও লেনদেন লেজার'
                    : isMerchant
                    ? 'Merchant Payments & Sales Ledger'
                    : 'Agent Cash-Flow & Transaction Ledger'
                }
                subtitle={
                  isBn
                    ? 'আয় (জমা), ব্যয় (খরচ) ও স্ট্যাটাস ভিত্তিক ফিল্টার সহ সকল ডিজিটাল লেনদেন'
                    : 'All digital transactions with income/expense and status filtering'
                }
                actions={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowReceiveQrModal(true)}
                      className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-[0.98]"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{isBn ? 'মার্চেন্ট কিউআর' : 'Merchant QR'}</span>
                    </button>
                    <button
                      onClick={() => onRequestRebalance(currentAgent)}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.98] transition"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>{isBn ? 'নতুন রিব্যালেন্স' : 'New Rebalance'}</span>
                    </button>
                  </div>
                }
              />

              {/* Cluster Liquidity Rebalances Ledger */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-500" />
                      <span>{isBn ? 'ক্লাস্টার লিকুইডিটি রিব্যালেন্সিং ও তহবিল স্থানান্তর লেজার' : 'Cluster Liquidity Rebalance Transfers'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isBn ? 'নিকটবর্তী উদ্বৃত্ত এজেন্টদের সাথে ডিজিটাল ই-ফ্লোট ও নগদ তহবিলের অডিট লগ' : 'Audit records of digital e-float and physical cash rebalancing with cluster agents'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {approvedRebalances.length} {isBn ? 'অনুমোদিত' : 'Approved'}
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {approvedRebalances.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {isBn ? 'এখনো কোনো রিব্যালেন্স রেকর্ড সম্পন্ন হয়নি।' : 'No cross-agent rebalancing records logged yet.'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isBn ? 'লিকুইডিটি রাডার বা রিব্যালেন্স বাটনে ক্লিক করে প্রস্তাব অনুমোদন করুন।' : 'Authorize a proposal from the Liquidity Radar or Rebalance action.'}
                      </p>
                    </div>
                  ) : (
                    approvedRebalances.map((prop, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {prop.partnerAgentName} ➔ {prop.targetAgentName}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Hash: {prop.auditHash} • {prop.distanceKm} km away • Score: {prop.partnerScore}/100
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            +{formatTaka(prop.suggestedAmount, isBn)}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {isBn ? 'অনুমোদিত ও সংরক্ষিত' : 'Settled'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: DEDICATED BUSINESS AI ASSISTANT */}
          {/* ================================================================= */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-4 animate-fade-in">
              <FintechChatWidget
                role="business"
                user={user}
                language={language}
                setLanguage={setLanguage}
                isFloating={false}
                isOpen={true}
                onTriggerAppAction={handleBusinessAction}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: OFFERS & MERCHANT GROWTH BOOSTER */}
          {/* ================================================================= */}
          {activeTab === 'offers' && (
            <div className="animate-fade-in">
              <MerchantBooster
                language={language}
                merchants={merchants}
                onOpenMicroMerchantModal={onOpenMicroMerchantModal}
                onAddOfferToMerchant={onAddOfferToMerchant}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: ANALYTICS & PARTNERSCORE ENGINE */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <AgentLiquidityRadar
                language={language}
                agents={agents}
                selectedAgentId={selectedAgentId}
                onSelectAgentId={setSelectedAgentId}
                onRequestRebalance={onRequestRebalance}
              />
              {/* PartnerScore Engine Ranking */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-500" />
                      <span>{isBn ? 'পার্টনারস্কোর লিকুইডিটি রিব্যালেন্সিং ইঞ্জিন' : 'PartnerScore Liquidity Rebalancing Engine'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isBn ? 'সূত্র: ০.৪৫ উদ্বৃত্ত + ০.৩০ দূরত্ব + ০.১৫ নির্ভরযোগ্যতা + ০.১০ সময়' : 'Formula: 0.45 Surplus + 0.30 Distance + 0.15 Reliability + 0.10 Operating Hours'}
                    </p>
                  </div>
                  <button
                    onClick={() => onRequestRebalance(currentAgent)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{isBn ? 'রিব্যালেন্স অনুমোদন' : 'Approve Rebalance'}</span>
                  </button>
                </div>

                {/* Ranked Donor Table */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {rankedDonors.map(({ partner, score }) => (
                    <div key={partner.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{isBn ? partner.nameBn : partner.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono">
                            Score: {score}/100
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {isBn ? partner.locationNameBn : partner.locationName} • {partner.distanceFromTargetKm} কিমি দূরে • {partner.operatingHours}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-bold">{isBn ? 'উদ্বৃত্ত ক্যাশ' : 'Surplus Cash'}</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                            {formatTaka(partner.surplusAmount, isBn)}
                          </span>
                        </div>
                        <button
                          onClick={() => onRequestRebalance(currentAgent)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold cursor-pointer"
                        >
                          {isBn ? 'তহবিলের অনুরোধ' : 'Request Funds'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: MAPS & AREA NOC GEOLOCATION */}
          {/* ================================================================= */}
          {activeTab === 'maps' && (
            <div className="animate-fade-in">
              <PressureMap
                language={language}
                agents={agents}
                merchants={merchants}
                activeScenario={activeScenario}
                setActiveScenario={onScenarioChange}
                userRole={user?.role}
                onOpenMicroMerchantModal={onOpenMicroMerchantModal}
                onSelectAgent={(id) => {
                  setSelectedAgentId(id);
                  setActiveTab('analytics');
                }}
                onSelectMerchant={() => {
                  setActiveTab('offers');
                }}
                onRequestRebalance={onRequestRebalance}
                approvedRebalances={approvedRebalances}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 7: REPORTS & RESPONSIBLE AI AUDIT GUARDIAN */}
          {/* ================================================================= */}
          {activeTab === 'reports' && (
            <div className="animate-fade-in">
              <ResponsibleAIPanel
                language={language}
                auditLogs={auditLogs}
                anomalies={anomalies}
                onResolveAnomaly={onResolveAnomaly}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 8: BUSINESS KPI */}
          {/* ================================================================= */}
          {activeTab === 'business_kpi' && (
            <div className="animate-fade-in">
              <BusinessImpactDashboard />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 9: SETTINGS */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <SettingsPage
                language={language}
                setLanguage={setLanguage}
                role="business"
              />
            </div>
          )}
        </main>
      </div>

      {/* Floating Business AI Assistant */}
      {activeTab !== 'ai_assistant' && (
        <FintechChatWidget
          role="business"
          user={user}
          language={language}
          setLanguage={setLanguage}
          isFloating={true}
          isOpen={isChatOpen}
          onToggleOpen={() => setIsChatOpen(!isChatOpen)}
          onTriggerAppAction={handleBusinessAction}
        />
      )}

      {/* Transaction Receipt Modal */}
      {selectedReceiptTx && (
        <TransactionReceiptModal
          isOpen={!!selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
          transaction={selectedReceiptTx}
          language={language}
        />
      )}

      {/* Merchant QR Code Presenter Modal */}
      {showReceiveQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setShowReceiveQrModal(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-400/30">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                {isBn ? user?.businessNameBn || 'রহমান ফার্মেসি' : user?.businessName || 'Rahman Pharmacy'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'উপায় মার্চেন্ট কিউআর কোড (Instant Clearing)' : 'Upay Merchant Payment QR'}
              </p>
              <span className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 inline-block mt-1">
                ID: {user?.associatedEntityId || 'merch-01'}
              </span>
            </div>

            {/* QR Visual */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 dark:border-amber-400 shadow-md inline-block mx-auto relative">
              <div className="w-48 h-48 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-3 space-y-2 relative overflow-hidden">
                <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90 p-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                          ? 'bg-amber-400'
                          : i % 5 === 0
                          ? 'bg-white'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-slate-950 shadow-md">
                    upay
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn
                ? 'যেকোনো উপায় গ্রাহক এই কিউআর স্ক্যান করে দ্রুত ক্যাশলেস পেমেন্ট সম্পন্ন করতে পারবেন।'
                : 'Any Upay customer can scan this QR code to complete instant zero-fee merchant payments.'}
            </p>

            <button
              onClick={() => {
                setShowReceiveQrModal(false);
              }}
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              {isBn ? 'কিউআর বন্ধ করুন' : 'Close QR Display'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
