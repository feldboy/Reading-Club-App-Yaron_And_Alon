import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../services/auth.api';
import api from '../services/api';

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
    useEffect(() => {
        const loadUser = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                try {
                    // Try to decode token and get user info
                    // For now, we'll just check if token exists
                    // In a real app, you might want to call an endpoint to get user info
                    const tokenParts = accessToken.split('.');
                    if (tokenParts.length === 3) {
                        const payload = JSON.parse(atob(tokenParts[1]));
                        // Token exists and is valid format, but we don't have user info yet
                        // We'll set user when they login/register
                    }
                } catch (error) {
                    // Invalid token, clear it
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
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

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
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

