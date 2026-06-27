/**
 * Simple toast notification system using custom events
 * No external dependencies needed
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export function showToast(message: string, type: ToastType = 'success', duration = 3000): void {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('vitalis-toast', {
    detail: {
      id: `toast_${Date.now()}`,
      type,
      message,
      duration,
    } as ToastMessage,
  });
  window.dispatchEvent(event);
}
