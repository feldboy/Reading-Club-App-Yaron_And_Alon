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
        <nav className="sticky top-0 z-50 bg-[#2c3e50] text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white hover:text-[#3498db] transition-colors duration-200"
                    >
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="hidden sm:inline">Reading Club</span>
                        <span className="sm:hidden">RC</span>
                    </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center gap-6 lg:gap-8">
                        <li>
                            <Link
                                to="/"
                                className="text-white hover:text-[#3498db] transition-colors duration-200 font-medium"
                            >
                                Home
                            </Link>
                        </li>
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <Link
                                        to="/profile"
                                        className="text-white hover:text-[#3498db] transition-colors duration-200 font-medium"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/create-review"
                                        className="text-white hover:text-[#3498db] transition-colors duration-200 font-medium"
                                    >
                                        Create Review
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-gray-300 text-sm font-medium">
                                        Hello, {user?.username}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="min-h-[44px] px-4 py-2 bg-[#3498db] text-white rounded-lg font-medium hover:bg-[#2980b9] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] active:scale-95"
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
                                        className="text-white hover:text-[#3498db] transition-colors duration-200 font-medium"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="min-h-[44px] px-4 py-2 bg-[#3498db] text-white rounded-lg font-medium hover:bg-[#2980b9] transition-colors duration-200 inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] active:scale-95"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden min-h-[44px] min-w-[44px] p-2 text-white hover:text-[#3498db] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 focus:ring-offset-[#2c3e50] rounded-lg"
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-600 py-4">
                        <ul className="flex flex-col gap-3">
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

