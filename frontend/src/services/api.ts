import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Axios instance with base configuration
 */
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
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
 * Transform MongoDB _id to id for frontend compatibility
 */
const transformResponse = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(transformResponse);
    }

    if (data && typeof data === 'object') {
        const transformed: any = {};

        for (const key in data) {
            if (key === '_id') {
                transformed.id = data._id;
            } else if (key === 'userId' && typeof data[key] === 'object' && data[key]?._id) {
                // Transform nested user object
                transformed[key] = transformResponse(data[key]);
            } else if (Array.isArray(data[key])) {
                transformed[key] = transformResponse(data[key]);
            } else if (data[key] && typeof data[key] === 'object') {
                transformed[key] = transformResponse(data[key]);
            } else {
                transformed[key] = data[key];
            }
        }

        return transformed;
    }

    return data;
};

/**
 * Response interceptor - Handle errors globally and transform _id to id
 */
api.interceptors.response.use(
    (response) => {
        // Transform _id to id in response data
        if (response.data) {
            response.data = transformResponse(response.data);
        }
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
                    const response = await axios.post('/api/auth/refresh', {
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

