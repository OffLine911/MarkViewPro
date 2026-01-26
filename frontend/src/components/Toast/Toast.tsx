import { useEffect, useState } from 'react';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 150);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
  };

  const colors = {
    success: 'bg-emerald-600 text-white',
    info: 'bg-cyan-600 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-600 text-white',
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-xs font-medium
        transition-all duration-150 ${colors[toast.type]}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{toast.message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 150);
        }}
        className="p-0.5 hover:bg-white/20 rounded transition-colors ml-1"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-16 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

let toastIdCounter = 0;

export function createToast(message: string, type: ToastType = 'info', duration = 3000): ToastMessage {
  return {
    id: `toast-${++toastIdCounter}`,
    message,
    type,
    duration,
  };
}
