import React from 'react';
import { Loader2, Compass } from 'lucide-react';
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
      "flex flex-col items-center justify-center p-8 text-center",
      fullScreen ? "min-h-[70vh] w-full" : "w-full py-16",
      className
    )}>
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-full bg-royal-fjord/15 border border-royal-fjord/30 flex items-center justify-center shadow-[0_0_20px_rgba(29,78,216,0.2)]">
          <Compass className="w-7 h-7 text-glacier-blue animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-glacier-blue absolute -bottom-1 -right-1" />
      </div>
      <h4 className="text-base font-bold text-snow tracking-tight mb-1">{message}</h4>
      {submessage && (
        <p className="text-xs text-slate-400 max-w-sm">{submessage}</p>
      )}
    </div>
  );
};
