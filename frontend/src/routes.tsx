import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

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
 * Placeholder components - will be created in later phases
 */
const HomePage = () => <div>Home Page - Coming Soon</div>;
const LoginPage = () => <div>Login Page - Coming Soon</div>;
const RegisterPage = () => <div>Register Page - Coming Soon</div>;
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
                element: <ProfilePage />,
            },
            {
                path: 'create-review',
                element: <CreateReviewPage />,
            },
        ],
    },
]);

