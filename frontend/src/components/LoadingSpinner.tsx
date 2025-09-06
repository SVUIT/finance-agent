import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Đang tải...', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-violet-500 border-t-transparent rounded-full animate-spin`}></div>
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
