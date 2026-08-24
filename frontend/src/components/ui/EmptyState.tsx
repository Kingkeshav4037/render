import React from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export const EmptyState: React.FC<{ 
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}> = ({ 
  title = "No results found", 
  message = "We couldn't find anything matching your search criteria. Try adjusting your query or resetting filters.",
  icon = <Compass className="w-10 h-10 text-arctic-gold" />,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center w-full bg-midnight rounded-3xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.2)]",
      className
    )}>
      <div className="w-20 h-20 bg-white/5 text-slate-300 rounded-full flex items-center justify-center mb-6 border border-white/10">
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold text-snow mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed text-sm">{message}</p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && actionLabel && (
          <Button variant="primary" onClick={onAction} className="flex items-center gap-2">
            <RotateCcw size={16} /> {actionLabel}
          </Button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

