import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, ToastMessage } from '../../store/useToastStore';

const ToastItem: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const { removeToast } = useToastStore();

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100',
      iconColor: 'text-emerald-400',
      titleColor: 'text-emerald-200',
      progressColor: 'bg-emerald-400',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-rose-950/90 border-rose-500/40 text-rose-100',
      iconColor: 'text-rose-400',
      titleColor: 'text-rose-200',
      progressColor: 'bg-rose-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-950/90 border-amber-500/40 text-amber-100',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-200',
      progressColor: 'bg-amber-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-sky-950/90 border-sky-500/40 text-sky-100',
      iconColor: 'text-sky-400',
      titleColor: 'text-sky-200',
      progressColor: 'bg-sky-400',
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`relative flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden max-w-md w-full pointer-events-auto ${config.bgColor}`}
    >
      <div className="shrink-0 mt-0.5">
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      <div className="flex-1 pr-2">
        {toast.title && (
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${config.titleColor}`}>
            {toast.title}
          </h4>
        )}
        <p className="text-xs font-medium leading-relaxed opacity-90">{toast.message}</p>
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="shrink-0 p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>

      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-0.5 ${config.progressColor}`}
        />
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
