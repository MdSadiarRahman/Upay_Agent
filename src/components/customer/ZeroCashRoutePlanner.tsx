import React, { useState, useMemo } from 'react';
import {
  Navigation,
  MapPin,
  Sparkles,
  ShoppingBag,
  Clock,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Search,
  Filter,
  Layers,
  ChevronRight,
  TrendingDown,
  AlertCircle,
  X,
  Compass,
  Store,
  DollarSign,
  PlusCircle,
  Check,
  RotateCcw,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Merchant, Agent, Language } from '../../types';
import { formatTaka } from '../../utils/algorithms';
import { useWallet } from '../../context/WalletContext';

interface ZeroCashRoutePlannerProps {
  language: Language;
  merchants: Merchant[];
  agents?: Agent[];
  onOpenPayMerchant: (merchantId: string, estimatedAmount: number) => void;
  onOpenAddMoney: () => void;
  onRecordCashoutDiverted: (amount: number, merchantName: string, savings: number) => void;
}

interface RouteStopItem {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantNameBn: string;
  category: string;
  categoryBn: string;
  locationName: string;
  locationNameBn: string;
  coords: { x: number; y: number };
  distanceKm: number;
  walkMinutes: number;
  estimatedCost: number;
  discount: number;
  discountTextBn: string;
  discountTextEn: string;
  isCompleted: boolean;
}

export const ZeroCashRoutePlanner: React.FC<ZeroCashRoutePlannerProps> = ({
  language,
  merchants,
  agents = [],
  onOpenPayMerchant,
  onOpenAddMoney,
  onRecordCashoutDiverted,
}) => {
  const isBn = language === 'bn';
  const { customerBalance } = useWallet();

  // Selected Category / Preset
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePinDetails, setActivePinDetails] = useState<Merchant | null>(null);

  // Live Navigation Simulator State
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedStops, setCompletedStops] = useState<Record<string, boolean>>({});
  const [routeFinished, setRouteFinished] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ x: number; y: number; name: string }>({
    x: 24,
    y: 64,
    name: 'Goneshtola Mor, Dinajpur Sadar',
  });

  // Build Route Stops dynamically based on real merchants prop
  const routeStops = useMemo<RouteStopItem[]>(() => {
    let filtered = merchants.filter((m) => m.isEnrolled);

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.nameBn.includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.categoryBn.includes(q)
      );
    }

    // Default to at least 2-3 prominent merchants if filtered is empty
    if (filtered.length === 0) {
      filtered = merchants.slice(0, 3);
    }

    return filtered.map((merchant, idx) => {
      // Calculate realistic distance from user origin (x: 24, y: 64)
      const dx = (merchant.coords.x - 24) * 0.04;
      const dy = (merchant.coords.y - 64) * 0.04;
      const dist = Math.max(0.2, Number(Math.sqrt(dx * dx + dy * dy).toFixed(1)));
      const walkTime = Math.max(2, Math.round(dist * 10));

      const offer = merchant.activeOffers?.[0];
      let discountVal = 30;
      let discountTextBn = '৳ ৩০ তাৎক্ষণিক ছাড়';
      let discountTextEn = '৳ 30 instant discount';
      let estCost = merchant.avgTicketSize || 600;

      if (offer) {
        if (offer.discountType === 'flat') {
          discountVal = offer.discountValue;
          discountTextBn = `৳ ${offer.discountValue} ফ্ল্যাট ছাড়`;
          discountTextEn = `৳ ${offer.discountValue} flat off`;
        } else {
          discountVal = Math.round((estCost * offer.discountValue) / 100);
          discountTextBn = `${offer.discountValue}% ক্যাশব্যাক (৳ ${discountVal})`;
          discountTextEn = `${offer.discountValue}% cashback (৳ ${discountVal})`;
        }
      }

      return {
        id: `stop-${merchant.id}`,
        merchantId: merchant.id,
        merchantName: merchant.name,
        merchantNameBn: merchant.nameBn,
        category: merchant.category,
        categoryBn: merchant.categoryBn,
        locationName: merchant.location,
        locationNameBn: isBn ? `${merchant.nameBn} - দিনাজপুর সদর` : merchant.location,
        coords: merchant.coords,
        distanceKm: dist,
        walkMinutes: walkTime,
        estimatedCost: estCost,
        discount: discountVal,
        discountTextBn,
        discountTextEn,
        isCompleted: !!completedStops[merchant.id],
      };
    });
  }, [merchants, selectedCategory, searchQuery, completedStops, isBn]);

  // Aggregate financial metrics
  const totalCost = routeStops.reduce((sum, s) => sum + s.estimatedCost, 0);
  const totalDiscounts = routeStops.reduce((sum, s) => sum + s.discount, 0);
  const potentialCashoutFee = Math.round(totalCost * 0.014); // 1.4% MFS fee
  const netSavings = totalDiscounts + potentialCashoutFee;
  const isBalanceSufficient = customerBalance >= (totalCost - totalDiscounts);

  // Target Agent with longest queue for comparison
  const crowdedAgent = agents.find((a) => a.queueLength >= 5) || agents[0];

  // Live Navigation handlers
  const handleStartNavigation = () => {
    setIsNavigating(true);
    setActiveStepIndex(0);
    setRouteFinished(false);
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleStopNavigation = () => {
    setIsNavigating(false);
  };

  const handleMarkStopCompleted = (stop: RouteStopItem) => {
    const updated = { ...completedStops, [stop.merchantId]: true };
    setCompletedStops(updated);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
    });

    // Move to next step if in navigation mode
    if (activeStepIndex < routeStops.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      // All completed
      setRouteFinished(true);
      setIsNavigating(false);
      const merchantNames = routeStops.map((s) => s.merchantName).join(' + ');
      onRecordCashoutDiverted(totalCost, merchantNames, netSavings);
    }
  };

  const handleResetRoute = () => {
    setCompletedStops({});
    setActiveStepIndex(0);
    setRouteFinished(false);
    setIsNavigating(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & LIVE GPS STATUS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-sm flex items-center justify-center">
                <Navigation className="w-5 h-5 text-slate-950" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{isBn ? 'জিরো-ক্যাশ স্মার্ট শপিং রুট (লাইভ ডাটা)' : 'Zero-Cash Smart Shopping Route (Live Data)'}</span>
              </h2>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{isBn ? 'লাইভ জিপিএস রুট সক্রিয়' : 'Live GPS Active'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? 'এজেন্টে ক্যাশ তুলে ১.৪% ফি ও লম্বা লাইন এড়াতে সরাসরি উপায় কিউআর পার্টনারদের মাধ্যমে বাজার সম্পন্ন করার এআই রুট।'
                : 'AI-calculated route connecting verified Upay QR merchants to eliminate 1.4% cash-out fees and avoid ATM queues.'}
            </p>
          </div>

          {/* Quick Origin & Wallet Balance Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">
                {isBn ? 'আপনার অবস্থান:' : 'Current Origin:'}
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>{isBn ? 'গণেশতলা মোড়, সদর' : 'Goneshtola Mor, Sadar'}</span>
              </span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-right">
              <span className="text-[10px] text-amber-800 dark:text-amber-300 block font-bold uppercase">
                {isBn ? 'ওয়ালেট ব্যালেন্স:' : 'Wallet Balance:'}
              </span>
              <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                {formatTaka(customerBalance, isBn)}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="pt-2 flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'দোকানের নাম, ওষুধ, মুদি বা খাবার খুঁজুন...' : 'Search pharmacy, grocery, restaurant, or items...'}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all', labelBn: 'সকল পার্টনার', labelEn: 'All Partners' },
              { id: 'pharmacy', labelBn: 'ওষুধ ও স্বাস্থ্য', labelEn: 'Pharmacy' },
              { id: 'grocery', labelBn: 'মুদি ও বাজার', labelEn: 'Grocery' },
              { id: 'restaurant', labelBn: 'রেস্তোরাঁ ও নাস্তা', labelEn: 'Dining' },
              { id: 'electronics', labelBn: 'ইলেকট্রনিক্স', labelEn: 'Electronics' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isBn ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE DINAJPUR SADAR SVG VECTOR MAP */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'দিনাজপুর সদর জিরো-ক্যাশ রাডার ম্যাপ' : 'Dinajpur Sadar Zero-Cash Radar Map'}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {routeStops.length} {isBn ? 'টি স্টপ' : 'Stops'}
            </span>
          </div>

          {/* Navigation Control Buttons */}
          <div className="flex items-center gap-2">
            {isNavigating ? (
              <button
                onClick={handleStopNavigation}
                className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{isBn ? 'নেভিগেশন থামান' : 'Stop Navigation'}</span>
              </button>
            ) : (
              <button
                onClick={handleStartNavigation}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition"
              >
                <Compass className="w-4 h-4 text-slate-950" />
                <span>{isBn ? 'লাইভ নেভিগেশন শুরু করুন' : 'Start Live Navigation'}</span>
              </button>
            )}

            {Object.keys(completedStops).length > 0 && (
              <button
                onClick={handleResetRoute}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer"
                title={isBn ? 'রুট রিসেট' : 'Reset Route'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live HUD Banner when in Navigation mode */}
        {isNavigating && routeStops[activeStepIndex] && (
          <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 font-black flex items-center justify-center text-sm shrink-0">
                {activeStepIndex + 1}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-950">
                  {isBn ? `বর্তমান স্টপ (${activeStepIndex + 1}/${routeStops.length})` : `Active Stop (${activeStepIndex + 1}/${routeStops.length})`}
                </span>
                <h4 className="font-extrabold text-sm text-slate-950">
                  {isBn ? routeStops[activeStepIndex].merchantNameBn : routeStops[activeStepIndex].merchantName}
                </h4>
                <p className="text-xs text-amber-950 font-medium">
                  {isBn
                    ? `হাসপাতাল মোড়ের দিকে ২০০ মি সোজা যান • ${routeStops[activeStepIndex].discountTextBn}`
                    : `Head 200m towards ${routeStops[activeStepIndex].locationName} • ${routeStops[activeStepIndex].discountTextEn}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onOpenPayMerchant(
                    routeStops[activeStepIndex].merchantId,
                    routeStops[activeStepIndex].estimatedCost
                  )
                }
                className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{isBn ? 'এখানে কিউআর পে' : 'Pay QR Here'}</span>
              </button>
              <button
                onClick={() => handleMarkStopCompleted(routeStops[activeStepIndex])}
                className="px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isBn ? 'স্টপ সম্পন্ন' : 'Mark Visited'}</span>
              </button>
            </div>
          </div>
        )}

        {/* SVG Canvas Map */}
        <div className="relative w-full h-[320px] sm:h-[360px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner select-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              {/* Radial background grid */}
              <radialGradient id="customerRadarGrid" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
              </radialGradient>

              {/* Animated Route Flow Gradient */}
              <linearGradient id="routeFlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Rect */}
            <rect width="100" height="100" fill="url(#customerRadarGrid)" />

            {/* Grid Pattern */}
            <g stroke="#334155" strokeWidth="0.2" opacity="0.3">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((pos) => (
                <React.Fragment key={pos}>
                  <line x1={pos} y1="0" x2={pos} y2="100" />
                  <line x1="0" y1={pos} x2="100" y2={pos} />
                </React.Fragment>
              ))}
            </g>

            {/* Dinajpur Sadar Main Road Network Polyline */}
            <g stroke="#475569" strokeWidth="1.2" strokeLinecap="round" opacity="0.4">
              {/* Sadar East-West Highway */}
              <line x1="5" y1="64" x2="95" y2="64" />
              {/* Hospital Road Connector */}
              <line x1="24" y1="64" x2="38" y2="46" />
              <line x1="38" y1="46" x2="55" y2="38" />
              {/* Station Road Arterial */}
              <line x1="55" y1="38" x2="80" y2="42" />
              <line x1="38" y1="46" x2="49" y2="58" />
              <line x1="49" y1="58" x2="70" y2="55" />
            </g>

            {/* Street Landmark Labels */}
            <g fontSize="2" fill="#64748b" fontWeight="bold">
              <text x="18" y="70">গণেশতলা মোড় (Goneshtola)</text>
              <text x="34" y="42">হাসপাতাল মোড় (Hospital Mor)</text>
              <text x="56" y="34">স্টেশন রোড (Station Rd)</text>
              <text x="50" y="63">সদর বাজার (Sadar Bazar)</text>
              <text x="70" y="52">পাহাড়পুর (Paharpur)</text>
            </g>

            {/* Zero-Cash Dynamic Polyline Path Connecting User -> Stop 1 -> Stop 2 -> Stop 3... */}
            {routeStops.length > 0 && (
              <polyline
                points={[
                  `${userLocation.x},${userLocation.y}`,
                  ...routeStops.map((s) => `${s.coords.x},${s.coords.y}`),
                ].join(' ')}
                fill="none"
                stroke="url(#routeFlowGrad)"
                strokeWidth="1.5"
                strokeDasharray="2 1.5"
                strokeLinecap="round"
                filter="url(#routeGlow)"
                className="animate-pulse"
              />
            )}

            {/* Nearby Agent Pin (Crowded Agent Warning to avoid queue) */}
            {crowdedAgent && (
              <g
                transform={`translate(${crowdedAgent.coords.x}, ${crowdedAgent.coords.y})`}
                className="cursor-pointer"
                opacity="0.85"
              >
                <circle r="3.5" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                <circle r="2.2" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
                <text x="3.5" y="1" fontSize="1.8" fill="#f87171" fontWeight="bold">
                  {crowdedAgent.nameBn.slice(0, 10)} (লাইনে {crowdedAgent.queueLength} জন)
                </text>
              </g>
            )}

            {/* Verified Merchant Pins on Map */}
            {routeStops.map((stop, idx) => {
              const isActive = isNavigating && activeStepIndex === idx;
              const isDone = stop.isCompleted;

              return (
                <g
                  key={stop.id}
                  transform={`translate(${stop.coords.x}, ${stop.coords.y})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => {
                    const original = merchants.find((m) => m.id === stop.merchantId) || null;
                    setActivePinDetails(original);
                  }}
                >
                  {/* Outer pulse if active */}
                  {isActive && (
                    <circle r="5" fill="#f59e0b" fillOpacity="0.4" className="animate-ping" />
                  )}

                  {/* Marker Pin Circle */}
                  <circle
                    r={isActive ? 3.8 : 3}
                    fill={isDone ? '#10b981' : isActive ? '#f59e0b' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                  />

                  {/* Step Number in circle */}
                  <text
                    x="0"
                    y="1.1"
                    textAnchor="middle"
                    fontSize="2.2"
                    fill="#020617"
                    fontWeight="900"
                  >
                    {isDone ? '✓' : idx + 1}
                  </text>

                  {/* Offer Tag badge above pin */}
                  <rect
                    x="-6"
                    y="-6.5"
                    width="12"
                    height="3"
                    rx="1.5"
                    fill="#0f172a"
                    stroke="#f59e0b"
                    strokeWidth="0.3"
                  />
                  <text
                    x="0"
                    y="-4.5"
                    textAnchor="middle"
                    fontSize="1.6"
                    fill="#fbbf24"
                    fontWeight="bold"
                  >
                    {isBn ? stop.discountTextBn.split(' ')[0] + ' ' + stop.discountTextBn.split(' ')[1] : stop.discountTextEn}
                  </text>
                </g>
              );
            })}

            {/* Current User Origin Marker (Goneshtola Mor) */}
            <g transform={`translate(${userLocation.x}, ${userLocation.y})`}>
              <circle r="6" fill="#3b82f6" fillOpacity="0.2" className="animate-ping" />
              <circle r="4" fill="#3b82f6" fillOpacity="0.4" />
              <circle r="2.6" fill="#60a5fa" stroke="#ffffff" strokeWidth="0.8" />
              {/* User Label */}
              <text x="4" y="1" fontSize="2" fill="#93c5fd" fontWeight="bold">
                {isBn ? 'আপনি এখানে (গণেশতলা)' : 'You are here (Goneshtola)'}
              </text>
            </g>
          </svg>

          {/* Floating Pin Details Popover */}
          {activePinDetails && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 bg-slate-900/95 backdrop-blur-md border border-amber-400/40 rounded-2xl p-4 text-xs text-white shadow-2xl space-y-2 z-20 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm text-white">
                    {isBn ? activePinDetails.nameBn : activePinDetails.name}
                  </span>
                </div>
                <button
                  onClick={() => setActivePinDetails(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-slate-300">
                {activePinDetails.location}
              </p>

              {activePinDetails.activeOffers?.[0] && (
                <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {isBn
                      ? activePinDetails.activeOffers[0].titleBn
                      : activePinDetails.activeOffers[0].title}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-emerald-400 font-bold">
                  {isBn ? 'জিরো-ক্যাশ পেমেন্ট গ্রহণযোগ্য' : 'Zero-Cash QR Verified'}
                </span>
                <button
                  onClick={() => {
                    onOpenPayMerchant(activePinDetails.id, activePinDetails.avgTicketSize || 500);
                    setActivePinDetails(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm cursor-pointer"
                >
                  {isBn ? 'কিউআর পে' : 'Pay QR'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. STEP-BY-STEP ITINERARY LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>{isBn ? 'লাইভ স্টপ ও ডিসকাউন্ট খতিয়ান' : 'Live Route Stops & Discount Itinerary'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn ? 'প্রতিটি স্টপে সরাসরি উপায় কিউআরে পেমেন্ট করে ক্যাশ-আউট ফি সম্পূর্ণ পরিহার করুন' : 'Pay directly via Upay QR at each stop to completely bypass cash-out fees'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
            {Object.keys(completedStops).length} / {routeStops.length} {isBn ? 'সম্পন্ন' : 'Visited'}
          </span>
        </div>

        {/* Steps List */}
        <div className="space-y-3 pt-1">
          {routeStops.map((stop, idx) => {
            const isCompleted = stop.isCompleted;
            const isCurrent = isNavigating && activeStepIndex === idx;

            return (
              <div
                key={stop.id}
                className={`p-4 rounded-2xl border transition ${
                  isCurrent
                    ? 'bg-amber-50 dark:bg-amber-400/10 border-amber-400 shadow-md'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-slate-950/60 border-emerald-500/40 opacity-75'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Stop Index & Merchant Info */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl font-black flex items-center justify-center text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {isBn ? stop.merchantNameBn : stop.merchantName}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {isBn ? stop.categoryBn : stop.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          <span>{stop.locationName}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>{stop.distanceKm} km (~{stop.walkMinutes} min walk)</span>
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{isBn ? stop.discountTextBn : stop.discountTextEn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Financial Cost + Pay QR Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block">
                        ~{formatTaka(stop.estimatedCost, isBn)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                        +{formatTaka(stop.discount, isBn)} {isBn ? 'সাশ্রয়' : 'saved'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenPayMerchant(stop.merchantId, stop.estimatedCost)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition active:scale-95"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{isBn ? 'কিউআর পে' : 'Pay QR'}</span>
                      </button>

                      <button
                        onClick={() => handleMarkStopCompleted(stop)}
                        className={`p-1.5 rounded-xl border transition cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 hover:text-emerald-500'
                        }`}
                        title={isBn ? 'স্টপ সম্পন্ন মার্ক করুন' : 'Mark as visited'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FINANCIAL COMPARISON: TRADITIONAL CASHOUT VS UPAY ZERO-CASH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Traditional Way (Loss & Delay) */}
        <div className="p-5 rounded-3xl bg-red-50/50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-red-700 dark:text-red-400">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>{isBn ? 'ঐতিহ্যবাহী ক্যাশ-আউট পদ্ধতি' : 'Traditional Cash-Out Way'}</span>
            </span>
            <span className="font-mono">৳ ৩৬ ফি লস</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>{isBn ? 'এজেন্টে ক্যাশ-আউট ফি (১.৪%):' : 'Agent Cash-Out Fee (1.4%):'}</span>
              <span className="font-mono text-red-600 font-bold">-{formatTaka(potentialCashoutFee, isBn)}</span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'এজেন্টের কাউন্টারে লাইন অপেক্ষা:' : 'Queue waiting time at agent:'}</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ~{crowdedAgent?.avgWaitTimeMin || 18} {isBn ? 'মিনিট' : 'minutes'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'দোকানে ক্যাশ পেমেন্টে ডিসকাউন্ট:' : 'Merchant discounts on cash:'}</span>
              <span className="font-mono text-slate-400">৳ ০ (নেই)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Upay Zero-Cash Way (Profits & Direct QR) */}
        <div className="p-5 rounded-3xl bg-emerald-50/60 dark:bg-emerald-500/5 border border-emerald-300 dark:border-emerald-500/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{isBn ? 'উপায় জিরো-ক্যাশ স্মার্ট রুট' : 'Upay Zero-Cash Smart Route'}</span>
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              +{formatTaka(netSavings, isBn)} {isBn ? 'মোট লাভ' : 'Net Gain'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>{isBn ? 'ক্যাশ-আউট ফি সম্পূর্ণ মাফ:' : 'Avoided Cash-Out Charge:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                +{formatTaka(potentialCashoutFee, isBn)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'সরাসরি কিউআরে ফ্ল্যাট ও ক্যাশব্যাক ছাড়:' : 'Direct QR discounts & cashback:'}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                +{formatTaka(totalDiscounts, isBn)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{isBn ? 'এজেন্টের লাইনে সময় সাশ্রয়:' : 'Time saved bypassing agent queue:'}</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                {crowdedAgent?.avgWaitTimeMin || 18} {isBn ? 'মিনিট বাঁচে' : 'min saved'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SUMMARY BOTTOM ACTION BAR */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-emerald-300/80 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-0.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-300">
              {isBn ? 'জিরো-ক্যাশ মোট নেট সাশ্রয়:' : 'Net Upay Route Savings:'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-black font-mono bg-emerald-500 text-white">
              {formatTaka(netSavings, isBn)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn
              ? `মোট খরচ আনুমানিক ${formatTaka(totalCost, true)} • ব্যালেন্স অবশিষ্ট থাকবে ${formatTaka(Math.max(0, customerBalance - totalCost + totalDiscounts), true)}`
              : `Total shopping ~${formatTaka(totalCost, false)} • Balance remaining ${formatTaka(Math.max(0, customerBalance - totalCost + totalDiscounts), false)}`}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isBalanceSufficient && (
            <button
              onClick={onOpenAddMoney}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? 'টাকা যোগ করুন' : 'Add Money'}</span>
            </button>
          )}

          <button
            onClick={handleStartNavigation}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-400/20 cursor-pointer active:scale-95 transition"
          >
            <Navigation className="w-4 h-4 text-slate-950" />
            <span>{isBn ? 'লাইভ রুট শুরু করুন' : 'Start Live Route'}</span>
          </button>
        </div>
      </div>

      {/* Completion Modal when all stops visited */}
      {routeFinished && (
        <div className="p-6 rounded-3xl bg-emerald-500 text-white shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-white" />
              <h3 className="font-extrabold text-base">
                {isBn ? 'অভিনন্দন! জিরো-ক্যাশ রুট সম্পন্ন হয়েছে' : 'Congratulations! Zero-Cash Route Completed'}
              </h3>
            </div>
            <button
              onClick={() => setRouteFinished(false)}
              className="text-white/80 hover:text-white text-xs font-bold"
            >
              {isBn ? 'বন্ধ করুন' : 'Dismiss'}
            </button>
          </div>
          <p className="text-xs text-emerald-50 leading-relaxed">
            {isBn
              ? `আপনি সকল দোকানে ডিজিটাল উপায় কিউআরে পেমেন্ট করে মোট ${formatTaka(netSavings, true)} ফি ও ডিসকাউন্ট সাশ্রয় করেছেন এবং এজেন্টের লম্বা লাইনের অপেক্ষা এড়িয়ে গেছেন!`
              : `You successfully completed your purchases using Upay QR, saving a total of ${formatTaka(netSavings, false)} and skipping agent cash-out queues completely!`}
          </p>
        </div>
      )}
    </div>
  );
};
