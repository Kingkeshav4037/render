import React from 'react';
import { Ghost } from 'lucide-react';
import { Button } from './Button';

export const EmptyState: React.FC<{ 
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ 
  title = "No results found", 
  message = "We couldn't find anything matching your search criteria.",
  icon = <Ghost className="w-10 h-10" />,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center w-full bg-white dark:bg-navy-800 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
      <div className="w-20 h-20 bg-gray-50 dark:bg-navy-900 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">{message}</p>
      
      {onAction && actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
