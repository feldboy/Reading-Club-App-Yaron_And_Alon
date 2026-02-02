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
        <div className="bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary/30 min-h-screen">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden nebula-bg-register">
                {/* Top Navigation */}
                <div className="flex items-center p-4 pb-2 justify-between z-10 pt-12">
                    <button onClick={() => navigate(-1)} className="text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">Initialize Account</h2>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 py-8">
                    {/* Hero Header Section */}
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-[0_0_40px_rgba(164,19,236,0.5)]">
                            <span className="material-symbols-outlined text-5xl text-white">auto_stories</span>
                        </div>
                        <h1 className="text-white tracking-tight text-4xl font-extrabold leading-tight mb-2">Join the Nebula</h1>
                        <p className="text-white/60 text-base font-normal leading-normal">Your portal to infinite stories awaits.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Registration Form Panel */}
                    <div className="glass-panel-register rounded-3xl p-6 mb-8 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white/80 text-sm font-medium px-1">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">person</span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="glow-input w-full rounded-xl bg-white/5 border border-white/10 h-14 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white/80 text-sm font-medium px-1">Email Address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">alternate_email</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="glow-input w-full rounded-xl bg-white/5 border border-white/10 h-14 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300"
                                        placeholder="name@nexus.com"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <label className="text-white/80 text-sm font-medium px-1">Create Password</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl">lock</span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="glow-input w-full rounded-xl bg-white/5 border border-white/10 h-14 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xl cursor-pointer hover:text-white transition-colors"
                                    >
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="pulsing-button w-full mt-8 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
                                <span className="material-symbols-outlined">rocket_launch</span>
                            </button>
                        </form>
                    </div>

                    {/* Social Registration */}
                    <div className="text-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Or Register With</span>
                            <div className="h-[1px] flex-1 bg-white/10"></div>
                        </div>
                        <div className="flex justify-center gap-4 mb-10">
                            <button
                                onClick={() => window.location.href = 'http://localhost:3000/api/auth/google'}
                                className="glass-panel-register w-16 h-16 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                <img className="w-6 h-6" alt="Google" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVQKtNYxfrdDuZ6lzSmrjGgZXIQ4eqmjOUJ2CbMLYo7lb2lJaw0bS0Eg3P8sL-WaU0kVsUQ6SvfQg04XV9CJwpkGUVymESHiQ71sMJtNnzC_bxd6JBWvDTd7MOSNU3uNv7PSr6Aq8BGcGJrs2jIZ65rXGZtnIhlC4qIdYa1ADW_M5pKIhIe6HuIgCyJCyB-L0oDgASCLI4crB7WaRUwBV3FG4yu3KKA98XXmrBPRbtDVC3gJrBhtu8IXEOBwCIAFaWEpUrgiOaSK0" />
                            </button>
                            <button className="glass-panel-register w-16 h-16 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-3xl">ios</span>
                            </button>
                            <button className="glass-panel-register w-16 h-16 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                                <span className="material-symbols-outlined text-3xl">fingerprint</span>
                            </button>
                        </div>
                        <p className="text-white/60 text-sm">
                            Already a member?
                            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Sign In</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Decorative Glow */}
                <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="fixed -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            </div>
        </div>
    );
}
