'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { ToastMessage } from '@/lib/toast';

export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const toast = (e as CustomEvent<ToastMessage>).detail;
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => removeToast(toast.id), toast.duration ?? 3000);
    };
    window.addEventListener('vitalis-toast', handler);
    return () => window.removeEventListener('vitalis-toast', handler);
  }, [removeToast]);

  const iconMap: Record<string, string> = {
    success: 'CheckCircleIcon',
    error: 'XCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon',
  };

  const colorMap: Record<string, string> = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    info: 'text-primary bg-secondary border-border',
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-rose-md backdrop-blur-sm ${colorMap[toast.type]}`}
        >
          <Icon
            name={iconMap[toast.type] as 'CheckCircleIcon'}
            size={20}
            className="flex-shrink-0 mt-0.5"
          />
          <p className="text-sm font-medium flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <Icon name="XMarkIcon" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
