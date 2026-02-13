import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Get API base URL from environment variable or use default
 */
const getApiBaseURL = (): string => {
    // Vite uses import.meta.env for environment variables
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
        return apiUrl;
    }
    // Default to localhost for development
    return import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';
};

/**
 * Axios instance with base configuration
 */
const api: AxiosInstance = axios.create({
    baseURL: getApiBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - Add JWT token to requests
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    // Try to refresh the token
                    const refreshUrl = `${getApiBaseURL()}/auth/refresh`;
                    const response = await axios.post(refreshUrl, {
                        refreshToken,
                    });

                    const { accessToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        return Promise.reject(error);
    }
);

export default api;

