import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import BottomNav from './components/layout/BottomNav';
import ScrollToTop from './components/ScrollToTop';
import AIChatBot from './components/AIChatBot';
import { PageLoader } from './components/ui';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import WishlistPageEnhanced from './pages/WishlistPageEnhanced';

/**
 * Layout component with BottomNav and ScrollToTop
 */
const Layout = () => {
    return (
        <div className="bg-[#0f0720] dark:bg-black min-h-screen text-white font-display flex flex-col md:py-6 md:items-center">
            <div className="app bg-background-light dark:bg-background-dark min-h-screen w-full md:max-w-[480px] md:min-h-[calc(100vh-3rem)] md:rounded-3xl md:shadow-[0_0_50px_rgba(124,58,237,0.15)] md:overflow-hidden relative flex flex-col">
                <ScrollToTop />
                <main className="app-main pb-24 flex-1">
                    <Outlet />
                </main>
                <AIChatBot />
                <BottomNav />
            </div>
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
import BookDetailPage from './pages/BookDetailPage';

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
                path: 'books/:googleBookId',
                element: <BookDetailPage />,
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
                path: 'wishlist',
                element: (
                    <ProtectedRoute>
                        <WishlistPageEnhanced />
                    </ProtectedRoute>
                ),
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);

