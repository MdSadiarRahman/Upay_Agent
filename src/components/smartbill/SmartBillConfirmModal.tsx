import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
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
  ArrowRight,
  Wallet,
  Lock,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartBillItem } from '../../types/smartBill';
import { Language } from '../../types';
import { formatTaka } from '../../utils/algorithms';
import { useSmartBill } from '../../context/SmartBillContext';
import { useWallet } from '../../context/WalletContext';
import { MfsHoldToConfirmButton } from './MfsHoldToConfirmButton';

interface SmartBillConfirmModalProps {
  bill: SmartBillItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SmartBillConfirmModal: React.FC<SmartBillConfirmModalProps> = ({
  bill,
  isOpen,
  onClose,
  language,
}) => {
  const isBn = language === 'bn';
  const { paySmartBill, scheduleBillPayment } = useSmartBill();
  const { customerBalance } = useWallet();

  // Wizard state: 1: Details & Amount -> 2: Date Option (Pay Now vs Schedule) -> 3: PIN Verification -> 4: Processing -> 5: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [amount, setAmount] = useState<number>(0);
  const [isScheduling, setIsScheduling] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<string>('10 Oct 2026');
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (bill) {
      setAmount(bill.customAmount || bill.amount);
      setScheduleDate(bill.dueDate);
      setStep(1);
      setPin('');
      setErrorMsg('');
      setIsScheduling(false);
    }
  }, [bill]);

  if (!isOpen || !bill) return null;

  const handleCopyTrx = () => {
    if (trxId) {
      navigator.clipboard.writeText(trxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetState = () => {
    setStep(1);
    setPin('');
    setErrorMsg('');
    setTrxId('');
    setIsScheduling(false);
    onClose();
  };

  const handleProceedToDateOrPin = () => {
    if (amount <= 0) {
      setErrorMsg(isBn ? 'সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }
    if (amount > 100000) {
      setErrorMsg(isBn ? 'সর্বোচ্চ সীমা ১,০০,০০০ টাকা।' : 'Maximum limit is ৳ 1,00,000.');
      return;
    }
    if (!isScheduling && customerBalance < amount) {
      setErrorMsg(
        isBn
          ? `অপর্যাপ্ত ব্যালেন্স। আপনার বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString('en-IN')}, প্রয়োজন ৳ ${amount.toLocaleString('en-IN')}।`
          : `Insufficient balance. Current balance is ৳ ${customerBalance.toLocaleString('en-IN')}, required ৳ ${amount.toLocaleString('en-IN')}.`
      );
      return;
    }

    setErrorMsg('');
    setStep(2);
  };

  const handleConfirmDateDecision = (schedule: boolean) => {
    setIsScheduling(schedule);
    setErrorMsg('');
    setStep(3); // Go to PIN
  };

  const handleConfirmAction = async () => {
    if (pin.length !== 4) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে ৪ ডিজিটের সঠিক পিন প্রদান করুন।' : 'Please enter your 4-digit secret PIN.');
      return;
    }

    if (pin !== '1234') {
      setErrorMsg(
        isBn
          ? 'ভুল পিন প্রদান করেছেন! (সিমুলেশন টেস্টের জন্য ১২৩৪ ব্যবহার করুন)'
          : 'Incorrect PIN! (Use 1234 for simulation testing)'
      );
      return;
    }

    setErrorMsg('');
    setStep(4); // Processing

    try {
      if (isScheduling) {
        // Schedule Bill Action
        setTimeout(() => {
          const res = scheduleBillPayment(bill.id, scheduleDate, amount);
          setTrxId(`SCHED-${Math.floor(100000 + Math.random() * 900000)}`);
          setStep(5);
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        }, 1200);
      } else {
        // Pay Now Action
        const res = await paySmartBill(bill.id, pin, amount);
        if (res.success && res.trxId) {
          setTrxId(res.trxId);
          setStep(5);
          confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
        } else {
          setErrorMsg(res.error || (isBn ? 'পেমেন্ট সম্পন্ন হতে পারেনি।' : 'Payment failed.'));
          setStep(3);
        }
      }
    } catch (e: any) {
      setErrorMsg(e?.message || (isBn ? 'লেনদেন ব্যর্থ হয়েছে।' : 'Transaction failed.'));
      setStep(3);
    }
  };

  const getCategoryIcon = () => {
    switch (bill.category) {
      case 'electricity':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'internet':
        return <Wifi className="w-5 h-5 text-sky-500" />;
      case 'gas':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'mobile_recharge':
      case 'mobile_postpaid':
        return <Smartphone className="w-5 h-5 text-emerald-500" />;
      case 'education':
        return <GraduationCap className="w-5 h-5 text-indigo-500" />;
      default:
        return <Tv className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-slate-950 dark:text-amber-400">
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {isBn ? 'বিল পেমেন্ট ও শিডিউলিং' : 'Bill Payment & Scheduling'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>{isBn ? 'এআই পরামর্শ • চূড়ান্ত সিদ্ধান্ত আপনার' : 'AI Assisted • 100% User Controlled'}</span>
              </p>
            </div>
          </div>
          <button
            onClick={resetState}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Amount Input */}
        {step === 1 && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* AI Recommendation Box */}
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">{isBn ? 'এআই বিল বিশ্লেষণ:' : 'AI Bill Analysis:'}</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed mt-0.5">
                  {isBn ? bill.aiRecommendationBn : bill.aiRecommendationEn}
                </p>
              </div>
            </div>

            {/* Bill Details Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'প্রতিষ্ঠান:' : 'Provider:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{bill.providerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'হিসাব নম্বর:' : 'Account / Meter:'}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{bill.accountNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'নির্ধারিত শেষ তারিখ:' : 'Due Deadline:'}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{bill.dueDate}</span>
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">{isBn ? 'সার্ভিস চার্জ / ফি:' : 'Processing Fee:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳ ০ (ফ্রি)</span>
              </div>
            </div>

            {/* Amount Input System (Custom Editable) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200">
                  {isBn ? 'প্রদেয় টাকার পরিমাণ (BDT):' : 'Payment Amount (BDT):'}
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {isBn ? 'সীমা: ৳ ৫০ - ৳ ১,০০,০০০' : 'Limit: ৳ 50 - ৳ 1,00,000'}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-slate-400">৳</span>
                <input
                  type="number"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="1500"
                  className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-base text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Wallet Balance Health Check */}
            <div className="flex items-center justify-between text-xs px-1 text-slate-500">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                <span>{isBn ? 'ওয়ালেট ব্যালেন্স:' : 'Wallet Balance:'}</span>
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatTaka(customerBalance, isBn)}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetState}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleProceedToDateOrPin}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
              >
                <span>{isBn ? 'তারিখ ও অপশন' : 'Next: Payment Date'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Date & Schedule Options */}
        {step === 2 && (
          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isBn ? 'পেমেন্ট সম্পন্ন করার সময় নির্বাচন করুন' : 'Choose Payment Schedule'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? 'আপনি কি এখনই পেমেন্ট করবেন নাকি নির্ধারিত কোনো তারিখে শিডিউল করে রাখতে চান?'
                  : 'Pay instantly now or schedule for a future date before the deadline.'}
              </p>
            </div>

            <div className="space-y-3">
              {/* Option A: Pay Now */}
              <div
                onClick={() => handleConfirmDateDecision(false)}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50 dark:bg-slate-950 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {isBn ? 'এখনই পে করুন (Pay Now)' : 'Pay Instantly Now'}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        {isBn ? 'তাৎক্ষণিক ডিজিটাল ক্লিয়ারেন্স ও ভাউচার পাবেন' : 'Immediate utility clearing & digital receipt'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition" />
                </div>
              </div>

              {/* Option B: Schedule Payment */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {isBn ? 'পেমেন্ট শিডিউল করুন (Schedule)' : 'Schedule Payment'}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {isBn ? 'এআই ওই তারিখে আপনাকে কনফার্মেশনের জন্য মনে করিয়ে দিবে' : 'AI will remind & request 1-tap approval on due date'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2">
                  <select
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value={bill.dueDate}>{isBn ? `শেষ তারিখে (${bill.dueDate})` : `On Due Date (${bill.dueDate})`}</option>
                    <option value="08 Oct 2026">08 Oct 2026</option>
                    <option value="10 Oct 2026">10 Oct 2026</option>
                    <option value="15 Oct 2026">15 Oct 2026</option>
                    <option value="20 Oct 2026">20 Oct 2026</option>
                  </select>
                  <button
                    onClick={() => handleConfirmDateDecision(true)}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs cursor-pointer transition active:scale-[0.98]"
                  >
                    {isBn ? 'শিডিউল সেট' : 'Schedule'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              {isBn ? 'ফিরে যান' : 'Back to Details'}
            </button>
          </div>
        )}

        {/* STEP 3: Security PIN Confirmation & MFS Hold-to-Confirm */}
        {step === 3 && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-11 h-11 rounded-2xl bg-amber-400/20 text-slate-950 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isBn ? 'পেমেন্ট অনুমোদন ও পিন যাচাই' : 'Payment Authorization & PIN Verification'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {isBn
                  ? 'এআই পরামর্শ অনুযায়ী বিল পর্যালোচনা করে আপনার গোপন পিন দিন'
                  : 'Review bill details based on AI analysis and enter your PIN'}
              </p>
            </div>

            {/* MFS Breakdown Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'বিলিং প্রতিষ্ঠান:' : 'Provider:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{bill.providerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'হিসাব নম্বর:' : 'Account / Meter:'}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{bill.accountNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'কার্যকর সময়:' : 'Payment Timing:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isScheduling
                    ? isBn
                      ? `শিডিউল: ${scheduleDate}`
                      : `Scheduled: ${scheduleDate}`
                    : isBn
                    ? 'তাৎক্ষণিক (Pay Now)'
                    : 'Instant (Pay Now)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'সার্ভিস ফি:' : 'Processing Fee:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳ ০ (ফ্রি)</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-slate-800 text-sm font-bold">
                <span className="text-slate-900 dark:text-white">{isBn ? 'মোট প্রদেয়:' : 'Total Payable:'}</span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                  {formatTaka(amount, isBn)}
                </span>
              </div>
              {!isScheduling && (
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span>{isBn ? 'পেমেন্টের পর সম্ভাব্য ব্যালেন্স:' : 'New Balance After Payment:'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatTaka(Math.max(0, customerBalance - amount), isBn)}
                  </span>
                </div>
              )}
            </div>

            {/* PIN Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block text-center">
                {isBn ? 'আপনার ৪ ডিজিটের গোপন পিন দিন:' : 'Enter 4-Digit Secret PIN:'}
              </label>
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-[1em] font-mono text-2xl py-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-400 text-slate-900 dark:text-white shadow-xs"
              />
              <span className="text-[10px] text-slate-400 block text-center">
                {isBn ? 'সিমুলেশন টেস্ট পিন: ১২৩৪' : 'Simulation Demo PIN: 1234'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Signature MFS Tap and Hold Confirmation */}
            <div className="pt-1">
              <MfsHoldToConfirmButton
                language={language}
                actionType={isScheduling ? 'schedule' : 'pay'}
                amount={amount}
                disabled={pin.length !== 4}
                onConfirm={handleConfirmAction}
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              {isBn ? 'ফিরে যান' : 'Back'}
            </button>
          </div>
        )}

        {/* STEP 4: Processing State */}
        {step === 4 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isScheduling
                  ? (isBn ? 'বিল শিডিউল সংরক্ষিত হচ্ছে...' : 'Saving Bill Schedule...')
                  : (isBn ? 'পেমেন্ট প্রক্রিয়াকরণ চলছে...' : 'Processing Bill Payment...')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isBn ? 'উপায় ও ইউটিলিটি বোর্ডের সার্ভারের সাথে সুরক্ষিত ক্লিয়ারিং' : 'Secure clearing with utility gateway ledger'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: Success & Digital Clearance Receipt */}
        {step === 5 && (
          <div className="p-6 space-y-5 animate-scale-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isScheduling
                  ? (isBn ? 'বিল পেমেন্ট শিডিউল সফল হয়েছে!' : 'Bill Schedule Successful!')
                  : (isBn ? 'বিল পরিশোধ সফল হয়েছে!' : 'Payment Successful!')}
              </h4>
              <p className="text-xs text-slate-500">
                {isScheduling
                  ? (isBn ? `আমরা ${scheduleDate} তারিখে আপনাকে পেমেন্ট সম্পন্ন করতে মনে করিয়ে দিব।` : `AI scheduled reminder saved for ${scheduleDate}.`)
                  : (isBn ? 'আপনার ইউটিলিটি একাউন্ট আপডেট হয়েছে এবং রিসিট সংরক্ষিত হয়েছে।' : 'Digital utility clearance voucher generated.')}
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500">{isBn ? 'ট্রানজ্যাকশন আইডি:' : 'Reference / TrxID:'}</span>
                <button
                  onClick={handleCopyTrx}
                  className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
                >
                  <span>{trxId}</span>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'প্রতিষ্ঠান:' : 'Provider:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{bill.providerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'গ্রাহক নম্বর:' : 'Account Number:'}</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{bill.accountNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'পরিমাণ:' : 'Amount:'}</span>
                <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                  {formatTaka(amount, isBn)}
                </span>
              </div>
              {!isScheduling && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{isBn ? 'অবশিষ্ট ব্যালেন্স:' : 'Remaining Balance:'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatTaka(customerBalance, isBn)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">{isBn ? 'স্ট্যাটাস:' : 'Status:'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                  {isScheduling ? (isBn ? 'শিডিউলড' : 'Scheduled') : (isBn ? 'পরিশোধিত' : 'Cleared')}
                </span>
              </div>
            </div>

            <button
              onClick={resetState}
              className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm cursor-pointer transition active:scale-[0.98]"
            >
              {isBn ? 'সম্পন্ন হয়েছে (বন্ধ করুন)' : 'Done & Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
