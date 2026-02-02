import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
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
                {/* Search Bar Component */}
                <div className="mt-2">
                    <div className="flex flex-col min-w-40 h-12 w-full max-w-2xl mx-auto">
                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-lg overflow-hidden group">
                            <div className="text-[#b09db9] flex border-none bg-white/10 items-center justify-center pl-4 group-focus-within:text-primary transition-colors" data-icon="search">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-white focus:outline-0 focus:ring-0 border-none bg-white/10 focus:border-none h-full placeholder:text-[#b09db9] px-4 pl-2 text-base font-normal leading-normal transition-all"
                                placeholder="Search books or members..."
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main>
                {/* Section Header */}
                <div className="flex items-center justify-between px-4 pb-1 pt-6">
                    <h2 className="text-white text-2xl font-extrabold leading-tight tracking-tight">Featured Reads</h2>
                    <button
                        onClick={() => navigate('/discover')}
                        className="text-primary text-sm font-bold uppercase tracking-wider"
                    >
                        See all
                    </button>
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
                {/* Trending Reviews Section */}
                <div className="px-4 pt-8 max-w-screen-xl mx-auto">
                    <h2 className="text-white text-2xl font-extrabold leading-tight tracking-tight mb-6">Trending Reviews</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                        {/* Review Card 1 */}
                        <Link to="/reviews/4" className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-primary/50 transition-all group">
                            <div className="w-full aspect-[4/3] rounded-xl mb-3 bg-center bg-cover shadow-inner" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAzzy_7yNEi0yFnIZmgMt_8iazMX2bZ01dOF8HWod-S2HBEd4Tr8JwKOAg_rV3gXBCY-wN4YPCqL9XyJ0UxdcJLyZEiJXMH3Wy00gkxZMrir6xkANORIZEQM9FnN4Rz5M-t85m5qTUr1JqZ0w9LnJr_C_wndtS3zdoVut2kt_jFDVXQq2CLwZQkgVPcUYxd3Lc8CfDHtV6m-mjDAmP9plUkWlUrvZf-dka66VI-eF_3OWEuae0vASrN_kNxbzDfUNzGsY3pbIfoiF8")' }}></div>
                            <p className="text-sm font-medium text-white mb-2 leading-relaxed group-hover:text-primary transition-colors">"This book changed how I view the cosmos. Absolutely stunning prose."</p>
                            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxzb13e8e44ZvpqWwmv_INL3ynLBofPysC9bVk1-MR_ae-iYdaji5Joh4Sbz3We2pb67H0eEPI8NizUnqnYW70ws29XRTCm4obQPE9cATx49iu7WQcstRDqbiuisqF4i0z4ummR8Vs6NZHtXk4OEtQS4MZaiugRQKqXAWtUEKYXf6vKcLxSC3XAaI3GMd9OwUWMqSez-lctSbutupR7pzEyMgMznCbFXVWxYon-MIbi60AcBYd8Hi74Fn8oTE8ipnoPdGGZbjID-Q")' }}></div>
                                <span className="text-xs text-[#b09db9] font-medium">@alex_reads</span>
                            </div>
                        </Link>
                        {/* Review Card 2 */}
                        <Link to="/reviews/5" className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-primary/50 transition-all group">
                            <p className="text-sm font-medium text-white mb-4 leading-relaxed group-hover:text-primary transition-colors">"Couldn't put it down! The plot twist at chapter 14 was insane."</p>
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuADZlG018tqvay7iyZdc6DaKQcmDmllSlTQjsN6ss6xo9MzVjDsCQ0TMeas3o8IBCqAOW_gXvTk9gKTO9tfS7AkZ1VUeWkAZtQuhdoDzkhuZxWEdAnn8f1vmAOodQrs88bugUFteO6w1OEk3BV6-DHqJuHzE_9-rFDpeRbHmTmgjHDb3OoJlpis1CfkLXAjqtfGN_XnJV3dVMa0UBgYgONWLPLo-ebQa8JeveMpQCfqzB0-cw-DSlRn5Fa_dCvi9ZHpbmizcB0GMw8")' }}></div>
                                <span className="text-xs text-[#b09db9] font-medium">@sarah_bookish</span>
                            </div>
                        </Link>
                        {/* Review Card 3 */}
                        <Link to="/reviews/6" className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-primary/50 transition-all group">
                            <div className="w-full aspect-square rounded-xl mb-3 bg-center bg-cover" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMjHXPNu7p3OX38iOTwz03ViflbP58NijCag23xc-J_sXn6PUQfvKXzdnDwoK4uPme-9wAL8MrVyFnWE9F9o8tL4YGhv3Q3aV03aigwEZCKs2j8Kc79GPti3NumxpAaAEyzJYlaqI-65d1eLD1GMGpNRHbBcjGAgaEIZz4xpneXSrxpF2ZTYO2An1Dlp7O9Vndx_MZT4kdB8XxXkHj2sZHXs_xL-F0-EehfcdO-IOofElKNlIgqE5VzUNyaTepNld79KO-yuUnmA8")' }}></div>
                            <p className="text-sm font-medium text-white mb-2 leading-relaxed group-hover:text-primary transition-colors">"The world-building is top notch. Highly recommend for any fantasy fans."</p>
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCpESwjHkO0dM_-e2V58olXIGngAo2-QZbm439wB6np04_Q3zLs3iIyUKEx_Kn1R-8mzr6Yzd6hJiToAK8luXo0ODc60h0f1w6ZD1LCaxrxyP0EA2c8Q7gMaiqwxpW8Dhvqpbzoqj5ALYKFXi14d7NBGXgu_tcaCPIvKjF7yMUwojbQjR5gwyx0uaXXXTyxdbTlt9sgZG_ymA5gtW4WDDR3b9gw6qfbeYexAxb-_w1ZRY3caGqO-lEjBT_ie7sIxV88WkYOhk3cxsg")' }}></div>
                                <span className="text-xs text-[#b09db9] font-medium">@fantasy_king</span>
                            </div>
                        </Link>
                        {/* Review Card 4 */}
                        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex flex-col justify-between">
                            <div>
                                <p className="text-primary text-xs font-bold uppercase mb-2">Staff Pick</p>
                                <p className="text-sm font-bold text-white mb-3 leading-relaxed">"A masterpiece of modern fiction. A must-read for everyone."</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold">BC</div>
                                <span className="text-xs text-white/70 font-medium">Club Editor</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
