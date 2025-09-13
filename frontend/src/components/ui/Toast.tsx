import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match the transition duration
  };

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center p-4 mb-2 rounded-lg shadow-lg transition-all duration-300 transform ${colorMap[type]} ${className}`}
      role="alert"
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <span className="flex-grow">{message}</span>
      <button
        type="button"
        onClick={handleClose}
        className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
