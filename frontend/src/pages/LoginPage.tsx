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
        <div className="bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen">
            <div className="relative min-h-screen w-full flex flex-col overflow-hidden nebula-bg">
                {/* Decorative Background Elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] pointer-events-none"></div>

                {/* Top App Bar Component */}
                <div className="flex items-center p-4 pb-2 justify-between z-10 pt-12">
                    <button onClick={() => navigate(-1)} className="text-white flex size-12 shrink-0 items-center cursor-pointer justify-center hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Login</h2>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 max-w-[480px] mx-auto w-full z-10">
                    {/* Headline Section */}
                    <div className="mb-2">
                        <h1 className="text-white tracking-[0.15em] text-[32px] font-bold leading-tight text-center pt-6 drop-shadow-[0_0_10px_rgba(37,226,244,0.3)]">GALACTIC LIBRARY</h1>
                        <p className="text-primary/80 text-sm font-medium tracking-[0.2em] text-center uppercase mt-1">Interstellar Knowledge Hub</p>
                    </div>

                    {/* Body Text */}
                    <div className="mb-8">
                        <p className="text-white/60 text-base font-normal leading-normal text-center">Re-establish your neural link to access the archives.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form Container */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div className="flex flex-col w-full">
                            <label className="flex flex-col w-full">
                                <p className="text-primary text-xs font-bold tracking-widest uppercase pb-2 pl-1 opacity-80">Subspace ID</p>
                                <div className="flex w-full items-stretch rounded-xl glass-panel group focus-within:border-primary/60 transition-all duration-300">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-14 placeholder:text-white/30 p-[15px] text-base font-normal leading-normal text-white"
                                        placeholder="commander@fleet.com"
                                        required
                                    />
                                    <div className="text-primary/60 flex items-center justify-center pr-[15px]">
                                        <span className="material-symbols-outlined">alternate_email</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col w-full">
                            <label className="flex flex-col w-full">
                                <div className="flex justify-between items-center pb-2 pl-1">
                                    <p className="text-primary text-xs font-bold tracking-widest uppercase opacity-80">Security Code</p>
                                    <a className="text-white/40 text-[10px] uppercase tracking-tighter hover:text-primary transition-colors cursor-pointer">Emergency Reset?</a>
                                </div>
                                <div className="flex w-full items-stretch rounded-xl glass-panel group focus-within:border-primary/60 transition-all duration-300">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-input flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-14 placeholder:text-white/30 p-[15px] text-base font-normal leading-normal text-white"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <div className="text-primary/60 flex items-center justify-center pr-[15px]">
                                        <span className="material-symbols-outlined">key_visualizer</span>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-primary text-background-dark font-bold text-lg rounded-xl mt-4 glow-shadow hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isLoading ? 'AUTHENTICATING...' : 'INITIATE AUTHENTICATION'}
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center py-10">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-white/30 text-xs uppercase tracking-widest">Protocol Sync</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    {/* Social Logins */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
                            className="flex-1 h-14 glass-panel rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <img alt="" className="w-5 h-5 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2jx-bWZi6_7KvSgAoKzuaa8xA6t0ba85hD68ZkEeZL80CIcr_DP0YxglVp6CcatnDqhnrC0WdZvP1JhkMQhB0YJEVtqNeUPl1HulA_jhW7BjvOJjsz0fxpFgZqfINaz7KnQHsp8g_cKjwH0TnoBU7-cu8NtJVN0MQshYrjWsxhlPdrEW5gisw9VOfpFlZFXF6ckaIiBZlKmxbMX9GUpIBhG-55bpvj3eB5mhZ-db7NEMgtw7SWtBrbU6OLkk369eow0Y2QOtptig" />
                            <span className="ml-2 text-sm font-medium text-white/80">Google</span>
                        </button>
                        <button className="flex-1 h-14 glass-panel rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-white/80">ios</span>
                            <span className="ml-2 text-sm font-medium text-white/80">Apple</span>
                        </button>
                    </div>

                    {/* Footer Toggle */}
                    <div className="mt-auto py-10 text-center">
                        <p className="text-white/40 text-sm">
                            New to the fleet?
                            <Link to="/register" className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-primary/30">JOIN THE CREW</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
