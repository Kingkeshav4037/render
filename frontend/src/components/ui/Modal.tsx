import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[95vw] h-[95vh]",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-navy-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className={`w-full bg-white dark:bg-navy-800 rounded-3xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden ${sizes[size]}`}
            >
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
                  <h2 className="text-xl font-bold text-navy-900 dark:text-white">{title}</h2>
                  <button 
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              )}
              {!title && (
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 z-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none bg-white/50 backdrop-blur-sm"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              )}
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
