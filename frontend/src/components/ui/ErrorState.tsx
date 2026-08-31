import React from 'react';
import { 
  AlertTriangle, 
  WifiOff, 
  ShieldAlert, 
  FileQuestion, 
  CreditCard, 
  Database, 
  ServerCrash, 
  RotateCcw, 
  ArrowLeft, 
  Home, 
  LifeBuoy 
} from 'lucide-react';
import { Button } from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type ErrorType = 
  | 'NETWORK' 
  | 'AUTH_EXPIRED' 
  | 'PERMISSION_DENIED' 
  | 'NOT_FOUND' 
  | 'PAYMENT_GATEWAY' 
  | 'DATABASE' 
  | 'SERVER' 
  | 'UNKNOWN';

interface ErrorClassification {
  title: string;
  message: string;
  icon: React.ReactNode;
  actionText: string;
}

const ERROR_CONFIGS: Record<ErrorType, ErrorClassification> = {
  NETWORK: {
    title: 'Network Connection Lost',
    message: 'Unable to reach the Norway SmartLife cloud servers. Please check your internet connection and try again.',
    icon: <WifiOff className="w-8 h-8 text-amber-400" aria-hidden="true" />,
    actionText: 'Retry Connection'
  },
  AUTH_EXPIRED: {
    title: 'Session Expired',
    message: 'Your authenticated session has ended for your security. Please sign in again to continue your journey.',
    icon: <ShieldAlert className="w-8 h-8 text-cyan-400" aria-hidden="true" />,
    actionText: 'Sign In Again'
  },
  PERMISSION_DENIED: {
    title: 'Access Restricted',
    message: 'You do not have administrative or provider permissions to access this Norwegian resource.',
    icon: <ShieldAlert className="w-8 h-8 text-rose-400" aria-hidden="true" />,
    actionText: 'Return to Dashboard'
  },
  NOT_FOUND: {
    title: 'Resource Not Located',
    message: 'The requested destination, hotel, trail, or itinerary could not be found or has been moved.',
    icon: <FileQuestion className="w-8 h-8 text-indigo-400" aria-hidden="true" />,
    actionText: 'Explore Norway'
  },
  PAYMENT_GATEWAY: {
    title: 'Payment Processing Disrupted',
    message: 'The payment transaction could not be authorized. Your card has not been charged.',
    icon: <CreditCard className="w-8 h-8 text-rose-400" aria-hidden="true" />,
    actionText: 'Try Payment Again'
  },
  DATABASE: {
    title: 'Data Synchronization Error',
    message: 'Temporary delay syncing with our Norwegian travel catalog. Please refresh to load fresh data.',
    icon: <Database className="w-8 h-8 text-purple-400" aria-hidden="true" />,
    actionText: 'Reload Data'
  },
  SERVER: {
    title: 'Service Temporarily Unavailable',
    message: 'Our Nordic cloud services are experiencing heavy load. Our team has been notified and is on it.',
    icon: <ServerCrash className="w-8 h-8 text-rose-400" aria-hidden="true" />,
    actionText: 'Retry Request'
  },
  UNKNOWN: {
    title: 'Unexpected Exception Occurred',
    message: 'An unforeseen error interrupted your browsing experience. You can retry or head back home safely.',
    icon: <AlertTriangle className="w-8 h-8 text-amber-400" aria-hidden="true" />,
    actionText: 'Try Again'
  }
};

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  errorDetails?: string | Error;
  onRetry?: () => void;
  showHome?: boolean;
  showBack?: boolean;
  showSupport?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  type = 'UNKNOWN',
  title, 
  message, 
  errorDetails,
  onRetry,
  showHome = true,
  showBack = true,
  showSupport = false,
  className
}) => {
  const navigate = useNavigate();
  const config = ERROR_CONFIGS[type] || ERROR_CONFIGS.UNKNOWN;

  const finalTitle = title || config.title;
  const finalMessage = message || config.message;
  const finalIcon = config.icon;

  const errorMessageString = errorDetails 
    ? (typeof errorDetails === 'string' ? errorDetails : errorDetails.message) 
    : null;

  return (
    <div 
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center w-full py-12 bg-midnight/90 rounded-3xl border border-rose-500/20 shadow-2xl select-none",
        className
      )}
    >
      <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-4 border border-rose-500/20 shadow-inner">
        {finalIcon}
      </div>
      <h3 className="text-2xl font-display font-bold text-snow mb-2 tracking-tight">{finalTitle}</h3>
      <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed text-sm">{finalMessage}</p>

      {/* Optional technical error trace in development */}
      {errorMessageString && (
        <div className="mb-6 p-3 bg-deep-night/80 rounded-xl border border-rose-500/30 text-rose-300 font-mono text-xs max-w-lg text-left overflow-x-auto">
          {errorMessageString}
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="flex items-center gap-2">
            <RotateCcw size={16} aria-hidden="true" /> {config.actionText}
          </Button>
        )}

        {showBack && (
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Go Back
          </Button>
        )}

        {showHome && (
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 text-snow hover:text-arctic-gold">
              <Home size={16} aria-hidden="true" /> Return Home
            </Button>
          </Link>
        )}

        {showSupport && (
          <Link to="/contact">
            <Button variant="ghost" className="flex items-center gap-2 text-slate-400 hover:text-snow">
              <LifeBuoy size={16} aria-hidden="true" /> Support
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
