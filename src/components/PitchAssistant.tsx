import React from 'react';
import {
  X,
  Presentation,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Language, ScenarioType } from '../types';

interface PitchAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectScenario: (sc: ScenarioType) => void;
}

export const PitchAssistant: React.FC<PitchAssistantProps> = ({
  isOpen,
  onClose,
  language,
  onSelectScenario,
}) => {
  const isBn = language === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-t-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30">
              <Presentation className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isBn ? 'উপায়পালস এআই – ১ মিনিটের পিচ ডেক' : 'UpayPulse AI — 1-Minute Judge Pitch Deck'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'এক্সিকিউটিভ পিচ স্ক্রিপ্ট ও বিচারকদের প্রশ্নোত্তর প্রতিরক্ষা' : 'Executive Pitch Script & Judge Q&A Defense'}
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

        {/* 1-Minute Pitch Script Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-amber-300 dark:border-amber-500/30 space-y-2 text-xs">
          <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {isBn ? '১ মিনিটের পিচ স্ক্রিপ্ট (Executive Pitch):' : '1-Minute Pitch Script:'}
          </span>
          <blockquote className="italic text-slate-700 dark:text-slate-200 leading-relaxed pl-3 border-l-2 border-amber-400">
            {isBn ? (
              <>
                মোবাইল ফাইন্যান্সিয়াল সার্ভিসে দুটি সমস্যা সবসময় একসাথে দেখা যায়: এজেন্টে টাকা শেষ হয়ে ক্যাশ-আউট ব্যর্থতা, আর অন্যদিকে স্থানীয় দোকানে ডিজিটাল কিউআর পেমেন্টের অভাব।
                <br /><br />
                <strong>উপায়পালস এআই</strong> এই দুই সংকটকে একই সমীকরণে সমাধান করে। এটি ৪ ঘণ্টা আগেই এজেন্টের ক্যাশ ঘাটতি পূর্বাভাস দেয়, পার্টনারস্কোর দিয়ে উদ্বৃত্ত এজেন্ট থেকে রিব্যালেন্সিং প্রস্তাব সাজায়, এবং একই সাথে পাশের ক্রেতাদের দোকানে কিউআর ছাড় দিয়ে অপ্রয়োজনীয় ক্যাশ উত্তোলনকে সরাসরি কেনাকাটায় রূপান্তর করে।
                <br /><br />
                ফলাফল: এজেন্টে ক্যাশ সংকট শূন্য, গ্রাহকের ফি সাশ্রয়, মার্চেন্টের বিক্রি বৃদ্ধি এবং উপায়ের ডিজিটাল ভলিউমে উল্লম্ফন।
              </>
            ) : (
              <>
                In mobile financial services, two critical friction points coexist in every local market: cash-out failures when agents run dry, and underutilized digital merchant QR payments.
                <br /><br />
                <strong>UpayPulse AI</strong> unites both problems into one synchronized local intelligence engine. It forecasts agent cash shortfalls hours in advance, matches surplus rebalancing partners via optimized scoring, and simultaneously serves hyperlocal merchant discounts to nearby users to divert unnecessary cash-outs into direct wallet spending.
                <br /><br />
                The result: zero agent cash-out failures, lower fees for consumers, higher sales for local merchants, and rapid digital volume growth for Upay.
              </>
            )}
          </blockquote>
        </div>

        {/* Core Formula & AI Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-purple-700 dark:text-purple-300 font-mono text-[11px] block">
              PartnerScore Formula
            </span>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-[10px]">
              0.45 Surplus + 0.30 Distance + 0.15 Reliability + 0.10 Hours
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-blue-700 dark:text-blue-300 font-mono text-[11px] block">
              OfferScore Formula
            </span>
            <p className="text-slate-600 dark:text-slate-400 font-mono text-[10px]">
              0.40 Distance + 0.30 Category + 0.20 Intent + 0.10 Fatigue
            </p>
          </div>
        </div>

        {/* Critical Judge Defense Q&A */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span>{isBn ? 'বিচারকদের সম্ভাব্য প্রশ্ন ও প্রতিরক্ষা (Defense Q&A):' : 'Key Regulatory & Security Defenses:'}</span>
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">
                Q1: {isBn ? 'এআই কি স্বয়ংক্রিয়ভাবে এজেন্টদের মধ্যে তহবিল স্থানান্তর করে?' : 'Does the AI autonomously move funds between agents?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                {isBn
                  ? 'উত্তর: কখনোই না। এআই কেবল ডেটা বিশ্লেষণ করে সিদ্ধান্ত সুপারিশ করে। প্রতিটি তহবিলের জন্য সুপারভাইজারের পিন অনুমোদন ও ক্রিপ্টোগ্রাফিক ট্রেইল থাকা বাধ্যতামূলক।'
                  : 'Ans: Absolutely not. The AI provides decision support and ranking. Fund reallocation requires human-in-the-loop supervisor approval with tamper-evident audit trails.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">
                Q2: {isBn ? 'গ্রাহকদের ওয়ালেট থেকে কি এজেন্টের লিকুইডিটি পূরণ করা হয়?' : 'Are customer wallet funds used for agent liquidity?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                {isBn
                  ? 'উত্তর: সম্পূর্ণ না। বাংলাদেশ ব্যাংকের ট্রাস্ট-কাম-সেটলমেন্ট একাউন্ট নির্দেশিকা অনুযায়ী গ্রাহক ফান্ড শতভাগ সুরক্ষিত ও পৃথক। কেবল এজেন্টের নিজস্ব অপারেশনাল ফ্লোট রিব্যালেন্স হয়।'
                  : 'Ans: Strictly no. Customer deposits remain ring-fenced under Bangladesh Bank regulatory directives. Only existing agent operational float is rebalanced.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">
                Q3: {isBn ? 'লোকেশনে গ্রাহকের গোপনীয়তা কীভাবে সংরক্ষিত থাকে?' : 'How is user privacy protected in location targeting?'}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                {isBn
                  ? 'উত্তর: গ্রাহকের নিরবচ্ছিন্ন জিপিএস হিস্টোরি সংরক্ষণ করা হয় না। গ্রাহকের স্পষ্ট সম্মতিতে কেবল এলাকাভিত্তিক প্রক্সিমিটি হিসেব করা হয়।'
                  : 'Ans: No raw continuous GPS coordinates are stored. We use anonymized zone-level centroids with strict user consent.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Demo Trigger Scenarios */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {isBn ? 'লাইভ ডেমো সিনারিও টেস্ট:' : 'Trigger Live Demo Scenario:'}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                onSelectScenario('friday_rush');
                onClose();
              }}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
            >
              {isBn ? 'শুক্রবার হাট' : 'Friday Rush'}
            </button>
            <button
              onClick={() => {
                onSelectScenario('salary_day');
                onClose();
              }}
              className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-500/40 rounded-lg text-xs font-bold cursor-pointer"
            >
              {isBn ? 'বেতনের দিন' : 'Salary Day'}
            </button>
            <button
              onClick={() => {
                onSelectScenario('agent_down');
                onClose();
              }}
              className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold cursor-pointer"
            >
              {isBn ? 'এজেন্ট বন্ধ' : 'Agent Down'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
