import React, { useEffect } from 'react';

export interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  title,
  message,
  actionText,
  onAction,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-20 inset-x-4 max-w-md mx-auto z-50 animate-in slide-in-from-top-6 duration-300 pointer-events-auto">
      <div className="bg-[#283044] text-[#eef0ff] px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 border border-[#6d7a72]/30">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#85f8c4]/20 text-[#85f8c4] flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs text-white truncate">{title}</span>
            <span className="text-[11px] text-[#eef0ff]/80 line-clamp-1">{message}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {actionText && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="text-xs font-bold text-[#85f8c4] hover:underline px-2 py-1"
            >
              {actionText}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
