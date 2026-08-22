import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CinematicBackgroundProps {
  imageUrl?: string;
  gradient?: 'dark' | 'light' | 'aurora' | 'none';
  overlayOpacity?: number;
  className?: string;
  children?: ReactNode;
  animate?: boolean;
  theme?: string;
}

export const CinematicBackground = ({
  imageUrl,
  gradient = 'dark',
  overlayOpacity = 0.5,
  className,
  children,
  animate = true,
  theme,
}: CinematicBackgroundProps) => {
  const gradientClasses = {
    dark: 'bg-gradient-to-b from-deep-night/80 via-midnight/60 to-deep-night',
    light: 'bg-gradient-to-b from-snow/80 via-snow/40 to-snow',
    aurora: 'bg-gradient-to-tr from-deep-night via-aurora-violet/20 to-fjord-teal/20',
    none: '',
  };

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {/* Background Image Layer */}
      {imageUrl && (
        <motion.div 
          className="absolute inset-0 z-0"
          initial={animate ? { scale: 1.05 } : false}
          animate={animate ? { scale: 1 } : false}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        </motion.div>
      )}

      {/* Gradient Overlay Layer */}
      {gradient !== 'none' && (
        <div 
          className={cn("absolute inset-0 z-0 pointer-events-none", gradientClasses[gradient])}
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
