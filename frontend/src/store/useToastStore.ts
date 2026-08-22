import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 4000,
    };
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  success: (message: string, title?: string, duration = 4000) =>
    useToastStore.getState().addToast({ message, title, type: 'success', duration }),
  error: (message: string, title?: string, duration = 5000) =>
    useToastStore.getState().addToast({ message, title, type: 'error', duration }),
  warning: (message: string, title?: string, duration = 4500) =>
    useToastStore.getState().addToast({ message, title, type: 'warning', duration }),
  info: (message: string, title?: string, duration = 4000) =>
    useToastStore.getState().addToast({ message, title, type: 'info', duration }),
};
