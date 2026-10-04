import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { Language } from '../../types';

interface AiHumanGovernanceCardProps {
  language: Language;
  compact?: boolean;
}

export const AiHumanGovernanceCard: React.FC<AiHumanGovernanceCardProps> = ({
  language,
  compact = false,
}) => {
  const isBn = language === 'bn';
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);

  return (
    <div className="rounded-3xl border border-amber-300/80 dark:border-amber-400/20 bg-linear-to-r from-amber-500/10 via-amber-400/5 to-transparent p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-xs">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                {isBn
                  ? 'রেসপন্সিবল এআই নীতি: এআই কেবল পরামর্শক, চূড়ান্ত অ্যাকশন মানুষের'
                  : 'Responsible AI Policy: AI Recommends, Human Takes Action'}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                100% User Governed
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'এআই স্বয়ংক্রিয়ভাবে কোনো টাকা কাটে না বা সিদ্ধান্ত নেয় না। সিদ্ধান্ত ও পেমেন্ট অ্যাকশন ১০০% আপনার নিয়ন্ত্রণে।'
                : 'AI never auto-deducts funds or makes financial decisions. Authorization & payment is 100% in your hands.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-xl hover:bg-amber-400/20 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-scale-in">
          {/* AI Role */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>{isBn ? '🤖 এআই কী করে (পরামর্শ ও পূর্বাভাস):' : '🤖 What AI Does (Assistance & Insights):'}</span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 list-none">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'লেনদেনের হিস্টোরি বিশ্লেষণ করে আসন্ন বিলের সম্ভাব্য তারিখ ও গড় টাকার অঙ্ক শনাক্ত করে।'
                    : 'Analyzes past transactions to forecast upcoming due dates and average bill amounts.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'ওয়ালেট ব্যালেন্স যথেষ্ট কিনা তা যাচাই করে টাকা যোগ করার সময়োচিত সতর্কবার্তা দেয়।'
                    : 'Evaluates wallet balance adequacy and warns if add-money is needed before due date.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'বিলের মাসভিত্তিক পরিবর্তন (+২০% বৃদ্ধি বা -১৫% হ্রাস) চিহ্নিত করে ইনসাইট প্রদান করে।'
                    : 'Detects unusual spikes or drops in consumption (+20% increase) to prevent bill shock.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Human Role */}
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>{isBn ? '👤 হিউম্যান (আপনি) কী করেন (সিদ্ধান্ত ও অ্যাকশন):' : '👤 What Human Does (Decision & Execution):'}</span>
            </div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 list-none">
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'বিলের টাকার পরিমাণ নিজে পরিবর্তন বা যাচাই করার সম্পূর্ণ স্বাধীনতা রাখেন।'
                    : 'Retains full authority to adjust, customize, or override the bill payment amount.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'এখনই পরিশোধ করবেন নাকি নির্দিষ্ট তারিখে শিডিউল করবেন তা নিজেই নির্বাচন করেন।'
                    : 'Decides whether to execute instant payment now or schedule for a specific date.'}
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? '৪-ডিজিটের গোপন পিন প্রবেশ করিয়ে নিজে ট্যাপ করে ধরে রেখে চূড়ান্ত অনুমোদন প্রদান করেন।'
                    : 'Enters 4-digit confidential PIN and intentionally taps & holds to release payment.'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
