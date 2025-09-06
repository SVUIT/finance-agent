import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface HealthStatus {
  isHealthy: boolean;
  lastChecked: Date | null;
  error: string | null;
}

export const useHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    isHealthy: false,
    lastChecked: null,
    error: null,
  });

  const checkHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isHealthy = response.ok;
      setHealthStatus({
        isHealthy,
        lastChecked: new Date(),
        error: isHealthy ? null : `Server responded with status: ${response.status}`,
      });

      return isHealthy;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setHealthStatus({
        isHealthy: false,
        lastChecked: new Date(),
        error: errorMessage,
      });
      return false;
    }
  };

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  return {
    healthStatus,
    checkHealth,
  };
};
