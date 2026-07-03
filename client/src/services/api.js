import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Extract error details
api.interceptors.response.use(
  (response) => response.data, // Return response body directly (ApiResponse structure: { success, data, message })
  (error) => {
    // If token is invalid or expired, clear localStorage and optionally handle redirect
    if (error.response && error.response.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (hadToken) {
        window.dispatchEvent(new Event('auth-unauthorized'));
      }
    }

    const message = error.response?.data?.message || 'An unexpected error occurred';
    const errors = error.response?.data?.errors || [];
    
    // Create a standardized error object to catch in components
    const customError = new Error(message);
    customError.status = error.response?.status || 500;
    customError.errors = errors;
    
    return Promise.reject(customError);
  }
);

export default api;
