import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:8080/api';
const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) || DEFAULT_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token && !config.url.includes('/auth/signin') && !config.url.includes('/auth/signup')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // console.debug('Request headers:', config.headers);
    // console.debug('Request payload:', config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('jwtToken', token);
  } else {
    localStorage.removeItem('jwtToken');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('jwtToken');
};

export default api;