import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

/**
 * Responsive Register Form Component with mobile optimizations
 */
const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    /**
     * Validate password strength
     */
    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        return null;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        // Username validation
        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password validation
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        // Confirm password
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
            <form
                className="bg-white dark:bg-white/5 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-white/10"
                onSubmit={handleSubmit}
            >
                <h2 className="text-center mb-6 sm:mb-8 text-gray-900 dark:text-white text-2xl sm:text-3xl font-bold">
                    Register
                </h2>

                {error && (
                    <div
                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-center text-sm sm:text-base border border-red-200 dark:border-red-800"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <GoogleLoginButton text="Sign up with Google" />

                <div className="flex items-center text-center my-4 sm:my-6 text-gray-600 dark:text-gray-400">
                    <div className="flex-1 border-b border-gray-300 dark:border-white/20"></div>
                    <span className="px-3 sm:px-4 text-sm sm:text-base">or</span>
                    <div className="flex-1 border-b border-gray-300 dark:border-white/20"></div>
                </div>

                <div className="mb-4 sm:mb-6">
                    <label
                        htmlFor="username"
                        className="block mb-2 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        required
                        minLength={3}
                        maxLength={30}
                        disabled={isSubmitting}
                        autoComplete="username"
                        className="w-full min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-white/20 rounded-lg text-base bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="mb-4 sm:mb-6">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        disabled={isSubmitting}
                        inputMode="email"
                        autoComplete="email"
                        className="w-full min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-white/20 rounded-lg text-base bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="mb-4 sm:mb-6">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password (min 6 characters)"
                        required
                        minLength={6}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        className="w-full min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-white/20 rounded-lg text-base bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                </div>

                <div className="mb-4 sm:mb-6">
                    <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        minLength={6}
                        disabled={isSubmitting}
                        autoComplete="new-password"
                        className="w-full min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-white/20 rounded-lg text-base bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full min-h-[44px] px-4 py-3 bg-[#3498db] text-white rounded-lg text-base sm:text-lg font-semibold cursor-pointer transition-all duration-200 mb-4 hover:bg-[#2980b9] focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed active:scale-95"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>

                <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-[#3498db] hover:text-[#2980b9] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 rounded px-1"
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterForm;
