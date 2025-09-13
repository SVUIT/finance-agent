import React from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface PageLoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Đang tải...',
  fullScreen = true,
}) => {
  const containerClasses = `flex flex-col items-center justify-center ${
    fullScreen ? 'min-h-screen' : 'py-16'
  }`;

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="mb-4">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default PageLoading;
