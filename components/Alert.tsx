import React from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface AlertProps {
  isOpen: boolean;
  type: AlertType;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDark?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = '确定',
  cancelText = '取消',
  isDark = true
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
      case 'confirm':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        );
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          button: 'bg-emerald-600 hover:bg-emerald-700'
        };
      case 'error':
        return {
          icon: 'text-rose-500',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          button: 'bg-rose-600 hover:bg-rose-700'
        };
      case 'warning':
        return {
          icon: 'text-amber-500',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          button: 'bg-amber-600 hover:bg-amber-700'
        };
      case 'info':
        return {
          icon: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'confirm':
        return {
          icon: 'text-slate-500',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/30',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getColorClasses();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`
          max-w-md w-full rounded-2xl p-6 shadow-2xl
          ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}
          border ${colors.border}
          animate-in zoom-in-95 slide-in-from-bottom-4 duration-200
        `}
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center mb-4 ${colors.icon}`}>
          {getIcon()}
        </div>

        {/* Title */}
        {title && (
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            {title}
          </h3>
        )}

        {/* Message */}
        <p className={`text-sm mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          {type === 'confirm' ? (
            <>
              <button
                onClick={onClose}
                className={`
                  flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all
                  ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}
                `}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`
                  flex-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all
                  ${colors.button}
                `}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`
                w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all
                ${colors.button}
              `}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};