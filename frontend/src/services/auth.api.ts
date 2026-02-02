import api from './api';

/**
 * Register request interface
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

/**
 * Login request interface
 */
export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Auth response interface
 */
export interface AuthResponse {
    status: string;
    message: string;
    data: {
        user: {
            id: string;
            username: string;
            email: string;
            profileImage: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

/**
 * Refresh token request interface
 */
export interface RefreshTokenRequest {
    refreshToken: string;
}

/**
 * Refresh token response interface
 */
export interface RefreshTokenResponse {
    status: string;
    message: string;
    data: {
        accessToken: string;
    };
}

/**
 * Register a new user
 */
export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
    });
    return response.data;
};

/**
 * Login user
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
    });
    return response.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
    });
    return response.data;
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<any> => {
    const response = await api.get('/users/profile');
    return response.data;
};
