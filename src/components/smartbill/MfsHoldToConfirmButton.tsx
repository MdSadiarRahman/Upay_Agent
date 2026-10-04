import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '../../types';

interface MfsHoldToConfirmButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  language: Language;
  actionType?: 'pay' | 'schedule';
  amount?: number;
}

export const MfsHoldToConfirmButton: React.FC<MfsHoldToConfirmButtonProps> = ({
  onConfirm,
  disabled = false,
  isProcessing = false,
  language,
  actionType = 'pay',
  amount,
}) => {
  const isBn = language === 'bn';
  const [progress, setProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const HOLD_DURATION = 1200; // 1.2 seconds hold required for human verification

  const clearHold = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
    if (!isCompleted) {
      setProgress(0);
    }
  }, [isCompleted]);

  const handleHoldStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || isProcessing || isCompleted) return;
    
    // Prevent default touch behaviors like text selection
    if ('touches' in e && e.cancelable) {
      // touchstart
    }

    setIsHolding(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setIsHolding(false);
        setIsCompleted(true);

        // Haptic feedback if available on mobile
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 50, 80]);
          } catch {
            // Ignore
          }
        }

        setTimeout(() => {
          onConfirm();
          setTimeout(() => {
            setIsCompleted(false);
            setProgress(0);
          }, 800);
        }, 200);
      }
    }, 16);
  };

  const handleHoldEnd = () => {
    clearHold();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2 select-none">
      {/* Primary MFS Hold-to-Confirm Surface */}
      <div
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        className={`relative overflow-hidden rounded-2xl h-14 border transition-all cursor-pointer flex items-center justify-between px-5 ${
          disabled
            ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
            : isCompleted
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-md scale-[0.99]'
            : isHolding
            ? 'bg-amber-400/90 border-amber-500 shadow-md scale-[0.99]'
            : 'bg-linear-to-r from-amber-400 via-amber-300 to-amber-400 border-amber-400/80 hover:shadow-md active:scale-[0.99]'
        }`}
      >
        {/* Progress fill animation bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 transition-all duration-75 ease-out ${
            isCompleted
              ? 'bg-emerald-600'
              : 'bg-slate-950/20 dark:bg-slate-950/30'
          }`}
          style={{ width: `${progress}%` }}
        />

        {/* Left Icon (Lock / Sparkle / Check) */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-white text-emerald-600 shadow-xs'
                : isHolding
                ? 'bg-slate-950 text-amber-400 shadow-xs scale-110'
                : 'bg-slate-950/10 dark:bg-slate-950/20 text-slate-950'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-scale-in" />
            ) : isProcessing ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : isHolding ? (
              <ShieldCheck className="w-5 h-5 text-amber-400 animate-pulse" />
            ) : (
              <Lock className="w-4 h-4 text-slate-950" />
            )}
          </div>

          <div className="text-left">
            <span className="block font-black text-xs sm:text-sm text-slate-950 leading-tight">
              {isCompleted
                ? isBn
                  ? 'অনুমোদন সফল!'
                  : 'Authorized!'
                : isProcessing
                ? isBn
                  ? 'প্রক্রিয়াকরণ হচ্ছে...'
                  : 'Processing...'
                : isHolding
                ? isBn
                  ? `ধরে রাখুন... ${Math.round(progress)}%`
                  : `Hold firmly... ${Math.round(progress)}%`
                : actionType === 'schedule'
                ? isBn
                  ? 'শিডিউল করতে ট্যাপ করে ধরে রাখুন'
                  : 'Tap and hold to Schedule'
                : isBn
                ? 'পেমেন্ট করতে ট্যাপ করে ধরে রাখুন'
                : 'Tap and hold to Confirm Payment'}
            </span>
            <span className="block text-[10px] text-slate-800/80 font-medium">
              {isCompleted
                ? isBn
                  ? 'নিরাপদ ক্লিয়ারিং সম্পন্ন হচ্ছে'
                  : 'Secure clearing in progress'
                : isHolding
                ? isBn
                  ? '১.২ সেকেন্ড ধরে রাখুন'
                  : 'Hold for 1.2s to authorize'
                : isBn
                ? 'মানুষের নিজস্ব নিয়ন্ত্রণ নিশ্চিতকরণ'
                : 'Human-governed conscious action'}
            </span>
          </div>
        </div>

        {/* Right Arrow / Pulse Indicator */}
        <div className="relative z-10 hidden sm:flex items-center gap-1 font-bold text-xs text-slate-950">
          {!isCompleted && !isProcessing && (
            <div className="flex items-center gap-0.5 animate-pulse">
              <ArrowRight className="w-4 h-4" />
              <ArrowRight className="w-4 h-4 -ml-2" />
            </div>
          )}
        </div>
      </div>

      {/* Accessible direct click fallback for desktop users or fast testing */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>{isBn ? 'জিরো অটো-ডেবিট পলিসি' : 'Zero Auto-Debit Policy'}</span>
        </span>

        {!disabled && !isProcessing && (
          <button
            type="button"
            onClick={onConfirm}
            className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {isBn ? 'অথবা সরাসরি ১-ক্লিকে নিশ্চিত করুন' : 'Or click directly to confirm'}
          </button>
        )}
      </div>
    </div>
  );
};
