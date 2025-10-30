import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    //console.log('[HTTP]', config.method?.toUpperCase(), (config.baseURL || '') + (config.url || ''));
    console.log('[HTTP]', config.method?.toUpperCase(), (config.baseURL||'') + (config.url||''), (config.headers as any)?.Authorization);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Return the data directly if success
    return response.data;
    //return response;
  },
  (error: AxiosError<{ error: boolean; message: string; code?: string }>) => {
    // Handle 401 errors (logout)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Normalize error response
    const errorMessage = error.response?.data?.message || 'Error en la conexión con el servidor';
    const errorCode = error.response?.data?.code;

    return Promise.reject({
      message: errorMessage,
      code: errorCode,
      status: error.response?.status,
    });
  }
);

export default api;
