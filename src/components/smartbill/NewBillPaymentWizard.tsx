import React, { useState, useMemo } from 'react';
import {
  Zap,
  Wifi,
  Flame,
  Droplets,
  Smartphone,
  GraduationCap,
  Tv,
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wallet,
  Lock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Check,
  Copy,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SmartBillCategoryGroup,
  SmartBillCategory,
  SmartBillProvider,
} from '../../types/smartBill';
import { Language } from '../../types';
import { formatTaka } from '../../utils/algorithms';
import { useSmartBill } from '../../context/SmartBillContext';
import { useWallet } from '../../context/WalletContext';
import { MfsHoldToConfirmButton } from './MfsHoldToConfirmButton';
import { AiHumanGovernanceCard } from './AiHumanGovernanceCard';

interface NewBillPaymentWizardProps {
  language: Language;
  onComplete?: () => void;
  onOpenAddMoney?: () => void;
}

export const NewBillPaymentWizard: React.FC<NewBillPaymentWizardProps> = ({
  language,
  onComplete,
  onOpenAddMoney,
}) => {
  const isBn = language === 'bn';
  const { providers, categoryGroups, executeNewBillPayment } = useSmartBill();
  const { customerBalance } = useWallet();

  // Multi-step Wizard State:
  // Step 1: Category Selection
  // Step 2: Provider Selection
  // Step 3: Bill Information & Server Lookup
  // Step 4: Amount, Date & Schedule Selection
  // Step 5: Review & Security PIN Confirmation
  // Step 6: Success & Digital Clearance Receipt
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Selections
  const [selectedGroup, setSelectedGroup] = useState<SmartBillCategoryGroup>('utility');
  const [selectedProvider, setSelectedProvider] = useState<SmartBillProvider | null>(null);
  const [providerSearch, setProviderSearch] = useState<string>('');

  // Form inputs
  const [formInputs, setFormInputs] = useState<{ [key: string]: string }>({});
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [consumerName, setConsumerName] = useState<string>('Tanvir Hasan');

  // Amount & Schedule
  const [amount, setAmount] = useState<number>(1000);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduleDate, setScheduleDate] = useState<string>('10 Oct 2026');

  // Security & Submission
  const [pin, setPin] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successTrxId, setSuccessTrxId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Filtered Providers based on selected group & search
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (p.categoryGroup !== selectedGroup) return false;
      if (providerSearch.trim()) {
        const q = providerSearch.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(q) || p.nameBn.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchCat) return false;
      }
      return true;
    });
  }, [providers, selectedGroup, providerSearch]);

  const handleSelectGroup = (groupId: SmartBillCategoryGroup) => {
    setSelectedGroup(groupId);
    setSelectedProvider(null);
    setProviderSearch('');
    setStep(2);
  };

  const handleSelectProvider = (provider: SmartBillProvider) => {
    setSelectedProvider(provider);
    setAmount(provider.sampleBillAmount);
    setConsumerName(provider.sampleCustomerName);

    // Prefill sample inputs for realistic testing convenience
    const initialInputs: { [key: string]: string } = {};
    provider.requiredFields.forEach((field) => {
      if (field.key === 'customerNumber' || field.key === 'accountNumber') {
        initialInputs[field.key] = provider.sampleAccountNumber;
      } else if (field.key === 'meterNumber') {
        initialInputs[field.key] = 'NS-884190';
      } else if (field.key === 'mobileNumber' || field.key === 'contactPhone' || field.key === 'accountPhone') {
        initialInputs[field.key] = '01712-445566';
      } else if (field.key === 'billingMonth') {
        initialInputs[field.key] = 'October 2026';
      } else if (field.key === 'studentId') {
        initialInputs[field.key] = 'DZS-2026-8812';
      } else {
        initialInputs[field.key] = '';
      }
    });

    setFormInputs(initialInputs);
    setIsFetched(false);
    setStep(3);
  };

  // Simulate server lookup / bill fetch
  const handleFetchBill = () => {
    // Check required fields
    if (!selectedProvider) return;
    for (const f of selectedProvider.requiredFields) {
      if (f.required && !formInputs[f.key]) {
        setErrorMsg(isBn ? `অনুগ্রহ করে '${f.labelBn}' পূরণ করুন।` : `Please enter '${f.labelEn}'.`);
        return;
      }
    }

    setErrorMsg('');
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setIsFetched(true);
      setAmount(selectedProvider.sampleBillAmount);
    }, 800);
  };

  const handleProceedToAmountAndDate = () => {
    if (!isFetched) {
      handleFetchBill();
      return;
    }
    setErrorMsg('');
    setStep(4);
  };

  const handleProceedToReview = () => {
    if (amount <= 0) {
      setErrorMsg(isBn ? 'সঠিক টাকার পরিমাণ লিখুন।' : 'Please enter a valid amount.');
      return;
    }
    if (selectedProvider && amount < selectedProvider.minAmount) {
      setErrorMsg(
        isBn
          ? `ন্যূনতম প্রদেয় পরিমাণ ৳ ${selectedProvider.minAmount}।`
          : `Minimum amount for this provider is ৳ ${selectedProvider.minAmount}.`
      );
      return;
    }
    if (selectedProvider && amount > selectedProvider.maxAmount) {
      setErrorMsg(
        isBn
          ? `সর্বোচ্চ প্রদেয় পরিমাণ ৳ ${selectedProvider.maxAmount}।`
          : `Maximum amount for this provider is ৳ ${selectedProvider.maxAmount}.`
      );
      return;
    }

    // Check balance if immediate payment
    if (!isScheduled && customerBalance < amount) {
      setErrorMsg(
        isBn
          ? `অপর্যাপ্ত ব্যালেন্স। আপনার বর্তমান ব্যালেন্স ৳ ${customerBalance.toLocaleString('en-IN')}, প্রদেয় ৳ ${amount.toLocaleString('en-IN')}। টাকা যোগ করুন।`
          : `Insufficient balance. Current balance is ৳ ${customerBalance.toLocaleString('en-IN')}, required ৳ ${amount.toLocaleString('en-IN')}. Please add money.`
      );
      return;
    }

    setErrorMsg('');
    setStep(5);
  };

  const handleFinalSubmit = async () => {
    if (pin.length !== 4) {
      setErrorMsg(isBn ? 'অনুগ্রহ করে ৪ ডিজিটের গোপন পিন দিন।' : 'Please enter 4-digit PIN.');
      return;
    }
    if (pin !== '1234') {
      setErrorMsg(isBn ? 'ভুল পিন! (টেস্টিং পিন: ১২৩৪)' : 'Incorrect PIN! (Testing PIN: 1234)');
      return;
    }

    if (!selectedProvider) return;

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const primaryAccNumber =
        formInputs['customerNumber'] ||
        formInputs['accountNumber'] ||
        formInputs['smsAccountNumber'] ||
        formInputs['subscriberId'] ||
        formInputs['mobileNumber'] ||
        formInputs['studentId'] ||
        'ACC-2026-99';

      const res = await executeNewBillPayment({
        providerId: selectedProvider.id,
        accountNumber: primaryAccNumber,
        meterNumber: formInputs['meterNumber'],
        contactPhone: formInputs['contactPhone'] || formInputs['mobileNumber'],
        billingMonth: formInputs['billingMonth'] || 'October 2026',
        amount,
        pin,
        isScheduled,
        scheduledDate: isScheduled ? scheduleDate : undefined,
      });

      setIsSubmitting(false);

      if (res.success && res.trxId) {
        setSuccessTrxId(res.trxId);
        setStep(6);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        setErrorMsg(res.error || (isBn ? 'পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে।' : 'Payment failed.'));
      }
    } catch (e: any) {
      setIsSubmitting(false);
      setErrorMsg(e?.message || (isBn ? 'লেনদেন ব্যর্থ হয়েছে।' : 'Transaction failed.'));
    }
  };

  const handleResetWizard = () => {
    setStep(1);
    setSelectedGroup('utility');
    setSelectedProvider(null);
    setFormInputs({});
    setIsFetched(false);
    setPin('');
    setErrorMsg('');
    setSuccessTrxId('');
    if (onComplete) onComplete();
  };

  const handleCopyTrx = () => {
    if (successTrxId) {
      navigator.clipboard.writeText(successTrxId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getProviderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Wifi':
        return <Wifi className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Tv className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 transition-all">
      {/* Step Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-500" />
              <span>{isBn ? 'নতুন বিল পেমেন্ট ও শিডিউলিং' : 'New Bill Payment & Scheduling'}</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              MFS Flow
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isBn
              ? 'ক্যাটাগরি ও প্রতিষ্ঠান নির্বাচন করে রিয়েল-টাইম তথ্য যাচাই, কাস্টম পরিমাণ ও শিডিউলিং'
              : 'Select category, lookup bill details, enter amount, choose schedule, and confirm with PIN'}
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-6 h-6 rounded-full font-mono text-[11px] font-bold flex items-center justify-center transition-all ${
                step === s
                  ? 'bg-amber-400 text-slate-950 scale-110 shadow-xs'
                  : step > s
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggests, Human Acts Banner */}
      <AiHumanGovernanceCard language={language} compact={true} />

      {/* ============================================================= */}
      {/* STEP 1: CATEGORY SELECTION */}
      {/* ============================================================= */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'ধাপ ১: বিলের ক্যাটাগরি নির্বাচন করুন' : 'Step 1: Select Bill Category'}
            </h4>
            <p className="text-xs text-slate-500">
              {isBn ? 'আপনি কোন ধরনের ইউটিলিটি বা সেবার বিল পরিশোধ করতে চান?' : 'Choose the category of payment to proceed.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
            {categoryGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleSelectGroup(group.id)}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50 dark:bg-slate-950 hover:bg-amber-50/20 dark:hover:bg-amber-400/5 transition cursor-pointer group space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-slate-950 dark:text-amber-400 flex items-center justify-center font-bold">
                      {getProviderIcon(group.iconName)}
                    </div>
                    {group.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        {group.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {isBn ? group.titleBn : group.titleEn}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {isBn ? group.descriptionBn : group.descriptionEn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 gap-1 pt-2">
                  <span>{isBn ? 'প্রতিষ্ঠান দেখুন' : 'Select Provider'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* STEP 2: PROVIDER SELECTION */}
      {/* ============================================================= */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ২: সেবা প্রদানকারী প্রতিষ্ঠান নির্বাচন করুন' : 'Step 2: Select Provider'}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isBn ? 'আপনার নির্বাচিত ক্যাটাগরির অন্তর্ভুক্ত প্রতিষ্ঠানসমূহ:' : 'Providers available for this category:'}
              </p>
            </div>

            {/* Provider Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={isBn ? 'প্রতিষ্ঠানের নাম দিয়ে খুঁজুন...' : 'Search provider...'}
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {filteredProviders.map((prov) => (
              <div
                key={prov.id}
                onClick={() => handleSelectProvider(prov)}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-400 bg-slate-50 dark:bg-slate-950 transition cursor-pointer group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 ${prov.color}`}>
                    {getProviderIcon(prov.iconName)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {isBn ? prov.nameBn : prov.name}
                    </h5>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {prov.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {prov.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {prov.badge}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* STEP 3: PROVIDER INFORMATION & SERVER LOOKUP */}
      {/* ============================================================= */}
      {step === 3 && selectedProvider && (
        <div className="space-y-5 animate-fade-in max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(2)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ৩: বিলের তথ্য প্রদান ও যাচাই' : 'Step 3: Enter Bill Information'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isBn ? selectedProvider.nameBn : selectedProvider.name}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/30">
              {selectedProvider.name}
            </span>
          </div>

          {/* Form Fields */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4">
            {selectedProvider.requiredFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    {isBn ? field.labelBn : field.labelEn}
                    {field.required && <span className="text-rose-500 ml-1">*</span>}
                  </label>
                  {field.helpTextBn && (
                    <span className="text-[11px] text-slate-400">
                      {isBn ? field.helpTextBn : field.helpTextEn}
                    </span>
                  )}
                </div>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formInputs[field.key] || ''}
                  onChange={(e) =>
                    setFormInputs((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            ))}

            {/* Bill Lookup Simulation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFetchBill}
                disabled={isFetching}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isFetching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white dark:border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>{isBn ? 'সার্ভার থেকে বিল অনুসন্ধান চলছে...' : 'Fetching bill from utility server...'}</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>{isBn ? 'বিল অনুসন্ধান করুন (Fetch Bill Details)' : 'Fetch & Verify Bill Details'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Verified Server Response Card */}
          {isFetched && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-300/60 dark:border-emerald-500/20 space-y-2.5 animate-scale-in text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isBn ? 'বিল তথ্য সফলভাবে যাচাইকৃত' : 'Bill Details Successfully Verified'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-500 block">{isBn ? 'গ্রাহকের নাম:' : 'Consumer Name:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{consumerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{isBn ? 'বিলের মাস:' : 'Billing Month:'}</span>
                  <span className="font-bold">October 2026</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{isBn ? 'বকেয়া বিলের পরিমাণ:' : 'Outstanding Amount:'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatTaka(amount, isBn)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">{isBn ? 'সার্ভিস চার্জ:' : 'Platform Fee:'}</span>
                  <span className="font-bold text-emerald-600">৳ ০ (ফ্রি)</span>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              {isBn ? 'ফিরে যান' : 'Back'}
            </button>
            <button
              onClick={handleProceedToAmountAndDate}
              className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
            >
              <span>{isBn ? 'পরবর্তী: পরিমাণ ও তারিখ' : 'Next: Amount & Schedule'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* STEP 4: AMOUNT, DATE & SCHEDULE SELECTION */}
      {/* ============================================================= */}
      {step === 4 && selectedProvider && (
        <div className="space-y-5 animate-fade-in max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(3)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isBn ? 'ধাপ ৪: প্রদেয় পরিমাণ ও পেমেন্ট শিডিউল' : 'Step 4: Payment Amount & Schedule'}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedProvider.name} • {consumerName}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                {isBn ? 'প্রদেয় টাকার পরিমাণ (BDT):' : 'Payment Amount (BDT):'}
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {isBn
                  ? `সীমা: ৳ ${selectedProvider.minAmount} - ৳ ${selectedProvider.maxAmount.toLocaleString('en-IN')}`
                  : `Range: ৳ ${selectedProvider.minAmount} - ৳ ${selectedProvider.maxAmount.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">৳</span>
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono font-bold text-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              {isBn
                ? 'বিলের নির্ধারিত পরিমাণের বাইরে কোনো আংশিক পেমেন্ট করতে চাইলে পরিমাণ এডিট করতে পারেন।'
                : 'You may modify the amount if partial/advance payment is allowed by provider.'}
            </p>
          </div>

          {/* Pay Now vs Schedule Choice */}
          <div className="space-y-3">
            <label className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
              {isBn ? 'পেমেন্ট সম্পন্ন করার ধরন:' : 'Select Payment Timing:'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Pay Now */}
              <div
                onClick={() => setIsScheduled(false)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                  !isScheduled
                    ? 'bg-amber-400/10 border-amber-400 dark:border-amber-400/60 ring-2 ring-amber-400/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>{isBn ? 'এখনই পে করুন (Pay Now)' : 'Pay Instantly Now'}</span>
                  </div>
                  {!isScheduled && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 font-bold" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'তাৎক্ষণিক ওয়ালেট থেকে নিষ্পত্তি ও ডিজিটাল ভাউচার' : 'Immediate clearance from wallet balance'}
                </p>
              </div>

              {/* Option B: Schedule Payment */}
              <div
                onClick={() => setIsScheduled(true)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                  isScheduled
                    ? 'bg-sky-500/10 border-sky-400 dark:border-sky-400/60 ring-2 ring-sky-400/20'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <span>{isBn ? 'পেমেন্ট শিডিউল (Schedule)' : 'Schedule Payment'}</span>
                  </div>
                  {isScheduled && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 font-bold" />}
                </div>
                <p className="text-[11px] text-slate-500">
                  {isBn ? 'ভবিষ্যতের নির্ধারিত তারিখে এআই অনুমোদন চাইবে' : 'Queued for future date with 1-tap approval'}
                </p>
              </div>
            </div>

            {/* Date Picker if Scheduled */}
            {isScheduled && (
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 space-y-2 animate-scale-in">
                <span className="text-xs font-bold text-sky-900 dark:text-sky-300 block">
                  {isBn ? 'শিডিউল তারিখ নির্বাচন করুন:' : 'Select Target Schedule Date:'}
                </span>
                <select
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-500/30 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="05 Oct 2026">05 October 2026</option>
                  <option value="10 Oct 2026">10 October 2026</option>
                  <option value="15 Oct 2026">15 October 2026</option>
                  <option value="20 Oct 2026">20 October 2026</option>
                  <option value="25 Oct 2026">25 October 2026</option>
                </select>
                <p className="text-[10px] text-sky-700 dark:text-sky-300">
                  🛡️ {isBn ? 'রেসপন্সিবল এআই নিশ্চয়তা: ওই তারিখে আপনার অনুমতি ও পিন ছাড়া কোনো টাকা কাটা হবে না।' : 'Responsible AI: No autonomous deductions. Your PIN confirmation is strictly required.'}
                </p>
              </div>
            )}
          </div>

          {/* Balance Health Preview */}
          <div className="flex items-center justify-between text-xs px-2 text-slate-500">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>{isBn ? 'আপনার বর্তমান ওয়ালেট ব্যালেন্স:' : 'Current Wallet Balance:'}</span>
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
              onClick={() => setStep(3)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              {isBn ? 'ফিরে যান' : 'Back'}
            </button>
            <button
              onClick={handleProceedToReview}
              className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-[0.98]"
            >
              <span>{isBn ? 'পরবর্তী: রিভিউ ও পিন' : 'Next: Review & PIN'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* STEP 5: REVIEW & SECURITY PIN CONFIRMATION */}
      {/* ============================================================= */}
      {step === 5 && selectedProvider && (
        <div className="space-y-5 animate-fade-in max-w-md mx-auto">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-slate-950 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'পেমেন্ট রিভিউ ও ৪ ডিজিটের পিন' : 'Payment Review & Security PIN'}
            </h4>
            <p className="text-xs text-slate-500">
              {isScheduled
                ? (isBn ? `শিডিউল তারিখ: ${scheduleDate}` : `Schedule Date: ${scheduleDate}`)
                : (isBn ? 'তাৎক্ষণিক ওয়ালেট ক্লিয়ারিং' : 'Immediate Wallet Clearance')}
            </p>
          </div>

          {/* Payment Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'প্রতিষ্ঠান:' : 'Provider:'}</span>
              <span className="font-bold text-slate-900 dark:text-white">{selectedProvider.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'গ্রাহকের নাম:' : 'Consumer:'}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{consumerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'হিসাব নম্বর:' : 'Account Reference:'}</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {formInputs['customerNumber'] || formInputs['accountNumber'] || formInputs['mobileNumber'] || 'ACC-2026-99'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'সার্ভিস ফি:' : 'Processing Fee:'}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">৳ ০ (ফ্রি)</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-sm">
              <span className="font-bold text-slate-900 dark:text-white">{isBn ? 'মোট প্রদেয়:' : 'Total Amount:'}</span>
              <span className="font-mono font-black text-base text-amber-600 dark:text-amber-400">
                {formatTaka(amount, isBn)}
              </span>
            </div>
            {!isScheduled && (
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>{isBn ? 'পেমেন্টের পর অবশিষ্ট ব্যালেন্স:' : 'Remaining Balance After Payment:'}</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatTaka(Math.max(0, customerBalance - amount), isBn)}
                </span>
              </div>
            )}
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block text-center">
              {isBn ? 'আপনার ৪ ডিজিটের পিন নম্বর প্রদান করুন:' : 'Enter 4-Digit Secret PIN:'}
            </label>
            <input
              type="password"
              maxLength={4}
              autoFocus
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full text-center tracking-[1em] font-mono text-2xl py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-amber-400 text-slate-900 dark:text-white shadow-xs"
            />
            <span className="text-[10px] text-slate-400 block text-center">
              {isBn ? 'সিমুলেশন টেস্টিং পিন: ১২৩৪' : 'Simulation Demo PIN: 1234'}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* MFS Tap and Hold Confirmation Button */}
          <div className="pt-1">
            <MfsHoldToConfirmButton
              language={language}
              actionType={isScheduled ? 'schedule' : 'pay'}
              amount={amount}
              disabled={pin.length !== 4 || isSubmitting}
              isProcessing={isSubmitting}
              onConfirm={handleFinalSubmit}
            />
          </div>

          <div className="pt-1">
            <button
              onClick={() => setStep(4)}
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              {isBn ? 'ফিরে যান' : 'Back to Edit Details'}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* STEP 6: SUCCESS & DIGITAL CLEARANCE RECEIPT */}
      {/* ============================================================= */}
      {step === 6 && selectedProvider && (
        <div className="p-6 space-y-5 animate-scale-in max-w-md mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">
              {isScheduled
                ? (isBn ? 'বিল পেমেন্ট শিডিউলিং সফল!' : 'Payment Scheduled Successfully!')
                : (isBn ? 'বিল পরিশোধ সফল হয়েছে!' : 'Bill Payment Successful!')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isScheduled
                ? (isBn ? `আমরা ${scheduleDate} তারিখে আপনাকে পেমেন্ট সম্পন্ন করতে মনে করিয়ে দিব।` : `AI scheduled reminder saved for ${scheduleDate}.`)
                : (isBn ? 'ইউটিলিটি সার্ভারে ক্লিয়ারেন্স সম্পন্ন হয়েছে এবং অফিসিয়াল রিসিট তৈরি হয়েছে।' : 'Digital utility clearance voucher generated.')}
            </p>
          </div>

          {/* Receipt Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500">{isBn ? 'ট্রানজ্যাকশন আইডি:' : 'Reference / TrxID:'}</span>
              <button
                onClick={handleCopyTrx}
                className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
              >
                <span>{successTrxId}</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'প্রতিষ্ঠান:' : 'Provider:'}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedProvider.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'গ্রাহকের নাম:' : 'Consumer Name:'}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{consumerName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{isBn ? 'পরিমাণ:' : 'Amount:'}</span>
              <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                {formatTaka(amount, isBn)}
              </span>
            </div>
            {!isScheduled && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">{isBn ? 'অবশিষ্ট ব্যালেন্স:' : 'New Wallet Balance:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatTaka(customerBalance, isBn)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500">{isBn ? 'স্ট্যাটাস:' : 'Status:'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                {isScheduled ? (isBn ? 'শিডিউলড' : 'Scheduled') : (isBn ? 'পরিশোধিত' : 'Cleared')}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleResetWizard}
              className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm cursor-pointer transition active:scale-[0.98]"
            >
              {isBn ? 'সম্পন্ন হয়েছে (হোমে যান)' : 'Done & Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
