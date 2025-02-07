import { useState, useCallback, useEffect } from "react";
/**
 * Custom hook to manage toast notifications.
 * It provides functionality for displaying, removing, and handling toasts.
 */
type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  position?: string;
  timeoutId?: NodeJS.Timeout;
}

export function useToast() {
  // State to hold the toasts, using a map to improve performance
  const [toasts, setToasts] = useState<Map<string, Toast>>(new Map());

  /**
   * Function to display a toast notification.
   * It adds a new toast to the list and automatically dismisses it after the specified duration.
   * @param message - The message to display in the toast.
   * @param type - The type of the toast ("success", "error", or "info").
   * @param duration - The duration in milliseconds before the toast is dismissed (default is 3000ms).
   * @param position - The position on the screen where the toast will appear (default is "top-right").
   */
  const showToast = useCallback(
  (message: string, type: ToastType, duration: number = 3000, position: string = "top-right") => {
    const id = new Date().toISOString(); 

    // Define timeoutId here first
    const timeoutId = setTimeout(() => {
      setToasts((prevToasts) => {
        const newToasts = new Map(prevToasts);
        newToasts.delete(id); // Remove the toast from the map after the timeout
        return newToasts;
      });
    }, duration);

    // Now create the newToast object after timeoutId is defined
    const newToast: Toast = { id, message, type, position, timeoutId };

    // Update the state
    setToasts((prevToasts) => new Map(prevToasts.set(id, newToast)));
    
    return timeoutId;
  },
  []
);

  /**
   * Function to manually dismiss a specific toast.
   * @param id - The ID of the toast to be removed.
   */
 const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => {
      const newToasts = new Map(prevToasts);
      const toast = newToasts.get(id);

      if (toast?.timeoutId) clearTimeout(toast.timeoutId); 

      newToasts.delete(id);
      return newToasts;
    });
  }, []);

  // Cleanup on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      // Clear all timeouts when the component is unmounted
      setToasts((prevToasts) => {
        prevToasts.forEach((toast) => clearTimeout(toast.timeoutId));
        return new Map();
      });
    };
  }, []);

  return { toasts: Array.from(toasts.values()), showToast, dismissToast };
}