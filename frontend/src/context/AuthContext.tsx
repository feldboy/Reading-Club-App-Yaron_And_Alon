import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '../services/auth.api';

/**
 * User interface
 */
export interface User {
    id: string;
    username: string;
    email: string;
    profileImage: string;
}

/**
 * Auth Context interface
 */
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    handleOAuthCallback: (accessToken: string, refreshToken: string, user: User) => void;
}

/**
 * Create Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    /**
     * Load user from token on mount
     */
    /**
     * Load user from token on mount
     */
    useEffect(() => {
        const loadUser = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    // Fetch user profile from API to verify token and get fresh data
                    const response = await authApi.getProfile();
                    if (response.data && response.data.user) {
                        setUser(response.data.user);
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    // Invalid token or session expired
                    console.error('Failed to load user profile:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    /**
     * Login function
     */
    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await authApi.login(email, password);

            // Store tokens
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // Set user
            setUser(response.data.user);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    /**
     * Register function
     */
    const register = async (username: string, email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            const response = await authApi.register(username, email, password);

            // Store tokens
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // Set user
            setUser(response.data.user);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    /**
     * Logout function
     */
    const logout = async (): Promise<void> => {
        try {
            await authApi.logout();
        } catch (error) {
            // Even if logout fails on server, clear local state
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    /**
     * Handle OAuth callback - store tokens and set user
     */
    const handleOAuthCallback = useCallback((accessToken: string, refreshToken: string, userData: User): void => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        handleOAuthCallback,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

