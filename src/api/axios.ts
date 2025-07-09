import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ample-curiosity-production-21b0.up.railway.app', // ganti jika backend deploy di server
});

// Interceptor untuk attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;