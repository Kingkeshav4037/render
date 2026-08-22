import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'rectangular',
  ...props 
}) => {
  const variants = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded-md h-4",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-white/10",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
