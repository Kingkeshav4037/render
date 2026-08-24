import React from 'react';
import { AlertCircle, RefreshCw, Compass, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface AsyncStateWrapperProps<T> {
  isLoading: boolean;
  error: Error | null | unknown;
  data: T | null | undefined;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onResetFilters?: () => void;
  errorMessage?: string;
  skeleton?: React.ReactNode;
  children: (data: T) => React.ReactNode;
  onRetry?: () => void;
}

export function AsyncStateWrapper<T>({
  isLoading,
  error,
  data,
  emptyTitle = 'No Results Found',
  emptyMessage = 'We could not find any items matching your criteria. Try adjusting your filters or search terms.',
  emptyActionLabel,
  onEmptyAction,
  onResetFilters,
  errorMessage = 'An error occurred while loading this content.',
  skeleton,
  children,
  onRetry
}: AsyncStateWrapperProps<T>) {
  
  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;
    // Default fallback loader
    return (
      <div className="w-full py-16 flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/10 border-t-arctic-gold"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-snow/50">Loading Experiences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 px-6 flex flex-col items-center justify-center bg-red-500/10 rounded-3xl border border-red-500/20 my-8 text-center max-w-2xl mx-auto shadow-xl">
        <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-snow mb-2">
          {errorMessage}
        </h3>
        <p className="text-sm text-snow/60 max-w-md mx-auto mb-6 leading-relaxed">
          The server encountered an issue retrieving this information. You can try refreshing the data.
        </p>
        {import.meta.env.DEV && (
          <div className="bg-deep-night/80 border border-red-500/30 text-xs text-red-400 p-3 rounded-xl mb-6 max-w-md overflow-x-auto text-left font-mono">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}
        {onRetry && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
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
    const handleAction = onResetFilters || onEmptyAction;
    const actionText = onResetFilters ? 'Clear All Filters' : (emptyActionLabel || 'Reset Filters');

    return (
      <div className="w-full py-20 px-6 flex flex-col items-center justify-center text-center bg-midnight/60 rounded-3xl border border-white/5 shadow-xl my-6">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-5 text-arctic-gold border border-white/10">
          <Compass className="w-8 h-8 opacity-80" />
        </div>
        <h3 className="text-2xl font-display font-bold text-snow mb-2">{emptyTitle}</h3>
        <p className="text-sm text-snow/60 max-w-md mx-auto mb-8 leading-relaxed">{emptyMessage}</p>
        
        {handleAction && (
          <Button 
            variant="outline" 
            onClick={handleAction}
            className="flex items-center gap-2 px-6 py-2.5"
          >
            <RotateCcw className="w-4 h-4" /> {actionText}
          </Button>
        )}
      </div>
    );
  }

  return <>{children(data as T)}</>;
}

