import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-aurora-green text-navy-900 hover:bg-green-400 focus:ring-aurora-green shadow-[0_0_15px_rgba(0,255,135,0.3)] hover:shadow-[0_0_20px_rgba(0,255,135,0.5)]",
      secondary: "bg-navy-800 text-white hover:bg-navy-700 focus:ring-navy-600 border border-white/10",
      outline: "border-2 border-aurora-green text-aurora-green hover:bg-aurora-green/10 focus:ring-aurora-green",
      ghost: "text-navy-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 focus:ring-gray-400",
      danger: "bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-base",
      lg: "h-14 px-8 text-lg",
      icon: "h-11 w-11",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
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
        {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
