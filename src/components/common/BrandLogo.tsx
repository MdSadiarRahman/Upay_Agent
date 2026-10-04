import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
  subtitleText?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
  subtitleText = 'MFS Intelligence & Local Commerce',
}) => {
  // Dimension definitions
  const dimensions = {
    sm: {
      box: 'w-8 h-8',
      svgSize: 18,
      textSize: 'text-base',
      badgeSize: 'text-[9px] px-1.5 py-0.5',
      subtextSize: 'text-[10px]',
    },
    md: {
      box: 'w-10 h-10',
      svgSize: 22,
      textSize: 'text-lg',
      badgeSize: 'text-[10px] px-2 py-0.5',
      subtextSize: 'text-[11px]',
    },
    lg: {
      box: 'w-12 h-12',
      svgSize: 26,
      textSize: 'text-2xl',
      badgeSize: 'text-xs px-2.5 py-0.5',
      subtextSize: 'text-xs',
    },
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Icon Mark */}
      <div
        className={`relative flex items-center justify-center ${dimensions.box} rounded-2xl bg-gradient-to-br from-amber-400 via-amber-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-400/20 ring-1 ring-amber-400/40 shrink-0 transition-transform duration-200 hover:scale-[1.03]`}
        aria-hidden="true"
      >
        {/* Dynamic Fintech Pulse SVG */}
        <svg
          width={dimensions.svgSize}
          height={dimensions.svgSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-slate-950"
        >
          {/* Fluid 'u' curve + financial pulse wave */}
          <path
            d="M4.5 5.5V11.5C4.5 14.5376 6.96243 17 10 17H10.5"
            stroke="currentColor"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          {/* Real-time Financial Pulse wave upward trajectory */}
          <path
            d="M10 17L12.25 11.5L15 19L17.5 13H20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* AI Intelligence Connection Spark node */}
          <circle cx="19.75" cy="7.25" r="2.25" fill="currentColor" />
        </svg>

        {/* Live System Operational Indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white dark:ring-slate-950"></span>
        </span>
      </div>

      {/* Brand Typography Lockup */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${dimensions.textSize} leading-none`}>
              Upay<span className="text-amber-500 dark:text-amber-400">Pulse</span>
            </span>
            <span
              className={`font-black uppercase tracking-wider bg-slate-950 text-amber-400 dark:bg-amber-400 dark:text-slate-950 rounded-md font-mono ${dimensions.badgeSize}`}
            >
              AI
            </span>
          </div>

          {showSubtitle && (
            <span className={`text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5 ${dimensions.subtextSize} truncate`}>
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
