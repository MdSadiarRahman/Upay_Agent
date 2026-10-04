import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  Send,
  ArrowDownLeft,
  PlusCircle,
  ShoppingBag,
  Smartphone,
  Zap,
  Flame,
  Wifi,
  Droplets,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Download,
  Share2,
  Store,
  Wallet,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Merchant, Agent } from '../../types';
import { WalletTransaction, TransactionType } from '../../types/wallet';
import { QUICK_CONTACTS, MOBILE_OPERATORS, BILL_PROVIDERS } from '../../data/walletData';
import { useWallet } from '../../context/WalletContext';
import { formatTaka } from '../../utils/algorithms';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: TransactionType;
  language: Language;
  merchants?: Merchant[];
  agents?: Agent[];
  initialTarget?: string;
  initialAmount?: number;
  onTransactionComplete?: (tx: WalletTransaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  language,
  merchants = [],
  agents = [],
  initialTarget = '',
  initialAmount = 500,
  onTransactionComplete,
}) => {
  const isBn = language === 'bn';
  const {
    customerBalance,
    sendMoney,
    cashOut,
    addMoney,
    merchantPay,
    mobileRecharge,
    billPay,
  } = useWallet();

  // Wizard Step: 1 = Input, 2 = Confirmation & PIN, 3 = Result / Receipt
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Common inputs
  const [amount, setAmount] = useState<number>(initialAmount);
  const [pin, setPin] = useState<string>('1234');
  const [isPinVisible, setIsPinVisible] = useState<boolean>(false);
  const [reference, setReference] = useState<string>('');

  // Service-specific inputs
  // Send Money
  const [receiverPhone, setReceiverPhone] = useState<string>(initialTarget || '01812-987654');
  const [receiverName, setReceiverName] = useState<string>('Rokeya Begum (Mother)');

  // Cash Out
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'sadar-14');

  // Add Money
  const [addMoneyMethod, setAddMoneyMethod] = useState<'brac_bank' | 'city_bank' | 'visa_card' | 'mastercard' | 'agent_cashin'>('brac_bank');

  // Merchant Pay
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>(merchants[0]?.id || 'merch-01');

  // Mobile Recharge
  const [rechargePhone, setRechargePhone] = useState<string>(initialTarget || '01711-234567');
  const [selectedOperator, setSelectedOperator] = useState<string>('gp');
  const [connectionType, setConnectionType] = useState<'Prepaid' | 'Postpaid'>('Prepaid');

  // Bill Pay
  const [billCategory, setBillCategory] = useState<'electricity' | 'gas' | 'internet' | 'water'>('electricity');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('nesco');
  const [accountNumber, setAccountNumber] = useState<string>('25410984321');

  // Execution & feedback state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedTx, setCompletedTx] = useState<WalletTransaction | null>(null);
  const [copiedTrxId, setCopiedTrxId] = useState<boolean>(false);
  const [downloadedReceipt, setDownloadedReceipt] = useState<boolean>(false);

  // Auto-detect operator on phone change
  useEffect(() => {
    if (rechargePhone.length >= 3) {
      const prefix = rechargePhone.substring(0, 3);
      if (prefix === '017' || prefix === '013') setSelectedOperator('gp');
      else if (prefix === '018') setSelectedOperator('robi');
      else if (prefix === '019' || prefix === '014') setSelectedOperator('banglalink');
      else if (prefix === '016') setSelectedOperator('airtel');
      else if (prefix === '015') setSelectedOperator('teletalk');
    }
  }, [rechargePhone]);

  if (!isOpen) return null;

  // Selected entities helper
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0] || {
    id: 'sadar-14',
    name: 'Agent Dinajpur Sadar-14 (Shahid Telecom)',
    nameBn: 'এজেন্ট দিনাজপুর সদর-১৪ (শহিদ টেলিকম)',
    locationName: 'Goneshtola Mor, Sadar Bazar',
    locationNameBn: 'গণেশতলা মোড়, সদর বাজার',
  };

  const currentMerchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0] || {
    id: 'merch-01',
    name: 'Rahman Pharmacy',
    nameBn: 'রহমান ফার্মেসি',
    category: 'pharmacy',
    location: 'Hospital Mor, Dinajpur Sadar',
  };

  const currentProvider = BILL_PROVIDERS.find((p) => p.id === selectedProviderId) || BILL_PROVIDERS[0];

  // Fee calculation
  const getFee = (): number => {
    if (serviceType === 'cash_out') {
      return Math.round(amount * 0.014); // 1.4% standard fee
    }
    if (serviceType === 'send_money') {
      return amount > 500 ? 5 : 0;
    }
    return 0; // free for merchant pay, recharge, add money, bill pay
  };

  const currentFee = getFee();
  const totalCharge = serviceType === 'add_money' ? amount : amount + currentFee;
  const balanceAfter = serviceType === 'add_money' ? customerBalance + amount : customerBalance - totalCharge;

  // Quick amount selections
  const quickAmounts = serviceType === 'recharge' ? [20, 50, 100, 199, 498] : [100, 500, 1000, 2000, 5000];

  // Handle step 1 submission
  const handleProceedToConfirmation = () => {
    setErrorMsg(null);
    if (!amount || amount <= 0) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }

    if (serviceType !== 'add_money' && customerBalance < totalCharge) {
      setErrorMsg(
        isBn
          ? `পর্যাপ্ত ব্যালেন্স নেই। মোট খরচ ৳ ${totalCharge.toLocaleString()}, আপনার বর্তমান ওয়ালেট ব্যালেন্স ৳ ${customerBalance.toLocaleString()}`
          : `Transaction failed. Insufficient funds. Required: ৳ ${totalCharge.toLocaleString()}, Available: ৳ ${customerBalance.toLocaleString()}`
      );
      return;
    }

    if (serviceType === 'send_money' && (!receiverPhone || receiverPhone.trim().length < 5)) {
      setErrorMsg(isBn ? 'সঠিক প্রাপক নম্বর প্রদান করুন।' : 'Please enter a valid recipient number.');
      return;
    }

    if (serviceType === 'recharge' && (!rechargePhone || rechargePhone.trim().length < 11)) {
      setErrorMsg(isBn ? 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।' : 'Please enter a valid 11-digit mobile number.');
      return;
    }

    if (serviceType === 'bill_pay' && (!accountNumber || accountNumber.trim().length < 4)) {
      setErrorMsg(isBn ? 'সঠিক বিল বা মিটার অ্যাকাউন্ট নম্বর প্রদান করুন।' : 'Please enter a valid billing account number.');
      return;
    }

    setStep(2);
  };

  // Execute transaction on Step 2
  const handleConfirmTransaction = async () => {
    setErrorMsg(null);
    if (!pin || pin.length < 4) {
      setErrorMsg(isBn ? '৪ ডিজিটের গোপন পিন নম্বর প্রদান করুন।' : 'Please enter your 4-digit PIN.');
      return;
    }

    setIsProcessing(true);

    try {
      let result: { success: boolean; transaction?: WalletTransaction; error?: string };

      if (serviceType === 'send_money') {
        result = await sendMoney({
          receiverPhone,
          receiverName,
          amount,
          pin,
          reference: reference || 'Send Money',
        });
      } else if (serviceType === 'cash_out') {
        result = await cashOut({
          agentId: currentAgent.id,
          agentName: isBn ? currentAgent.nameBn : currentAgent.name,
          amount,
          pin,
          reference: reference || 'Agent Cash Out',
        });
      } else if (serviceType === 'add_money') {
        const methodNames = {
          brac_bank: 'BRAC Bank Internet Banking',
          city_bank: 'Citytouch City Bank',
          visa_card: 'Visa Debit/Credit Card',
          mastercard: 'Mastercard International',
          agent_cashin: 'Agent Cash-In Point',
        };
        result = await addMoney({
          method: methodNames[addMoneyMethod],
          sourceAccount: `Account / Card ending in ${Math.floor(1000 + Math.random() * 9000)}`,
          amount,
          pin,
        });
      } else if (serviceType === 'merchant_pay') {
        result = await merchantPay({
          merchantId: currentMerchant.id,
          merchantName: isBn ? currentMerchant.nameBn : currentMerchant.name,
          amount,
          pin,
          reference: reference || 'Merchant Purchase',
          discountOrCashback: Math.round(amount * 0.03), // 3% instant cashback reward
        });
      } else if (serviceType === 'recharge') {
        const op = MOBILE_OPERATORS.find((o) => o.id === selectedOperator);
        result = await mobileRecharge({
          phone: rechargePhone,
          operator: isBn ? op?.nameBn || 'গ্রামীনফোন' : op?.name || 'Grameenphone',
          connectionType,
          amount,
          pin,
        });
      } else {
        // Bill Pay
        result = await billPay({
          billType: billCategory,
          providerName: isBn ? currentProvider.nameBn : currentProvider.name,
          accountNumber,
          amount,
          pin,
          reference: reference || `Utility Bill ${currentProvider.name}`,
        });
      }

      setIsProcessing(false);

      if (result.success && result.transaction) {
        setCompletedTx(result.transaction);
        setStep(3);

        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#FBBF24', '#3B82F6'],
        });

        if (onTransactionComplete) {
          onTransactionComplete(result.transaction);
        }
      } else {
        setErrorMsg(result.error || (isBn ? 'লেনদেন ব্যর্থ হয়েছে।' : 'Transaction failed. Please try again.'));
      }
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || (isBn ? 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।' : 'An unexpected error occurred.'));
    }
  };

  const handleCopyTrxId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTrxId(true);
    setTimeout(() => setCopiedTrxId(false), 2000);
  };

  const getServiceTitle = () => {
    switch (serviceType) {
      case 'send_money':
        return isBn ? 'টাকা পাঠান (Send Money)' : 'Send Money';
      case 'cash_out':
        return isBn ? 'এজেন্ট ক্যাশ আউট (Cash Out)' : 'Agent Cash Out';
      case 'add_money':
        return isBn ? 'টাকা যোগ করুন (Add Money)' : 'Add Money';
      case 'merchant_pay':
        return isBn ? 'মার্চেন্ট পেমেন্ট (Merchant Pay)' : 'Merchant Payment';
      case 'recharge':
        return isBn ? 'মোবাইল রিচার্জ (Mobile Recharge)' : 'Mobile Recharge';
      case 'bill_pay':
        return isBn ? 'বিল পরিশোধ (Pay Utility Bill)' : 'Pay Utility Bill';
      default:
        return isBn ? 'ফিনটেক সেবা' : 'Financial Service';
    }
  };

  const getServiceIcon = () => {
    switch (serviceType) {
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
        return <Wallet className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-400/30">
              {getServiceIcon()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {getServiceTitle()}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'উপলব্ধ ওয়ালেট ব্যালেন্স:' : 'Available Balance:'}{' '}
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {formatTaka(customerBalance, isBn)}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 pt-3 pb-1 bg-slate-50/40 dark:bg-slate-950/30 flex items-center justify-center gap-2 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 1 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              1
            </span>
            <span>{isBn ? 'তথ্য ও পরিমাণ' : 'Details & Amount'}</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step >= 2 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              2
            </span>
            <span>{isBn ? 'নিশ্চিতকরণ ও পিন' : 'Confirm & PIN'}</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
              3
            </span>
            <span>{isBn ? 'রিসিট' : 'Receipt'}</span>
          </div>
        </div>

        {/* Modal Body with Scroll */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 1: SERVICE SPECIFIC INPUTS */}
          {/* =============================================================== */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              {/* 1. SEND MONEY INPUTS */}
              {serviceType === 'send_money' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'প্রাপকের মোবাইল নম্বর বা অ্যাকাউন্ট:' : 'Recipient Mobile / Account:'}
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Quick Contacts */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                      {isBn ? 'সাম্প্রতিক পরিচিতি:' : 'Recent Contacts:'}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_CONTACTS.map((cnt) => (
                        <button
                          key={cnt.id}
                          type="button"
                          onClick={() => {
                            setReceiverPhone(cnt.phone);
                            setReceiverName(isBn ? cnt.nameBn : cnt.name);
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                            receiverPhone === cnt.phone
                              ? 'bg-amber-400/10 border-amber-400/50 text-slate-900 dark:text-white'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg ${cnt.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
                            {cnt.name[0]}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold block truncate text-[11px]">
                              {isBn ? cnt.nameBn : cnt.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 block truncate">
                              {cnt.phone}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CASH OUT INPUTS */}
              {serviceType === 'cash_out' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      {isBn
                        ? 'ক্যাশ-আউট খরচ ১.৪% (প্রতি হাজারে ১৪ টাকা)। উপায় মার্চেন্ট কিউআরে কেনাকাটা সম্পূর্ণ ফ্রি!'
                        : 'Cash-out fee is 1.4% (৳ 14 per ৳ 1,000). Direct merchant QR payment is 100% free with discounts.'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'নিকটস্থ অনুমোদিত এজেন্ট নির্বাচন করুন:' : 'Select Authorized Agent Point:'}
                    </label>
                    <select
                      value={selectedAgentId}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-400"
                    >
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {isBn ? agent.nameBn : agent.name} — {isBn ? agent.locationNameBn : agent.locationName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 3. ADD MONEY INPUTS */}
              {serviceType === 'add_money' && (
                <div className="space-y-3">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    {isBn ? 'টাকা যোগ করার মাধ্যম নির্বাচন করুন:' : 'Select Add Money Source:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: 'brac_bank', name: 'BRAC Bank', nameBn: 'ব্র্যাক ব্যাংক', sub: 'Internet Banking' },
                      { id: 'city_bank', name: 'City Bank', nameBn: 'সিটি ব্যাংক', sub: 'Citytouch App' },
                      { id: 'visa_card', name: 'Visa Card', nameBn: 'ভিসা কার্ড', sub: 'Debit or Credit' },
                      { id: 'mastercard', name: 'Mastercard', nameBn: 'মাস্টারকার্ড', sub: 'Any Bangladeshi Bank' },
                      { id: 'agent_cashin', name: 'Agent Cash-In', nameBn: 'এজেন্ট ক্যাশ-ইন', sub: 'Free at Counter' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAddMoneyMethod(opt.id as any)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                          addMoneyMethod === opt.id
                            ? 'bg-amber-400/10 border-amber-400 text-slate-900 dark:text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold block text-xs">{isBn ? opt.nameBn : opt.name}</span>
                          <span className="text-[10px] text-slate-400 block">{opt.sub}</span>
                        </div>
                        {addMoneyMethod === opt.id && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. MERCHANT PAYMENT INPUTS */}
              {serviceType === 'merchant_pay' && (
                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      {isBn
                        ? 'উপায় কিউআরে পেমেন্ট করলে কোনো চার্জ নেই এবং ৩% পর্যন্ত তাৎক্ষণিক ক্যাশব্যাক প্রযোজ্য!'
                        : 'No transaction fee on Upay QR merchant payments plus up to 3% instant cashback!'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'মার্চেন্ট প্রতিষ্ঠান নির্বাচন করুন:' : 'Select Merchant Shop / Outlet:'}
                    </label>
                    <div className="space-y-2">
                      {merchants.map((merch) => (
                        <button
                          key={merch.id}
                          type="button"
                          onClick={() => setSelectedMerchantId(merch.id)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                            selectedMerchantId === merch.id
                              ? 'bg-purple-400/10 border-purple-400 text-slate-900 dark:text-white'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Store className="w-4 h-4 text-purple-500" />
                            <div>
                              <span className="font-bold block text-xs">
                                {isBn ? merch.nameBn : merch.name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {merch.location} • {isBn ? merch.categoryBn : merch.category}
                              </span>
                            </div>
                          </div>
                          {selectedMerchantId === merch.id && (
                            <CheckCircle2 className="w-4 h-4 text-purple-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. MOBILE RECHARGE INPUTS */}
              {serviceType === 'recharge' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'মোবাইল নম্বর:' : 'Mobile Number:'}
                    </label>
                    <input
                      type="text"
                      placeholder="01XXXXXXXXX"
                      value={rechargePhone}
                      onChange={(e) => setRechargePhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'অপারেটর নির্বাচন করুন:' : 'Select Mobile Operator:'}
                    </label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {MOBILE_OPERATORS.map((op) => (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => setSelectedOperator(op.id)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                            selectedOperator === op.id
                              ? 'bg-amber-400/15 border-amber-400 text-slate-900 dark:text-white font-bold'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${op.color} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
                            {op.logoInitial}
                          </div>
                          <span className="text-[10px] truncate max-w-full text-center">
                            {isBn ? op.nameBn : op.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'কানেকশন টাইপ:' : 'Connection Type:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Prepaid', 'Postpaid'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setConnectionType(type)}
                          className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            connectionType === type
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {type === 'Prepaid' ? (isBn ? 'প্রিপেইড' : 'Prepaid') : isBn ? 'পোস্টপেইড' : 'Postpaid'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. BILL PAY INPUTS */}
              {serviceType === 'bill_pay' && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'বিলের ধরন নির্বাচন করুন:' : 'Select Bill Type:'}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'electricity', labelBn: 'বিদ্যুৎ', labelEn: 'Electricity', icon: Zap },
                        { id: 'gas', labelBn: 'গ্যাস', labelEn: 'Gas', icon: Flame },
                        { id: 'internet', labelBn: 'ইন্টারনেট', labelEn: 'Internet', icon: Wifi },
                        { id: 'water', labelBn: 'পানি', labelEn: 'Water', icon: Droplets },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setBillCategory(item.id as any);
                              const match = BILL_PROVIDERS.find((p) => p.type === item.id);
                              if (match) setSelectedProviderId(match.id);
                            }}
                            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                              billCategory === item.id
                                ? 'bg-amber-400/15 border-amber-400 text-slate-900 dark:text-white font-bold'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-amber-500" />
                            <span className="text-[11px]">{isBn ? item.labelBn : item.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'বিল প্রতিষ্ঠান / সংস্থা:' : 'Biller / Organization:'}
                    </label>
                    <select
                      value={selectedProviderId}
                      onChange={(e) => setSelectedProviderId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-400"
                    >
                      {BILL_PROVIDERS.filter((p) => p.type === billCategory).map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {isBn ? provider.nameBn : provider.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                      {isBn ? 'গ্রাহক / মিটার / বিল অ্যাকাউন্ট নম্বর:' : 'Customer / Billing Account Number:'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 25410984321"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* AMOUNT INPUT (Common to all) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold">
                    {isBn ? 'পরিমাণ (টাকা):' : 'Amount (৳):'}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {isBn ? 'চার্জ:' : 'Fee:'}{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {currentFee === 0 ? (isBn ? 'ফ্রি' : 'Free') : formatTaka(currentFee, isBn)}
                    </span>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl font-bold text-amber-500">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="10"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-slate-900 dark:text-white font-mono text-xl font-black focus:outline-none focus:border-amber-400"
                    placeholder="0"
                  />
                </div>

                {/* Quick Amount Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                        amount === q
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      +{q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reference / Note (Optional) */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {isBn ? 'রেফারেন্স / নোট (ঐচ্ছিক):' : 'Reference Note (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder={isBn ? 'যেমন: মাসিক খরচ বা পরিবারের উপহার' : 'e.g., Grocery shopping'}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Next Step Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleProceedToConfirmation}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/25 active:scale-[0.99] transition cursor-pointer"
                >
                  <span>{isBn ? 'পরবর্তী ধাপে যান' : 'Continue to Confirmation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 2: CONFIRMATION & SECURITY PIN VERIFICATION */}
          {/* =============================================================== */}
          {step === 2 && (
            <div className="space-y-5 text-xs">
              {/* Financial Breakdown Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {isBn ? 'লেনদেনের ধরন:' : 'Transaction Type:'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {getServiceTitle()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {serviceType === 'send_money'
                      ? (isBn ? 'প্রাপক:' : 'Recipient:')
                      : serviceType === 'cash_out'
                      ? (isBn ? 'এজেন্ট পয়েন্ট:' : 'Agent Point:')
                      : serviceType === 'merchant_pay'
                      ? (isBn ? 'মার্চেন্ট:' : 'Merchant:')
                      : serviceType === 'recharge'
                      ? (isBn ? 'মোবাইল নম্বর:' : 'Mobile Number:')
                      : (isBn ? 'বিলিং সংস্থা:' : 'Biller:')}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">
                    {serviceType === 'send_money' && `${receiverName} (${receiverPhone})`}
                    {serviceType === 'cash_out' && (isBn ? currentAgent.nameBn : currentAgent.name)}
                    {serviceType === 'add_money' && `Source: ${addMoneyMethod.replace('_', ' ').toUpperCase()}`}
                    {serviceType === 'merchant_pay' && (isBn ? currentMerchant.nameBn : currentMerchant.name)}
                    {serviceType === 'recharge' && `${rechargePhone} (${connectionType})`}
                    {serviceType === 'bill_pay' && `${isBn ? currentProvider.nameBn : currentProvider.name} (A/C: ${accountNumber})`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {isBn ? 'মূল পরিমাণ:' : 'Base Amount:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatTaka(amount, isBn)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    {isBn ? 'সার্ভিস চার্জ / ফি:' : 'Service Fee:'}
                  </span>
                  <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
                    {currentFee === 0 ? (isBn ? '০ টাকা (ফ্রি)' : '৳ 0 (Free)') : formatTaka(currentFee, isBn)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-900 dark:text-white font-bold text-sm">
                    {serviceType === 'add_money' ? (isBn ? 'মোট যোগ হবে:' : 'Total To Add:') : isBn ? 'মোট কর্তন হবে:' : 'Total Deducted:'}
                  </span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-base">
                    {formatTaka(totalCharge, isBn)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{isBn ? 'লেনদেন পরবর্তী অবশিষ্ট ব্যালেন্স:' : 'New Balance After Tx:'}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatTaka(balanceAfter, isBn)}
                  </span>
                </div>
              </div>

              {/* PIN Entry Security Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isBn ? 'আপনার ৪-সংখ্যার গোপন পিন লিখুন:' : 'Enter 4-Digit MFS Security PIN:'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPin('1234')}
                    className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
                  >
                    {isBn ? 'ডেমো পিন (১২৩৪)' : 'Demo PIN: 1234'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={isPinVisible ? 'text' : 'password'}
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full tracking-widest text-center text-xl font-mono font-black bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPinVisible(!isPinVisible)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {isPinVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleConfirmTransaction}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/25 active:scale-[0.99] transition cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>{isBn ? 'লেনদেন প্রক্রিয়াজাত হচ্ছে...' : 'Processing Transaction...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isBn ? 'লেনদেন নিশ্চিত করুন' : 'Confirm & Complete Transaction'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  {isBn ? 'তথ্য পরিবর্তন করতে ফিরে যান' : 'Back to Edit Details'}
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 3: TRANSACTION SUCCESS & DIGITAL RECEIPT */}
          {/* =============================================================== */}
          {step === 3 && completedTx && (
            <div className="space-y-5 text-xs animate-fade-in">
              {/* Success Badge */}
              <div className="text-center space-y-2 py-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-scale-up">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    {isBn ? 'লেনদেন সফলভাবে সম্পন্ন হয়েছে!' : 'Transaction Completed Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn ? 'আপনার ডিজিটাল লেনদেন ভাউচার তৈরি হয়েছে' : 'Official digital transaction voucher generated'}
                  </p>
                </div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 font-mono text-emerald-800 dark:text-emerald-300 font-bold">
                  {isBn ? 'নতুন ওয়ালেট ব্যালেন্স:' : 'New Available Balance:'} {formatTaka(customerBalance, isBn)}
                </div>
              </div>

              {/* Digital MFS Receipt Slip */}
              <div className="relative p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      {isBn ? 'ট্রানজ্যাকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                    </span>
                    <span className="font-mono text-base font-black text-slate-900 dark:text-white tracking-wider">
                      {completedTx.id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyTrxId(completedTx.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedTrxId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTrxId ? (isBn ? 'কপি হয়েছে' : 'Copied') : isBn ? 'কপি' : 'Copy'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isBn ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {completedTx.date}, {completedTx.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isBn ? 'সার্ভিস ধরন:' : 'Service Type:'}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {isBn ? completedTx.titleBn : completedTx.titleEn}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isBn ? 'প্রেরক:' : 'Sender:'}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {completedTx.senderName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isBn ? 'প্রাপক:' : 'Recipient:'}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {completedTx.receiverName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isBn ? 'মূল পরিমাণ:' : 'Base Amount:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatTaka(completedTx.amount, isBn)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isBn ? 'ফি / চার্জ:' : 'Charge:'}</span>
                    <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
                      {completedTx.fee === 0 ? (isBn ? 'ফ্রি (৳০)' : 'Free (৳0)') : formatTaka(completedTx.fee, isBn)}
                    </span>
                  </div>
                </div>

                {completedTx.reference && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                    <span className="font-semibold">{isBn ? 'রেফারেন্স:' : 'Reference:'}</span> {completedTx.reference}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadedReceipt(true);
                    setTimeout(() => setDownloadedReceipt(false), 2500);
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    downloadedReceipt
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {downloadedReceipt ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                  <span>{downloadedReceipt ? (isBn ? 'ডাউনলোড হয়েছে!' : 'Downloaded!') : isBn ? 'রিসিট ডাউনলোড' : 'Download Receipt'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setAmount(500);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <span>{isBn ? 'আরেকটি লেনদেন' : 'New Transaction'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-2xl text-xs shadow-md shadow-amber-400/25 transition cursor-pointer"
              >
                {isBn ? 'ড্যাশবোর্ডে ফিরে যান' : 'Back to Dashboard'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
