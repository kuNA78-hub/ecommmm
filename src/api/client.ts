import axios from 'axios';
import { store } from '../store/store';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
