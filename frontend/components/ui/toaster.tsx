'use client';

import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToasterProvider');
  }
  return context;
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5
            ${toast.variant === 'destructive' ? 'bg-red-600 text-white' : 
              toast.variant === 'success' ? 'bg-green-600 text-white' : 
              toast.variant === 'warning' ? 'bg-yellow-600 text-white' : 
              'bg-gray-800 text-white'}
            p-4 mb-4 rounded-md shadow-lg
          `}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toast.variant === 'destructive' && (
                <svg className="h-6 w-6 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.variant === 'success' && (
                <svg className="h-6 w-6 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                toast.variant === 'destructive' ? 'text-red-200' : 
                toast.variant === 'success' ? 'text-green-200' : 
                toast.variant === 'warning' ? 'text-yellow-200' : 
                'text-gray-200'
              }`}>
                {toast.title}
              </h3>
              {toast.description && (
                <p className={`mt-1 text-sm ${
                  toast.variant === 'destructive' ? 'text-red-100' : 
                  toast.variant === 'success' ? 'text-green-100' : 
                  toast.variant === 'warning' ? 'text-yellow-100' : 
                  'text-gray-100'
                }`}>
                  {toast.description}
                </p>
              )}
            </div>
            <div className="ml-4 pl-3">
              <button
                onClick={() => removeToast(toast.id)}
                className={`
                  inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${toast.variant === 'destructive' ? 'focus:ring-red-500' : 
                    toast.variant === 'success' ? 'focus:ring-green-500' : 
                    toast.variant === 'warning' ? 'focus:ring-yellow-500' : 
                    'focus:ring-gray-500'}
                `}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
