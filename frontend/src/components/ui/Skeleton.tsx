import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'rectangular', 
  ...props 
}) => {
  const variants = {
    rectangular: "rounded-2xl",
    circular: "rounded-full",
    text: "rounded-lg h-4 w-3/4",
    card: "rounded-3xl h-64 w-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/5 dark:via-white/10 dark:to-white/5",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("bg-white dark:bg-navy-800 rounded-3xl p-6 border border-gray-100 dark:border-white/10 space-y-4 shadow-sm", className)}>
    <Skeleton className="h-44 w-full rounded-2xl" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-4/5" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-xl" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({ count = 3, className }) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-navy-800 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
        <Skeleton variant="circular" className="w-12 h-12 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-8 w-20 rounded-xl shrink-0" />
      </div>
    ))}
  </div>
);
