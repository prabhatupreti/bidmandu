import axios from 'axios';

const api = axios.create({
  baseURL: '/api',     // <-- changed from http://localhost:3000
});

// Attach token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;