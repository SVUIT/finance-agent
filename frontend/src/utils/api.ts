const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || `HTTP error! status: ${response.status}`,
        response
      );
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const apiRequestWithAuth = async <T = any>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Retry logic for failed requests
export const apiRequestWithRetry = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries: number = 3
): Promise<ApiResponse<T>> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await apiRequest<T>(endpoint, options);
      
      if (result.success) {
        return result;
      }

      // If it's a client error (4xx), don't retry
      if (result.error?.includes('4')) {
        return result;
      }

      lastError = new Error(result.error || 'Request failed');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
    }

    // Wait before retrying (exponential backoff)
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Max retries exceeded',
  };
};
