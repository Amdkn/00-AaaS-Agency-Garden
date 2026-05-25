import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '@/lib/types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000); // Auto close after 4s

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-stone-500" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success': return 'border-emerald-100 bg-white';
      case 'warning': return 'border-amber-100 bg-white';
      default: return 'border-stone-100 bg-white';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-soft border mb-3 animate-fade-in-up min-w-[300px] backdrop-blur-sm ${getStyles()}`}>
      <div className={`p-2 rounded-full ${
        toast.type === 'success' ? 'bg-emerald-50' : 
        toast.type === 'warning' ? 'bg-amber-50' : 'bg-stone-50'
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-stone-800 font-sans">{toast.message}</p>
      </div>
      <button 
        onClick={() => onClose(toast.id)}
        className="text-stone-400 hover:text-stone-600 transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;