import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import BottomNav from './components/layout/BottomNav';
import { PageLoader } from './components/ui';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';

/**
 * Layout component with BottomNav
 */
const Layout = () => {
    return (
        <div className="app bg-background-light dark:bg-background-dark min-h-screen text-white font-display">
            <main className="app-main pb-24">
                <Outlet />
            </main>
            <BottomNav />
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
        return <PageLoader text="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

/**
 * Placeholder components - will be created in later phases
 */
import CreateReviewPage from './pages/CreateReviewPage';
import DiscoverPage from './pages/DiscoverPage';
import ClubsPage from './pages/ClubsPage';

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
                path: 'auth/callback',
                element: <OAuthCallbackPage />,
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
                path: 'profile/edit',
                element: (
                    <ProtectedRoute>
                        <EditProfilePage />
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
            {
                path: 'reviews/:id',
                element: <ReviewDetailPage />,
            },
            {
                path: 'discover',
                element: <DiscoverPage />,
            },
            {
                path: 'clubs',
                element: <ClubsPage />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);

