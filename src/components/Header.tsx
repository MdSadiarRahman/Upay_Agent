import React from 'react';
import {
  Building2,
  Store,
  ShoppingBag,
  Smartphone,
  ShieldCheck,
  SlidersHorizontal,
  Presentation,
  Flame,
} from 'lucide-react';
import { Language, UserRole, ScenarioType } from '../types';
import { SCENARIO_PRESETS } from '../data/mockData';
import { BrandLogo } from './common/BrandLogo';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeScenario: ScenarioType;
  setActiveScenario: (scenario: ScenarioType) => void;
  onOpenPitchAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  activeRole,
  setActiveRole,
  activeScenario,
  setActiveScenario,
  onOpenPitchAssistant,
}) => {
  const isBn = language === 'bn';

  const roleLabels: Record<UserRole, { bn: string; en: string; icon: React.ReactNode }> = {
    operator: {
      bn: 'অপারেটর কনসোল ও রিব্যালেন্সিং',
      en: 'Operator Map & Rebalancing',
      icon: <Building2 className="w-4 h-4" />,
    },
    agent: {
      bn: 'এজেন্ট লিকুইডিটি রাডার',
      en: 'Agent Liquidity Radar',
      icon: <Store className="w-4 h-4" />,
    },
    merchant: {
      bn: 'মার্চেন্ট গ্রোথ ইনসাইটস',
      en: 'Merchant Growth Booster',
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    customer: {
      bn: 'জিরো-ক্যাশ রুট ও অফার',
      en: 'Customer Zero-Cash Route',
      icon: <Smartphone className="w-4 h-4" />,
    },
    guardian: {
      bn: 'রেসপন্সিবল এআই ও কমপ্লায়েন্স',
      en: 'Responsible AI & Compliance',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  };

  const currentScenarioData = SCENARIO_PRESETS[activeScenario];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <BrandLogo
              variant="full"
              size="md"
              showSubtitle={true}
              subtitleText={
                isBn
                  ? 'স্মার্ট লিকুইডিটি ফোরকাস্টিং ও লোকাল কমার্স প্ল্যাটফর্ম'
                  : 'AI-Powered Liquidity & Local Commerce Intelligence'
              }
            />

            {/* Mobile Language switch */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setLanguage(isBn ? 'en' : 'bn')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              >
                {isBn ? 'EN' : 'বাংলা'}
              </button>
            </div>
          </div>

          {/* Scenario & Controls Area */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Live Scenario Selector */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <label htmlFor="scenario-select" className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {isBn ? 'বাজার অবস্থা:' : 'Market Stress:'}
              </label>
              <select
                id="scenario-select"
                value={activeScenario}
                onChange={(e) => setActiveScenario(e.target.value as ScenarioType)}
                aria-label={isBn ? 'সিনারিও নির্বাচন করুন' : 'Select scenario'}
                className="bg-transparent text-xs font-bold text-amber-600 dark:text-amber-400 focus:outline-none cursor-pointer pr-1"
              >
                {Object.entries(SCENARIO_PRESETS).map(([key, data]) => (
                  <option key={key} value={key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">
                    {isBn ? data.titleBn : data.titleEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Pitch Deck / Presentation Button */}
            <button
              onClick={onOpenPitchAssistant}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-400/10 text-amber-900 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 active:scale-[0.98] transition cursor-pointer"
              title={isBn ? 'প্রজেক্ট ডেক ও এআই আর্কিটেকচার ভিউ' : 'Executive Pitch & Architecture View'}
            >
              <Presentation className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isBn ? 'এক্সিকিউটিভ ডেক' : 'Executive Deck'}</span>
            </button>

            {/* Language Toggle (Desktop) */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  isBn
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  !isBn
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Live Cluster Health Status Banner */}
        <div className="mt-2.5 flex items-center justify-between text-xs px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-white">
              {isBn ? 'সক্রিয় অর্থনৈতিক ক্লাস্টার:' : 'Active Economic Cluster:'}
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {isBn ? 'দিনাজপুর সদর বাজার ও স্টেশন রোড হাব' : 'Dinajpur Sadar Commercial Zone (Cluster 04)'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-500 dark:text-slate-400">
              {isBn ? currentScenarioData.subtitleBn : currentScenarioData.subtitleEn}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">
              {isBn ? 'ঘাটতি সম্ভাবনা ঝুঁকি সূচক:' : 'Liquidity Risk Index:'}
            </span>
            <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
              {currentScenarioData.targetShortageRisk}%
            </span>
          </div>
        </div>
      </div>

      {/* Role / Portal Switcher Tabs */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1.5 py-2">
          {(Object.keys(roleLabels) as UserRole[]).map((role) => {
            const isActive = activeRole === role;
            const item = roleLabels[role];
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{isBn ? item.bn : item.en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
