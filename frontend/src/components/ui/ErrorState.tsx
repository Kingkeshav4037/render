import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState: React.FC<{ 
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while trying to load this content.",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center w-full py-12 bg-red-50/50 dark:bg-red-500/5 rounded-2xl border border-red-100 dark:border-red-500/10">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
