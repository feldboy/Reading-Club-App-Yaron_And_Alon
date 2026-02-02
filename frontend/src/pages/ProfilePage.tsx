import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('reviews');

    // Use user data or defaults
    const displayName = user?.username || 'Alex Thorne';
    const displayImage = user?.profileImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhyqW2zbpi7oGbtqQAKgl0I3OHqHcATRUOD15xJxJsYDxkKoCrigWl8PBxabHog92dIqbqaOFmQN4sUfURyXTRLapXg0MPuGzhSy0T9YPMGypENmhyGszdG0l8H1zsB1jCEBF-o7o6LNiMs_9vQDMV8xu7aZ30SEveGLY6oX36lozT0WN2fk7ps5X02Q-gR-ERGHohuD2ed6Oxl29JI3o3wlWKHxFSH5olD_x7_eyDU4q1IRgJpWcNWyZ1Fi_DCTqvT8rZyRYwoxE';

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen pb-24">
            <div className="relative flex h-auto min-h-screen w-full flex-col bg-gradient-dark overflow-x-hidden w-full shadow-2xl">
                {/* Header Image Section */}
                <div className="relative w-full h-64 overflow-hidden">
                    <div className="w-full h-full bg-center bg-no-repeat bg-cover" data-alt="Abstract futuristic neon violet light trails" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCAIzqYqyd-cCio_yZloTImeANixm56uBEggayTiWlRGa5-WRD1wuK2tQORc_2MCu0VaV8kF0Hvfmg2Tm3_NX-5MAYdiyicn-IQg9OBavLCGvH-89wiYbO1KdZG8Iw7rYlwW4_2gDmX9cU2fHNUyDtuG4p-NL_yHndO1W-czu7JyBqfdIEgy3n9ScBXqja3-op7MAyjrgd1tHg8plrEiQ6VOuSn1xCGUgobTsYVikqaXaauWGrTrx1lKIN2oiyvxuYf7DSqfJ8xajo")' }}>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                </div>

                {/* Profile Header Overlap */}
                <div className="relative flex flex-col items-center -mt-20 px-4">
                    <div className="relative">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-[0_0_20px_rgba(164,19,236,0.6)]" data-alt="User profile" style={{ backgroundImage: `url("${displayImage}")` }}>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-1 rounded-full border-2 border-background-dark flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">verified</span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white">{displayName}</h1>
                        <p className="text-primary/90 text-sm font-semibold tracking-widest uppercase mt-1">Premium Member</p>
                        <p className="text-slate-400 text-base mt-3 max-w-xs mx-auto leading-relaxed">
                            Devouring sci-fi realms one page at a time. Architect of imaginary worlds.
                        </p>
                        <button
                            onClick={() => logout()}
                            className="mt-4 text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1 rounded-full hover:bg-red-500/10 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex gap-3 px-4 py-8 overflow-x-auto no-scrollbar">
                    <div className="flex min-w-[110px] flex-1 flex-col items-center gap-1 rounded-xl p-4 glass-card">
                        <span className="material-symbols-outlined text-primary mb-1">auto_stories</span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Read</p>
                        <p className="text-white text-xl font-bold">124</p>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col items-center gap-1 rounded-xl p-4 glass-card">
                        <span className="material-symbols-outlined text-primary mb-1">rate_review</span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Reviews</p>
                        <p className="text-white text-xl font-bold">48</p>
                    </div>
                    <div className="flex min-w-[110px] flex-1 flex-col items-center gap-1 rounded-xl p-4 glass-card relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 rounded-bl-full blur-xl"></div>
                        <span className="material-symbols-outlined text-primary mb-1">bolt</span>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Streak</p>
                        <p className="text-white text-xl font-bold">15d</p>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-md">
                    <div className="flex border-b border-white/10 px-4">
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-4 flex-1 transition-all ${activeTab === 'reviews' ? 'border-primary text-white' : 'border-transparent text-slate-500'}`}
                        >
                            <p className="text-sm font-bold tracking-wide">My Reviews</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-4 flex-1 transition-all ${activeTab === 'wishlist' ? 'border-primary text-white' : 'border-transparent text-slate-500'}`}
                        >
                            <p className="text-sm font-bold tracking-wide">Wishlist</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex flex-col items-center justify-center border-b-2 pb-3 pt-4 flex-1 transition-all ${activeTab === 'settings' ? 'border-primary text-white' : 'border-transparent text-slate-500'}`}
                        >
                            <p className="text-sm font-bold tracking-wide">Settings</p>
                        </button>
                    </div>
                </div>

                {/* Content Area: Recent Reviews Feed */}
                {activeTab === 'reviews' && (
                    <div className="flex flex-col gap-4 p-4">
                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                            Recent Activity
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        </h3>
                        {/* Review Card 1 */}
                        <Link to="/reviews/1" className="glass-card rounded-xl p-4 flex gap-4 hover:border-primary transition-all group">
                            <div className="w-20 h-28 flex-shrink-0 bg-slate-800 rounded shadow-lg overflow-hidden bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtzBppcQA2KqE2fjkn6Zsv6nuhkr3UxZwipQZnGdsHssFpJ_5PtdXbu0Jd9xVifEshnvil0PFVISLdwHg6W4BxNABc4bven1-0I1CkZp2wzJW0__LU-kAHhDbDeiMSM7hvas36ikfkLmuYhF1O1Tyoyc7CFzmnfjxdlIUkrxz7r2Kc8ZsY0t4K76lQAIqndsXOmtu7r-O8bj99XoXAxxSq4u9raA08AHInLAdBB8NfDPGRVOnY1iz25CXDtiL1SjjO05DAGOkvs3Y")' }}>
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h4 className="text-white font-bold leading-tight group-hover:text-primary transition-colors">Project Hail Mary</h4>
                                    <p className="text-slate-400 text-xs">Andy Weir</p>
                                    <div className="flex items-center gap-0.5 mt-2">
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-xs line-clamp-2 italic">"Incredible pacing and scientific accuracy. A masterpiece of modern sci-fi..."</p>
                            </div>
                        </Link>
                        {/* More mocked cards */}
                        <Link to="/reviews/2" className="glass-card rounded-xl p-4 flex gap-4 hover:border-primary transition-all group">
                            <div className="w-20 h-28 flex-shrink-0 bg-slate-800 rounded shadow-lg overflow-hidden bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOjistMlapRzrjwK4xf4XveOZaAJjEhDvDiNe3a49v2rG7E6qxLK_LygpZl4Ksuq1BMD2b9rHggK5DGgh6nQVCFoOy81faslkrhAMkNef7Rs0zhUfELCG272oMOyGMVxwRWxhY9mlevXb-49hCPKpBf2lefRVb5Wxr6BML9xRYnqFPrw8MDM_J3213wRIBAa6pV1feOINZlS3n12Yb8z3Wub6G51CSTbxa44I2DhLUWn8Y4hEFnVCZrUvnaUUj5EG6mDSWEsDZPGE")' }}>
                            </div>
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h4 className="text-white font-bold leading-tight group-hover:text-primary transition-colors">Dune: Deluxe Edition</h4>
                                    <p className="text-slate-400 text-xs">Frank Herbert</p>
                                    <div className="flex items-center gap-0.5 mt-2">
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-primary text-xs !text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                        <span className="material-symbols-outlined text-slate-600 text-xs !text-[16px]">star</span>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-xs line-clamp-2 italic">"The world-building is unparalleled. It took a while to get into, but..."</p>
                            </div>
                        </Link>
                    </div>
                )}

                {activeTab === 'wishlist' && (
                    <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Wishlist item placeholder */}
                        <div className="flex flex-col gap-3 group">
                            <div className="aspect-[3/4.5] bg-white/5 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary transition-all">
                                <span className="material-symbols-outlined text-4xl text-white/20 group-hover:text-primary transition-colors">auto_stories</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded w-3/4"></div>
                            <div className="h-3 bg-white/5 rounded w-1/2"></div>
                        </div>
                        <div className="flex flex-col gap-3 group">
                            <div className="aspect-[3/4.5] bg-white/5 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-primary transition-all">
                                <span className="material-symbols-outlined text-4xl text-white/20 group-hover:text-primary transition-colors">auto_stories</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded w-3/4"></div>
                            <div className="h-3 bg-white/5 rounded w-1/2"></div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="p-6 space-y-6 max-w-2xl mx-auto w-full">
                        <div className="space-y-4">
                            <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">Account Settings</h3>
                            <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    <span>Edit Profile</span>
                                </div>
                                <span className="material-symbols-outlined opacity-30">chevron_right</span>
                            </div>
                            <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">notifications</span>
                                    <span>Notifications</span>
                                </div>
                                <span className="material-symbols-outlined opacity-30">chevron_right</span>
                            </div>
                            <div className="flex items-center justify-between p-4 glass-card rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">security</span>
                                    <span>Privacy & Security</span>
                                </div>
                                <span className="material-symbols-outlined opacity-30">chevron_right</span>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="w-full p-4 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
