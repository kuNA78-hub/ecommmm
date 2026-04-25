import axios from 'axios';
import { store } from '../store/store';

const api = axios.create({
  baseURL: 'https://ecom-yj3z.onrender.com/api',  // Updated to live backend
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
