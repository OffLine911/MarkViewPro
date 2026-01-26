import { useState, useCallback } from 'react';
import type { ToastMessage, ToastType } from '../components/Toast/Toast';
import { createToast } from '../components/Toast/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const toast = createToast(message, type, duration);
    setToasts((prev) => [...prev, toast]);
    return toast.id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    dismissToast,
    success,
    info,
    warning,
    error,
  };
}
