import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id, duration: toast.duration || 3500 };
    this.toasts.update((t) => [...t, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  remove(id: string) {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }

  success(title: string, description?: string) {
    this.add({ title, description, type: 'success' });
  }

  error(title: string, description?: string) {
    this.add({ title, description, type: 'error' });
  }

  info(title: string, description?: string) {
    this.add({ title, description, type: 'info' });
  }

  warning(title: string, description?: string) {
    this.add({ title, description, type: 'warning' });
  }
}

