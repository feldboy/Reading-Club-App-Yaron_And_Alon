import { createContext, useContext, useState, ReactNode } from 'react';

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
    logout: () => void;
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
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Login function (placeholder - will be implemented in Phase 2)
     */
    const login = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            // TODO: Implement in Phase 2
            console.log('Login:', email, password);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    /**
     * Register function (placeholder - will be implemented in Phase 2)
     */
    const register = async (username: string, email: string, password: string): Promise<void> => {
        setLoading(true);
        try {
            // TODO: Implement in Phase 2
            console.log('Register:', username, email, password);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    /**
     * Logout function (placeholder - will be implemented in Phase 2)
     */
    const logout = (): void => {
        // TODO: Implement in Phase 2
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
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

