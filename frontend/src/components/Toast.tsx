import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface ToastContextType {
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(({ title, message, type }: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isWarning = t.type === 'warning';
          const isError = t.type === 'error';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-bottom-3 ${
                isSuccess
                  ? 'bg-white border-emerald-200 text-emerald-950'
                  : isWarning
                  ? 'bg-white border-amber-200 text-amber-950'
                  : isError
                  ? 'bg-white border-red-200 text-red-950'
                  : 'bg-white border-orange-200 text-slate-900'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 size={16} className="text-emerald-600" />}
                {isWarning && <AlertTriangle size={16} className="text-amber-600" />}
                {isError && <AlertTriangle size={16} className="text-red-600" />}
                {!isSuccess && !isWarning && !isError && <Info size={16} className="text-[#FF5C00]" />}
              </div>

              <div className="flex-1 text-xs">
                <p className="font-bold">{t.title}</p>
                {t.message && <p className="text-[11px] text-gray-500 mt-0.5">{t.message}</p>}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-gray-600 text-xs shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {}
    };
  }
  return context;
};
