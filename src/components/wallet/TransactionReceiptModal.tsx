import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  ArrowDownLeft,
  PlusCircle,
  ShoppingBag,
  Smartphone,
  Zap,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Language } from '../../types';
import { WalletTransaction } from '../../types/wallet';
import { formatTaka } from '../../utils/algorithms';

interface TransactionReceiptModalProps {
  transaction: WalletTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';
  const [copied, setCopied] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  if (!isOpen || !transaction) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const getIcon = () => {
    switch (transaction.type) {
      case 'send_money':
        return <Send className="w-5 h-5 text-amber-500" />;
      case 'cash_out':
        return <ArrowDownLeft className="w-5 h-5 text-rose-500" />;
      case 'add_money':
        return <PlusCircle className="w-5 h-5 text-emerald-500" />;
      case 'merchant_pay':
        return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'recharge':
        return <Smartphone className="w-5 h-5 text-sky-500" />;
      case 'bill_pay':
        return <Zap className="w-5 h-5 text-amber-500" />;
      default:
        return <FileText className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'ডিজিটাল লেনদেন ভাউচার' : 'Digital Transaction Voucher'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Top Status & Amount */}
          <div className="text-center space-y-1.5 py-1">
            <div className="inline-flex p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 mb-1">
              {getIcon()}
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {transaction.category === 'income' ? '+' : '-'}
              {formatTaka(transaction.amount, isBn)}
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                {isBn ? 'লেনদেন সফল (Completed)' : 'Completed & Settled'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn ? transaction.titleBn : transaction.titleEn}
            </p>
          </div>

          {/* Detailed Ledger Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-dashed border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">{isBn ? 'ট্রানজ্যাকশন আইডি:' : 'Transaction ID:'}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-slate-900 dark:text-white tracking-wider">
                  {transaction.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1 rounded text-slate-400 hover:text-amber-500 cursor-pointer"
                  title="Copy TrxID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isBn ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {transaction.date} • {transaction.time}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isBn ? 'প্রেরক (Sender):' : 'Sender Account:'}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {transaction.senderName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isBn ? 'প্রাপক (Recipient):' : 'Recipient Account:'}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {transaction.receiverName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">{isBn ? 'সার্ভিস চার্জ:' : 'Platform Fee:'}</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {transaction.fee === 0 ? (isBn ? '০ টাকা (ফ্রি)' : '৳ 0 (Free)') : formatTaka(transaction.fee, isBn)}
              </span>
            </div>

            {transaction.reference && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">{isBn ? 'রেফারেন্স:' : 'Reference:'}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {transaction.reference}
                </span>
              </div>
            )}

            {transaction.extraDetails?.paymentMethod && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{isBn ? 'পেমেন্ট চ্যানেল:' : 'Payment Channel:'}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {transaction.extraDetails.paymentMethod}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                downloaded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? (isBn ? 'ডাউনলোড সম্পন্ন!' : 'Downloaded!') : (isBn ? 'ডাউনলোড' : 'Download')}</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : isBn ? 'আইডি কপি' : 'Copy ID'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
