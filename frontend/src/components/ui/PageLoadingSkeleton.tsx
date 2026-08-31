import React from 'react';
import { Skeleton, SkeletonCard, SkeletonList } from './Skeleton';
import { cn } from '../../lib/utils';

export interface PageLoadingSkeletonProps {
  variant?: 'card-grid' | 'dashboard' | 'detail-hero' | 'table-list' | 'itinerary' | 'full';
  className?: string;
  itemCount?: number;
}

export const CardGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 6,
  className,
}) => (
  <div
    role="status"
    aria-label="Loading content cards"
    className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1440px] mx-auto',
      className
    )}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} className="bg-midnight/60 border border-white/10" />
    ))}
    <span className="sr-only">Loading content...</span>
  </div>
);

export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    role="status"
    aria-label="Loading dashboard"
    className={cn('w-full max-w-[1440px] mx-auto space-y-8 p-6 md:p-12', className)}
  >
    {/* Header / Profile Hero skeleton */}
    <div className="bg-midnight/70 rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center gap-6">
      <Skeleton variant="circular" className="w-24 h-24 shrink-0 bg-white/10" />
      <div className="flex-1 space-y-3 w-full">
        <Skeleton className="h-8 w-1/3 bg-white/10" />
        <Skeleton className="h-4 w-1/2 bg-white/5" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
          <Skeleton className="h-6 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </div>

    {/* Metrics / Stats grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-midnight/60 rounded-2xl p-5 border border-white/5 space-y-3">
          <Skeleton className="h-4 w-1/2 bg-white/10" />
          <Skeleton className="h-8 w-2/3 bg-white/10" />
          <Skeleton className="h-3 w-3/4 bg-white/5" />
        </div>
      ))}
    </div>

    {/* Content Panels split */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-midnight/60 rounded-3xl p-6 border border-white/10 space-y-4">
          <Skeleton className="h-6 w-1/4 bg-white/10" />
          <SkeletonList count={3} />
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-midnight/60 rounded-3xl p-6 border border-white/10 space-y-4">
          <Skeleton className="h-6 w-1/3 bg-white/10" />
          <Skeleton className="h-40 w-full rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
    <span className="sr-only">Loading dashboard metrics and bookings...</span>
  </div>
);

export const DetailHeroSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    role="status"
    aria-label="Loading page details"
    className={cn('w-full min-h-screen bg-deep-night', className)}
  >
    {/* Large Hero image skeleton */}
    <div className="h-[50vh] min-h-[380px] w-full relative bg-midnight/80">
      <Skeleton className="w-full h-full rounded-none bg-white/5 animate-pulse" />
      <div className="absolute bottom-12 left-6 md:left-12 space-y-4 max-w-xl">
        <Skeleton className="h-4 w-32 bg-white/20 rounded-full" />
        <Skeleton className="h-12 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/10" />
      </div>
    </div>

    {/* Content section */}
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-7 w-1/3 bg-white/10" />
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-4/5 bg-white/5" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
      <div>
        <div className="bg-midnight/80 rounded-3xl p-6 border border-white/10 space-y-6">
          <Skeleton className="h-8 w-1/2 bg-white/10" />
          <Skeleton className="h-12 w-full rounded-xl bg-white/5" />
          <Skeleton className="h-12 w-full rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
    <span className="sr-only">Loading detailed view...</span>
  </div>
);

export const TableListSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 5,
  className,
}) => (
  <div
    role="status"
    aria-label="Loading list items"
    className={cn('w-full max-w-[1440px] mx-auto space-y-4 p-6', className)}
  >
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-8 w-48 bg-white/10" />
      <Skeleton className="h-10 w-32 rounded-xl bg-white/10" />
    </div>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-midnight/60 rounded-2xl p-5 border border-white/5 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 flex-1">
          <Skeleton variant="circular" className="w-10 h-10 shrink-0 bg-white/10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3 bg-white/10" />
            <Skeleton className="h-3 w-1/4 bg-white/5" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
        <Skeleton className="h-8 w-24 rounded-xl bg-white/10" />
      </div>
    ))}
    <span className="sr-only">Loading table records...</span>
  </div>
);

export const TripItinerarySkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div
    role="status"
    aria-label="Loading travel itinerary"
    className={cn('w-full max-w-[1440px] mx-auto space-y-8 p-6 md:p-12', className)}
  >
    <div className="bg-midnight/60 rounded-3xl p-8 border border-white/10 space-y-4">
      <Skeleton className="h-10 w-1/2 bg-white/10" />
      <Skeleton className="h-4 w-1/3 bg-white/5" />
    </div>
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-midnight/40 rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-28 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl bg-white/5" />
            <Skeleton className="h-16 w-full rounded-xl bg-white/5" />
          </div>
        </div>
      ))}
    </div>
    <span className="sr-only">Loading travel itinerary days...</span>
  </div>
);

export const PageLoadingSkeleton: React.FC<PageLoadingSkeletonProps> = ({
  variant = 'full',
  className,
  itemCount,
}) => {
  switch (variant) {
    case 'card-grid':
      return <CardGridSkeleton count={itemCount} className={className} />;
    case 'dashboard':
      return <DashboardSkeleton className={className} />;
    case 'detail-hero':
      return <DetailHeroSkeleton className={className} />;
    case 'table-list':
      return <TableListSkeleton count={itemCount} className={className} />;
    case 'itinerary':
      return <TripItinerarySkeleton className={className} />;
    case 'full':
    default:
      return (
        <div
          role="status"
          aria-label="Loading application page"
          className={cn('min-h-[70vh] flex flex-col items-center justify-center p-8', className)}
        >
          <div className="w-12 h-12 border-4 border-arctic-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold uppercase tracking-widest text-snow/60 animate-pulse">
            Loading Norway SmartLife...
          </p>
          <span className="sr-only">Loading page...</span>
        </div>
      );
  }
};
