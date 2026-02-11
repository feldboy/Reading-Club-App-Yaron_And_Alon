import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

/**
 * Navbar Component
 */
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" aria-label="Reading Club - Home">
                    📚 Reading Club
                </Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">
                            Home
                        </Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="navbar-item">
                                <Link to="/profile" className="navbar-link">
                                    Profile
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/create-review" className="navbar-link">
                                    Create Review
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <span className="navbar-user">Hello, {user?.username}</span>
                            </li>
                            <li className="navbar-item">
                                <button 
                                    onClick={handleLogout} 
                                    className="navbar-button focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
                                    aria-label={`Logout ${user?.username || 'user'}`}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link">
                                    Login
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/register" className="navbar-button">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

