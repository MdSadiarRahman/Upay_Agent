import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  Sparkles,
  CheckCircle2,
  Navigation,
  Tag,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Merchant } from '../types';
import { formatTaka } from '../utils/algorithms';

interface CustomerExperienceProps {
  language: Language;
  merchants: Merchant[];
  onRecordCashoutDiverted: (amount: number, merchantName: string, savings: number) => void;
}

export const CustomerExperience: React.FC<CustomerExperienceProps> = ({
  language,
  merchants,
  onRecordCashoutDiverted,
}) => {
  const isBn = language === 'bn';

  // Customer Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(4500);
  const [showCashoutPrompt, setShowCashoutPrompt] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<'nearby_offers' | 'zero_cash_route'>('zero_cash_route');

  // Zero-Cash Shopping Route State
  const [shoppingItems, setShoppingItems] = useState<Array<{ id: string; nameBn: string; nameEn: string; cost: number; merchant: string; discount: number }>>([
    { id: 'item-1', nameBn: 'জরুরি প্রেসক্রিপশন ওষুধ', nameEn: 'Prescription Medicine', cost: 650, merchant: 'Rahman Pharmacy', discount: 30 },
    { id: 'item-2', nameBn: 'মুদি বাজার (চাল ও সয়াবিন তেল)', nameEn: 'Grocery (Rice & Oil)', cost: 1200, merchant: 'Rafiq Grocery', discount: 36 },
    { id: 'item-3', nameBn: 'সন্ধ্যার নাস্তা ও কাবাব', nameEn: 'Evening Snacks', cost: 250, merchant: 'Bismillah Restaurant', discount: 15 },
  ]);

  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCost, setNewItemCost] = useState<number>(300);

  // Payment Simulation State
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Financial calculations
  const totalShoppingCost = shoppingItems.reduce((acc, i) => acc + i.cost, 0);
  const totalOfferDiscount = shoppingItems.reduce((acc, i) => acc + i.discount, 0);
  const cashoutFeeSaved = Number((totalShoppingCost * 0.014).toFixed(1)); // 1.4% MFS cashout fee saved
  const totalCustomerSavings = totalOfferDiscount + cashoutFeeSaved;

  const handleAddItem = () => {
    if (!newItemName) return;
    const newItem = {
      id: 'item-' + Date.now(),
      nameBn: newItemName,
      nameEn: newItemName,
      cost: newItemCost,
      merchant: 'Rafiq Grocery',
      discount: Math.round(newItemCost * 0.04),
    };
    setShoppingItems([...shoppingItems, newItem]);
    setNewItemName('');
  };

  const handleRemoveItem = (id: string) => {
    setShoppingItems(shoppingItems.filter((i) => i.id !== id));
  };

  const handleExecuteZeroCashPay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      setWalletBalance((prev) => prev - (totalShoppingCost - totalOfferDiscount));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1'],
      });
      onRecordCashoutDiverted(totalShoppingCost, 'Multiple Sadar Merchants', totalCustomerSavings);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
                <Smartphone className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {isBn ? 'গ্রাহক অভিজ্ঞতা ও জিরো-ক্যাশ রুট' : 'Customer Experience & Zero-Cash Route'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn
                    ? 'ক্যাশ-আউট খরচ পরিহার ও সরাসরি কিউআর পেমেন্টের মাধ্যমে আর্থিক সাশ্রয়'
                    : 'Interactive simulated consumer app with cash-out avoidance prompts & zero-cash routing.'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Wallet Quick Bar */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-right text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold">{isBn ? 'ওয়ালেট ব্যালেন্স:' : 'Upay Balance:'}</span>
              <span className="font-black text-amber-700 dark:text-amber-400 font-mono text-base">{formatTaka(walletBalance, isBn)}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm">
              u
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedTab('zero_cash_route')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              selectedTab === 'zero_cash_route'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{isBn ? 'জিরো-ক্যাশ রুট (Zero-Cash Route)' : 'Zero-Cash Route'}</span>
          </button>
          <button
            onClick={() => setSelectedTab('nearby_offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              selectedTab === 'nearby_offers'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{isBn ? 'কাছের অফারসমূহ (Nearby Offers)' : 'Nearby Smart Offers'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Smartphone Shell (Left) + Interactive Route/Offer Manager (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Smartphone Mockup UI (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-slate-950 border-4 border-slate-800 rounded-[36px] shadow-2xl p-4 flex flex-col justify-between space-y-4 relative overflow-hidden ring-4 ring-slate-900/60 min-h-[580px]">
            {/* Phone Top Speaker & Camera Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
              <div className="w-8 h-1 rounded-full bg-slate-800" />
            </div>

            {/* App Header Inside Phone */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                    u
                  </span>
                  <span className="font-bold text-white text-sm">upay</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">03:30 PM • Sadar</span>
              </div>

              {/* In-App Upay Wallet Card */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-4 rounded-2xl text-slate-950 shadow-lg space-y-1">
                <span className="text-[11px] font-bold opacity-90 block">
                  {isBn ? 'উপায় প্রাথমিক ওয়ালেট' : 'Primary Upay Wallet'}
                </span>
                <div className="text-2xl font-black font-mono">
                  {formatTaka(walletBalance, isBn)}
                </div>
                <div className="text-[10px] font-semibold pt-1 opacity-80 flex justify-between">
                  <span>{isBn ? 'রিওয়ার্ড পয়েন্ট: ৯৪' : 'Reward Points: 94'}</span>
                  <span>{isBn ? 'সক্রিয়' : 'Active'}</span>
                </div>
              </div>

              {/* Cash-Out Alternative Prompt Popup */}
              {showCashoutPrompt && (
                <div className="p-3.5 bg-slate-900 border border-amber-400/40 rounded-2xl shadow-xl space-y-2 relative animate-fade-in text-xs">
                  <button
                    onClick={() => setShowCashoutPrompt(false)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ক্যাশ-আউট ফি সাশ্রয়ের সুযোগ!' : 'Cash-out Alternative Alert'}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {isBn
                      ? '৩০০ মিটারের মধ্যে ৪টি উপায় কিউআর দোকান রয়েছে! নগদ তোলার ১৪ টাকা ফি বাঁচিয়ে সরাসরি দোকানে মূল্য পরিশোধ করুন।'
                      : '4 Upay-accepting shops within 300m! Save ৳ 14 withdrawal fee and get direct merchant discounts.'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedTab('zero_cash_route')}
                      className="px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-300 transition"
                    >
                      {isBn ? 'রুট দেখুন' : 'View Route'}
                    </button>
                    <button
                      onClick={() => setShowCashoutPrompt(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {isBn ? 'বাতিল' : 'Dismiss'}
                    </button>
                  </div>
                </div>
              )}

              {/* Mini Nearby Merchants List in Phone */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 block">
                  {isBn ? 'নিকটবর্তী উপায় মার্চেন্টসমূহ:' : 'Nearby Upay Merchants:'}
                </span>
                {merchants.slice(0, 3).map((m) => (
                  <div key={m.id} className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{isBn ? m.nameBn : m.name}</h4>
                      <span className="text-[10px] text-amber-400">
                        {m.activeOffers.length > 0 ? (isBn ? m.activeOffers[0].titleBn : m.activeOffers[0].title) : (isBn ? 'কিউআর পেমেন্ট সক্রিয়' : 'QR accepted')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">0.3 km</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom In-Phone Action Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedTab('zero_cash_route')}
                className="w-full py-2.5 bg-slate-900 border border-amber-400/40 hover:bg-slate-800 text-amber-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                <QrCode className="w-4 h-4" />
                <span>{isBn ? 'উপায় কিউআর স্ক্যান করুন' : 'Scan Upay QR'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Zero-Cash Route Planner / Details (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedTab === 'zero_cash_route' ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                    {isBn ? 'ক্যাশলেস শপিং রুট' : 'AI Cashless Route'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-500" />
                    <span>{isBn ? 'জিরো-ক্যাশ শপিং রুট প্ল্যানার' : 'Zero-Cash Shopping Route Planner'}</span>
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">
                  {shoppingItems.length} {isBn ? 'টি সামগ্রী' : 'Items'}
                </span>
              </div>

              {/* Shopping List Table */}
              <div className="space-y-2">
                {shoppingItems.map((item, index) => (
                  <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[11px] shadow-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{isBn ? item.nameBn : item.nameEn}</h4>
                        <span className="text-[10px] text-slate-500">
                          {item.merchant} • {isBn ? 'উপায় পেমেন্ট' : 'Upay Payment'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-white font-mono block">{formatTaka(item.cost, isBn)}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                          -{formatTaka(item.discount, isBn)} {isBn ? 'ছাড়' : 'off'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Shopping Item */}
              <div className="p-3 bg-slate-50/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
                <input
                  type="text"
                  placeholder={isBn ? 'কেনাকাটার সামগ্রী লিখুন (যেমন: ফলমূল)...' : 'Add shopping item (e.g. Fruits)'}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 text-xs"
                />
                <input
                  type="number"
                  placeholder="Cost ৳"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(Number(e.target.value))}
                  className="w-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleAddItem}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl flex items-center gap-1 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBn ? 'যোগ করুন' : 'Add'}</span>
                </button>
              </div>

              {/* Benefits & Savings Summary Box */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/40 dark:to-slate-950 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl text-xs space-y-3">
                <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {isBn ? 'মোট আর্থিক সাশ্রয় ও লাভ:' : 'Total Customer Financial Benefit:'}
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-300">
                    +{formatTaka(totalCustomerSavings, isBn)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px] pt-1 border-t border-emerald-200 dark:border-emerald-500/20">
                  <div className="flex justify-between">
                    <span>{isBn ? 'ক্যাশ-আউট ফি সাশ্রয় (১.৪%):' : 'Cashout Fee Saved (1.4%):'}</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{formatTaka(cashoutFeeSaved, isBn)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{isBn ? 'সরাসরি মার্চেন্ট ডিসকাউন্ট:' : 'Direct Merchant Discounts:'}</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formatTaka(totalOfferDiscount, isBn)}</strong>
                  </div>
                </div>
              </div>

              {/* 1-Tap QR Payment Button */}
              {!paymentSuccess ? (
                <button
                  onClick={handleExecuteZeroCashPay}
                  disabled={isPaying || shoppingItems.length === 0}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isPaying ? (
                    <span>{isBn ? 'উপায় কিউআর পেমেন্ট সম্পন্ন হচ্ছে...' : 'Processing Upay QR Payment...'}</span>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>
                        {isBn
                          ? `জিরো-ক্যাশ রুট এক্সিকিউট করুন (${formatTaka(totalShoppingCost - totalOfferDiscount, isBn)})`
                          : `Execute Zero-Cash Route via Upay (${formatTaka(totalShoppingCost - totalOfferDiscount)})`}
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h4 className="font-bold">{isBn ? 'নগদ ক্যাশ ছাড়াই কেনাকাটা সম্পন্ন!' : 'Payment Completed Without Cash!'}</h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-200/80">
                        {isBn ? `আপনি মোট ${formatTaka(totalCustomerSavings, isBn)} টাকা সাশ্রয় করেছেন।` : `You saved ${formatTaka(totalCustomerSavings)}.`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPaymentSuccess(false)}
                    className="px-2.5 py-1 bg-emerald-500/20 text-emerald-800 dark:text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {isBn ? 'পুনরায় করুন' : 'Reset'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Nearby Offers Tab */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>{isBn ? 'দিনাজপুর সদরের লাইভ অফারসমূহ' : 'Live Hyperlocal Upay Offers'}</span>
              </h3>
              <div className="space-y-3">
                {merchants.map((merchant) => (
                  <div key={merchant.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{isBn ? merchant.nameBn : merchant.name}</span>
                      <span className="text-[10px] text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
                        {isBn ? merchant.categoryBn : merchant.category}
                      </span>
                    </div>
                    {merchant.activeOffers.length > 0 ? (
                      merchant.activeOffers.map((off) => (
                        <div key={off.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-amber-700 dark:text-amber-300">{isBn ? off.titleBn : off.title}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{isBn ? off.aiRecommendationReasonBn : off.aiRecommendationReasonEn}</p>
                          </div>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            {off.discountType === 'flat' ? formatTaka(off.discountValue, isBn) : `${off.discountValue}%`}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-[11px]">{isBn ? 'এই মুহূর্তে অফার নেই।' : 'No active promo currently.'}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
