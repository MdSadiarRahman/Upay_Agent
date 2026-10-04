import React from 'react';
import {
  X,
  Phone,
  MapPin,
  FileText,
  LogOut,
  CheckCircle2,
  Zap,
  CreditCard,
  Building,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import { formatTaka } from '../../utils/algorithms';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const isBn = language === 'bn';

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl p-6 space-y-5 overflow-hidden">
        {/* Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${
          user.accountType === 'customer'
            ? 'bg-gradient-to-r from-amber-400 to-amber-500'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
        }`} />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
              user.accountType === 'customer'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-blue-600 text-white shadow-sm'
            }`}>
              {user.name ? user.name[0] : 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? user.nameBn : user.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {user.accountType === 'customer'
                    ? (isBn ? 'ব্যক্তিগত গ্রাহক অ্যাকাউন্ট' : 'Personal Customer Wallet')
                    : (isBn ? `বিজনেস: ${user.role.toUpperCase()}` : `Business: ${user.role.toUpperCase()}`)}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  {user.kycTier}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Details Card */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {isBn ? 'নিবন্ধিত ফোন নম্বর:' : 'Registered Phone:'}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{user.phone}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {isBn ? 'নির্ধারিত জোন:' : 'Assigned Zone:'}
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{isBn ? user.zoneBn : user.zone}</span>
          </div>

          {user.businessName && (
            <div className="flex justify-between items-center py-1 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {isBn ? 'প্রতিষ্ঠানের নাম:' : 'Business Name:'}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{isBn ? user.businessNameBn : user.businessName}</span>
            </div>
          )}

          {user.tradeLicenseNumber && (
            <div className="flex justify-between items-center py-1 border-b border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                {isBn ? 'ট্রেড লাইসেন্স নম্বর:' : 'License / Auth ID:'}
              </span>
              <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">{user.tradeLicenseNumber}</span>
            </div>
          )}

          {user.walletBalance !== undefined && (
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                {isBn ? 'বর্তমান ওয়ালেট ব্যালেন্স:' : 'Current Wallet Balance:'}
              </span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-sm">{formatTaka(user.walletBalance, isBn)}</span>
            </div>
          )}
        </div>

        {/* Quick Demo Switcher inside profile for easy testing */}
        <div className="space-y-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            {isBn ? 'সহজেই রোল পরিবর্তন করে পরীক্ষা করুন:' : 'Quick Switch Account for Testing:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { switchDemoUser('customer'); onClose(); }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                user.role === 'customer'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-800 dark:text-amber-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">{isBn ? 'তানভীর (গ্রাহক)' : 'Tanvir (Customer)'}</div>
              <div className="text-[10px] text-slate-500">Personal Wallet</div>
            </button>
            <button
              onClick={() => { switchDemoUser('agent'); onClose(); }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                user.role === 'agent'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-800 dark:text-amber-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">{isBn ? 'শহিদুল (এজেন্ট ১৪)' : 'Shahid (Agent 14)'}</div>
              <div className="text-[10px] text-slate-500">Liquidity Radar</div>
            </button>
            <button
              onClick={() => { switchDemoUser('merchant'); onClose(); }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                user.role === 'merchant'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-800 dark:text-blue-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">{isBn ? 'ডা. রফিকুর (মার্চেন্ট)' : 'Rahman Pharmacy'}</div>
              <div className="text-[10px] text-slate-500">Growth Booster</div>
            </button>
            <button
              onClick={() => { switchDemoUser('operator'); onClose(); }}
              className={`p-2 rounded-xl border text-left transition cursor-pointer ${
                user.role === 'operator'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-800 dark:text-purple-300 font-bold'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="font-bold text-[11px]">{isBn ? 'আনোয়ার (সুপারভাইজার)' : 'Anwar (Supervisor)'}</div>
              <div className="text-[10px] text-slate-500">Pressure Map & Audit</div>
            </button>
          </div>
        </div>

        {/* Action Buttons: Logout */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
          <button
            onClick={() => { logout(); onClose(); }}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isBn ? 'লগআউট' : 'Log Out'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
