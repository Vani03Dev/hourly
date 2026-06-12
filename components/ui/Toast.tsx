import React, { useEffect } from 'react';
import { cn } from './Button';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  message,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const variants = {
    success: 'border-l-[3px] border-l-green',
    error: 'border-l-[3px] border-l-red',
    info: 'border-l-[3px] border-l-teal',
  };

  const Icon = {
    success: <CheckCircle2 className="text-green" size={20} />,
    error: <XCircle className="text-red" size={20} />,
    info: <Info className="text-teal" size={20} />,
  }[type];

  return (
    <div
      className={cn(
        'w-[320px] bg-white rounded-[8px] shadow-raised p-[16px] flex flex-row items-center gap-[12px] animate-toast-enter',
        variants[type]
      )}
    >
      <div className="flex-shrink-0">{Icon}</div>
      <p className="flex-1 text-[14px] text-gray-700 font-medium leading-tight">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
