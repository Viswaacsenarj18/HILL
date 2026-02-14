/* ============================================================
   CENTRALIZED API CONFIGURATION
   Automatically switches between localhost and Render backend
============================================================ */

/**
 * Get the correct API base URL based on environment
 * - Development: http://localhost:5000
 * - Production: https://hillbackend.onrender.com
 */
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV || !import.meta.env.PROD;
  
  // Check environment variable first (for flexibility)
  const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
  if (envBackendUrl) {
    return envBackendUrl;
  }

  // Fallback to automatic detection
  if (isDevelopment) {
    return 'http://localhost:5000';
  } else {
    // Production deployment on Render or similar
    return 'https://hillbackend.onrender.com';
  }
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Build full API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/api/tractors')
 * @returns Full URL
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export default {
  API_BASE_URL,
  getApiUrl,
  // Common endpoints
  endpoints: {
    tractors: '/api/tractors',
    registerTractor: '/api/tractors/register',
    getTractor: (id: string) => `/api/tractors/${id}`,
    confirmRental: '/api/tractors/confirm-rental',
  },
};
