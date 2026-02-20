import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] text-white selection:bg-primary/30 min-h-screen">
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-primary/8 blur-[140px] pointer-events-none animate-pulse"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[55%] h-[55%] rounded-full bg-primary/12 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Main Content Container - Centered on Desktop */}
                <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8">
                    {/* Top App Bar Component */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            className="text-white flex size-11 shrink-0 items-center cursor-pointer justify-center hover:bg-white/10 rounded-full transition-colors duration-200"
                        >
                            <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                        </button>
                        <h1 className="font-heading text-white text-xl md:text-2xl font-semibold leading-tight tracking-tight flex-1 text-center pr-11">Login</h1>
                    </div>
                    {/* Headline Section */}
                    <div className="mb-8 text-center animate-fade-in">
                        <h2 className="font-heading text-white tracking-[0.12em] text-3xl md:text-4xl font-bold leading-tight pt-4 drop-shadow-[0_0_12px_rgba(124,58,237,0.4)]">
                            GALACTIC LIBRARY
                        </h2>
                        <p className="font-ui text-primary/90 text-sm md:text-base font-semibold tracking-[0.15em] uppercase mt-3">
                            Interstellar Knowledge Hub
                        </p>
                        <p className="font-body text-white/60 text-base font-normal leading-relaxed mt-4 max-w-sm mx-auto">
                            Re-establish your neural link to access the archives.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-2xl text-red-200 text-sm text-center animate-slide-down shadow-lg">
                            <p className="font-ui font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="flex flex-col w-full">
                            <label htmlFor="email" className="flex flex-col w-full">
                                <p className="font-ui text-primary/90 text-xs font-semibold tracking-[0.12em] uppercase pb-3 pl-1">Subspace ID</p>
                                <div className="flex w-full items-stretch rounded-2xl glass-panel group focus-within:border-primary/60 focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-200 h-14">
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="font-ui flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 placeholder:text-white/30 px-5 text-base font-normal leading-normal text-white outline-none"
                                        placeholder="commander@fleet.com"
                                        required
                                        autoComplete="email"
                                    />
                                    <div className="text-primary/70 flex items-center justify-center pr-5">
                                        <span className="material-symbols-outlined text-xl">alternate_email</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col w-full">
                            <label htmlFor="password" className="flex flex-col w-full">
                                <div className="flex justify-between items-center pb-3 pl-1">
                                    <p className="font-ui text-primary/90 text-xs font-semibold tracking-[0.12em] uppercase">Security Code</p>
                                    <button
                                        type="button"
                                        className="font-ui text-white/50 text-xs uppercase tracking-wider hover:text-primary transition-colors duration-200 cursor-pointer"
                                    >
                                        Emergency Reset?
                                    </button>
                                </div>
                                <div className="flex w-full items-stretch rounded-2xl glass-panel group focus-within:border-primary/60 focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-200 h-14">
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="font-ui flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 placeholder:text-white/30 px-5 text-base font-normal leading-normal text-white outline-none"
                                        placeholder="••••••••••••"
                                        required
                                        autoComplete="current-password"
                                        minLength={6}
                                    />
                                    <div className="text-primary/70 flex items-center justify-center pr-5">
                                        <span className="material-symbols-outlined text-xl">key_visualizer</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-gradient-to-r from-primary to-[#9333ea] text-white font-ui font-bold text-base tracking-wide rounded-2xl mt-6 shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'AUTHENTICATING...' : 'INITIATE AUTHENTICATION'}
                            <span className="material-symbols-outlined text-xl">{isLoading ? 'progress_activity' : 'rocket_launch'}</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center py-8">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="font-ui flex-shrink mx-4 text-white/40 text-xs uppercase tracking-[0.15em] font-medium">Protocol Sync</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    {/* Social Logins */}
                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                const backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
                                window.location.href = `${backendUrl}/api/auth/google`;
                            }}
                            className="flex-1 h-14 glass-panel rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                        >
                            <img alt="Google logo" className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2jx-bWZi6_7KvSgAoKzuaa8xA6t0ba85hD68ZkEeZL80CIcr_DP0YxglVp6CcatnDqhnrC0WdZvP1JhkMQhB0YJEVtqNeUPl1HulA_jhW7BjvOJjsz0fxpFgZqfINaz7KnQHsp8g_cKjwH0TnoBU7-cu8NtJVN0MQshYrjWsxhlPdrEW5gisw9VOfpFlZFXF6ckaIiBZlKmxbMX9GUpIBhG-55bpvj3eB5mhZ-db7NEMgtw7SWtBrbU6OLkk369eow0Y2QOtptig" />
                            <span className="font-ui text-sm font-medium text-white/80 group-hover:text-white transition-colors">Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex-1 h-14 glass-panel rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                        >
                            <span className="material-symbols-outlined text-white/80 group-hover:text-white transition-colors text-xl">ios</span>
                            <span className="font-ui text-sm font-medium text-white/80 group-hover:text-white transition-colors">Apple</span>
                        </button>
                    </div>

                    {/* Footer Toggle */}
                    <div className="mt-8 pt-6 text-center">
                        <p className="font-ui text-white/50 text-sm">
                            New to the fleet?
                            <Link
                                to="/register"
                                className="text-primary font-semibold ml-2 hover:text-primary/80 hover:underline underline-offset-4 decoration-primary/40 transition-colors duration-200"
                            >
                                JOIN THE CREW
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
