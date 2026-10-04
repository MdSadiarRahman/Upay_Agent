import React, { useState } from 'react';
import {
  X,
  Coffee,
  Sparkles,
  QrCode,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';

interface MicroMerchantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOnboardSuccess: () => void;
}

export const MicroMerchantModal: React.FC<MicroMerchantModalProps> = ({
  isOpen,
  onClose,
  language,
  onOnboardSuccess,
}) => {
  const isBn = language === 'bn';
  const [isOnboarded, setIsOnboarded] = useState(false);

  if (!isOpen) return null;

  const handleOnboard = () => {
    setIsOnboarded(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6'],
    });
    onOnboardSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl p-6 space-y-5 overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
              <Coffee className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'ক্ষুদ্র মার্চেন্ট অন্তর্ভুক্তিকরণ স্টার্টার প্যাক' : 'Micro-Merchant Starter Pack Lead'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'হাইপারলোকাল এআই অ্যাকুইজিশন লিড' : 'Hyperlocal predictive merchant acquisition'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isOnboarded ? (
          <div className="space-y-4 text-xs">
            {/* Target Shop Candidate */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded">
                  {isBn ? 'অন্তর্ভুক্তি সম্ভাবনা: ৯৬%' : 'Acquisition Potential: 96%'}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">Dinajpur Sadar Bazar</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? 'করিম টি স্টল ও বেকারি' : 'Karim Tea Stall & Bakery'}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {isBn ? 'গণেশতলা মোড়, শহিদ টেলিকম থেকে ৫০ গজ দূরে' : 'Goneshtola Mor, 50 yards from Shahid Telecom'}
              </p>
            </div>

            {/* AI Reasoning Insights */}
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 rounded-2xl space-y-2">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isBn ? 'কেন করিম টি স্টলকে অন্তর্ভুক্ত করা প্রয়োজন:' : 'Why Karim Tea Stall is Prime for Onboarding:'}</span>
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] list-disc list-inside">
                <li>
                  <strong>{isBn ? 'দূরত্ব:' : 'Proximity:'}</strong> {isBn ? 'উচ্চ ক্যাশ-আউট চাপযুক্ত এজেন্ট সদর-১৪ থেকে মাত্র ২৫০ মিটারের মধ্যে।' : 'Within 250m of high cash-out Agent Sadar-14.'}
                </li>
                <li>
                  <strong>{isBn ? 'ফুটফল:' : 'Footfall:'}</strong> {isBn ? 'দৈনিক ৫৫০+ জন ক্রেতা, যাদের গড় লেনদেন মাত্র ৪৫ টাকা।' : '550+ daily customers with average ticket size of ৳ 45.'}
                </li>
                <li>
                  <strong>{isBn ? 'খুচরা পয়সা সমাধান:' : 'Micro-tickets:'}</strong> {isBn ? 'উপায় কিউআরের মাধ্যমে খুচরা পয়সার দীর্ঘস্থায়ী সংকট দূর হবে।' : 'Solves small change crisis through micro Upay QR.'}
                </li>
              </ul>
            </div>

            {/* Suggested Starter Offer Plan */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                {isBn ? 'প্রথম মাসের প্রস্তাবিত স্টার্টার ক্যাম্পেইন:' : 'Recommended 1st Month Starter Offer:'}
              </span>
              <p className="text-amber-700 dark:text-amber-300 font-semibold">
                {isBn ? 'প্রথম ১০০টি উপায় কিউআর পেমেন্টে তাৎক্ষণিক ১০ টাকা ক্যাশব্যাক' : 'First 100 Upay QR payments get ৳ 10 instant cashback'}
              </p>
              <p className="text-slate-500 text-[10px]">
                {isBn ? 'বাজেট ক্যাপ: ১,০০০ টাকা (উপায় ক্লাস্টার ফান্ড থেকে ভর্তুকি)' : 'Cost Cap: ৳ 1,000 subsidized by Upay Cluster Growth Fund'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl text-xs cursor-pointer"
              >
                {isBn ? 'পরে করব' : 'Later'}
              </button>
              <button
                onClick={handleOnboard}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition active:scale-95 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>{isBn ? 'মার্চেন্ট কিউআর কিট বরাদ্দ দিন' : 'Issue Upay Merchant QR Kit'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Success confirmation */
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'করিম টি স্টল সফলভাবে অন্তর্ভুক্ত হয়েছে!' : 'Karim Tea Stall Onboarded!'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {isBn
                ? 'ডিজিটাল মার্চেন্ট কিউআর তৈরি হয়েছে এবং স্ট্যান্ডিসহ মাঠ কর্মকর্তা প্রেরণ করা হয়েছে।'
                : 'Digital merchant QR generated. Field officer dispatched with display standee.'}
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              {isBn ? 'সম্পন্ন' : 'Done'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
