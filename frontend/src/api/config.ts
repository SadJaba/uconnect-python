import axios from 'axios';

export const API_URL = 'http://localhost:8000/api';

export const getAuthHeader = () => ({
  Authorization: `Token ${localStorage.getItem('token')}`,
});

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
}); 