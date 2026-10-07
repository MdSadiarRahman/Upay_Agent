import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Bot,
  Tag,
  TrendingUp,
  MapPin,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  Wallet,
  CalendarClock,
  ShieldCheck,
  ShieldAlert,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';
import { Language } from '../../types';
import { AuthUser } from '../../types/auth';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../common/BrandLogo';

export interface SidebarNavItem {
  id: string;
  labelBn: string;
  labelEn: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface SidebarNavProps {
  role: 'customer' | 'business';
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: AuthUser | null;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  role,
  activeTab,
  onSelectTab,
  language,
  setLanguage,
  isCollapsed,
  onToggleCollapse,
  user,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const isBn = language === 'bn';
  const isCustomer = role === 'customer';
  const { resolvedTheme, toggleTheme } = useTheme();

  const mainMenuItems: SidebarNavItem[] = [
    {
      id: 'dashboard',
      labelBn: isCustomer ? 'ওভারভিউ ড্যাশবোর্ড' : 'অপারেশনস ড্যাশবোর্ড',
      labelEn: isCustomer ? 'Dashboard' : 'Business Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    ...(isCustomer
      ? [
          {
            id: 'smart_bills',
            labelBn: 'স্মার্ট বিল পেমেন্ট',
            labelEn: 'Smart Bill Payment',
            icon: <CalendarClock className="w-4 h-4" />,
            badge: 'AI',
            badgeColor: 'bg-amber-400 text-slate-950 font-bold',
          },
        ]
      : []),
    {
      id: 'transactions',
      labelBn: isCustomer ? 'লেনদেন হিস্টোরি' : 'লাইভ ট্রানজ্যাকশন ফিড',
      labelEn: isCustomer ? 'Transaction History' : 'Transaction Feed',
      icon: <ArrowLeftRight className="w-4 h-4" />,
    },
    {
      id: 'ai_assistant',
      labelBn: 'এআই ফিনান্সিয়াল অ্যাসিস্ট্যান্ট',
      labelEn: 'AI Financial Assistant',
      icon: <Bot className="w-4 h-4" />,
      badge: 'GenAI',
      badgeColor: 'bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/30',
    },
    {
      id: 'offers',
      labelBn: isCustomer ? 'পার্সোনালাইজড অফার' : 'মার্চেন্ট গ্রোথ বুস্টার',
      labelEn: isCustomer ? 'Personalized Offers' : 'Growth Campaigns',
      icon: <Tag className="w-4 h-4" />,
      badge: isCustomer ? 'ক্যাশব্যাক' : 'Booster',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    },
    {
      id: 'analytics',
      labelBn: isCustomer ? 'ব্যয় ও সঞ্চয় বিশ্লেষণ' : 'লিকুইডিটি রাডার',
      labelEn: isCustomer ? 'Spending Analytics' : 'Liquidity Radar',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'maps',
      labelBn: isCustomer ? 'জিরো-ক্যাশ রুট' : 'ক্লাস্টার প্রেসার ম্যাপ',
      labelEn: isCustomer ? 'Zero-Cash Route' : 'Cluster Cash Map',
      icon: <MapPin className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30',
    },
    {
      id: 'reports',
      labelBn: isCustomer ? 'স্টেটমেন্ট ও রিপোর্ট' : 'কমপ্লায়েন্স ও অডিট লগ',
      labelEn: isCustomer ? 'Account Statements' : 'Audit & Compliance',
      icon: <FileText className="w-4 h-4" />,
    },
    ...(isCustomer
      ? [
          {
            id: 'proactive_insights',
            labelBn: 'প্রোঅ্যাক্টিভ এআই',
            labelEn: 'Proactive AI',
            icon: <Sparkles className="w-4 h-4" />,
            badge: 'Alerts',
            badgeColor: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30',
          },
          {
            id: 'customer_intelligence',
            labelBn: 'কাস্টমার ইন্টেলিজেন্স',
            labelEn: 'Customer Intelligence',
            icon: <Bot className="w-4 h-4" />,
            badge: 'Personalized',
            badgeColor: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30',
          },
          {
            id: 'responsible_ai',
            labelBn: 'রেসপন্সিবল এআই',
            labelEn: 'Responsible AI',
            icon: <ShieldCheck className="w-4 h-4" />,
            badge: 'Trust Framework',
            badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
          },
          {
            id: 'ml_metrics',
            labelBn: 'এমএল মডেল মেট্রিক্স',
            labelEn: 'ML Model Metrics',
            icon: <BrainCircuit className="w-4 h-4" />,
            badge: 'XGBoost',
            badgeColor: 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30',
          },
        ]
      : [
          {
            id: 'business_kpi',
            labelBn: 'বিজনেস ইমপ্যাক্ট ও কেপিআই',
            labelEn: 'Business KPI',
            icon: <TrendingUp className="w-4 h-4" />,
            badge: 'Admin',
            badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30',
          }
        ]),
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 transition-colors">
      {/* Top Header & Brand */}
      <div>
        <div className={`p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <BrandLogo
              variant={isCollapsed ? 'icon-only' : 'compact'}
              size="md"
            />
          </div>
          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="hidden lg:flex p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition border border-slate-200 dark:border-slate-800 cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Account Mode Label */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {isCustomer
                ? (isBn ? 'গ্রাহক অ্যাকাউন্ট' : 'Customer Account')
                : (isBn ? 'বিজনেস অ্যাকাউন্ট' : 'Enterprise Portal')}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/15 text-amber-800 dark:text-amber-300 font-mono">
              v2.4
            </span>
          </div>
        )}

        {/* Main Navigation Items */}
        <div className="p-3">
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  title={isCollapsed ? (isBn ? item.labelBn : item.labelEn) : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                >
                  <span className={`shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-500'
                  }`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate font-semibold">
                      {isBn ? item.labelBn : item.labelEn}
                    </span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-slate-950/15 text-slate-950' : item.badgeColor
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings & User Profile Avatar */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
        {/* Settings Navigation Item */}
        <button
          onClick={() => {
            onSelectTab('settings');
            onCloseMobile();
          }}
          title={isCollapsed ? (isBn ? 'সেটিংস ও নিরাপত্তা' : 'Settings & Security') : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
          } ${isCollapsed ? 'justify-center px-2' : ''}`}
        >
          <span className={`shrink-0 transition-transform group-hover:scale-105 ${
            activeTab === 'settings' ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400 group-hover:text-amber-500'
          }`}>
            <Settings className="w-4 h-4" />
          </span>
          {!isCollapsed && (
            <span className="flex-1 text-left truncate font-semibold">
              {isBn ? 'সেটিংস ও নিরাপত্তা' : 'Settings & Security'}
            </span>
          )}
        </button>

        {/* User Profile Avatar Bar */}
        <div className={`pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <button
            onClick={() => {
              onSelectTab('settings');
              onCloseMobile();
            }}
            title={isBn ? 'প্রোফাইল সেটিংস দেখুন' : 'View Profile Settings'}
            className={`flex items-center gap-2.5 text-left p-1 rounded-2xl hover:bg-slate-200/60 dark:hover:bg-slate-900 transition flex-1 overflow-hidden cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            {/* Avatar circle */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
              user?.avatarUrl
                ? 'overflow-hidden border border-amber-400'
                : 'bg-amber-400 text-slate-950'
            }`}>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name[0] : (isCustomer ? 'T' : 'S')
              )}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {isBn ? user?.nameBn || user?.name : user?.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                  {user?.phone}
                </span>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                title={isBn ? 'থিম পরিবর্তন' : 'Toggle Theme'}
                className="p-1.5 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onLogout}
                title={isBn ? 'লগআউট' : 'Logout'}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 h-screen sticky top-0 z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
