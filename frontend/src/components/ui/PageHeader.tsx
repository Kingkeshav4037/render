import React from 'react';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  breadcrumb: React.ReactNode;
  backgroundImage?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumb,
  backgroundImage,
  children,
  className
}) => {
  const content = (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full pt-32 pb-16">
      <div className="max-w-4xl text-snow">
        <div className="font-sans text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 drop-shadow-md text-arctic-gold">
          {breadcrumb}
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6 drop-shadow-lg text-snow">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl font-sans text-snow/90 max-w-2xl mb-12 leading-relaxed drop-shadow-md">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  if (backgroundImage) {
    return (
      <CinematicBackground
        imageUrl={backgroundImage}
        gradient="dark"
        overlayOpacity={0.4}
        className={cn("min-h-[50vh] flex items-center", className)}
      >
        {content}
      </CinematicBackground>
    );
  }

  return (
    <div className={cn("bg-deep-night border-b border-white/5", className)}>
      {content}
    </div>
  );
};
