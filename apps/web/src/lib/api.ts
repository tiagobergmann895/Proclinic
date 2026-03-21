import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Auto-inject Token
api.interceptors.request.use((config) => {
  const token = Cookies.get('proclinic.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global Error Handler for 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('proclinic.token');
      if (typeof window !== 'undefined') {
        window.location.href = '/'; // Global redirect to login
      }
    }
    return Promise.reject(error);
  }
);
