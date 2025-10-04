import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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
    console.log('Request headers:', config.headers); // Log headers
    console.log('Request payload:', config.data); // Log payload
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