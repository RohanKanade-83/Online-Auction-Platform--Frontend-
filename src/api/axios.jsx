import axios from 'axios';

export const LOCAL_URL = 'http://localhost:5000/api/auth';
export const RENDER_URL = 'https://api-bidsphare-rk.onrender.com/api/auth';

export const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('bidsphere_api_url');
    if (saved) return saved;

    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      return LOCAL_URL;
    }
  }
  return import.meta.env.VITE_API_URL || RENDER_URL;
};

export const setCustomBaseURL = (newUrl) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bidsphere_api_url', newUrl);
    api.defaults.baseURL = newUrl;
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  // Always synchronize with active baseURL
  config.baseURL = getBaseURL();
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Error reading token:", err);
  }
  return config;
});

export default api;
