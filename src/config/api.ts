/* ============================================================
   CENTRALIZED API CONFIGURATION
   Automatically switches between localhost and Render backend
============================================================ */

/**
 * Get the correct API base URL based on environment
 * - Development (localhost): http://localhost:5000
 * - Production (Vercel): https://hillbackend.onrender.com
 */
const getApiBaseUrl = (): string => {
  // For Vercel production deployment - always use Render backend
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isVercelProduction = hostname.includes('vercel.app') || hostname === 'hillsmartfarming.vercel.app';
  
  // Check environment variable first (highest priority)
  const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
  if (envBackendUrl) {
    return envBackendUrl;
  }

  // Development mode uses localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  // For Vercel or any production deployment, use Render backend
  if (isVercelProduction || !import.meta.env.DEV) {
    return 'https://hillbackend.onrender.com';
  }

  // Final fallback
  return 'https://hillbackend.onrender.com';
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
