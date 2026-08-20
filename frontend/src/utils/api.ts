import axios from 'axios';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {

    if (typeof window !== 'undefined') {

      let token = sessionStorage.getItem('access_token');


      if (!token) {
        token = sessionStorage.getItem('pending_token');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {

      }
    }
    return Promise.reject(error);
  }
);

export default api;
