import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  theme?: 'dark' | 'light' | 'auto';
  linkTo?: string | null;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  theme = 'dark',
  linkTo = '/',
  className
}) => {
  const [imgError, setImgError] = useState(false);

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-wider',
    md: 'text-base font-bold tracking-wider',
    lg: 'text-2xl font-extrabold tracking-wide',
    xl: 'text-3xl font-extrabold tracking-wide'
  };

  const subSizes = {
    sm: 'text-[9px] tracking-widest',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-sm tracking-widest'
  };

  const content = (
    <div className={cn("inline-flex items-center gap-3 group transition-all select-none", className)}>
      {/* Emblem Icon */}
      <div className={cn(
        "relative shrink-0 rounded-2xl overflow-hidden shadow-lg border transition-transform duration-300 group-hover:scale-105",
        iconSizes[size],
        theme === 'light' 
          ? "border-slate-200 bg-white shadow-slate-200/50" 
          : "border-cyan-500/30 bg-slate-950 shadow-cyan-950/40 ring-1 ring-white/10"
      )}>
        {!imgError ? (
          <img
            src="/images/logo.png"
            alt="Norway SmartLife Emblem"
            className="w-full h-full object-cover object-center"
            onError={() => setImgError(true)}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-950 via-slate-900 to-deep-night text-cyan-400">
            <Compass className="w-1/2 h-1/2 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "font-display uppercase tracking-widest",
              titleSizes[size],
              theme === 'light' ? "text-slate-900" : "text-white"
            )}>
              NORWAY
            </span>
            <span className={cn(
              "font-display uppercase font-bold text-cyan-400 tracking-wider",
              titleSizes[size]
            )}>
              SMARTLIFE
            </span>
          </div>

          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs">🇳🇴</span>
              <span className={cn(
                "uppercase font-semibold text-slate-400",
                subSizes[size]
              )}>
                EXPLORE • CONNECT • LIVE SMART
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};
