import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(undefined);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info', title) => {
    const id = `t_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const success = useCallback((message, title) => toast(message, 'success', title), [toast]);
  const error = useCallback((message, title) => toast(message, 'error', title), [toast]);
  const info = useCallback((message, title) => toast(message, 'info', title), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-neutral-900/95 border-emerald-500/30 text-neutral-100'
                : t.type === 'error'
                ? 'bg-neutral-900/95 border-rose-500/30 text-neutral-100'
                : 'bg-neutral-900/95 border-amber-500/30 text-neutral-100'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}

            <div className="flex-1 text-sm">
              {t.title && <div className="font-semibold text-neutral-100 mb-0.5">{t.title}</div>}
              <div className="text-neutral-300 text-xs leading-relaxed">{t.message}</div>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
