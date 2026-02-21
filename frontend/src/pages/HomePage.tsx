import { useNavigate } from 'react-router-dom';
import ReviewFeed from '../components/review/ReviewFeed';
import TopBooksCarousel from '../components/review/TopBooksCarousel';
import AISearchBar from '../components/ai/AISearchBar';
import BookRecommendations from '../components/ai/BookRecommendations';
import type { AIBook } from '../services/ai.api';
import { searchBooks } from '../services/books.api';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageUtils';

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen pb-24 md:pb-8 selection:bg-primary/30" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            {/* Premium Glassmorphism Header */}
            <header
                className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5"
                style={{
                    background: 'linear-gradient(180deg, rgba(3,3,3,0.97) 0%, rgba(3,3,3,0.9) 100%)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            {/* Premium user avatar with gradient ring */}
                            <div className="relative size-11 sm:size-12 shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full opacity-60"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6, #22d3ee, #f472b6)',
                                        filter: 'blur(8px)'
                                    }}
                                />
                                <div className="relative size-full rounded-full p-[2px] bg-gradient-to-tr from-primary via-accent to-accent-warm">
                                    <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center overflow-hidden">
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user.username}
                                                className="w-full h-full object-cover"
                                                onError={handleImageError}
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined text-white/60 text-xl">person</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                                <span className="text-[10px] sm:text-[11px] text-white/40 font-bold uppercase tracking-[0.15em] truncate mb-0.5 font-ui">Welcome back</span>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-heading font-extrabold truncate tracking-tight text-white">
                                    {user?.username ? user.username : "Reader's Haven"}
                                </h1>
                            </div>
                        </div>
                        <div className="flex gap-2.5 shrink-0">
                            {/* Premium New Review button */}
                            <button
                                onClick={() => navigate('/create-review')}
                                className="hidden sm:flex min-h-[44px] items-center gap-2 px-5 rounded-full text-sm font-bold transition-all duration-500 cursor-pointer overflow-hidden relative group"
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                                }}
                                aria-label="Write a new review"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundSize: '200% 100%' }} />
                                <span className="material-symbols-outlined text-lg text-white relative z-10" aria-hidden="true">edit_square</span>
                                <span className="text-white relative z-10">New Review</span>
                            </button>
                            {/* Notification button */}
                            <button
                                onClick={() => alert('No new notifications')}
                                className="min-w-[44px] min-h-[44px] size-11 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] cursor-pointer active:scale-95"
                                aria-label="View notifications"
                            >
                                <span className="material-symbols-outlined text-white/50 text-xl" aria-hidden="true">notifications</span>
                            </button>
                        </div>
                    </div>
                    {/* Premium AI Search Bar */}
                    <div className="mt-1">
                        <AISearchBar
                            placeholder="Ask AI for book recommendations..."
                            onBookSelect={async (book: AIBook) => {
                                try {
                                    const results = await searchBooks(`${book.title} ${book.author}`);
                                    if (results.length > 0) {
                                        navigate(`/books/${results[0].id}`);
                                    } else {
                                        navigate('/create-review', { state: { selectedBook: book } });
                                    }
                                } catch (error) {
                                    console.error('Failed to find book:', error);
                                    navigate('/create-review', { state: { selectedBook: book } });
                                }
                            }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto animate-fade-in">
                {/* AI Recommendations Section */}
                <div className="px-4 sm:px-6 lg:px-8 pt-8">
                    <BookRecommendations />
                </div>

                {/* Top Books Carousel */}
                <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                    <TopBooksCarousel />
                </div>

                {/* Live Reviews Feed */}
                <section className="px-4 sm:px-6 lg:px-8 pt-6 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl sm:text-3xl font-heading font-extrabold leading-tight tracking-tight">
                            Community Reviews
                        </h2>
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]"></span>
                            </span>
                            <span className="text-primary text-[11px] font-bold uppercase tracking-[0.1em] font-ui">Live</span>
                        </span>
                    </div>
                    <ReviewFeed />
                </section>
            </main>
        </div>
    );
}
