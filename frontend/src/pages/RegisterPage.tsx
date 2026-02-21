import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-white selection:bg-primary/30 min-h-screen" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Premium Ambient Background Effects */}
                <div
                    className="absolute top-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        animation: 'pulse 8s ease-in-out infinite'
                    }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        animation: 'pulse 8s ease-in-out infinite',
                        animationDelay: '4s'
                    }}
                />

                {/* Main Content Container */}
                <div className="relative z-10 w-full max-w-md mx-auto px-6 py-8">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            className="size-11 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-all duration-300 active:scale-95"
                        >
                            <span className="material-symbols-outlined text-white/70 text-lg">arrow_back_ios_new</span>
                        </button>
                        <h1 className="font-heading text-white text-xl md:text-2xl font-bold tracking-tight flex-1 text-center pr-11">Create Account</h1>
                    </div>

                    {/* Headline Section */}
                    <div className="mb-8 text-center">
                        {/* Premium Logo/Icon */}
                        <div
                            className="mx-auto mb-5 w-20 h-20 rounded-2xl flex items-center justify-center relative"
                            style={{
                                background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.05) 100%)',
                                border: '1px solid rgba(139,92,246,0.2)',
                                boxShadow: '0 0 40px -10px rgba(139,92,246,0.4)'
                            }}
                        >
                            <span className="material-symbols-outlined text-4xl text-primary">auto_stories</span>
                        </div>
                        <h2 className="font-heading text-white tracking-tight text-3xl md:text-4xl font-extrabold leading-tight">
                            Join Us
                        </h2>
                        <p className="font-ui text-primary text-sm font-bold tracking-[0.15em] uppercase mt-3">
                            Reading Club
                        </p>
                        <p className="font-body text-white/50 text-base font-normal leading-relaxed mt-4 max-w-sm mx-auto">
                            Start your reading journey today
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            className="mb-6 p-4 rounded-2xl text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)',
                                border: '1px solid rgba(239,68,68,0.2)'
                            }}
                        >
                            <p className="font-ui font-medium text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name Field */}
                        <div className="flex flex-col w-full">
                            <label htmlFor="name" className="flex flex-col w-full">
                                <p className="font-ui text-white/50 text-xs font-bold tracking-[0.12em] uppercase pb-3 pl-1">Full Name</p>
                                <div
                                    className="flex w-full items-stretch rounded-2xl h-14 transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15),0_4px_20px_rgba(139,92,246,0.15)]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: '1px solid rgba(255,255,255,0.08)'
                                    }}
                                >
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="font-body flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 placeholder:text-white/25 px-5 text-base font-normal leading-normal text-white outline-none"
                                        placeholder="Enter your name"
                                        required
                                        autoComplete="name"
                                    />
                                    <div className="text-white/30 flex items-center justify-center pr-5">
                                        <span className="material-symbols-outlined text-xl">person</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Email Field */}
                        <div className="flex flex-col w-full">
                            <label htmlFor="email" className="flex flex-col w-full">
                                <p className="font-ui text-white/50 text-xs font-bold tracking-[0.12em] uppercase pb-3 pl-1">Email Address</p>
                                <div
                                    className="flex w-full items-stretch rounded-2xl h-14 transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15),0_4px_20px_rgba(139,92,246,0.15)]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: '1px solid rgba(255,255,255,0.08)'
                                    }}
                                >
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="font-body flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 placeholder:text-white/25 px-5 text-base font-normal leading-normal text-white outline-none"
                                        placeholder="your@email.com"
                                        required
                                        autoComplete="email"
                                    />
                                    <div className="text-white/30 flex items-center justify-center pr-5">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col w-full">
                            <label htmlFor="password" className="flex flex-col w-full">
                                <p className="font-ui text-white/50 text-xs font-bold tracking-[0.12em] uppercase pb-3 pl-1">Password</p>
                                <div
                                    className="flex w-full items-stretch rounded-2xl h-14 transition-all duration-300 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15),0_4px_20px_rgba(139,92,246,0.15)]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: '1px solid rgba(255,255,255,0.08)'
                                    }}
                                >
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="font-body flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 placeholder:text-white/25 px-5 text-base font-normal leading-normal text-white outline-none"
                                        placeholder="••••••••••••"
                                        required
                                        autoComplete="new-password"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-white/30 flex items-center justify-center pr-5 cursor-pointer hover:text-white/60 transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </label>
                            <p className="font-body text-white/30 text-xs mt-2 pl-1">Minimum 6 characters</p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full h-14 text-white font-ui font-bold text-sm tracking-wide rounded-2xl mt-6 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                            style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                            }}
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10">{isLoading ? 'Creating account...' : 'Create Account'}</span>
                            <span className="material-symbols-outlined text-lg relative z-10">{isLoading ? 'progress_activity' : 'arrow_forward'}</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center py-8">
                        <div className="flex-grow border-t border-white/[0.06]"></div>
                        <span className="font-ui flex-shrink mx-4 text-white/30 text-xs uppercase tracking-[0.15em] font-semibold">or continue with</span>
                        <div className="flex-grow border-t border-white/[0.06]"></div>
                    </div>

                    {/* Social Logins */}
                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                const backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
                                window.location.href = `${backendUrl}/api/auth/google`;
                            }}
                            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer group hover:border-primary/30"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            <img alt="Google logo" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2jx-bWZi6_7KvSgAoKzuaa8xA6t0ba85hD68ZkEeZL80CIcr_DP0YxglVp6CcatnDqhnrC0WdZvP1JhkMQhB0YJEVtqNeUPl1HulA_jhW7BjvOJjsz0fxpFgZqfINaz7KnQHsp8g_cKjwH0TnoBU7-cu8NtJVN0MQshYrjWsxhlPdrEW5gisw9VOfpFlZFXF6ckaIiBZlKmxbMX9GUpIBhG-55bpvj3eB5mhZ-db7NEMgtw7SWtBrbU6OLkk369eow0Y2QOtptig" />
                            <span className="font-ui text-sm font-semibold text-white/60 group-hover:text-white transition-colors">Google</span>
                        </button>
                        <button
                            type="button"
                            className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer group hover:border-primary/30"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        >
                            <span className="material-symbols-outlined text-white/60 group-hover:text-white transition-colors text-xl">ios</span>
                            <span className="font-ui text-sm font-semibold text-white/60 group-hover:text-white transition-colors">Apple</span>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 text-center">
                        <p className="font-body text-white/40 text-sm">
                            Already have an account?
                            <Link
                                to="/login"
                                className="text-primary font-semibold ml-2 hover:text-primary/80 transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
