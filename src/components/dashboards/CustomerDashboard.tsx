import React, { useState } from 'react';
import {
  MapPin,
  QrCode,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  Navigation,
  Tag,
  X,
  History,
  Send,
  ArrowDownToLine,
  ArrowDownLeft,
  PlusCircle,
  Receipt,
  Bot,
  Eye,
  EyeOff,
  Menu,
  TrendingDown,
  Search,
  Cpu,
  Presentation,
  ArrowLeftRight,
  Zap,
  Sun,
  Moon,
  Download,
  FileText,
  BarChart3,
  Smartphone,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Merchant, Agent, Language } from '../../types';
import { formatTaka } from '../../utils/algorithms';
import { FintechChatWidget } from '../chat/FintechChatWidget';
import { SidebarNav } from '../layout/SidebarNav';
import { SettingsPage } from '../settings/SettingsPage';
import { useWallet } from '../../context/WalletContext';
import { useSmartBill } from '../../context/SmartBillContext';
import { SmartBillPaymentView } from '../smartbill/SmartBillPaymentView';
import { WalletTransaction, TransactionType } from '../../types/wallet';
import { TransactionModal } from '../wallet/TransactionModal';
import { TransactionReceiptModal } from '../wallet/TransactionReceiptModal';
import { TransactionHistory } from '../wallet/TransactionHistory';
import { ZeroCashRoutePlanner } from '../customer/ZeroCashRoutePlanner';
import { ResponsibleAICenter } from '../responsible-ai/ResponsibleAICenter';

interface CustomerDashboardProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  merchants: Merchant[];
  agents?: Agent[];
  onOpenPitchAssistant: () => void;
  onOpenProfile: () => void;
  onOpenTechModal?: () => void;
  onRecordCashoutDiverted: (amount: number, merchantName: string, savings: number) => void;
}

interface Transaction {
  id: string;
  type: 'merchant_pay' | 'cash_out' | 'send_money' | 'recharge' | 'add_money' | 'bill_pay';
  titleBn: string;
  titleEn: string;
  recipient: string;
  amount: number;
  fee: number;
  discountSaved: number;
  timestamp: string;
  status: 'completed' | 'pending';
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  language,
  setLanguage,
  merchants,
  agents = [],
  onOpenPitchAssistant,
  onOpenProfile,
  onOpenTechModal,
  onRecordCashoutDiverted,
}) => {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isBn = language === 'bn';

  // Navigation & Layout State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Financial Wallet States from Context
  const { customerBalance, transactions, getCustomerStats } = useWallet();
  const { openPaymentFlow, bills, dueSoonBills, totalUpcomingAmount } = useSmartBill();
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState<boolean>(false);
  const [showCashoutDivertModal, setShowCashoutDivertModal] = useState<boolean>(false);
  
  // Wallet modal states
  const [activeModalService, setActiveModalService] = useState<TransactionType | null>(null);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<WalletTransaction | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Pay target for Zero-Cash route direct QR execution
  const [payTargetMerchantId, setPayTargetMerchantId] = useState<string>('');
  const [payTargetAmount, setPayTargetAmount] = useState<number>(500);

  const [reportToast, setReportToast] = useState<string | null>(null);

  const triggerReportDownload = (msg: string) => {
    setReportToast(msg);
    setTimeout(() => setReportToast(null), 3000);
  };

  const walletBal = customerBalance;
  const stats = getCustomerStats();

  // App Action trigger from Chatbot Action Chips
  const handleAppAction = (actionId: string, payload?: any) => {
    if (actionId === 'check_balance') {
      setActiveTab('dashboard');
      setIsBalanceVisible(true);
    } else if (actionId === 'view_offers') {
      setActiveTab('offers');
    } else if (actionId === 'open_zero_cash_route' || actionId === 'plan_route' || actionId === 'view_route') {
      setActiveTab('maps');
    } else if (actionId === 'send_money') {
      setActiveModalService('send_money');
    } else if (actionId === 'cash_out') {
      setActiveModalService('cash_out');
    } else if (actionId === 'merchant_pay') {
      setActiveModalService('merchant_pay');
    } else if (actionId === 'recharge') {
      setActiveModalService('recharge');
    } else if (actionId === 'add_money') {
      setActiveModalService('add_money');
    } else if (actionId === 'pay_bill' || actionId === 'bill_pay') {
      setActiveTab('smart_bills');
    } else if (
      actionId === 'smart_bills' ||
      actionId === 'view_smart_bills' ||
      actionId === 'open_smart_bills' ||
      actionId === 'smart_bill_payment'
    ) {
      setActiveTab('smart_bills');
    } else if (actionId === 'pay_internet_bill') {
      setActiveTab('smart_bills');
      const b = bills.find((item) => item.category === 'internet');
      if (b) openPaymentFlow(b);
    } else if (actionId === 'pay_electricity_bill') {
      setActiveTab('smart_bills');
      const b = bills.find((item) => item.category === 'electricity');
      if (b) openPaymentFlow(b);
    } else if (actionId === 'pay_mobile_bill') {
      setActiveTab('smart_bills');
      const b = bills.find((item) => item.category === 'mobile_recharge');
      if (b) openPaymentFlow(b);
    } else if (actionId === 'view_transactions') {
      setActiveTab('transactions');
    } else if (actionId === 'open_privacy' || actionId === 'open_settings' || actionId === 'view_security') {
      setActiveTab('settings');
    } else if (actionId === 'view_analytics' || actionId === 'spending_query') {
      setActiveTab('analytics');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex selection:bg-amber-400 selection:text-slate-950 font-sans transition-colors">
      {/* Floating Download Toast */}
      {reportToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{reportToast}</span>
        </div>
      )}

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <SidebarNav
        role="customer"
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        language={language}
        setLanguage={setLanguage}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
        onLogout={logout}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Sticky App Header */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 max-w-6xl mx-auto w-full">
            {/* Left: Mobile Sidebar Trigger & Location */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-800 dark:text-amber-300 border border-amber-400/20">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dinajpur Sadar (Goneshtola Mor)</span>
                </span>
              </div>
            </div>

            {/* Right: Theme, Language, Profile */}
            <div className="flex items-center gap-2">

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

              {/* Profile Avatar Shortcut */}
              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl p-1 sm:px-2.5 transition text-xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                  {user?.name ? user.name[0] : 'T'}
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 hidden md:block">
                  {isBn ? user?.nameBn?.split(' ')[0] : user?.name?.split(' ')[0]}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Global Toast Action Feedback */}
        {actionSuccess && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Dynamic Main Body Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 space-y-6 max-w-6xl w-full mx-auto">
          {/* ================================================================= */}
          {/* 1. DASHBOARD / HOME (Bright & Clean Fintech Dashboard) */}
          {/* ================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Greeting & AI Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {isBn ? `শুভ সকাল, ${user?.nameBn || 'তানভীর'}!` : `Good Morning, ${user?.name || 'Tanvir'}!`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                      Tier 2 KYC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'আপনার উপায়পালস এআই পরামর্শক সক্রিয়। আজ ক্যাশ-আউট ফি এড়িয়ে সরাসরি মার্চেন্ট কিউআরে পেমেন্ট করুন।'
                      : 'Your AI financial advisor is active. Skip cash-out fees today with smart merchant QR payments.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('ai_assistant')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-sm transition cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    <span>{isBn ? 'এআই পরামর্শক খুলুন' : 'Open AI Advisor'}</span>
                  </button>
                </div>
              </div>

              {/* HERO CARD: Radiant Upay Balance Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-6 sm:p-7 text-slate-950 shadow-md shadow-amber-400/10 border border-amber-300 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-white/40 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute right-4 top-4 opacity-15">
                    <QrCode className="w-24 h-24 text-slate-950" />
                  </div>

                  {/* Card Top: Chip & Label */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-7 rounded-lg bg-slate-950/15 border border-slate-950/20 flex items-center justify-center">
                        <div className="w-6 h-4 border border-slate-950/30 rounded flex items-center justify-center">
                          <Zap className="w-3 h-3 text-slate-950" />
                        </div>
                      </div>
                      <span className="text-xs font-black tracking-wider uppercase text-slate-950/80">
                        UpayPulse MFS Wallet
                      </span>
                    </div>
                    <button
                      onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-slate-950/10 hover:bg-slate-950/20 rounded-full text-xs font-bold transition text-slate-950 cursor-pointer"
                    >
                      {isBalanceVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isBalanceVisible ? (isBn ? 'গোপন' : 'Hide') : (isBn ? 'ব্যালেন্স দেখুন' : 'Show Balance')}</span>
                    </button>
                  </div>

                  {/* Card Middle: Available Balance */}
                  <div className="my-4">
                    <span className="text-xs font-bold text-slate-950/70 block uppercase tracking-wider">
                      {isBn ? 'উপলব্ধ ওয়ালেট ব্যালেন্স:' : 'Available Wallet Balance:'}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-950 mt-1">
                      {isBalanceVisible ? formatTaka(walletBal, isBn) : '••••••••'}
                    </div>
                  </div>

                  {/* Card Bottom: Phone & Status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-950/15 text-xs font-semibold">
                    <span className="font-mono text-slate-950/90 font-bold">{user?.phone}</span>
                    <span className="text-[11px] font-bold bg-slate-950 text-amber-300 px-3 py-0.5 rounded-full shadow-xs">
                      {isBn ? 'জিরো-ক্যাশ রুট সক্রিয়' : 'Zero-Cash Route Active'}
                    </span>
                  </div>
                </div>

                {/* 3 Value Metric Cards */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                        {isBn ? 'ক্যাশ-আউট ফি সাশ্রয়:' : 'Cash-out Fee Saved:'}
                      </span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                        ৳ ২৩২
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                        {isBn ? 'চলতি মাসের মোট ব্যয়:' : 'Total Monthly Spend:'}
                      </span>
                      <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                        {formatTaka(stats.totalSpentThisMonth, isBn)}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <ArrowLeftRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">
                        {isBn ? 'মোট লেনদেনের সংখ্যা:' : 'Total Transactions:'}
                      </span>
                      <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5 block">
                        {stats.totalTransactions} {isBn ? 'টি লেনদেন' : 'Activities'}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <History className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK ACTION BUTTONS GRID */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {isBn ? 'তাৎক্ষণিক আর্থিক সেবা (Instant Financial Services):' : 'Instant Financial Services:'}
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { id: 'send_money', labelBn: 'সেন্ড মানি', labelEn: 'Send Money', icon: <Send className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30' },
                    { id: 'cash_out', labelBn: 'ক্যাশ আউট', labelEn: 'Cash Out', icon: <ArrowDownToLine className="w-5 h-5" />, color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30' },
                    { id: 'merchant_pay', labelBn: 'মার্চেন্ট কিউআর পে', labelEn: 'Merchant Pay', icon: <QrCode className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-300 dark:border-amber-400/30' },
                    { id: 'recharge', labelBn: 'মোবাইল রিচার্জ', labelEn: 'Mobile Recharge', icon: <Smartphone className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' },
                    { id: 'smart_bills', labelBn: 'স্মার্ট বিল পে (AI)', labelEn: 'Smart Bill Pay', icon: <CalendarClock className="w-5 h-5" />, color: 'bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/40' },
                    { id: 'add_money', labelBn: 'অ্যাড মানি', labelEn: 'Add Money', icon: <PlusCircle className="w-5 h-5" />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30' },
                  ].map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        if (act.id === 'smart_bills') {
                          setActiveTab('smart_bills');
                        } else {
                          setActiveModalService(act.id as any);
                        }
                      }}
                      className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50/50 dark:hover:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center transition group active:scale-95 shadow-xs cursor-pointer"
                    >
                      <div className={`p-2.5 rounded-xl transition group-hover:scale-105 ${act.color}`}>
                        {act.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                        {isBn ? act.labelBn : act.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI SMART BILL ASSISTANT TEASER CARD ON DASHBOARD */}
              <div className="p-5 rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-400/15 to-transparent border border-amber-300/80 dark:border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-xs">
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {isBn ? 'স্মার্ট বিল পেমেন্ট অ্যাসিস্ট্যান্ট (AI)' : 'Smart Bill Payment Assistant (AI)'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-900 dark:text-amber-200">
                        {dueSoonBills.length} {isBn ? 'টি বিল বাকি' : 'Dues'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {isBn
                        ? `আসন্ন বিল: ${formatTaka(totalUpcomingAmount, true)} • প্রোঅ্যাক্টিভ এআই রিমাইন্ডার ও ক্যালেন্ডার ট্র্যাক করুন`
                        : `Upcoming bills: ${formatTaka(totalUpcomingAmount, false)} • Proactive calendar & reminders`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('smart_bills')}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer self-end sm:self-center shrink-0 active:scale-[0.98]"
                >
                  <span>{isBn ? 'বিল অ্যাসিস্ট্যান্ট খুলুন' : 'Open Bill Assistant'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AI RECOMMENDATION BANNER */}
              <div className="p-5 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-amber-200 dark:border-amber-400/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{isBn ? 'এআই সেভিংস ইনসাইট: ক্যাশ-আউট ফি সম্পূর্ণ এড়িয়ে চলুন' : 'AI Savings Insight: Eliminate Withdrawal Fees'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono">
                        Save 1.4%
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                      {isBn
                        ? 'দিনাজপুর সদরে নিবন্ধিত গ্রোসারি ও ফার্মেসিতে সরাসরি উপায় কিউআরে পেমেন্ট করে ক্যাশ-আউট ফি সাশ্রয় করুন।'
                        : 'Avoid 1.4% cash-out charges by making direct Upay QR payments at verified local partners.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('maps')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shrink-0 transition shadow-xs cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{isBn ? 'জিরো-ক্যাশ রুট এক্সপ্লোর করুন' : 'Explore Zero-Cash Route'}</span>
                </button>
              </div>

              {/* RECENT TRANSACTIONS PREVIEW */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'সাম্প্রতিক লেনদেনসমূহ' : 'Recent Transactions'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                  >
                    {isBn ? 'সবগুলো দেখুন' : 'View All'}
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedReceiptTx(tx)}
                      className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-amber-500 shrink-0">
                          {tx.type === 'merchant_pay' ? <ShoppingBag className="w-4 h-4" /> :
                           tx.type === 'send_money' ? <Send className="w-4 h-4" /> :
                           tx.type === 'add_money' ? <PlusCircle className="w-4 h-4 text-emerald-500" /> :
                           tx.type === 'bill_pay' ? <Zap className="w-4 h-4" /> :
                           <Smartphone className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {isBn ? tx.titleBn : tx.titleEn}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                            {tx.receiverName} • {tx.date}, {tx.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-mono font-bold text-xs block ${
                          tx.category === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {tx.category === 'income' ? '+' : '-'}{formatTaka(tx.amount, isBn)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Trx: {tx.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* SMART BILL PAYMENT ASSISTANT TAB */}
          {/* ================================================================= */}
          {activeTab === 'smart_bills' && (
            <div className="space-y-6 animate-fade-in">
              <SmartBillPaymentView
                language={language}
                onOpenAddMoneyModal={() => setActiveModalService('add_money')}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* 2. TRANSACTIONS TAB */}
          {/* ================================================================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fade-in">
              <TransactionHistory
                language={language}
                role="customer"
                onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
                actions={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalService('send_money')}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition active:scale-[0.98]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isBn ? 'টাকা পাঠান' : 'Send Money'}</span>
                    </button>
                    <button
                      onClick={() => setActiveModalService('add_money')}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isBn ? 'টাকা যোগ' : 'Add Money'}</span>
                    </button>
                  </div>
                }
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. AI ASSISTANT TAB */}
          {/* ================================================================= */}
          {activeTab === 'ai_assistant' && (
            <div className="space-y-4 animate-fade-in">
              <FintechChatWidget
                role="customer"
                user={user}
                language={language}
                setLanguage={setLanguage}
                isFloating={false}
                isOpen={true}
                onTriggerAppAction={handleAppAction}
                walletBalance={walletBal}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* 4. OFFERS TAB */}
          {/* ================================================================= */}
          {activeTab === 'offers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-500" />
                      <span>{isBn ? 'নিকটবর্তী হাইপারলোকাল স্মার্ট অফারসমূহ' : 'Hyperlocal Smart Offers Near You'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isBn ? 'ক্যাশ-আউট ফি বাঁচিয়ে সরাসরি দোকানে কিউআর দিয়ে কিনুন ও বিশেষ ছাড় পান' : 'Save cash-out fees and get instant flat discounts at verified local merchants'}
                    </p>
                  </div>
                </div>

                {/* Grid of Offers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {merchants.flatMap((m) => m.activeOffers.map((offer) => ({ ...offer, merchant: m }))).map((offer) => (
                    <div
                      key={offer.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3 hover:border-amber-400 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {offer.merchant.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                          {offer.discountType === 'flat' ? `৳ ${offer.discountValue} Off` : `${offer.discountValue}% Cashback`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {isBn ? offer.titleBn : offer.title}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                        <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          <span>{((offer.merchant.coords.x % 5 + 1) * 0.2).toFixed(1)} km away</span>
                        </span>
                        <button
                          onClick={() => {
                            setActiveModalService('merchant_pay');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm cursor-pointer"
                        >
                          {isBn ? 'কিউআর পে' : 'Pay QR'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 5. ANALYTICS TAB */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'মাসিক আর্থিক বিশ্লেষণ ও ব্যয়ের খতিয়ান' : 'Monthly Financial Analytics & Spending Breakdown'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn ? 'আপনার ব্যয়ের প্যাটার্ন ও ফি কমানোর পরামর্শ' : 'Visual spending patterns and AI suggestions to minimize transaction fees'}
                  </p>
                </div>

                {/* Categories Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { category: isBn ? 'মুদি ও খাদ্য' : 'Grocery & Food', percent: '42%', amount: '৳ ৪,২০০', color: 'bg-amber-400' },
                    { category: isBn ? 'ওষুধ ও স্বাস্থ্য' : 'Pharmacy & Health', percent: '22%', amount: '৳ ২,২০০', color: 'bg-blue-500' },
                    { category: isBn ? 'ইউটিলিটি বিল' : 'Utility Bills', percent: '18%', amount: '৳ ১,৮০০', color: 'bg-emerald-500' },
                    { category: isBn ? 'মোবাইল রিচার্জ' : 'Recharge & Others', percent: '18%', amount: '৳ ১,২৫০', color: 'bg-purple-500' },
                  ].map((cat, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.category}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{cat.percent}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.percent }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block pt-1">
                        {cat.amount}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Spending Insights Card */}
                <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-400/5 border border-amber-300/60 dark:border-amber-400/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'এআই ব্যয়ের বিশ্লেষণ ও পরামর্শ:' : 'AI Spending Recommendation:'}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {isBn
                      ? 'আপনার লেনদেন বিশ্লেষণ অনুযায়ী, খাদ্য ও মুদি খাতে সবচেয়ে বেশি খরচ হচ্ছে। ক্যাশ-আউট না করে সরাসরি উপায় কিউআরে পেমেন্ট করায় গত মাসে আপনি ২৩২ টাকা ফি সাশ্রয় করেছেন।'
                      : 'Based on your transaction pattern, grocery is your highest expenditure. By avoiding cash-out and using Upay QR, you saved ৳ 232 last month.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 6. MAPS & ZERO-CASH ROUTE TAB (LIVE DATA INTEGRATED) */}
          {/* ================================================================= */}
          {activeTab === 'maps' && (
            <div className="space-y-6 animate-fade-in">
              <ZeroCashRoutePlanner
                language={language}
                merchants={merchants}
                agents={agents}
                onOpenPayMerchant={(merchantId, estimatedAmount) => {
                  setPayTargetMerchantId(merchantId);
                  setPayTargetAmount(estimatedAmount);
                  setActiveModalService('merchant_pay');
                }}
                onOpenAddMoney={() => setActiveModalService('add_money')}
                onRecordCashoutDiverted={onRecordCashoutDiverted}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* 7. REPORTS TAB */}
          {/* ================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'আর্থিক বিবরণী ও ট্যাক্স সার্টিফিকেট' : 'Financial Statements & Tax Reports'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn ? 'বাংলাদেশ ব্যাংক অনুমোদিত এমএফএস স্টেটমেন্ট ও ডিজিটাল ট্যাক্স সার্টিফিকেট ডাউনলোড করুন' : 'Download authenticated MFS transaction statements and digital tax certificates'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isBn ? 'মাসিক অ্যাকাউন্ট স্টেটমেন্ট' : 'Monthly Statement'}
                      </span>
                      <FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'অক্টোবর ২০২৬ এর সকল জমা ও খরচের খতিয়ান' : 'All debits and credits for October 2026'}
                    </p>
                    <button
                      onClick={() => triggerReportDownload(isBn ? 'পিডিএফ স্টেটমেন্ট ডাউনলোড সম্পন্ন হয়েছে!' : 'PDF statement downloaded successfully!')}
                      className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ডাউনলোড PDF' : 'Download PDF'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isBn ? 'জিরো-ক্যাশ সাশ্রয় সার্টিফিকেট' : 'Zero-Cash Certificate'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'মোট সাশ্রয়কৃত ২৩২ টাকার অফিসিয়াল স্বীকৃতি' : 'Official certificate showing ৳ 232 saved'}
                    </p>
                    <button
                      onClick={() => triggerReportDownload(isBn ? 'সাশ্রয় সার্টিফিকেট ডাউনলোড সম্পন্ন হয়েছে!' : 'Savings certificate downloaded successfully!')}
                      className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBn ? 'সার্টিফিকেট পান' : 'Get Certificate'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {isBn ? 'এনবিআর ট্যাক্স সারাংশ' : 'NBR Tax Certificate'}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'বাংলাদেশ ব্যাংক নির্দেশিত বার্ষিক ট্যাক্স রিটার্ন ফাইল' : 'Annual tax summary compliant with BB'}
                    </p>
                    <button
                      onClick={() => triggerReportDownload(isBn ? 'এনবিআর ট্যাক্স সারাংশ প্রস্তুত ও ডাউনলোড সম্পন্ন!' : 'Tax summary generated and downloaded successfully!')}
                      className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 8. RESPONSIBLE AI CENTER TAB */}
          {/* ================================================================= */}
          {activeTab === 'responsible_ai' && (
            <div className="animate-fade-in">
              <ResponsibleAICenter language={language} />
            </div>
          )}

          {/* ================================================================= */}
          {/* 10. SETTINGS TAB */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <SettingsPage
                language={language}
                setLanguage={setLanguage}
                role="customer"
              />
            </div>
          )}
        </main>
      </div>

      {/* Floating AI Assistant (Always accessible on all tabs except when inside dedicated tab) */}
      {activeTab !== 'ai_assistant' && (
        <FintechChatWidget
          role="customer"
          user={user}
          language={language}
          setLanguage={setLanguage}
          isFloating={true}
          isOpen={isFloatingChatOpen}
          onToggleOpen={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
          onTriggerAppAction={handleAppAction}
          walletBalance={walletBal}
        />
      )}

      {/* REALISTIC FINTECH TRANSACTION WIZARD MODAL */}
      {activeModalService && (
        <TransactionModal
          isOpen={!!activeModalService}
          onClose={() => {
            setActiveModalService(null);
            setPayTargetMerchantId('');
          }}
          serviceType={activeModalService}
          language={language}
          merchants={merchants}
          agents={agents}
          initialTarget={payTargetMerchantId}
          initialAmount={payTargetAmount}
          onTransactionComplete={(tx) => {
            setSelectedReceiptTx(tx);
          }}
        />
      )}

      {/* FULL TRANSACTION RECEIPT VOUCHER MODAL */}
      {selectedReceiptTx && (
        <TransactionReceiptModal
          isOpen={!!selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
          transaction={selectedReceiptTx}
          language={language}
        />
      )}

      {/* CASHOUT DIVERT MODAL (Smart Zero-Cash Promotion) */}
      {showCashoutDivertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-amber-400/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isBn ? 'ক্যাশ-আউট ফি বাঁচিয়ে টাকা সাশ্রয় করুন!' : 'Skip Cash-Out Fee & Save!'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? `ক্যাশ-আউটে ১.৪% ফি প্রযোজ্য। আশপাশের দোকানে সরাসরি উপায় কিউআরে পেমেন্ট সম্পূর্ণ ফ্রি এবং সাথে তাৎক্ষণিক ক্যাশব্যাক পাওয়া যায়!`
                : `A cash-out incurs a 1.4% fee. Paying directly at nearby merchants with Upay QR is 100% free plus instant cashbacks!`}
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setShowCashoutDivertModal(false);
                  setActiveTab('maps');
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isBn ? 'জিরো-ক্যাশ রুট ব্যবহার করুন' : 'Use Zero-Cash Route'}</span>
              </button>
              <button
                onClick={() => {
                  setShowCashoutDivertModal(false);
                  setActiveModalService('cash_out');
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs cursor-pointer"
              >
                {isBn ? 'তবুও ক্যাশ-আউট করুন' : 'Proceed with Cash-Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
