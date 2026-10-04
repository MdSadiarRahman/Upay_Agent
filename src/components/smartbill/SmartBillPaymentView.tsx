import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Zap,
  Wifi,
  Flame,
  Droplets,
  Smartphone,
  GraduationCap,
  Tv,
  CheckCircle2,
  AlertCircle,
  Clock,
  PlusCircle,
  Bell,
  BellOff,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Calendar as CalendarIcon,
  Search,
  Check,
  RotateCcw,
  Wallet,
  Receipt,
  Plus,
  Calendar,
  XCircle,
  FileText,
  Copy,
} from 'lucide-react';
import { Language } from '../../types';
import { SmartBillItem, SmartBillCategory } from '../../types/smartBill';
import { formatTaka } from '../../utils/algorithms';
import { useSmartBill } from '../../context/SmartBillContext';
import { useWallet } from '../../context/WalletContext';
import { SmartBillConfirmModal } from './SmartBillConfirmModal';
import { NewBillPaymentWizard } from './NewBillPaymentWizard';
import { AiHumanGovernanceCard } from './AiHumanGovernanceCard';

interface SmartBillPaymentViewProps {
  language: Language;
  onOpenAddMoneyModal?: () => void;
}

export const SmartBillPaymentView: React.FC<SmartBillPaymentViewProps> = ({
  language,
  onOpenAddMoneyModal,
}) => {
  const isBn = language === 'bn';
  const {
    bills,
    upcomingBills,
    dueSoonBills,
    scheduledBills,
    paidBills,
    failedBills,
    totalUpcomingAmount,
    totalScheduledAmount,
    totalPaidThisMonth,
    activePayModalBill,
    openPaymentFlow,
    closePaymentFlow,
    toggleReminder,
    snoozeReminder,
    cancelScheduledBill,
    getBalanceHealth,
    aiInsights,
    resetBillsToDefault,
  } = useSmartBill();

  const { customerBalance } = useWallet();

  // Active view tab inside Smart Bill Payment Assistant
  const [activeSubTab, setActiveSubTab] = useState<
    'cards' | 'new_bill' | 'scheduled' | 'calendar' | 'history' | 'detection' | 'insights'
  >('cards');

  const [categoryFilter, setCategoryFilter] = useState<'all' | SmartBillCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [snoozeToast, setSnoozeToast] = useState<string | null>(null);

  // History filter: all | paid | scheduled | failed
  const [historyFilter, setHistoryFilter] = useState<'all' | 'paid' | 'scheduled' | 'failed'>('all');

  // Selected date on calendar
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(5);

  const balanceHealth = getBalanceHealth();

  // Most urgent upcoming bill for the proactive AI reminder banner
  const mostUrgentBill = useMemo(() => {
    return upcomingBills.slice().sort((a, b) => a.dueDay - b.dueDay)[0] || null;
  }, [upcomingBills]);

  // Filtered upcoming bills
  const filteredBills = useMemo(() => {
    return upcomingBills.filter((b) => {
      if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = b.titleEn.toLowerCase().includes(q) || b.titleBn.toLowerCase().includes(q);
        const matchProvider = b.providerName.toLowerCase().includes(q);
        const matchAcc = b.accountNumber.toLowerCase().includes(q);
        if (!matchTitle && !matchProvider && !matchAcc) return false;
      }
      return true;
    });
  }, [upcomingBills, categoryFilter, searchQuery]);

  // Filtered history bills
  const filteredHistoryBills = useMemo(() => {
    return bills.filter((b) => {
      if (historyFilter === 'paid') return b.status === 'paid';
      if (historyFilter === 'scheduled') return b.status === 'scheduled';
      if (historyFilter === 'failed') return b.status === 'failed';
      return b.status === 'paid' || b.status === 'scheduled' || b.status === 'failed';
    });
  }, [bills, historyFilter]);

  const handleSnooze = (bill: SmartBillItem) => {
    snoozeReminder(bill.id);
    setSnoozeToast(
      isBn
        ? `${bill.titleBn}-এর রিমাইন্ডার ২ দিনের জন্য স্থগিত রাখা হয়েছে।`
        : `Reminder for ${bill.titleEn} snoozed for 2 days.`
    );
    setTimeout(() => setSnoozeToast(null), 3000);
  };

  const getCategoryIcon = (cat: SmartBillCategory) => {
    switch (cat) {
      case 'electricity':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'internet':
        return <Wifi className="w-4 h-4 text-sky-500" />;
      case 'gas':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'mobile_recharge':
      case 'mobile_postpaid':
        return <Smartphone className="w-4 h-4 text-emerald-500" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      default:
        return <Tv className="w-4 h-4 text-purple-500" />;
    }
  };

  // Calendar dates with active bills (October 2026 starts on Thursday, Oct 1 = Day 4)
  const calendarDays = useMemo(() => {
    const days = [];
    const totalDaysInMonth = 31;
    const startDayOffset = 4;

    for (let i = 0; i < startDayOffset; i++) {
      days.push({ dayNumber: null, bills: [] });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const billsOnThisDay = bills.filter((b) => b.dueDay === day || (b.isScheduled && b.scheduledDay === day));
      days.push({ dayNumber: day, bills: billsOnThisDay });
    }

    return days;
  }, [bills]);

  const selectedDayBills = useMemo(() => {
    return bills.filter((b) => b.dueDay === selectedCalendarDay || (b.isScheduled && b.scheduledDay === selectedCalendarDay));
  }, [bills, selectedCalendarDay]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {snoozeToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 border border-slate-700 animate-bounce">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{snoozeToast}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 text-slate-950 dark:text-amber-400 shadow-xs">
              <CalendarClock className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {isBn ? 'স্মার্ট বিল পেমেন্ট অ্যাসিস্ট্যান্ট' : 'Smart Bill Payment Assistant'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>MFS AI Suite</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn
              ? 'ইউটিলিটি, মোবাইল ও শিক্ষা ফি-এর সম্পূর্ণ এমএফএস বিলিং ফ্লো • এআই পরামর্শ দেয়, চূড়ান্ত সিদ্ধান্ত আপনার'
              : 'Complete MFS utility & education billing flow • AI recommends & assists, human takes action'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('new_bill')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন বিল পে করুন' : 'Pay New Bill'}</span>
          </button>

          {onOpenAddMoneyModal && (
            <button
              onClick={onOpenAddMoneyModal}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'টাকা যোগ' : 'Add Money'}</span>
            </button>
          )}

          <button
            onClick={resetBillsToDefault}
            title={isBn ? 'ডেমো রিসেট' : 'Reset Demo'}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RESPONSIBLE AI GOVERNANCE: AI SUGGESTS, HUMAN ACTS */}
      <AiHumanGovernanceCard language={language} />

      {/* 2. PROACTIVE AI REMINDER BANNER (3 Actions: Pay Now / Schedule / Remind Later) */}
      {mostUrgentBill && (
        <div className="p-5 rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-400/15 to-transparent border border-amber-300/80 dark:border-amber-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/30 text-amber-900 dark:text-amber-200">
                  {isBn ? 'এআই স্মার্ট রিমাইন্ডার' : 'AI Smart Reminder'}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{mostUrgentBill.dueDate}</span>
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {isBn
                  ? `আপনার ${mostUrgentBill.titleBn}-এর ৳ ${mostUrgentBill.amount.toLocaleString('en-IN')} বিল পরিশোধের সময় এসেছে।`
                  : `Your ${mostUrgentBill.titleEn} payment of ৳ ${mostUrgentBill.amount.toLocaleString('en-IN')} is due soon.`}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                {isBn ? mostUrgentBill.aiRecommendationBn : mostUrgentBill.aiRecommendationEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
            <button
              onClick={() => handleSnooze(mostUrgentBill)}
              className="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              {isBn ? 'পরে মনে করান' : 'Remind Later'}
            </button>
            <button
              onClick={() => openPaymentFlow(mostUrgentBill)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
            >
              <span>{isBn ? 'এখনই পে করুন' : 'Pay Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. BALANCE-AWARE PAYMENT ASSISTANCE BANNER */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          balanceHealth.healthStatus === 'healthy'
            ? 'bg-emerald-50/60 dark:bg-emerald-500/5 border-emerald-300/60 dark:border-emerald-500/20'
            : balanceHealth.healthStatus === 'warning'
            ? 'bg-amber-50/60 dark:bg-amber-500/5 border-amber-300/60 dark:border-amber-500/20'
            : 'bg-rose-50/60 dark:bg-rose-500/5 border-rose-300/60 dark:border-rose-500/20'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-2xl shrink-0 ${
                balanceHealth.healthStatus === 'healthy'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : balanceHealth.healthStatus === 'warning'
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {isBn ? 'ব্যালেন্স সচেতন এআই সহায়তা' : 'Balance-Aware Payment Assistance'}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-900/10 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                  {isBn ? 'হিউম্যান ইন দ্য লুপ' : 'Human in Control'}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {isBn ? balanceHealth.messageBn : balanceHealth.messageEn}
              </p>
              {balanceHealth.tipBn && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  💡 {isBn ? balanceHealth.tipBn : balanceHealth.tipEn}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">{isBn ? 'আসন্ন মোট বিল:' : 'Total Upcoming:'}</span>
              <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                {formatTaka(totalUpcomingAmount, isBn)}
              </span>
            </div>
            {!balanceHealth.isSufficient && onOpenAddMoneyModal && (
              <button
                onClick={onOpenAddMoneyModal}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs cursor-pointer transition active:scale-[0.98]"
              >
                {isBn ? 'টাকা যোগ করুন' : 'Add Money Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'cards', labelBn: 'আসন্ন বিলসমূহ', labelEn: 'Upcoming Bills', icon: <Receipt className="w-3.5 h-3.5" />, count: upcomingBills.length },
          { id: 'new_bill', labelBn: 'নতুন বিল পে (MFS Flow)', labelEn: 'Pay New Bill', icon: <Plus className="w-3.5 h-3.5" /> },
          { id: 'scheduled', labelBn: 'শিডিউলকৃত বিল', labelEn: 'Scheduled Bills', icon: <Calendar className="w-3.5 h-3.5" />, count: scheduledBills.length },
          { id: 'calendar', labelBn: 'স্মার্ট বিল ক্যালেন্ডার', labelEn: 'Calendar View', icon: <CalendarIcon className="w-3.5 h-3.5" /> },
          { id: 'history', labelBn: 'হিস্টোরি ও ডিজিটাল রিসিট', labelEn: 'History & Receipts', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'detection', labelBn: 'এআই ডিটেকশন', labelEn: 'AI Detection', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'insights', labelBn: 'আর্থিক ইনসাইটস', labelEn: 'Insights', icon: <TrendingUp className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-amber-400 text-slate-950 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {tab.icon}
            <span>{isBn ? tab.labelBn : tab.labelEn}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeSubTab === tab.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ============================================================= */}
      {/* VIEW 1: UPCOMING SMART BILL CARDS */}
      {/* ============================================================= */}
      {activeSubTab === 'cards' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={isBn ? 'বিলের নাম, প্রতিষ্ঠান বা একাউন্ট নম্বর দিয়ে খুঁজুন...' : 'Search by bill name, provider, or account number...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', labelBn: 'সকল ক্যাটাগরি', labelEn: 'All' },
                { id: 'internet', labelBn: 'ইন্টারনেট', labelEn: 'Internet' },
                { id: 'electricity', labelBn: 'বিদ্যুৎ', labelEn: 'Electricity' },
                { id: 'gas', labelBn: 'গ্যাস', labelEn: 'Gas' },
                { id: 'mobile_recharge', labelBn: 'মোবাইল', labelEn: 'Mobile' },
                { id: 'education', labelBn: 'শিক্ষা', labelEn: 'Education' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {isBn ? c.labelBn : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredBills.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {isBn ? 'কোনো বকেয়া বিল পাওয়া যায়নি!' : 'No upcoming bills found!'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isBn ? 'আপনার নির্বাচিত ফিল্টারে কোনো বিল বাকি নেই।' : 'All matching utility bills are up to date.'}
                </p>
                <button
                  onClick={() => setActiveSubTab('new_bill')}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নতুন বিল পে করুন' : 'Pay New Bill'}</span>
                </button>
              </div>
            ) : (
              filteredBills.map((bill) => {
                const isDueSoon = bill.status === 'due_soon' || bill.dueDay <= 10;
                return (
                  <div
                    key={bill.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/60 dark:hover:border-amber-400/40 transition shadow-xs space-y-4 flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                            {getCategoryIcon(bill.category)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                              {isBn ? bill.titleBn : bill.titleEn}
                            </h4>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                              {bill.accountNumber}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
                            isDueSoon
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {isBn ? `${bill.dueDate} এর মধ্যে` : `Due ${bill.dueDate}`}
                        </span>
                      </div>

                      {/* Amount & Fee */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{isBn ? 'বিলের পরিমাণ:' : 'Bill Amount:'}</span>
                          <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                            {formatTaka(bill.customAmount || bill.amount, isBn)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">{isBn ? 'উপায় ফি:' : 'Fee:'}</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {isBn ? '৳ ০ (ফ্রি)' : '৳ 0 Free'}
                          </span>
                        </div>
                      </div>

                      {/* AI Recommendation */}
                      <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-400/5 border border-amber-200/60 dark:border-amber-400/20 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">
                          {isBn ? bill.aiRecommendationBn : bill.aiRecommendationEn}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Actions: Reminder & Pay Now */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => toggleReminder(bill.id)}
                        className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          bill.reminderSet
                            ? 'bg-amber-400/10 text-amber-800 dark:text-amber-300 border-amber-400/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                        title="Reminder"
                      >
                        {bill.reminderSet ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                        <span className="text-[10px] hidden sm:inline">{bill.reminderSet ? (isBn ? 'রিমাইন্ডার অন' : 'Reminder') : (isBn ? 'অফ' : 'Off')}</span>
                      </button>

                      <button
                        onClick={() => openPaymentFlow(bill)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
                      >
                        <span>{isBn ? 'পে করুন' : 'Pay Now'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW 2: NEW BILL PAYMENT MFS WIZARD */}
      {/* ============================================================= */}
      {activeSubTab === 'new_bill' && (
        <NewBillPaymentWizard
          language={language}
          onComplete={() => setActiveSubTab('cards')}
          onOpenAddMoney={onOpenAddMoneyModal}
        />
      )}

      {/* ============================================================= */}
      {/* VIEW 3: SCHEDULED BILLS */}
      {/* ============================================================= */}
      {activeSubTab === 'scheduled' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span>{isBn ? 'শিডিউলকৃত ইউটিলিটি বিলসমূহ' : 'Scheduled Bill Payments Queue'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'নির্ধারিত তারিখে এআই আপনাকে প্রম্পট করবে; আপনার অনুমতি ও পিন ছাড়া কোনো টাকা কাটা হবে না'
                  : 'Queued for future dates. AI notifies and requests 1-tap PIN confirmation before clearing'}
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
              {isBn ? 'মোট শিডিউল: ' : 'Total Scheduled: '}{formatTaka(totalScheduledAmount, isBn)}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {scheduledBills.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto opacity-40" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'বর্তমানে কোনো শিডিউল করা বিল নেই।' : 'No bills currently scheduled.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isBn ? 'যেকোনো বিল পে করার সময় Schedule অপশন নির্বাচন করে শিডিউল করতে পারেন।' : 'Select Schedule Payment when paying any bill to add to this queue.'}
                </p>
              </div>
            ) : (
              scheduledBills.map((b) => (
                <div key={b.id} className="py-4 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                      {getCategoryIcon(b.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {isBn ? b.titleBn : b.titleEn}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300">
                          {isBn ? `শিডিউল: ${b.scheduledDate}` : `Scheduled: ${b.scheduledDate}`}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {b.providerName} • Acc: {b.accountNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
                        {formatTaka(b.customAmount || b.amount, isBn)}
                      </span>
                      <span className="text-[10px] text-sky-500 font-bold block">
                        {isBn ? 'অপেক্ষমাণ' : 'Pending Date'}
                      </span>
                    </div>

                    <button
                      onClick={() => openPaymentFlow(b)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {isBn ? 'এখনই পে' : 'Pay Early'}
                    </button>

                    <button
                      onClick={() => cancelScheduledBill(b.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                      title={isBn ? 'শিডিউল বাতিল' : 'Cancel Schedule'}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW 4: SMART BILL CALENDAR */}
      {/* ============================================================= */}
      {activeSubTab === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'স্মার্ট বিল ক্যালেন্ডার (অক্টোবর ২০২৬)' : 'Smart Bill Calendar (October 2026)'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'মাসিক সকল ইউটিলিটি ও সাবস্ক্রিপশন বিলের টাইমলাইন এবং নির্ধারিত শেষ তারিখ'
                  : 'Monthly calendar timeline of upcoming due dates, scheduled payments, and settled bills'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>{isBn ? 'আসন্ন' : 'Upcoming'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                <span>{isBn ? 'শিডিউল' : 'Scheduled'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>{isBn ? 'পরিশোধিত' : 'Paid'}</span>
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-center py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d}>{isBn ? (d === 'Sun' ? 'রবি' : d === 'Mon' ? 'সোম' : d === 'Tue' ? 'মঙ্গল' : d === 'Wed' ? 'বুধ' : d === 'Thu' ? 'বৃহস্পতি' : d === 'Fri' ? 'শুক্র' : 'শনি') : d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {calendarDays.map((item, idx) => {
                const hasBills = item.bills.length > 0;
                const isSelected = item.dayNumber === selectedCalendarDay;

                return (
                  <div
                    key={idx}
                    onClick={() => item.dayNumber && setSelectedCalendarDay(item.dayNumber)}
                    className={`min-h-[75px] sm:min-h-[85px] p-2 transition cursor-pointer relative ${
                      !item.dayNumber
                        ? 'bg-slate-50/50 dark:bg-slate-950/30 cursor-default'
                        : isSelected
                        ? 'bg-amber-400/10 dark:bg-amber-400/15'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {item.dayNumber && (
                      <>
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono font-bold text-xs ${
                              isSelected
                                ? 'w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {item.dayNumber}
                          </span>
                          {hasBills && (
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              {item.bills.length}
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 space-y-1">
                          {item.bills.map((b) => (
                            <div
                              key={b.id}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold truncate flex items-center gap-1 ${
                                b.status === 'paid'
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                  : b.status === 'scheduled'
                                  ? 'bg-sky-500/15 text-sky-700 dark:text-sky-400'
                                  : 'bg-amber-400/20 text-amber-900 dark:text-amber-300'
                              }`}
                            >
                              <span>{formatTaka(b.customAmount || b.amount, isBn)}</span>
                              <span className="truncate hidden sm:inline">{isBn ? b.titleBn : b.titleEn}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Inspector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedCalendarDay} October 2026 {isBn ? 'এর বিলসমূহ:' : 'Scheduled Bills:'}</span>
              </span>
              <span className="text-[11px] text-slate-500">
                {selectedDayBills.length} {isBn ? 'টি বিল নির্ধারিত' : 'bills scheduled'}
              </span>
            </div>

            {selectedDayBills.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                {isBn ? 'এই তারিখে কোনো বিল পরিশোধের তারিখ নেই।' : 'No bill due dates recorded for this date.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
                {selectedDayBills.map((b) => (
                  <div key={b.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shrink-0">
                        {getCategoryIcon(b.category)}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white">
                          {isBn ? b.titleBn : b.titleEn}
                        </h5>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {b.providerName} • {b.accountNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 dark:text-white block">
                          {formatTaka(b.customAmount || b.amount, isBn)}
                        </span>
                        <span className={`text-[10px] font-bold ${b.status === 'paid' ? 'text-emerald-500' : b.status === 'scheduled' ? 'text-sky-500' : 'text-amber-500'}`}>
                          {b.status === 'paid' ? (isBn ? 'পরিশোধিত' : 'Paid') : b.status === 'scheduled' ? (isBn ? 'শিডিউলড' : 'Scheduled') : (isBn ? 'বকেয়া' : 'Pending')}
                        </span>
                      </div>

                      {b.status !== 'paid' && (
                        <button
                          onClick={() => openPaymentFlow(b)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
                        >
                          {isBn ? 'পে করুন' : 'Pay'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW 5: PAYMENT HISTORY & DIGITAL RECEIPTS */}
      {/* ============================================================= */}
      {activeSubTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>{isBn ? 'বিল পেমেন্ট হিস্টোরি ও ডিজিটাল রিসিট' : 'Bill Payment History & Digital Receipts'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'পরিশোধিত, শিডিউলকৃত ও অন্যান্য বিলের অফিসিয়াল ভাউচার লেজার'
                  : 'Comprehensive ledger of cleared, scheduled, and failed utility clearance vouchers'}
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', labelBn: 'সকল বিল', labelEn: 'All' },
                { id: 'paid', labelBn: 'পরিশোধিত', labelEn: 'Paid' },
                { id: 'scheduled', labelBn: 'শিডিউলকৃত', labelEn: 'Scheduled' },
                { id: 'failed', labelBn: 'ব্যর্থ চেষ্টা', labelEn: 'Failed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setHistoryFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    historyFilter === f.id
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {isBn ? f.labelBn : f.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredHistoryBills.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto opacity-40" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  {isBn ? 'এই ক্যাটাগরিতে কোনো রেকর্ড নেই।' : 'No records found for this filter.'}
                </p>
              </div>
            ) : (
              filteredHistoryBills.map((b) => (
                <div key={b.id} className="py-3.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl shrink-0 ${
                      b.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                      b.status === 'scheduled' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' :
                      'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {getCategoryIcon(b.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          {isBn ? b.titleBn : b.titleEn}
                        </h4>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {b.paidTrxId || (b.isScheduled ? 'SCHEDULED' : 'FAILED')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {b.providerName} • {b.paidAt || b.scheduledDate || b.dueDate}
                      </span>
                      {b.failureReason && (
                        <p className="text-[10px] text-rose-500 font-semibold mt-0.5">
                          {b.failureReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono font-bold text-xs block ${
                      b.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' :
                      b.status === 'scheduled' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 line-through'
                    }`}>
                      {formatTaka(b.customAmount || b.amount, isBn)}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      b.status === 'paid' ? 'text-emerald-600' :
                      b.status === 'scheduled' ? 'text-sky-500' : 'text-rose-500'
                    }`}>
                      {b.status === 'paid' ? (isBn ? 'পরিশোধিত' : 'Paid') :
                       b.status === 'scheduled' ? (isBn ? 'শিডিউলড' : 'Scheduled') :
                       (isBn ? 'ব্যর্থ' : 'Failed')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW 6: AI BILL DETECTION SYSTEM */}
      {/* ============================================================= */}
      {activeSubTab === 'detection' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isBn ? 'এআই রিকারিং বিল ডিটেকশন সিস্টেম' : 'AI Recurring Bill Detection System'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'বিগত ৬ মাসের ট্রানজ্যাকশন লেজার বিশ্লেষণ করে নিয়মিত বিলের প্যাটার্ন ও পরিশোধের তারিখ স্বয়ংক্রিয়ভাবে শনাক্তকরণ'
                : 'Autonomous machine learning analysis of past ledger records detecting recurring utility bill schedules and confidence ratings'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.slice(0, 6).map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(b.category)}
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {isBn ? b.titleBn : b.titleEn}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{b.aiConfidence}% {isBn ? 'অ্যাকুরেসি' : 'Confidence'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  💡 {b.aiPattern}
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {isBn ? 'পূর্ববর্তী লেনদেন খতিয়ান:' : 'Historical Correlated Transactions:'}
                  </span>
                  <div className="space-y-1.5">
                    {b.previousPayments.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300">
                        <span>{p.date} • {p.trxId}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{formatTaka(p.amount, isBn)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-500">
                    {isBn ? `প্রত্যাশিত প্রদেয় দিন: প্রতি মাসের ${b.dueDay} তারিখ` : `Expected Date: Around ${b.dueDay}th of each month`}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ~{formatTaka(b.amount, isBn)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* VIEW 7: AI PAYMENT INSIGHTS */}
      {/* ============================================================= */}
      {activeSubTab === 'insights' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>{isBn ? 'এআই আর্থিক বিশ্লেষণ ও ব্যয়ের খতিয়ান' : 'AI Financial Analytics & Spending Insights'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'বিল বৃদ্ধির প্রবণতা, ক্যাশলেস ফি সাশ্রয় এবং আপনার পেমেন্ট অভ্যাসের স্বয়ংক্রিয় বিশ্লেষণ'
                : 'Automated breakdown of bill fluctuation trends, fee savings, and on-time habits'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((ins) => (
              <div
                key={ins.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-400/20 text-slate-950 dark:text-amber-400">
                    {ins.iconName === 'TrendingUp' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : ins.iconName === 'ShieldCheck' ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    ) : ins.iconName === 'PieChart' ? (
                      <PieChart className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {isBn ? ins.titleBn : ins.titleEn}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn ? ins.descriptionBn : ins.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Controlled Payment Confirmation Modal */}
      <SmartBillConfirmModal
        bill={activePayModalBill}
        isOpen={!!activePayModalBill}
        onClose={closePaymentFlow}
        language={language}
      />
    </div>
  );
};
