import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1C2E20] text-amber-50 px-5 py-3 rounded-full shadow-2xl border border-emerald-700/50 flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-3 fade-in duration-200">
      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};
