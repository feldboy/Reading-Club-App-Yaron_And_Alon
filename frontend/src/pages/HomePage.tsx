import { useNavigate } from 'react-router-dom';
import ReviewFeed from '../components/review/ReviewFeed';
import AISearchBar from '../components/ai/AISearchBar';
import BookRecommendations from '../components/ai/BookRecommendations';
import type { AIBook } from '../services/ai.api';

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen pb-24">
            {/* Glassmorphism Header */}
            <header className="sticky top-0 z-40 glass-header px-4 pt-12 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-[2px]">
                            <div className="w-full h-full rounded-full bg-center bg-cover border-2 border-background-dark" data-alt="User profile picture with colorful border" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmbnuFqdRi99jKPkeniqvH8Pb26oxui-hjUL3guoCQ-6TM3037TFOLjRopmIFCSPhvwMxDItc3zM5sePWnS-UVXTJqQxZogYU1k6XUW_3lYjVJMPB114uRIW7F_Vc0tb95Wt1fZ9gz-Vn2K1oWGsVh2aRWAKFSi8VGfkuuJ7wl17geG_jJw0DGHcUU9dIGsZl8rMWaQ-oSm5Th94vha2KsrcGJ28oQTlLUHePnOrTBcgc_PLh6n21r9WsjOHuHdgVk849Tmjsebeg")' }}></div>
                        </div>
                        <div>
                            <h1 className="text-xs text-gray-400 font-medium uppercase tracking-widest">Welcome back</h1>
                            <p className="text-lg font-bold">Reader's Haven</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => alert('No new notifications')}
                            className="size-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-white">notifications</span>
                        </button>
                    </div>
                </div>
                {/* AI Search Bar Component */}
                <div className="mt-2 px-4">
                    <AISearchBar
                        placeholder="Search for books using AI (e.g., 'sci-fi books about space')..."
                        onBookSelect={(book: AIBook) => {
                            // Navigate to create review with book pre-filled
                            navigate('/create-review', { state: { selectedBook: book } });
                        }}
                    />
                </div>
            </header>
            <main>
                {/* AI Recommendations Section */}
                <div className="px-4 pt-6">
                    <BookRecommendations />
                </div>

                {/* Reviews Feed Section */}
                <div className="px-4 pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-2xl font-extrabold leading-tight tracking-tight">Recent Reviews</h2>
                    </div>
                </div>
                {/* Carousel with 3D-like covers */}
                <div className="flex overflow-x-auto no-scrollbar md:px-4">
                    <div className="flex items-stretch p-4 gap-6 md:grid md:grid-cols-3 md:w-full md:max-w-screen-xl md:mx-auto">
                        <Link to="/reviews/1" className="flex h-full flex-1 flex-col gap-4 min-w-[200px] group">
                            <div className="w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform -rotate-2 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO6W5qlz7tLks66icc5fkcF7rz9v73VeU-GybzbrEPRb5aeFrcrziXUboEwiZYu6GLcDwEjiB5PN1ZnPxYqI237ZON7953gVIDfbWbUO1UqNXoEluZBu-2vQSxmNwM9BXd41iC7m7CrEJX2T5WTQWm0VmjScicG2SmD2Z3jgbE7qPYtLy2LaBRac-0FZvVHjfKsa8rHWcmkp-b4gEJf9d1sWrtGU9rilR2kXQRh5HtbZc5Ew3x8E6DKxUX0gerNEvRFt1-vOGRVNA")' }}>
                            </div>
                            <div className="mt-2">
                                <p className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">Beyond the Stars</p>
                                <p className="text-[#b09db9] text-sm font-medium">Elena Vance</p>
                            </div>
                        </Link>
                        <Link to="/reviews/2" className="flex h-full flex-1 flex-col gap-4 min-w-[200px] group">
                            <div className="w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform rotate-2 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdTe2FGoMvuUVSK-gy0NOjrX3ZbbTcXrEMSYOWd9rBSrcC1xD40wkHHbPE1gxsVEPWgOW0KbvGKutg4DTQDMXZeTmHob3mzL47XEhiLqckyjeAy6KVfTRCtKk9WJism7do23TTYuQZNVWP73upZlpA_Ne8xLgxq1AktIgQJNMaewAyolwjr1O-mgKa_CJ6dLLPKoKd4-NoZrkETgGxaGeSWxvxLIolCr24i7Ik0KOzDMoAmv9TyATxckq-kX9NZA4s_JUpbEnQzfE")' }}>
                            </div>
                            <div className="mt-2">
                                <p className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">Dark Matter</p>
                                <p className="text-[#b09db9] text-sm font-medium">Blake Crouch</p>
                            </div>
                        </Link>
                        <Link to="/reviews/3" className="flex h-full flex-1 flex-col gap-4 min-w-[200px] group">
                            <div className="w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform -rotate-1 group-hover:rotate-0 transition-transform duration-300" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrMI4gvpM06Dn7NUyNGBdK9QeyU8CBa_BG7mOm3ej_yKQfUvNRw6GKniJ7zzrhMLx3Aew95FBbkv1nvmxFeZBBuQ4a35BW28K6ThF8Fp7hTiwEhjx5fk-3zHwcj_CJeKCCHGhV_ARD2GLR0VKtAh5QUt_wnpJkxPIh7cBlPHVNsJzAWUBt0ytkIRUFvUMxgda4YpABYp1fAXK7Vmc1RHpTrDdoljJRzG8Qr1JvjV6fjLUNXZBGdqjPwHDB6FQghS-pjB6cd72a6Yc")' }}>
                            </div>
                            <div className="mt-2">
                                <p className="text-white text-lg font-bold leading-tight group-hover:text-primary transition-colors">The Fourth Wing</p>
                                <p className="text-[#b09db9] text-sm font-medium">Rebecca Yarros</p>
                            </div>
                        </Link>
                    </div>
                </div>
                {/* Chips / Category Pills */}
                <div className="px-4 py-2">
                    <div className="flex gap-3 overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 shadow-lg shadow-primary/20">
                            <p className="text-white text-sm font-bold leading-normal">Sci-Fi</p>
                        </div>
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-6">
                            <p className="text-white text-sm font-medium leading-normal">Romance</p>
                        </div>
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-6">
                            <p className="text-white text-sm font-medium leading-normal">Mystery</p>
                        </div>
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-6">
                            <p className="text-white text-sm font-medium leading-normal">Thriller</p>
                        </div>
                        <div className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-6">
                            <p className="text-white text-sm font-medium leading-normal">Non-Fiction</p>
                        </div>
                    </div>
                </div>
                {/* Reviews Feed */}
                <div className="px-4 pt-2 max-w-screen-xl mx-auto">
                    <ReviewFeed />
                </div>
            </main>
        </div>
    );
}
