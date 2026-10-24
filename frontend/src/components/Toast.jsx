import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-slate-900 text-white';
        let Icon = Info;
        let iconColor = 'text-blue-400';

        if (toast.type === 'success') {
          bg = 'bg-emerald-900 text-emerald-50 border border-emerald-700';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          bg = 'bg-rose-900 text-rose-50 border border-rose-700';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-medium ${bg} transition-all duration-300`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
