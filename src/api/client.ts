import axios from 'axios';
import { store } from '../store/store';

// Use environment variable, fallback to live backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://ecommmm-gsre.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(undefined, (error) => {
  if (error.response?.status === 401) {
    store.dispatch({ type: 'auth/logout' });
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
