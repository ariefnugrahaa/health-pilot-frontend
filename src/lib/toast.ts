import { toast as sonnerToast } from 'sonner';

// ==========================================
// Types
// ==========================================

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastMessage = string;

interface ToastOptions {
  description?: string;
  duration?: number;
}

// ==========================================
// Toast Wrapper
// ==========================================

/**
 * Show a success toast notification
 */
export function success(message: ToastMessage, options?: ToastOptions) {
  return sonnerToast.success(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
  });
}

/**
 * Show an error toast notification
 */
export function error(message: ToastMessage, options?: ToastOptions) {
  return sonnerToast.error(message, {
    duration: options?.duration ?? 5000,
    description: options?.description,
  });
}

/**
 * Show an info toast notification
 */
export function info(message: ToastMessage, options?: ToastOptions) {
  return sonnerToast.info(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
  });
}

/**
 * Show a warning toast notification
 */
export function warning(message: ToastMessage, options?: ToastOptions) {
  return sonnerToast.warning(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
  });
}

/**
 * Show a loading toast that can be updated later
 */
export function loading(message: ToastMessage, options?: ToastOptions) {
  return sonnerToast.loading(message, {
    duration: Infinity,
    description: options?.description,
  });
}

/**
 * Dismiss a specific toast or all toasts
 */
export function dismiss(toastId?: string | number) {
  return sonnerToast.dismiss(toastId);
}

// ==========================================
// Preset Toasts for Common Actions
// ==========================================

export const toast = {
  success,
  error,
  info,
  warning,
  loading,
  dismiss,

  // Auth presets
  loginSuccess: () => success('Welcome back!'),
  logoutSuccess: () => success('Logged out successfully'),
  registerSuccess: () => success('Account created successfully'),

  // Error presets
  authError: (errorMsg?: string) =>
    error('Authentication failed', { description: errorMsg }),
  loadError: (itemType: string, errorMsg?: string) =>
    error(`Failed to load ${itemType}`, { description: errorMsg }),
  saveError: (itemType: string, errorMsg?: string) =>
    error(`Failed to save ${itemType}`, { description: errorMsg }),
  uploadError: (errorMsg?: string) =>
    error('Upload failed', { description: errorMsg }),

  // Generic error from unknown
  fromError: (err: unknown, fallback = 'An unexpected error occurred') =>
    error(err instanceof Error ? err.message : fallback),
};

export default toast;
