import { Link, useNavigate } from 'react-router-dom';
import ReviewFeed from '../components/review/ReviewFeed';
import AISearchBar from '../components/ai/AISearchBar';
import BookRecommendations from '../components/ai/BookRecommendations';
import type { AIBook } from '../services/ai.api';

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] font-[Libre_Baskerville] text-white min-h-screen pb-24 md:pb-8">
            {/* Glassmorphism Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#1a0f2e]/80 border-b border-white/5 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4 shadow-lg shadow-black/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="size-10 sm:size-12 shrink-0 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-[2px]">
                                <div
                                    className="w-full h-full rounded-full bg-center bg-cover border-2 border-background-dark"
                                    role="img"
                                    aria-label="User profile picture with colorful border"
                                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAmbnuFqdRi99jKPkeniqvH8Pb26oxui-hjUL3guoCQ-6TM3037TFOLjRopmIFCSPhvwMxDItc3zM5sePWnS-UVXTJqQxZogYU1k6XUW_3lYjVJMPB114uRIW7F_Vc0tb95Wt1fZ9gz-Vn2K1oWGsVh2aRWAKFSi8VGfkuuJ7wl17geG_jJw0DGHcUU9dIGsZl8rMWaQ-oSm5Th94vha2KsrcGJ28oQTlLUHePnOrTBcgc_PLh6n21r9WsjOHuHdgVk849Tmjsebeg")' }}
                                ></div>
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-widest truncate">Welcome back</h1>
                                <p className="text-base sm:text-lg lg:text-xl font-bold truncate">Reader's Haven</p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={() => alert('No new notifications')}
                                className="min-w-[44px] min-h-[44px] size-10 sm:size-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark cursor-pointer active:scale-95"
                                aria-label="View notifications"
                            >
                                <span className="material-symbols-outlined text-white text-xl sm:text-2xl" aria-hidden="true">notifications</span>
                            </button>
                        </div>
                    </div>
                    {/* AI Search Bar Component */}
                    <div className="mt-2">
                        <AISearchBar
                            placeholder="Search for books using AI (e.g., 'sci-fi books about space')..."
                            onBookSelect={(book: AIBook) => {
                                // Navigate to create review with book pre-filled
                                navigate('/create-review', { state: { selectedBook: book } });
                            }}
                        />
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto">
                {/* AI Recommendations Section */}
                <div className="px-4 sm:px-6 lg:px-8 pt-6">
                    <BookRecommendations />
                </div>

                {/* Reviews Feed Section */}
                <div className="px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">Recent Reviews</h2>
                    </div>
                </div>
                {/* Carousel with 3D-like covers */}
                <div className="overflow-x-auto no-scrollbar md:overflow-visible px-4 sm:px-6 lg:px-8">
                    <div className="flex items-stretch gap-4 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 py-4">
                        <Link
                            to="/reviews/1"
                            className="flex h-full flex-1 flex-col gap-3 sm:gap-4 min-w-[180px] sm:min-w-[200px] md:min-w-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-lg"
                        >
                            <div
                                className="w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 group-focus:rotate-0"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCO6W5qlz7tLks66icc5fkcF7rz9v73VeU-GybzbrEPRb5aeFrcrziXUboEwiZYu6GLcDwEjiB5PN1ZnPxYqI237ZON7953gVIDfbWbUO1UqNXoEluZBu-2vQSxmNwM9BXd41iC7m7CrEJX2T5WTQWm0VmjScicG2SmD2Z3jgbE7qPYtLy2LaBRac-0FZvVHjfKsa8rHWcmkp-b4gEJf9d1sWrtGU9rilR2kXQRh5HtbZc5Ew3x8E6DKxUX0gerNEvRFt1-vOGRVNA")' }}
                                role="img"
                                aria-label="Beyond the Stars book cover"
                            >
                            </div>
                            <div className="mt-2">
                                <p className="text-white text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200">Beyond the Stars</p>
                                <p className="text-[#b09db9] text-sm font-medium">Elena Vance</p>
                            </div>
                        </Link>
                        <Link
                            to="/reviews/2"
                            className="flex h-full flex-1 flex-col gap-3 sm:gap-4 min-w-[180px] sm:min-w-[200px] md:min-w-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-lg"
                        >
                            <div
                                className="w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform rotate-2 group-hover:rotate-0 transition-transform duration-300 group-focus:rotate-0"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdTe2FGoMvuUVSK-gy0NOjrX3ZbbTcXrEMSYOWd9rBSrcC1xD40wkHHbPE1gxsVEPWgOW0KbvGKutg4DTQDMXZeTmHob3mzL47XEhiLqckyjeAy6KVfTRCtKk9WJism7do23TTYuQZNVWP73upZlpA_Ne8xLgxq1AktIgQJNMaewAyolwjr1O-mgKa_CJ6dLLPKoKd4-NoZrkETgGxaGeSWxvxLIolCr24i7Ik0KOzDMoAmv9TyATxckq-kX9NZA4s_JUpbEnQzfE")' }}
                                role="img"
                                aria-label="Dark Matter book cover"
                            >
                            </div>
                            <div className="mt-2">
                                <p className="text-white text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200">Dark Matter</p>
                                <p className="text-[#b09db9] text-sm font-medium">Blake Crouch</p>
                            </div>
                        </Link>
                        <Link
                            to="/reviews/3"
                            className="flex h-full flex-1 flex-col gap-3 sm:gap-4 min-w-[180px] sm:min-w-[200px] md:min-w-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-lg"
                        >
                            <div
                                className="w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 group-focus:rotate-0"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrMI4gvpM06Dn7NUyNGBdK9QeyU8CBa_BG7mOm3ej_yKQfUvNRw6GKniJ7zzrhMLx3Aew95FBbkv1nvmxFeZBBuQ4a35BW28K6ThF8Fp7hTiwEhjx5fk-3zHwcj_CJeKCCHGhV_ARD2GLR0VKtAh5QUt_wnpJkxPIh7cBlPHVNsJzAWUBt0ytkIRUFvUMxgda4YpABYp1fAXK7Vmc1RHpTrDdoljJRzG8Qr1JvjV6fjLUNXZBGdqjPwHDB6FQghS-pjB6cd72a6Yc")' }}
                                role="img"
                                aria-label="The Fourth Wing book cover"
                            >
                            </div>
                            <div className="mt-2">
                                <p className="text-white text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200">The Fourth Wing</p>
                                <p className="text-[#b09db9] text-sm font-medium">Rebecca Yarros</p>
                            </div>
                        </Link>
                    </div>
                </div>
                {/* Chips / Category Pills */}
                <div className="px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
                    <div className="flex gap-2 sm:gap-3 overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <button className="flex min-h-[44px] h-10 sm:h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-5 sm:px-6 shadow-lg shadow-primary/20 cursor-pointer hover:shadow-primary/30 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark active:scale-95">
                            <p className="text-white text-sm font-bold leading-normal whitespace-nowrap">Sci-Fi</p>
                        </button>
                        <button className="flex min-h-[44px] h-10 sm:h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-5 sm:px-6 cursor-pointer hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark active:scale-95">
                            <p className="text-white text-sm font-medium leading-normal whitespace-nowrap">Romance</p>
                        </button>
                        <button className="flex min-h-[44px] h-10 sm:h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-5 sm:px-6 cursor-pointer hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark active:scale-95">
                            <p className="text-white text-sm font-medium leading-normal whitespace-nowrap">Mystery</p>
                        </button>
                        <button className="flex min-h-[44px] h-10 sm:h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-5 sm:px-6 cursor-pointer hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark active:scale-95">
                            <p className="text-white text-sm font-medium leading-normal whitespace-nowrap">Thriller</p>
                        </button>
                        <button className="flex min-h-[44px] h-10 sm:h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white/5 border border-white/10 px-5 sm:px-6 cursor-pointer hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark active:scale-95">
                            <p className="text-white text-sm font-medium leading-normal whitespace-nowrap">Non-Fiction</p>
                        </button>
                    </div>
                </div>
                {/* Reviews Feed */}
                <div className="px-4 sm:px-6 lg:px-8 pt-2">
                    <ReviewFeed />
                </div>
            </main>
        </div>
    );
}
