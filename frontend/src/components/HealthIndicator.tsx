import React from 'react';
import { useHealthCheck } from '../hooks/useHealthCheck';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const HealthIndicator: React.FC = () => {
  const { healthStatus, checkHealth } = useHealthCheck();

  const getStatusColor = () => {
    if (healthStatus.isHealthy) {
      return 'text-green-500';
    }
    return 'text-red-500';
  };

  const getStatusIcon = () => {
    if (healthStatus.isHealthy) {
      return <Wifi className="w-4 h-4" />;
    }
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (healthStatus.isHealthy) {
      return 'Kết nối ổn định';
    }
    return 'Mất kết nối';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
      <button
        onClick={checkHealth}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        title="Kiểm tra lại kết nối"
      >
        <RefreshCw className="w-3 h-3" />
      </button>
      {healthStatus.lastChecked && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {healthStatus.lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default HealthIndicator;
