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
    default: "bg-white/10 text-snow border-white/20",
    success: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    warning: "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    danger: "bg-red-500/20 text-red-200 border-red-500/30",
    info: "bg-glacier-cyan/20 text-glacier-cyan border-glacier-cyan/30",
    outline: "text-slate-300 border-white/20",
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
