import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoadingState: React.FC<{ 
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
  className?: string;
}> = ({ 
  message = "Loading experiences...", 
  submessage,
  fullScreen = false, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center select-none font-sans",
      fullScreen ? "min-h-[70vh] w-full" : "w-full py-16",
      className
    )}>
      <div className="relative mb-5 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 ring-4 ring-cyan-500/10 animate-pulse bg-slate-950">
            <img 
              src="/images/logo.png" 
              alt="Norway SmartLife" 
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400 absolute -bottom-2 -right-2 bg-slate-950 rounded-full p-0.5 border border-cyan-500/40 shadow-lg" />
        </div>
      </div>
      <h4 className="text-base font-bold text-snow tracking-tight mb-1">{message}</h4>
      {submessage && (
        <p className="text-xs text-slate-400 max-w-sm">{submessage}</p>
      )}
    </div>
  );
};
