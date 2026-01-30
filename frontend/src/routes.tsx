import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

/**
 * Layout component with Navbar and Footer
 */
const Layout = () => {
    return (
        <div className="app">
            <Navbar />
            <main className="app-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

/**
 * Protected Route Wrapper
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

/**
 * Placeholder components - will be created in later phases
 */
const HomePage = () => <div>Home Page - Coming Soon</div>;
const ProfilePage = () => <div>Profile Page - Coming Soon</div>;
const CreateReviewPage = () => <div>Create Review Page - Coming Soon</div>;

/**
 * Route definitions
 */
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'create-review',
                element: (
                    <ProtectedRoute>
                        <CreateReviewPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

