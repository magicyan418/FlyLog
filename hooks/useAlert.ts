import { useState, useCallback } from 'react';
import { AlertType } from '../components/Alert';

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title?: string;
  message: string;
  onConfirm?: () => void;
}

export function useAlert() {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: 'info',
    message: ''
  });

  const showAlert = useCallback((
    type: AlertType,
    message: string,
    title?: string,
    onConfirm?: () => void
  ) => {
    setAlertState({
      isOpen: true,
      type,
      title,
      message,
      onConfirm
    });
  }, []);

  const success = useCallback((message: string, title?: string) => {
    showAlert('success', message, title);
  }, [showAlert]);

  const error = useCallback((message: string, title?: string) => {
    showAlert('error', message, title);
  }, [showAlert]);

  const warning = useCallback((message: string, title?: string) => {
    showAlert('warning', message, title);
  }, [showAlert]);

  const info = useCallback((message: string, title?: string) => {
    showAlert('info', message, title);
  }, [showAlert]);

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    title?: string
  ) => {
    showAlert('confirm', message, title, onConfirm);
  }, [showAlert]);

  const closeAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alertState,
    success,
    error,
    warning,
    info,
    confirm,
    closeAlert
  };
}