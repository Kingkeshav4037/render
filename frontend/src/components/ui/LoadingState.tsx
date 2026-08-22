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
        <div className="w-14 h-14 rounded-full bg-aurora-green/15 border border-aurora-green/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,135,0.2)]">
          <Compass className="w-7 h-7 text-aurora-green animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-aurora-green absolute -bottom-1 -right-1" />
      </div>
      <h4 className="text-base font-bold text-navy-900 dark:text-white tracking-tight mb-1">{message}</h4>
      {submessage && (
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">{submessage}</p>
      )}
    </div>
  );
};
