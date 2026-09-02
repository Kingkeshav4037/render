import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Receipt, 
  ArrowRight, 
  Home, 
  CalendarCheck2, 
  HeartHandshake 
} from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type SuccessStatePreset = 
  | 'BOOKING_CONFIRMED'
  | 'PAYMENT_SUCCESSFUL'
  | 'ORDER_PLACED'
  | 'MESSAGE_SENT'
  | 'PROFILE_SAVED'
  | 'FEEDBACK_SUBMITTED'
  | 'CUSTOM';

const SUCCESS_PRESETS: Record<Exclude<SuccessStatePreset, 'CUSTOM'>, {
  title: string;
  message: string;
  icon: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}> = {
  BOOKING_CONFIRMED: {
    title: 'Norwegian Experience Confirmed',
    message: 'Your reservation has been locked in. We have emailed your detailed itinerary and check-in coordinates.',
    icon: <CalendarCheck2 className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'View My Bookings',
    actionHref: '/dashboard'
  },
  PAYMENT_SUCCESSFUL: {
    title: 'Payment Successfully Processed',
    message: 'Your payment was authorized and verified via secure cryptographic signature. Invoice receipt generated.',
    icon: <Receipt className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'View Order Details',
    actionHref: '/dashboard'
  },
  ORDER_PLACED: {
    title: 'Eco-Marketplace Order Placed',
    message: 'Takk! Your authentic Norwegian gear is being prepared for carbon-neutral arctic dispatch.',
    icon: <ShieldCheck className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'Track Shipment',
    actionHref: '/dashboard'
  },
  MESSAGE_SENT: {
    title: 'Inquiry Dispatched to Host',
    message: 'Your inquiry has reached the local Norwegian guide. Expect a prompt response within a few hours.',
    icon: <HeartHandshake className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'Back to Explorer',
    actionHref: '/explore'
  },
  PROFILE_SAVED: {
    title: 'Travel Preferences Updated',
    message: 'Your dietary requirements, currency, and favorite fjord regions have been safely updated.',
    icon: <Sparkles className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'Explore Stays',
    actionHref: '/stay'
  },
  FEEDBACK_SUBMITTED: {
    title: 'Feedback Appreciated',
    message: 'Thank you for sharing your experience. Your insights help improve sustainable travel across Norway.',
    icon: <CheckCircle2 className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'Return Home',
    actionHref: '/'
  }
};

export interface SuccessStateProps {
  preset?: SuccessStatePreset;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  referenceId?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  preset = 'CUSTOM',
  title,
  message,
  icon,
  referenceId,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className
}) => {
  const config = preset !== 'CUSTOM' ? SUCCESS_PRESETS[preset] : null;

  const finalTitle = title || config?.title || 'Action Completed Successfully';
  const finalMessage = message || config?.message || 'Your action has been processed and saved successfully.';
  const finalIcon = icon || config?.icon || <CheckCircle2 className="w-10 h-10 text-emerald-400" aria-hidden="true" />;
  const finalActionLabel = actionLabel || config?.actionLabel;
  const finalActionHref = actionHref || config?.actionHref;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center w-full bg-midnight/90 rounded-3xl border border-emerald-500/30 shadow-[0_8px_30px_rgba(16,185,129,0.15)] select-none",
        className
      )}
    >
      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 shadow-inner">
        {finalIcon}
      </div>
      
      <h3 className="text-2xl sm:text-3xl font-display font-bold text-snow mb-2 tracking-tight">
        {finalTitle}
      </h3>
      
      <p className="text-slate-300 mb-6 max-w-md mx-auto leading-relaxed text-sm">
        {finalMessage}
      </p>

      {referenceId && (
        <div className="mb-6 px-4 py-2 bg-deep-night/80 rounded-xl border border-emerald-500/30 text-emerald-300 font-mono text-xs tracking-wider">
          REFERENCE: <span className="font-bold text-snow">{referenceId}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {finalActionLabel && (
          finalActionHref ? (
            <Link to={finalActionHref}>
              <Button variant="emerald" className="flex items-center gap-2">
                {finalActionLabel} <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
          ) : (
            onAction && (
              <Button variant="emerald" onClick={onAction} className="flex items-center gap-2">
                {finalActionLabel} <ArrowRight size={16} aria-hidden="true" />
              </Button>
            )
          )
        )}

        {secondaryActionLabel ? (
          secondaryActionHref ? (
            <Link to={secondaryActionHref}>
              <Button variant="outline">
                {secondaryActionLabel}
              </Button>
            </Link>
          ) : (
            onSecondaryAction && (
              <Button variant="outline" onClick={onSecondaryAction}>
                {secondaryActionLabel}
              </Button>
            )
          )
        ) : (
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 text-slate-400 hover:text-snow">
              <Home size={16} aria-hidden="true" /> Return Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
