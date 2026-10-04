import React, { useState } from 'react';
import {
  Smartphone,
  Store,
  ShoppingBag,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Phone,
  User,
  Zap,
  Cpu,
  Sun,
  Moon,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../types';
import { UserAccountType, BusinessRole } from '../../types/auth';
import { BrandLogo } from '../common/BrandLogo';
import { AboutUsModal } from '../AboutUsModal';

interface LoginPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenPitchAssistant: () => void;
  onOpenTechModal?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  language,
  setLanguage,
  onOpenPitchAssistant,
  onOpenTechModal,
}) => {
  const { login, switchDemoUser } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const isBn = language === 'bn';

  const [accountType, setAccountType] = useState<UserAccountType>('customer');
  const [businessRole, setBusinessRole] = useState<BusinessRole>('agent');

  const [phone, setPhone] = useState<string>('01711-234567');
  const [pin, setPin] = useState<string>('1234');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState<boolean>(false);

  const handleSwitchTab = (type: UserAccountType) => {
    setAccountType(type);
    setErrorMessage(null);
    if (type === 'customer') {
      setPhone('01711-234567');
      setPin('1234');
    } else {
      if (businessRole === 'agent') {
        setPhone('01812-987654');
        setPin('4321');
      } else if (businessRole === 'merchant') {
        setPhone('01913-554433');
        setPin('5678');
      } else {
        setPhone('01710-004029');
        setPin('9942');
      }
    }
  };

  const handleBusinessRoleChange = (role: BusinessRole) => {
    setBusinessRole(role);
    if (role === 'agent') {
      setPhone('01812-987654');
      setPin('4321');
    } else if (role === 'merchant') {
      setPhone('01913-554433');
      setPin('5678');
    } else {
      setPhone('01710-004029');
      setPin('9942');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    const result = await login({
      accountType,
      phone,
      pin,
      businessRole: accountType === 'business' ? businessRole : undefined,
    });
    setIsLoading(false);
    if (!result.success && result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-amber-400 selection:text-slate-950">
      {/* Top Brand Navigation Bar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors">
        <BrandLogo
          variant="full"
          size="md"
          showSubtitle={true}
          subtitleText={
            isBn
              ? 'নেক্সট-জেন এমএফএস লিকুইডিটি ও কমার্স প্ল্যাটফর্ম'
              : 'Next-Generation MFS Intelligence & Local Commerce Platform'
          }
        />

        <div className="flex items-center gap-2.5">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
            title={isBn ? 'থিম পরিবর্তন' : 'Toggle Theme'}
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                isBn ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                !isBn ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand & Fintech Purpose */}
          <div className="lg:col-span-5 space-y-5 hidden lg:block">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {isBn ? 'ব্যাংক-গ্রেড এনক্রিপ্টেড গেটওয়ে' : 'Bank-Grade Encrypted Portal'}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                {isBn ? (
                  <>
                    গ্রাহক ও ব্যবসার জন্য <br />
                    <span className="text-amber-500">বিশেষায়িত আর্থিক প্ল্যাটফর্ম</span>
                  </>
                ) : (
                  <>
                    Intelligent Financial Hub for <br />
                    <span className="text-amber-500">Customers & Businesses</span>
                  </>
                )}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'স্মার্ট লিকুইডিটি ফোরকাস্টিংয়ের মাধ্যমে এজেন্টদের ক্যাশ সংকট রোধ এবং জিরো-ক্যাশ রুটের মাধ্যমে গ্রাহক ও মার্চেন্টদের ডিজিটাল লেনদেন গতিশীল করুন।'
                  : 'AI-powered liquidity forecasting to prevent cash shortages before they impact customers, paired with zero-cash merchant shopping routes.'}
              </p>
            </div>

            {/* Feature Pillars */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <span className="p-2 rounded-xl bg-amber-400/15 text-amber-700 dark:text-amber-400 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    {isBn ? 'গ্রাহক পোর্টাল: জিরো-ক্যাশ অভিজ্ঞতা' : 'Customer Portal: Zero-Cash Journey'}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn
                      ? 'ওয়ালেট ব্যালেন্স ট্র্যাকিং, স্মার্ট অফার ও ১.৪% ক্যাশআউট ফি সাশ্রয়কারী রুট'
                      : 'Real-time wallet balance, personalized merchant offers & zero-fee shopping routes.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
                <span className="p-2 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-400 shrink-0">
                  <Store className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                    {isBn ? 'বিজনেস স্যুট: লিকুইডিটি ও গ্রোথ ইঞ্জিন' : 'Business Suite: Liquidity & Growth'}
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {isBn
                      ? 'এজেন্ট ক্যাশ ফোরকাস্টিং, পিয়ার রিব্যালেন্সিং ও মার্চেন্ট ক্যাম্পেইন বুস্টার'
                      : 'Cluster liquidity radar, algorithmic rebalancing, and margin-safe promotional campaigns.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Assurance */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                {isBn
                  ? 'কঠোর রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC) ও অডিট ট্রেইল দ্বারা সুরক্ষিত।'
                  : 'Role-based access control and cryptographic audit logging for financial compliance.'}
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden transition-colors">
            {/* Top Accent Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

            {/* Portal Type Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                {isBn ? 'আপনার পোর্টাল নির্বাচন করুন:' : 'Select Portal Type:'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('customer')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    accountType === 'customer'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isBn ? 'গ্রাহক অ্যাকাউন্ট' : 'Customer Account'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTab('business')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                    accountType === 'business'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>{isBn ? 'বিজনেস অ্যাকাউন্ট' : 'Business Suite'}</span>
                </button>
              </div>
            </div>

            {/* Sub-Role Selector for Business Login */}
            {accountType === 'business' && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 animate-fade-in">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {isBn ? 'ব্যবসায়িক পদবি নির্বাচন করুন:' : 'Select Business Role:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleBusinessRoleChange('agent')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      businessRole === 'agent'
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এজেন্ট' : 'Agent'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBusinessRoleChange('merchant')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      businessRole === 'merchant'
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isBn ? 'মার্চেন্ট' : 'Merchant'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBusinessRoleChange('operator')}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center gap-1 cursor-pointer ${
                      businessRole === 'operator'
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'সুপারভাইজার' : 'Supervisor'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {accountType === 'customer'
                    ? (isBn ? 'উপায় নিবন্ধিত মোবাইল নম্বর:' : 'Upay Registered Mobile Number:')
                    : (isBn ? 'বিজনেস / এমএফএস এজেন্ট মোবাইল নম্বর:' : 'Business / MFS Agent Phone Number:')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">
                    {accountType === 'customer'
                      ? (isBn ? '৪ ডিজিটের গোপন নিরাপত্তা পিন:' : '4-Digit Confidential Security PIN:')
                      : (isBn ? 'বিজনেস সিক্রেট অথরাইজেশন পিন:' : 'Business Authorization PIN:')}
                  </label>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 cursor-pointer hover:underline font-bold">
                    {isBn ? 'সাহায্য প্রয়োজন?' : 'Need Help?'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-amber-400 transition tracking-widest"
                  />
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.99] bg-amber-400 hover:bg-amber-500 text-slate-950 cursor-pointer"
              >
                {isLoading ? (
                  <span>{isBn ? 'পরিচয় যাচাই করা হচ্ছে...' : 'Verifying Security Credentials...'}</span>
                ) : (
                  <>
                    <span>
                      {accountType === 'customer'
                        ? (isBn ? 'গ্রাহক পোর্টালে প্রবেশ করুন' : 'Access Customer Portal')
                        : (isBn ? 'বিজনেস স্যুট ওপেন করুন' : 'Access Enterprise Portal')}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Instant 1-Click Evaluation Profiles */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  {isBn ? 'মূল্যায়নের জন্য ১-ক্লিক প্রোফাইল:' : 'Instant 1-Click Evaluation Profiles:'}
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono font-bold">Live Demo</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => switchDemoUser('customer')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 dark:text-white text-[11px] truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                      {isBn ? 'তানভীর (গ্রাহক)' : 'Tanvir (Customer)'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">৳ 4,500 Available</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => switchDemoUser('agent')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 dark:text-white text-[11px] truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                      {isBn ? 'শহিদুল (এজেন্ট ১৪)' : 'Shahid (Agent 14)'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">82% Shortage Risk</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => switchDemoUser('merchant')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 dark:text-white text-[11px] truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                      {isBn ? 'ডা. রফিকুর (মার্চেন্ট)' : 'Rahman Pharmacy'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Growth Booster</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => switchDemoUser('operator')}
                  className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition flex items-center gap-2 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-slate-900 dark:text-white text-[11px] truncate group-hover:text-amber-600 dark:group-hover:text-amber-300 transition">
                      {isBn ? 'আনোয়ার (সুপারভাইজার)' : 'Anwar (Supervisor)'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Pressure Map & Audit</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 px-4 py-4 mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {isBn
              ? 'উপায়পালস এআই – বাংলাদেশ ব্যাংক এমএফএস নীতিমালা অনুযায়ী নির্মিত।'
              : 'UpayPulse AI — Engineered in compliance with Bangladesh Bank MFS Regulatory Framework.'}
          </p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setIsAboutUsOpen(true)} className="hover:text-amber-500 transition font-semibold cursor-pointer">
              {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
            </button>
            <button type="button" onClick={() => setIsAboutUsOpen(true)} className="hover:text-amber-500 transition font-semibold cursor-pointer">
              {isBn ? 'ডেভেলপার্স' : 'Developers'}
            </button>
            <button type="button" onClick={() => setIsAboutUsOpen(true)} className="hover:text-amber-500 transition font-semibold cursor-pointer">
              {isBn ? 'যোগাযোগ' : 'Contact'}
            </button>
          </div>
        </div>
      </footer>
      
      <AboutUsModal isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)} language={language} />
    </div>
  );
};
