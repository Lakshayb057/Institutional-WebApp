import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, AlertTriangle } from 'lucide-react';

/* ── Toast notification ── */
export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const config = {
    success: { bg: 'bg-emerald-600', Icon: CheckCircle },
    error:   { bg: 'bg-red-600',     Icon: AlertCircle },
    info:    { bg: 'bg-primary-600', Icon: AlertCircle },
  };
  const { bg, Icon } = config[type] || config.success;

  return (
    <div className={`toast ${bg} text-white`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity ml-1">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

/* ── Generic confirm modal ── */
export const ConfirmModal = ({ 
  message, 
  onConfirm, 
  onCancel, 
  title = "Confirm Delete", 
  confirmText = "Delete",
  confirmVariant = "danger"
}) => (
  <div className="modal animate-fadeInUp">
    <div className="modal-content p-6 max-w-sm">
      <div className="flex justify-center mb-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${confirmVariant === 'danger' ? 'bg-red-100' : 'bg-primary-100'}`}>
          <AlertTriangle className={`h-7 w-7 ${confirmVariant === 'danger' ? 'text-red-600' : 'text-primary-600'}`} />
        </div>
      </div>
      <h3 className="text-lg font-bold text-secondary-900 text-center mb-2">{title}</h3>
      <p className="text-secondary-500 text-center text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="btn btn-outline flex-1">Cancel</button>
        <button onClick={onConfirm} className={`btn btn-${confirmVariant} flex-1`}>{confirmText}</button>
      </div>
    </div>
  </div>
);

export default { Toast, ConfirmModal };
