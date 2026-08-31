import React from 'react';
import { 
  Compass, 
  RotateCcw, 
  Heart, 
  Hotel, 
  ShoppingBag, 
  Bell, 
  Calendar, 
  Clock, 
  Search, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type EmptyStatePreset = 
  | 'NO_FAVORITES'
  | 'NO_BOOKINGS'
  | 'NO_ORDERS'
  | 'NO_NOTIFICATIONS'
  | 'NO_SEARCH_RESULTS'
  | 'NO_RECENTLY_VIEWED'
  | 'NO_SAVED_TRIPS'
  | 'NO_STAYS_AVAILABLE'
  | 'NO_ITINERARY_ITEMS'
  | 'CUSTOM';

const PRESETS: Record<Exclude<EmptyStatePreset, 'CUSTOM'>, {
  title: string;
  message: string;
  icon: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
}> = {
  NO_FAVORITES: {
    title: 'No favorites saved yet',
    message: 'Start exploring Norway and tap the heart icon to curate your dream Norwegian collection.',
    icon: <Heart className="w-10 h-10 text-rose-400" aria-hidden="true" />,
    actionLabel: 'Explore Norway',
    actionHref: '/explore'
  },
  NO_BOOKINGS: {
    title: 'No active reservations',
    message: 'You have no confirmed hotel or cabin bookings. Discover handpicked authentic Norwegian stays.',
    icon: <Hotel className="w-10 h-10 text-arctic-gold" aria-hidden="true" />,
    actionLabel: 'Find Stays',
    actionHref: '/stay'
  },
  NO_ORDERS: {
    title: 'No merchandise orders yet',
    message: 'Browse our sustainable eco-marketplace for authentic Norwegian gear, apparel, and gadgets.',
    icon: <ShoppingBag className="w-10 h-10 text-emerald-400" aria-hidden="true" />,
    actionLabel: 'Visit Shop',
    actionHref: '/shop'
  },
  NO_NOTIFICATIONS: {
    title: 'You are all caught up',
    message: 'No unread travel alerts, payment confirmations, or itinerary updates at this time.',
    icon: <Bell className="w-10 h-10 text-cyan-400" aria-hidden="true" />,
    actionLabel: 'View Dashboard',
    actionHref: '/dashboard'
  },
  NO_SEARCH_RESULTS: {
    title: 'No matching results found',
    message: 'We could not find any destinations, stays, or activities matching your query. Try different keywords.',
    icon: <Search className="w-10 h-10 text-arctic-gold" aria-hidden="true" />,
    actionLabel: 'Reset Search',
  },
  NO_RECENTLY_VIEWED: {
    title: 'No recent browsing history',
    message: 'Explore fjords, hiking trails, arctic wildlife, and culinary highlights to build your history.',
    icon: <Clock className="w-10 h-10 text-indigo-400" aria-hidden="true" />,
    actionLabel: 'Explore Highlights',
    actionHref: '/explore'
  },
  NO_SAVED_TRIPS: {
    title: 'No planned trips yet',
    message: 'Craft your first Norwegian adventure with smart travel routes, dates, and day-by-day itineraries.',
    icon: <Calendar className="w-10 h-10 text-arctic-gold" aria-hidden="true" />,
    actionLabel: 'Open Travel Planner',
    actionHref: '/planner'
  },
  NO_STAYS_AVAILABLE: {
    title: 'No available stays for selected dates',
    message: 'All rooms are reserved during this period. Try adjusting your check-in dates or guest count.',
    icon: <MapPin className="w-10 h-10 text-amber-400" aria-hidden="true" />,
    actionLabel: 'Change Dates',
  },
  NO_ITINERARY_ITEMS: {
    title: 'No items in this day yet',
    message: 'Add scenic cruises, mountain hikes, authentic dining, or fjord transit to complete your schedule.',
    icon: <Compass className="w-10 h-10 text-cyan-400" aria-hidden="true" />,
    actionLabel: 'Add Activity',
  }
};

export interface EmptyStateProps {
  preset?: EmptyStatePreset;
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  preset = 'CUSTOM',
  title, 
  message, 
  icon, 
  actionLabel, 
  actionHref,
  onAction, 
  secondaryActionLabel, 
  secondaryActionHref,
  onSecondaryAction, 
  className 
}) => {
  const presetConfig = preset !== 'CUSTOM' ? PRESETS[preset] : null;

  const finalTitle = title || presetConfig?.title || 'No items to display';
  const finalMessage = message || presetConfig?.message || 'There is no data available in this section currently.';
  const finalIcon = icon || presetConfig?.icon || <Compass className="w-10 h-10 text-arctic-gold" aria-hidden="true" />;
  const finalActionLabel = actionLabel || presetConfig?.actionLabel;
  const finalActionHref = actionHref || presetConfig?.actionHref;

  return (
    <div 
      role="region"
      aria-label={finalTitle}
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center w-full bg-midnight/80 rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] select-none",
        className
      )}
    >
      <div className="w-20 h-20 bg-white/5 text-slate-300 rounded-full flex items-center justify-center mb-6 border border-white/10">
        {finalIcon}
      </div>
      <h3 className="text-2xl font-display font-bold text-snow mb-2 tracking-tight">{finalTitle}</h3>
      <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed text-sm">{finalMessage}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {finalActionLabel && (
          finalActionHref ? (
            <Link to={finalActionHref}>
              <Button variant="primary" className="flex items-center gap-2">
                {finalActionLabel} <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
          ) : (
            onAction && (
              <Button variant="primary" onClick={onAction} className="flex items-center gap-2">
                <RotateCcw size={16} aria-hidden="true" /> {finalActionLabel}
              </Button>
            )
          )
        )}

        {secondaryActionLabel && (
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
        )}
      </div>
    </div>
  );
};
