import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        // Attach the token to the request headers (if available)
        const token = localStorage.getItem('authToken'); // Retrieve the token from a secure location
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors (e.g., network errors)
        console.error('Request error:', error.message);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (e.g., unauthorized access, server errors)
        console.error('Global error handler:', error.message);
        return Promise.reject(error);
    }
);

export default api;
