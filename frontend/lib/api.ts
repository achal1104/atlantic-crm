import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = document.cookie.split('; ').find(r => r.startsWith('token='))?.split('=')[1];
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const setAuthToken = (token: string) => {
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`;
};

export const clearAuthToken = () => {
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0';
};
