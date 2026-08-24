import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";
    
    const variants = {
      primary: "bg-royal-fjord text-white hover:bg-polar-indigo focus:ring-royal-fjord shadow-[0_0_15px_rgba(29,78,216,0.3)] hover:shadow-[0_0_20px_rgba(29,78,216,0.5)] rounded-xl border border-white/10",
      secondary: "bg-white/10 text-white hover:bg-white/20 focus:ring-white/30 border border-white/10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
      outline: "border-2 border-white/20 text-white hover:bg-white/10 focus:ring-white/30 rounded-xl",
      ghost: "text-white hover:bg-white/10 focus:ring-white/20 rounded-xl",
      danger: "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded-xl",
      gold: "bg-arctic-gold text-deep-night hover:bg-amber-400 focus:ring-arctic-gold shadow-md rounded-xl font-black",
      emerald: "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500 shadow-md rounded-xl",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs",
      md: "min-h-[44px] px-5 text-xs sm:text-sm",
      lg: "min-h-[50px] px-8 text-sm sm:text-base",
      icon: "min-h-[44px] min-w-[44px] p-2",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        whileHover={{ translateY: disabled || isLoading ? 0 : -1 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="mr-2 shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="ml-2 shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
