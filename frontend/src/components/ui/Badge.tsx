import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  ...props 
}) => {
  const variants = {
    default: "bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-100",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/30",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-200 dark:border-yellow-500/30",
    danger: "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-200 dark:border-red-500/30",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-500/30",
    outline: "text-gray-800 border-gray-300 dark:text-gray-200 dark:border-gray-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-transparent transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
