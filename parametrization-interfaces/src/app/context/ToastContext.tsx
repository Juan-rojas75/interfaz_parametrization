"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ToastData {
  id: number;
  title: string;
  message: string;
}

interface ToastContextType {
  toasts: ToastData[];
  showToast: (title: string, message: string, duration?: number) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (title: string, message: string, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message }]);

    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
