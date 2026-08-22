import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
}

const ErrorFallback = ({ error, resetErrorBoundary, sectionName }: { error: any, resetErrorBoundary: () => void, sectionName?: string }) => {
  return (
    <div className="w-full py-12 px-4 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-navy-800/30 rounded-3xl border border-gray-100 dark:border-white/5 my-8">
      <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {sectionName ? `Unable to load ${sectionName}` : 'Section unavailable'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
        We encountered an issue while loading this content. The rest of the page should still work normally.
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={resetErrorBoundary}
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Try Again
      </Button>
      {import.meta.env.DEV && error && (
        <pre className="mt-6 p-4 bg-gray-900 text-red-400 text-xs rounded-lg max-w-full overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      )}
    </div>
  );
};

export const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({ children, sectionName }) => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <ErrorFallback {...props} sectionName={sectionName} />}
      onReset={() => {
        // Reset state or query cache if needed. 
        // With react-query, query errors will retry automatically on mount or window focus.
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
