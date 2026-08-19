import axios from 'axios';

// Create an Axios instance with a base URL
// We assume the FastAPI backend runs on localhost:8000
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the auth token to requests automatically
api.interceptors.request.use(
  (config) => {
    // In Next.js, we can read from localStorage on the client side
    // For server-side rendering, things get more complex, but we will focus on client-side fetching for this dashboard
    if (typeof window !== 'undefined') {
      // First check for a verified access token
      let token = sessionStorage.getItem('access_token');
      
      // If we don't have an access token, we might be in the OTP step, so check for pending_token
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

// Interceptor for handling global responses (e.g., redirecting on 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 and we are not already on the login page, we could redirect to login.
      // However, managing router state directly in Axios can be tricky. We usually handle this in Redux or React Query.
      // For now, we just pass the error along.
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Optional: clear tokens if they are invalid
        // sessionStorage.removeItem('access_token');
        // sessionStorage.removeItem('pending_token');
        // window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
