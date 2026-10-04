import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Tag,
  Clock,
  Zap,
  BarChart3,
  Coffee,
  QrCode,
  CheckCircle2,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Merchant, Offer, Language } from '../types';
import { formatTaka } from '../utils/algorithms';

interface MerchantBoosterProps {
  language: Language;
  merchants: Merchant[];
  onOpenMicroMerchantModal: () => void;
  onAddOfferToMerchant: (merchantId: string, offer: Offer) => void;
}

export const MerchantBooster: React.FC<MerchantBoosterProps> = ({
  language,
  merchants,
  onOpenMicroMerchantModal,
  onAddOfferToMerchant,
}) => {
  const isBn = language === 'bn';
  const [selectedMerchantId, setSelectedMerchantId] = useState<string>('merch-01');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'campaign_builder' | 'demand_forecast' | 'micro_onboarding'>('overview');

  // Campaign Builder States
  const [offerType, setOfferType] = useState<'flat' | 'percentage' | 'cashback' | 'bundle'>('flat');
  const [discountVal, setDiscountVal] = useState<number>(30);
  const [minPurchase, setMinPurchase] = useState<number>(500);
  const [selectedWindow, setSelectedWindow] = useState<string>('5:00 PM – 8:00 PM');
  const [targetGroup, setTargetGroup] = useState<string>('nearby_cashout_seekers');
  const [campaignBudgetCap, setCampaignBudgetCap] = useState<number>(750);
  const [isCampaignPublished, setIsCampaignPublished] = useState<boolean>(false);

  // Micro Merchants Lead List
  const [microLeads, setMicroLeads] = useState([
    {
      id: 'lead-01',
      nameBn: 'করিম টি স্টল ও বেকারি',
      nameEn: 'Karim Tea Stall & Bakery',
      categoryBn: 'চা ও হালকা খাবার',
      categoryEn: 'Tea & Snacks',
      locationBn: 'গণেশতলা মোড়, শহিদ টেলিকমের নিকটে',
      locationEn: 'Goneshtola Mor, near Shahid Telecom',
      footfall: '৫৫০+ দৈনিক',
      avgTicket: '৳ ৪৫',
      potentialScore: 96,
      reasonBn: 'এজেন্ট সদর-১৪ থেকে মাত্র ৫০ গজ দূরে। প্রতিদিন গড়ে ৫৫০ জন চা পান করে, ডিজিটাল কিউআরে খুচরা পয়সার ঝামেলা এড়ানো সম্ভব।',
      reasonEn: 'High cash-out friction zone within 250m. Micro-tickets solve small change crises.',
      status: 'pending',
    },
    {
      id: 'lead-02',
      nameBn: 'মায়ের দোয়া কনফেকশনারি',
      nameEn: 'Mayer Doya Confectionery',
      categoryBn: 'কনফেকশনারি',
      categoryEn: 'Confectionery',
      locationBn: 'স্টেশন রোড রিকশা স্ট্যান্ড',
      locationEn: 'Station Road Rickshaw Stand',
      footfall: '৩২০+ দৈনিক',
      avgTicket: '৳ ৮০',
      potentialScore: 89,
      reasonBn: 'সন্ধ্যায় যাত্রী সমাগম বেশি। ছোট খাতের নগদ লেনদেন ডিজিটাল কিউআরে রূপান্তরের চমৎকার সম্ভাবনা।',
      reasonEn: 'Evening transit footfall hotspot with heavy small cash volume.',
      status: 'pending',
    },
  ]);

  const currentMerchant = merchants.find((m) => m.id === selectedMerchantId) || merchants[0];

  // AI Margin Safety Evaluation
  const evaluateMarginSafety = () => {
    if (offerType === 'percentage' && discountVal > 8) {
      return {
        safe: false,
        score: 45,
        warningBn: '৮% এর বেশি ছাড় দিলে ক্যাটাগরি মুনাফা মার্জিন ক্ষতিগ্রস্ত হতে পারে। ক্যাম্পেইনে ব্যয় ঝুঁকির সম্ভাবনা রয়েছে।',
        warningEn: 'Discounts over 8% threaten average category margin (12-15%). High campaign cost risk.',
        recommendationBn: 'পরামর্শ: ফ্ল্যাট ৩০ টাকা ছাড় নির্ধারণ করুন অথবা সর্বোচ্চ ছাড়ের সীমা ৪০ টাকায় নির্ধারণ করুন।',
        recommendationEn: 'Recommendation: Switch to flat ৳ 30 or cap percentage discount at ৳ 40.',
      };
    }
    if (minPurchase < 300) {
      return {
        safe: false,
        score: 62,
        warningBn: 'ন্যূনতম ক্রয়ের পরিমাণ খুব কম, এতে ছোট কেনাকাটায় কুপন অপব্যবহার হতে পারে।',
        warningEn: 'Minimum purchase threshold too low, inviting small-ticket coupon exploitation.',
        recommendationBn: 'পরামর্শ: ন্যূনতম ক্রয়ের পরিমাণ অন্তত ৪৫০ টাকা নির্ধারণ করুন।',
        recommendationEn: 'Recommendation: Set minimum transaction threshold to at least ৳ 450.',
      };
    }
    return {
      safe: true,
      score: 94,
      warningBn: 'অফারটি মার্জিন-নিরাপদ এবং বিকালের ক্যাশ-আউট গ্রাহকদের দোকানে কেনাকাটায় আকৃষ্ট করার জন্য সুষম।',
      warningEn: 'Offer is margin-safe and perfectly calibrated to divert high-cashout afternoon shoppers.',
      recommendationBn: 'আনুমানিক ১৮ থেকে ২৫টি অতিরিক্ত ডিজিটাল লেনদেন অর্জনের সম্ভাবনা রয়েছে।',
      recommendationEn: 'Estimated to generate 18-25 incremental Upay wallet transactions.',
    };
  };

  const marginAssessment = evaluateMarginSafety();

  const handleLaunchCampaign = () => {
    const newOffer: Offer = {
      id: 'off-' + Date.now(),
      merchantId: currentMerchant.id,
      merchantName: currentMerchant.name,
      title: `${offerType === 'flat' ? `৳ ${discountVal} flat off` : `${discountVal}% discount`} on ৳ ${minPurchase}+ Upay purchase`,
      titleBn: `৳ ${minPurchase}+ কেনাকাটায় উপায় পেমেন্টে ${offerType === 'flat' ? `৳ ${discountVal} ছাড়` : `${discountVal}% ক্যাশব্যাক`}`,
      discountType: offerType === 'flat' ? 'flat' : offerType === 'cashback' ? 'cashback' : 'percentage',
      discountValue: discountVal,
      minPurchase,
      targetWindow: selectedWindow,
      targetWindowBn: selectedWindow,
      redemptionLimit: Math.round(campaignBudgetCap / discountVal),
      redemptionCount: 0,
      marginSafetyScore: marginAssessment.score,
      aiRecommendationReasonBn: marginAssessment.recommendationBn,
      aiRecommendationReasonEn: marginAssessment.recommendationEn,
    };

    onAddOfferToMerchant(currentMerchant.id, newOffer);
    setIsCampaignPublished(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#F59E0B'],
    });

    setTimeout(() => {
      setIsCampaignPublished(false);
    }, 3500);
  };

  const handleOnboardLead = (leadId: string) => {
    setMicroLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'onboarded' } : l))
    );
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B'],
    });
    onOpenMicroMerchantModal();
  };

  const hourlyTraffic = [
    { time: '9:00 AM', footfall: 18, isPeak: false },
    { time: '11:00 AM', footfall: 24, isPeak: false },
    { time: '1:00 PM', footfall: 32, isPeak: false },
    { time: '3:00 PM', footfall: 14, isLow: true },
    { time: '5:00 PM', footfall: 68, isPeak: true },
    { time: '7:00 PM', footfall: 85, isPeak: true },
    { time: '9:00 PM', footfall: 42, isPeak: false },
  ];

  return (
    <div className="space-y-6">
      {/* 1. MERCHANT OVERVIEW SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                  Merchant ID: {currentMerchant.id.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
                  {isBn ? 'সক্রিয় কিউআর মার্চেন্ট' : 'Active QR Terminal'}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {isBn ? currentMerchant.nameBn : currentMerchant.name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'স্টেশন রোড, হাসপাতাল মোড়, দিনাজপুর সদর' : 'Station Road, Hospital Mor, Dinajpur Sadar'}
              </p>
            </div>
          </div>

          {/* Merchant Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isBn ? 'মার্চেন্ট নির্বাচন:' : 'Select Merchant:'}
            </span>
            <select
              value={currentMerchant.id}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-700 dark:text-blue-300 focus:outline-none cursor-pointer"
            >
              {merchants.filter((m) => m.isEnrolled).map((m) => (
                <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                  {isBn ? m.nameBn : m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Core Merchant Overview Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'আজকের মোট বিক্রি' : 'Total Sales Today'}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 block">{formatTaka(14850, isBn)}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">{isBn ? '+১৮.২% গতদিনের তুলনায়' : '+18.2% vs yesterday'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'মোট লেনদেনের সংখ্যা' : 'Transaction Count'}</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1 block">২৮</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400/80 block mt-0.5">{isBn ? 'উপায় কিউআর পেমেন্ট' : 'Upay QR payments'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'ইউনিক ক্রেতা' : 'Unique Customers'}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1 block">২৪</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{isBn ? 'দিনাজপুর সদর ক্লাস্টার' : 'Active nearby cluster'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{isBn ? 'ডিজিটাল পেমেন্ট বৃদ্ধি' : 'Payment Growth'}</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">+২২%</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 block mt-0.5">{isBn ? 'ক্যাশ থেকে রূপান্তরিত' : 'Shifted from cash'}</span>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="pt-2 flex space-x-1.5 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-2 px-3.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isBn ? 'গ্রোথ বুস্টার এআই' : 'Growth Booster AI'}
          </button>
          <button
            onClick={() => setActiveSubTab('campaign_builder')}
            className={`py-2 px-3.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'campaign_builder'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isBn ? 'এআই ক্যাম্পেইন বিল্ডার' : 'AI Campaign Builder'}
          </button>
          <button
            onClick={() => setActiveSubTab('demand_forecast')}
            className={`py-2 px-3.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'demand_forecast'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isBn ? 'চাহিদার পূর্বাভাস' : 'Demand Forecast'}
          </button>
          <button
            onClick={() => setActiveSubTab('micro_onboarding')}
            className={`py-2 px-3.5 rounded-xl transition cursor-pointer ${
              activeSubTab === 'micro_onboarding'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isBn ? 'ক্ষুদ্র মার্চেন্ট লিড' : 'Micro Merchant Leads'}
          </button>
        </div>
      </div>

      {/* 2. MERCHANT GROWTH BOOSTER AI SECTION */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {isBn ? 'মার্চেন্ট গ্রোথ বুস্টার এআই ইনসাইটস' : 'AI-Driven Merchant Growth Insights'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn
                    ? 'এআই-চালিত বিক্রয় অন্তর্দৃষ্টি ও গ্রাহকদের ডিজিটাল পেমেন্টে উৎসাহিত করার উপায়'
                    : 'AI-driven growth insights to help merchants increase sales and digital payment adoption.'}
                </p>
              </div>
            </div>

            {/* AI Core Recommendation Callout */}
            <div className="p-4 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 border border-amber-300 dark:border-amber-400/30 rounded-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Actionable Growth Strategy
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-amber-300">
                {isBn ? 'বিকাল ৫টা থেকে রাত ৮টায় ৫০০+ টাকা কেনাকাটায় ৩০ টাকা ছাড় দিন।' : 'Deploy ৳ 30 off on ৳ 500+ orders during 5 PM – 8 PM peak.'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-200 leading-relaxed">
                {isBn
                  ? 'অন্তর্দৃষ্টি: নিকটস্থ এজেন্টদের ক্যাশ-আউট ভিড় বিকাল ৫-৮টায় তুঙ্গে ওঠে। ৫০০ টাকার কেনাকাটায় ৩০ টাকার তাৎক্ষণিক ছাড় দিলে প্রায় ২১% ক্যাশ-আউট গ্রাহক নগদ তোলার বদলে সরাসরি আপনার দোকানে কিউআর দিয়ে পেমেন্ট করবে।'
                  : 'Insight: Nearby cash-out congestion peaks between 5 PM – 8 PM. A ৳ 30 discount on ৳ 500+ purchases converts an estimated 21% of cash-out seekers into direct Upay QR buyers.'}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('campaign_builder')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition active:scale-95 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? 'স্মার্ট ক্যাম্পেইন কনফিগার করুন' : 'Configure Smart Offer Campaign'}</span>
                </button>
              </div>
            </div>

            {/* 3 AI Analytics Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">{isBn ? 'গ্রাহক চাহিদা:' : 'Customer Demand:'}</span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {isBn ? 'প্রেসক্রিপশন ওষুধ ও স্বাস্থ্যপণ্যে সন্ধ্যার ভিড় সর্বোচ্চ।' : 'Evening peak for prescriptions & wellness goods.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">{isBn ? 'অফ-পিক সময়:' : 'Low Traffic Hours:'}</span>
                <p className="text-amber-700 dark:text-amber-300 text-[11px] font-semibold leading-relaxed">
                  {isBn ? 'দুপুর ২:০০ – বিকাল ৫:০০ (ফুটফল ৬০% কমে)' : '2:00 PM – 5:00 PM (Footfall drops 60%)'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">{isBn ? 'সর্বোত্তম অফার:' : 'Optimal Offer:'}</span>
                <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold leading-relaxed">
                  {isBn ? 'ফ্ল্যাট ৩০ টাকা ক্যাশব্যাক ভাউচার' : 'Flat ৳ 30 Off or Bundle'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Campaign Performance & Active Offers */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>{isBn ? 'চলমান ক্যাম্পেইনসমূহ' : 'Current Active Campaigns'}</span>
              </h3>
              {currentMerchant.activeOffers.length > 0 ? (
                currentMerchant.activeOffers.map((off) => (
                  <div key={off.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{isBn ? off.titleBn : off.title}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg text-xs">
                        {off.discountType === 'flat' ? `৳ ${off.discountValue}` : `${off.discountValue}%`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{isBn ? off.aiRecommendationReasonBn : off.aiRecommendationReasonEn}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span>{isBn ? 'সময়: ' : 'Window: '}{off.targetWindow}</span>
                      <span>{off.redemptionCount}/{off.redemptionLimit} {isBn ? 'ব্যবহার হয়েছে' : 'used'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs py-2">{isBn ? 'কোনো সক্রিয় ক্যাম্পেইন নেই।' : 'No active campaign.'}</p>
              )}
            </div>

            {/* Quick Tip Card */}
            <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl text-xs space-y-1.5 text-purple-900 dark:text-purple-200">
              <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-500" />
                <span>{isBn ? 'ক্রস-প্রমোশন টিপস:' : 'Cross-Promotion Tip:'}</span>
              </span>
              <p className="text-[11px] leading-relaxed text-slate-700 dark:text-purple-100/90">
                {isBn
                  ? 'ওষুধের ক্রেতাদের মুদি দোকানের কুপন দিলে ১৪ দিনের গ্রাহক রিটেনশন ১৮% বৃদ্ধি পায়।'
                  : 'Issuing grocery coupons to medicine buyers increases 14-day customer retention by 18%.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI CAMPAIGN BUILDER SECTION */}
      {activeSubTab === 'campaign_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30">
                Custom Offer Studio
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {isBn ? 'এআই ক্যাম্পেইন বিল্ডার' : 'AI Campaign Builder'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn ? 'ছাড়ের পরিমাণ, গ্রাহক সেগমেন্ট এবং বাজেট সীমা নির্ধারণ করুন।' : 'Configure offer incentives, customer targeting & cost caps.'}
              </p>
            </div>

            {/* Offer Type Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-semibold block">
                {isBn ? 'অফারের ধরন নির্বাচন করুন:' : 'Offer Type:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'flat', labelBn: 'ফ্ল্যাট ছাড় (৳ ৩০)', labelEn: 'Flat ৳ 30' },
                  { id: 'percentage', labelBn: 'শতাংশ ছাড় (৫%)', labelEn: 'Percentage 5%' },
                  { id: 'cashback', labelBn: 'ক্যাশব্যাক (৩%)', labelEn: 'Cashback 3%' },
                  { id: 'bundle', labelBn: 'বান্ডেল প্যাকেজ', labelEn: 'Bundle Pack' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setOfferType(t.id as any)}
                    className={`py-2 px-2.5 rounded-xl font-bold border text-center transition cursor-pointer ${
                      offerType === t.id
                        ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isBn ? t.labelBn : t.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Offer Amount Slider */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {isBn ? 'ছাড় বা ক্যাশব্যাকের পরিমাণ:' : 'Discount Amount:'}
                </span>
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-sm">
                  {offerType === 'percentage' || offerType === 'cashback' ? `${discountVal}%` : formatTaka(discountVal, isBn)}
                </span>
              </div>
              <input
                type="range"
                min={offerType === 'percentage' || offerType === 'cashback' ? 2 : 10}
                max={offerType === 'percentage' || offerType === 'cashback' ? 12 : 60}
                step={offerType === 'percentage' || offerType === 'cashback' ? 1 : 5}
                value={discountVal}
                onChange={(e) => setDiscountVal(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Target Group Selector */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-700 dark:text-slate-300 font-semibold block">
                {isBn ? 'টার্গেট অডিয়েন্স:' : 'Target Customer Segment:'}
              </label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="nearby_cashout_seekers">
                  {isBn ? '৪০০ মিটারের মধ্যে ক্যাশ-আউট করতে আসা গ্রাহক' : 'Nearby Cash-Out Seekers within 400m'}
                </option>
                <option value="first_time_upay">
                  {isBn ? 'প্রথমবার উপায় কিউআর ব্যবহারকারী' : 'First-Time Upay Shoppers'}
                </option>
                <option value="all_local">
                  {isBn ? 'দিনাজপুর সদর এলাকার সকল সক্রিয় ব্যবহারকারী' : 'All Dinajpur Sadar MFS Users'}
                </option>
              </select>
            </div>

            {/* Time Window & Budget Limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                  {isBn ? 'ক্যাম্পেইন সময়সীমা:' : 'Campaign Window:'}
                </label>
                <select
                  value={selectedWindow}
                  onChange={(e) => setSelectedWindow(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs"
                >
                  <option value="2:00 PM – 5:00 PM">2:00 PM – 5:00 PM (Off-Peak Hours)</option>
                  <option value="5:00 PM – 8:00 PM">5:00 PM – 8:00 PM (Peak Cash-Out)</option>
                  <option value="8:00 PM – 10:30 PM">8:00 PM – 10:30 PM (Night Rush)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-semibold block mb-1">
                  {isBn ? 'ক্যাম্পেইনের মোট বাজেট সীমা:' : 'Campaign Cost Cap:'}
                </label>
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold text-amber-700 dark:text-amber-300">
                  <span>{formatTaka(campaignBudgetCap, isBn)}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (~{Math.round(campaignBudgetCap / discountVal)} {isBn ? 'জন রিডিম করতে পারবে' : 'redemptions'})
                  </span>
                </div>
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handleLaunchCampaign}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isBn ? 'স্মার্ট অফার ক্যাম্পেইন প্রকাশ করুন' : 'Launch Smart Offer Campaign'}</span>
            </button>

            {isCampaignPublished && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>
                  {isBn
                    ? 'ক্যাম্পেইন সফলভাবে চালু হয়েছে! আশপাশের ৩৪০ জন উপায় ব্যবহারকারী অফারটি দেখতে পাচ্ছেন।'
                    : 'Campaign published! 340 active nearby users now discover this offer.'}
                </span>
              </div>
            )}
          </div>

          {/* Right AI Assessment Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{isBn ? 'মার্জিন সুরক্ষা স্কোর' : 'Margin Safety Score'}</span>
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {marginAssessment.score}/100
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {isBn ? marginAssessment.warningBn : marginAssessment.warningEn}
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300 text-[10px] block">
                  {isBn ? 'প্রত্যাশিত আর্থিক প্রবৃদ্ধি:' : 'Projected Uplift:'}
                </span>
                <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">
                  {isBn
                    ? '১৮ থেকে ২৫টি অতিরিক্ত লেনদেন এবং প্রায় +১২% থেকে ১৪% রাজস্ব বৃদ্ধির সম্ভাবনা।'
                    : '+18 to 25 incremental sales transactions with an expected +12% to 14% revenue lift.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DEMAND FORECAST & PEAK HOURS */}
      {activeSubTab === 'demand_forecast' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                Predictive Footfall Timeline
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-500" />
                <span>{isBn ? 'ভবিষ্যৎ ক্রেতা চাহিদা ও পিক আওয়ার ফোরকাস্ট' : 'Future Customer Demand & Peak Hours Forecast'}</span>
              </h2>
            </div>
          </div>

          {/* Hourly Demand Bar Chart */}
          <div className="space-y-3 pt-2">
            {hourlyTraffic.map((slot, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 w-24">{slot.time}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {slot.isPeak ? (
                      <span className="text-red-500 font-bold">{isBn ? 'পিক আওয়ার (সর্বোচ্চ ভিড়)' : 'Peak Window'}</span>
                    ) : slot.isLow ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{isBn ? 'কম ভিড় (অফ-পিক)' : 'Low Traffic'}</span>
                    ) : (
                      <span className="text-slate-500">{isBn ? 'স্বাভাবিক' : 'Normal'}</span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{slot.footfall} {isBn ? 'জন' : 'shoppers'}</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-800">
                  <div
                    style={{ width: `${Math.min(100, (slot.footfall / 85) * 100)}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      slot.isPeak
                        ? 'bg-gradient-to-r from-red-500 to-amber-500'
                        : slot.isLow
                        ? 'bg-slate-300 dark:bg-slate-700'
                        : 'bg-gradient-to-r from-blue-500 to-teal-400'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sales Prediction Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">{isBn ? 'সাধারণ স্বাভাবিক বিক্রি (অফার ছাড়া):' : 'Baseline Sales (Without Offer):'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-200 mt-1 block">{formatTaka(12500, isBn)}</span>
            </div>
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold block">{isBn ? 'এআই ক্যাম্পেইনে সম্ভাব্য বিক্রি:' : 'Forecast With AI Campaign:'}</span>
              <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">{formatTaka(15800, isBn)} (+২৬%)</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MICRO MERCHANT ONBOARDING SECTION */}
      {activeSubTab === 'micro_onboarding' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                Network Expansion AI
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-500" />
                <span>{isBn ? 'ক্ষুদ্র মার্চেন্ট অন্তর্ভুক্তি লিডস (Micro-Merchant AI)' : 'Micro-Merchant AI Acquisition Leads'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'উচ্চ সম্ভাবনাযুক্ত এলাকাভিত্তিক চা স্টল ও ক্ষুদ্র দোকান শনাক্তকরণ অ্যালগরিদম।'
                  : 'AI predictive scoring identifying high-yield unbanked tea stalls and kiosks.'}
              </p>
            </div>
          </div>

          {/* Micro Merchant Leads List */}
          <div className="space-y-3.5">
            {microLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{isBn ? lead.nameBn : lead.nameEn}</span>
                    <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 font-bold">
                      Score: {lead.potentialScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{isBn ? lead.locationBn : lead.locationEn}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                    {isBn ? lead.reasonBn : lead.reasonEn}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span>ফুটফল: <strong className="text-slate-800 dark:text-slate-200">{lead.footfall}</strong></span>
                    <span>•</span>
                    <span>গড় বিল: <strong className="text-amber-700 dark:text-amber-300 font-mono">{lead.avgTicket}</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  {lead.status === 'onboarded' ? (
                    <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'অন্তর্ভুক্ত' : 'Onboarded'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOnboardLead(lead.id)}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কিউআর কিট বরাদ্দ ও যুক্ত করুন' : 'Issue QR & Onboard'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
