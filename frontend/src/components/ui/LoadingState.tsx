import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoadingState: React.FC<{ 
  message?: string;
  fullScreen?: boolean;
  className?: string;
}> = ({ message = "Loading...", fullScreen = false, className }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      fullScreen ? "h-screen w-full" : "w-full py-12",
      className
    )}>
      <Loader2 className="w-10 h-10 animate-spin text-aurora-green mb-4" />
      <p className="text-gray-500 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );
};
