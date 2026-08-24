import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<"div">, 'ref'> {
  variant?: 'solid' | 'glass' | 'outline';
  noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'solid', noPadding = false, children, ...props }, ref) => {
    
    const variants = {
      solid: "bg-midnight border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] text-snow",
      glass: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-snow",
      outline: "bg-transparent border-2 border-white/10 text-snow",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden",
          variants[variant],
          !noPadding && "p-6",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("text-xl font-bold leading-none tracking-tight", className)} {...props} />
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("text-sm text-slate-400", className)} {...props} />
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-0", className)} {...props} />
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex items-center pt-4 mt-4 border-t border-white/10", className)} {...props} />
);
