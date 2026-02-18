import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

/**
 * Responsive Navbar Component with mobile menu
 */
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false);
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
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link
                                            to="/profile"
                                            className="block min-h-[44px] px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/create-review"
                                            className="block min-h-[44px] px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Create Review
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="block px-4 py-2 text-gray-300 text-sm font-medium">
                                            Hello, {user?.username}
                                        </span>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full min-h-[44px] px-4 py-3 bg-[#3498db] text-white rounded-lg font-medium hover:bg-[#2980b9] transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] active:scale-95"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="block min-h-[44px] px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/register"
                                            className="block min-h-[44px] px-4 py-3 bg-[#3498db] text-white rounded-lg font-medium hover:bg-[#2980b9] transition-colors duration-200 text-center focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] active:scale-95"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

