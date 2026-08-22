import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface AsyncStateWrapperProps<T> {
  isLoading: boolean;
  error: Error | null | unknown;
  data: T | null | undefined;
  emptyMessage?: string;
  errorMessage?: string;
  skeleton?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  onRetry?: () => void;
}

export function AsyncStateWrapper<T>({
  isLoading,
  error,
  data,
  emptyMessage = 'No items found.',
  errorMessage = 'An error occurred while loading this section.',
  skeleton,
  children,
  onRetry
}: AsyncStateWrapperProps<T>) {
  
  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;
    // Default fallback loader
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-arctic-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-4 flex flex-col items-center justify-center bg-red-500/5 dark:bg-red-500/10 rounded-2xl border border-red-500/20 my-8">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {errorMessage}
        </h3>
        {import.meta.env.DEV && (
          <p className="text-sm text-red-500/80 max-w-lg text-center mb-4 break-words">
            {error instanceof Error ? error.message : String(error)}
          </p>
        )}
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Handle empty arrays or null data
  const isEmpty = 
    data === null || 
    data === undefined || 
    (Array.isArray(data) && data.length === 0);

  if (isEmpty) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-snow/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 text-snow/30">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-lg text-gray-500 dark:text-snow/70">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children(data as T)}</>;
}
