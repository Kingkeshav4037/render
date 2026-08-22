import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import React from 'react';

// ─── Shared fallback UI ───────────────────────────────────────────────────────
// Used by both GlobalErrorBoundary (full-screen) and RouteErrorBoundary (inline).

interface ErrorFallbackProps extends FallbackProps {
  /** Human-readable label for the route group, used in console error logging. */
  groupName?: string;
  /** When true the fallback fills the full viewport (used at the app root). */
  fullScreen?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  groupName,
  fullScreen = true,
}) => {
  // ── Error logging ─────────────────────────────────────────────────────
  // Log once on mount so every boundary records into the browser console
  // (and can be picked up by external error-tracking integrations later).
  React.useEffect(() => {
    const context = groupName ? `[${groupName}]` : '[App]';
    console.error(`${context} Unhandled render error:`, error);
  }, [error, groupName]);

  const wrapperClass = fullScreen
    ? 'min-h-screen bg-slate-950 flex items-center justify-center p-4'
    : 'min-h-[40vh] flex items-center justify-center p-4';

  return (
    <div className={wrapperClass} role="alert" data-testid="error-boundary-fallback">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-2xl">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-rose-400" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-white mb-2">
          Something went wrong.
        </h2>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
          {groupName
            ? `An unexpected error occurred in the ${groupName} section.`
            : 'An unexpected application error occurred.'}
          {' '}You can retry or return to the home page.
        </p>

        {/* Dev-only error details */}
        {import.meta.env.DEV && (
          <div className="bg-slate-950 text-left p-4 rounded-lg overflow-auto mb-6 text-xs text-rose-400 font-mono border border-rose-900/50 max-h-32">
            <strong className="block mb-1 text-rose-300">
              {(error as Error).name ?? 'Error'}
            </strong>
            {(error as Error).message}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Return Home — always visible */}
          <a
            href="/home"
            data-testid="error-boundary-home-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Return Home
          </a>

          {/* Retry — resets the error boundary and re-renders */}
          <button
            onClick={resetErrorBoundary}
            data-testid="error-boundary-retry-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCcw className="w-4 h-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Global Error Boundary ────────────────────────────────────────────────────
// Wraps the entire app (placed in main.tsx). Shows full-screen fallback.

export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          onError={(error) => {
            // Dedicated top-level log — the fallback also logs, but this
            // fires even before the fallback mounts.
            console.error('[GlobalErrorBoundary] Fatal render error:', error);
          }}
          FallbackComponent={(props) => (
            <ErrorFallback {...props} groupName="Application" fullScreen />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

// ─── Route Error Boundary ─────────────────────────────────────────────────────
// Lightweight boundary used around individual route groups. Does NOT wrap a
// QueryErrorResetBoundary (the parent GlobalErrorBoundary already does that for
// the whole tree); instead it simply catches render errors in its subtree,
// logs them with context, and shows the shared fallback UI.

interface RouteErrorBoundaryProps {
  /** Label shown in the fallback message and in console output. */
  groupName: string;
  children: React.ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  groupName,
  children,
}) => {
  return (
    <ErrorBoundary
      onError={(error) => {
        console.error(`[RouteErrorBoundary:${groupName}] Render error:`, error);
      }}
      FallbackComponent={(props) => (
        <ErrorFallback {...props} groupName={groupName} fullScreen={false} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
