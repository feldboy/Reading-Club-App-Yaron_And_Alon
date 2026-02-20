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
            <div className="navbar-container flex items-center justify-between p-4">
                <Link to="/" className="navbar-logo text-xl font-bold text-white flex items-center transition-colors hover:text-primary active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md px-2 py-1" aria-label="Reading Club - Home">
                    📚 Reading Club
                </Link>

                {/* Mobile Menu Button - Added for accessibility and responsive design */}
                <button
                    className="md:hidden text-white p-2 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className="material-symbols-outlined select-none" aria-hidden="true">
                        {isMobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>

                {/* Desktop Menu */}
                <ul className="navbar-menu hidden md:flex items-center gap-6">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md px-2 py-1">
                            Home
                        </Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="navbar-item">
                                <Link to="/profile" className="navbar-link text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md px-2 py-1">
                                    Profile
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/create-review" className="navbar-link text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md px-2 py-1">
                                    Create Review
                                </Link>
                            </li>
                            <li className="navbar-item flex items-center">
                                <span className="navbar-user text-gray-300 text-sm font-medium mr-4">Hello, {user?.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="navbar-button bg-[#3498db] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2980b9] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] active:scale-95"
                                    aria-label={`Logout ${user?.username || 'user'}`}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-md px-2 py-1">
                                    Login
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/register" className="navbar-button bg-[#3498db] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2980b9] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] active:scale-95">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-background-dark border-b border-white/10 md:hidden z-50">
                        <ul className="flex flex-col p-4 space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="block min-h-[44px] px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
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

