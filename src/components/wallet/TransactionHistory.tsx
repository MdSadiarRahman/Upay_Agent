import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  PlusCircle,
  ShoppingBag,
  Smartphone,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  Download,
  RotateCcw,
  ArrowUpDown,
  Wallet,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { WalletTransaction, TransactionCategory, TransactionStatus, TransactionType } from '../../types/wallet';
import { Language } from '../../types';
import { formatTaka } from '../../utils/algorithms';
import { TransactionReceiptModal } from './TransactionReceiptModal';

export interface TransactionHistoryProps {
  language: Language;
  role?: 'customer' | 'business' | 'merchant' | 'agent';
  entityId?: string;
  onSelectTransaction?: (tx: WalletTransaction) => void;
  actions?: React.ReactNode;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  language,
  role = 'customer',
  entityId,
  onSelectTransaction,
  actions,
  title,
  subtitle,
  compact = false,
}) => {
  const isBn = language === 'bn';
  const { transactions } = useWallet();

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | TransactionType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Modal State
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRowClick = (tx: WalletTransaction) => {
    if (onSelectTransaction) {
      onSelectTransaction(tx);
    } else {
      setSelectedTx(tx);
    }
  };

  // Filter and Sort Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Business role specific filter if entityId provided
        if (role === 'business' || role === 'merchant' || role === 'agent') {
          // If entityId is set, match either senderId or receiverId
          if (entityId && tx.receiverId !== entityId && tx.senderId !== entityId) {
            // Keep common business types
            if (tx.type !== 'merchant_pay' && tx.type !== 'cash_out' && tx.type !== 'rebalance_transfer') {
              return false;
            }
          }
        }

        // 1. Category Filter (Income / Expense)
        if (typeFilter !== 'all' && tx.category !== typeFilter) {
          return false;
        }

        // 2. Status Filter (Successful / Failed / Pending)
        if (statusFilter !== 'all' && tx.status !== statusFilter) {
          return false;
        }

        // 3. Service Type Filter
        if (serviceFilter !== 'all' && tx.type !== serviceFilter) {
          return false;
        }

        // 4. Search Query (id, sender, receiver, reference, operator)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchId = tx.id.toLowerCase().includes(q);
          const matchSender = tx.senderName.toLowerCase().includes(q) || tx.senderPhone.includes(q);
          const matchReceiver = tx.receiverName.toLowerCase().includes(q) || tx.receiverPhone.includes(q);
          const matchRef = tx.reference ? tx.reference.toLowerCase().includes(q) : false;
          const matchTitle = tx.titleEn.toLowerCase().includes(q) || tx.titleBn.toLowerCase().includes(q);
          const matchAmount = tx.amount.toString().includes(q);
          if (!matchId && !matchSender && !matchReceiver && !matchRef && !matchTitle && !matchAmount) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.timestamp - a.timestamp;
        if (sortBy === 'oldest') return a.timestamp - b.timestamp;
        if (sortBy === 'highest') return b.amount - a.amount;
        if (sortBy === 'lowest') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, typeFilter, statusFilter, serviceFilter, searchQuery, sortBy, role, entityId]);

  // Aggregate Stats for Current Filter
  const stats = useMemo(() => {
    let totalInflow = 0;
    let totalOutflow = 0;
    let successfulCount = 0;

    filteredTransactions.forEach((tx) => {
      if (tx.status === 'successful') {
        successfulCount++;
        if (tx.category === 'income') {
          totalInflow += tx.amount;
        } else {
          totalOutflow += tx.amount;
        }
      }
    });

    return {
      count: filteredTransactions.length,
      totalInflow,
      totalOutflow,
      netVolume: totalInflow + totalOutflow,
      successfulCount,
    };
  }, [filteredTransactions]);

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setStatusFilter('all');
    setServiceFilter('all');
    setSortBy('newest');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Category', 'Status', 'Amount (BDT)', 'Fee (BDT)', 'Sender', 'Receiver', 'Date', 'Time', 'Reference'];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.type,
      tx.category,
      tx.status,
      tx.amount,
      tx.fee,
      `"${tx.senderName} (${tx.senderPhone})"`,
      `"${tx.receiverName} (${tx.receiverPhone})"`,
      tx.date,
      tx.time,
      `"${tx.reference || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UpayPulse_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for Transaction Icon
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'send_money':
        return <Send className="w-4 h-4 text-blue-500" />;
      case 'cash_out':
        return <ArrowDownLeft className="w-4 h-4 text-rose-500" />;
      case 'add_money':
        return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case 'merchant_pay':
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case 'recharge':
        return <Smartphone className="w-4 h-4 text-sky-500" />;
      case 'bill_pay':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'received_money':
        return <ArrowUpRight className="w-4 h-4 text-emerald-500" />;
      default:
        return <Wallet className="w-4 h-4 text-slate-500" />;
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'successful':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isBn ? 'সফল' : 'Successful'}</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            <span>{isBn ? 'ব্যর্থ' : 'Failed'}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>{isBn ? 'প্রক্রিয়াধীন' : 'Pending'}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 transition-colors">
      {/* 1. Header with Title and Custom Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              {title || (isBn ? 'লেনদেন হিস্টোরি ও ডিজিটাল লেজার' : 'Transaction History & Digital Ledger')}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle ||
              (isBn
                ? 'আয়-ব্যয় ও স্ট্যাটাস অনুযায়ী ফিল্টারিং এবং ভেরিফায়েড ডিজিটাল ভাউচার'
                : 'Filter by income/expense and transaction status with verified digital receipts')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={handleExportCSV}
            title={isBn ? 'সিএসভি স্টেটমেন্ট ডাউনলোড' : 'Download CSV Statement'}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">{isBn ? 'এক্সপোর্ট CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Quick Stats Bar */}
      {!compact && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isBn ? 'মোট লেনদেন:' : 'Transactions:'}
            </span>
            <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
              {stats.count} {isBn ? 'টি' : 'records'}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>{isBn ? 'মোট জমা (ইনকাম):' : 'Total Inflow:'}</span>
            </span>
            <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
              +{formatTaka(stats.totalInflow, isBn)}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-rose-500" />
              <span>{isBn ? 'মোট ব্যয় (খরচ):' : 'Total Outflow:'}</span>
            </span>
            <div className="text-sm font-black font-mono text-slate-900 dark:text-slate-100">
              -{formatTaka(stats.totalOutflow, isBn)}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isBn ? 'সফলতার হার:' : 'Success Rate:'}
            </span>
            <div className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
              {stats.count > 0 ? `${Math.round((stats.successfulCount / stats.count) * 100)}%` : '100%'}
            </div>
          </div>
        </div>
      )}

      {/* 3. Search Bar and Filter Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={
                isBn
                  ? 'TrxID, প্রাপক/প্রেরকের নাম, ফোন বা পরিমাণ দিয়ে খুঁজুন...'
                  : 'Search by TrxID, name, phone, or amount...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 font-medium transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="newest" className="dark:bg-slate-900">{isBn ? 'নতুন আগে' : 'Newest First'}</option>
                <option value="oldest" className="dark:bg-slate-900">{isBn ? 'পুরাতন আগে' : 'Oldest First'}</option>
                <option value="highest" className="dark:bg-slate-900">{isBn ? 'বড় পরিমাণ আগে' : 'Highest Amount'}</option>
                <option value="lowest" className="dark:bg-slate-900">{isBn ? 'ছোট পরিমাণ আগে' : 'Lowest Amount'}</option>
              </select>
            </div>

            {(typeFilter !== 'all' || statusFilter !== 'all' || serviceFilter !== 'all' || searchQuery) && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                title={isBn ? 'ফিল্টার রিসেট করুন' : 'Reset filters'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isBn ? 'রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills Row 1: Type (Income / Expense) and Status */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Category: Income / Expense */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              {isBn ? 'ধরন:' : 'Type:'}
            </span>
            {[
              { id: 'all', labelBn: 'সকল টাইপ', labelEn: 'All Types' },
              { id: 'income', labelBn: 'জমা (Income)', labelEn: 'Income (+)' },
              { id: 'expense', labelBn: 'খরচ (Expense)', labelEn: 'Expense (-)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  typeFilter === f.id
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {isBn ? f.labelBn : f.labelEn}
              </button>
            ))}
          </div>

          {/* Status: Successful / Failed / Pending */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              {isBn ? 'স্ট্যাটাস:' : 'Status:'}
            </span>
            {[
              { id: 'all', labelBn: 'সকল', labelEn: 'All' },
              { id: 'successful', labelBn: 'সফল', labelEn: 'Successful' },
              { id: 'failed', labelBn: 'ব্যর্থ', labelEn: 'Failed' },
              { id: 'pending', labelBn: 'পেন্ডিং', labelEn: 'Pending' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id as any)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === s.id
                    ? s.id === 'successful'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : s.id === 'failed'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {isBn ? s.labelBn : s.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills Row 2: Service Types */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            {isBn ? 'সেবা:' : 'Service:'}
          </span>
          {[
            { id: 'all', labelBn: 'সব সেবা', labelEn: 'All Services' },
            { id: 'send_money', labelBn: 'সেন্ড মানি', labelEn: 'Send Money' },
            { id: 'cash_out', labelBn: 'ক্যাশ আউট', labelEn: 'Cash Out' },
            { id: 'merchant_pay', labelBn: 'মার্চেন্ট পে', labelEn: 'Merchant Pay' },
            { id: 'recharge', labelBn: 'মোবাইল রিচার্জ', labelEn: 'Recharge' },
            { id: 'bill_pay', labelBn: 'বিল পে', labelEn: 'Bill Pay' },
            { id: 'add_money', labelBn: 'অ্যাড মানি', labelEn: 'Add Money' },
            { id: 'received_money', labelBn: 'টাকা প্রাপ্তি', labelEn: 'Received' },
          ].map((service) => (
            <button
              key={service.id}
              onClick={() => setServiceFilter(service.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                serviceFilter === service.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-950/40'
              }`}
            >
              {isBn ? service.labelBn : service.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Transactions List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-2">
        {filteredTransactions.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {isBn ? 'কোনো লেনদেন পাওয়া যায়নি' : 'No transactions found'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isBn
                  ? 'আপনার নির্বাচিত ফিল্টারের সাথে কোনো রেকর্ড মেলেনি।'
                  : 'No records matched your selected criteria or search term.'}
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isBn ? 'সকল ফিল্টার রিসেট করুন' : 'Reset All Filters'}</span>
            </button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.category === 'income';
            const isSuccess = tx.status === 'successful';

            return (
              <div
                key={tx.id}
                onClick={() => handleRowClick(tx)}
                className="py-3.5 px-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-2xl transition cursor-pointer group"
              >
                {/* Left: Icon and Basic Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-105 ${
                      tx.type === 'merchant_pay'
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : tx.type === 'send_money'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                        : tx.type === 'add_money' || tx.type === 'received_money'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : tx.type === 'cash_out'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : tx.type === 'bill_pay'
                        ? 'bg-amber-400/20 text-amber-700 dark:text-amber-400 border border-amber-400/30'
                        : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                    }`}
                  >
                    {getTransactionIcon(tx.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {isBn ? tx.titleBn : tx.titleEn}
                      </h4>
                      {getStatusBadge(tx.status)}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="truncate">
                        {isIncome ? tx.senderName : tx.receiverName}
                      </span>
                      <span>•</span>
                      <span>{tx.date}, {tx.time}</span>
                      <span>•</span>
                      <button
                        onClick={(e) => handleCopyId(e, tx.id)}
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1 cursor-pointer"
                        title={isBn ? 'TrxID কপি করুন' : 'Copy TrxID'}
                      >
                        {tx.id}
                        {copiedId === tx.id ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>

                    {tx.failureReason && (
                      <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold mt-0.5">
                        {tx.failureReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Receipt Preview Link */}
                <div className="text-right shrink-0 ml-3">
                  <div
                    className={`font-mono font-black text-xs sm:text-sm ${
                      !isSuccess
                        ? 'text-slate-400 dark:text-slate-500 line-through'
                        : isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatTaka(tx.amount, isBn)}
                  </div>

                  {tx.fee > 0 && isSuccess && (
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {isBn ? 'ফি: ' : 'Fee: '}{formatTaka(tx.fee, isBn)}
                    </span>
                  )}

                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold group-hover:underline block mt-0.5">
                    {isBn ? 'রিসিট ভিউ' : 'View Receipt'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Internal Receipt Modal if not using external handler */}
      {!onSelectTransaction && selectedTx && (
        <TransactionReceiptModal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
          language={language}
        />
      )}
    </div>
  );
};
