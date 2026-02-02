import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { router } from './routes';
import './App.css';

/**
 * Main App Component
 * Wrapped with ErrorBoundary for graceful error handling
 */
function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
