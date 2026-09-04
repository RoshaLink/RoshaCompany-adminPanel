import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const Toast = () => {
  const { toast } = useAdmin();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
  };

  const bgClasses = {
    success: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-100',
    error: 'border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/80 text-rose-900 dark:text-rose-100',
    info: 'border-sky-500/30 bg-sky-50/90 dark:bg-sky-950/80 text-sky-900 dark:text-sky-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-xl ${
          bgClasses[toast.type] || bgClasses.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
