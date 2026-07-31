export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
    stack?: string;
  };
  timestamp: string;
}

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: { code: string; details?: any }
): ApiResponse<T> {
  return {
    success,
    message,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}
