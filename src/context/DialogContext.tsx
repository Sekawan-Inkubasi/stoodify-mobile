import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type DialogType = 'info' | 'success' | 'warning' | 'error';

export interface DialogOptions {
  title?: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  isConfirm?: boolean;
}

interface DialogContextValue {
  showAlert: (message: string, title?: string, type?: DialogType) => void;
  showConfirm: (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isDestructive?: boolean;
  }) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    message: '',
    type: 'info',
  });

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showAlert = useCallback(
    (message: string, title?: string, type: DialogType = 'info') => {
      setDialog({
        isOpen: true,
        isConfirm: false,
        title,
        message,
        type,
        confirmText: 'Mengerti',
      });
    },
    []
  );

  const showConfirm = useCallback(
    ({
      title = 'Konfirmasi',
      message,
      confirmText = 'Ya, Lanjutkan',
      cancelText = 'Batal',
      onConfirm,
      onCancel,
      isDestructive = false,
    }: {
      title?: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      onConfirm: () => void;
      onCancel?: () => void;
      isDestructive?: boolean;
    }) => {
      setDialog({
        isOpen: true,
        isConfirm: true,
        title,
        message,
        type: isDestructive ? 'warning' : 'info',
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
        isDestructive,
      });
    },
    []
  );

  const handleConfirm = () => {
    const action = dialog.onConfirm;
    closeDialog();
    if (action) action();
  };

  const handleCancel = () => {
    const action = dialog.onCancel;
    closeDialog();
    if (action) action();
  };

  const renderIcon = () => {
    switch (dialog.type) {
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0062FF] border border-blue-100 flex items-center justify-center">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  return (
    <DialogContext.Provider value={{ showAlert, showConfirm, closeDialog }}>
      {children}

      {dialog.isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm backdrop-smooth flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl modal-enter-smooth border border-slate-100 flex flex-col items-center text-center relative">
            <button
              type="button"
              onClick={closeDialog}
              className="absolute right-4 top-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup dialog"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {renderIcon()}

            {dialog.title && (
              <h3 id="dialog-title" className="text-base font-bold text-slate-900 tracking-tight mt-3">
                {dialog.title}
              </h3>
            )}

            <p className="text-xs text-slate-600 font-normal leading-relaxed mt-2 whitespace-pre-line max-w-[280px]">
              {dialog.message}
            </p>

            <div className="w-full mt-5 flex items-center gap-2.5">
              {dialog.isConfirm ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all active:scale-98 cursor-pointer"
                  >
                    {dialog.cancelText || 'Batal'}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-4 rounded-full text-white font-semibold text-xs transition-all active:scale-98 cursor-pointer shadow-sm ${
                      dialog.isDestructive
                        ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                        : 'bg-[#0062FF] hover:bg-blue-700 shadow-blue-500/20'
                    }`}
                  >
                    {dialog.confirmText || 'Ya, Lanjutkan'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={closeDialog}
                  className="w-full py-3 px-5 rounded-full text-white font-semibold text-xs tracking-wide bg-gradient-to-r from-[#1746E0] via-[#1E50FF] to-[#143DC0] shadow-md shadow-blue-500/25 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
                >
                  {dialog.confirmText || 'Mengerti'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextValue => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
