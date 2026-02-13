import { useNavigate } from 'react-router-dom';
import ReviewFeed from '../components/review/ReviewFeed';
import TopBooksCarousel from '../components/review/TopBooksCarousel';
import AISearchBar from '../components/ai/AISearchBar';
import BookRecommendations from '../components/ai/BookRecommendations';
import type { AIBook } from '../services/ai.api';
import { searchBooks } from '../services/books.api';

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
                            onBookSelect={async (book: AIBook) => {
                                // Search for the book in Google Books API to get the ID
                                try {
                                    const results = await searchBooks(`${book.title} ${book.author}`);

                                    // Find best match and navigate to book detail page
                                    if (results.length > 0) {
                                        navigate(`/books/${results[0].id}`);
                                    } else {
                                        // Fallback: navigate to create review if book not found
                                        navigate('/create-review', { state: { selectedBook: book } });
                                    }
                                } catch (error) {
                                    console.error('Failed to find book:', error);
                                    // Fallback: navigate to create review on error
                                    navigate('/create-review', { state: { selectedBook: book } });
                                }
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

                {/* Top Books Carousel */}
                <TopBooksCarousel />

                {/* Reviews Feed */}
                <div className="px-4 sm:px-6 lg:px-8 pt-8">
                    <ReviewFeed />
                </div>
            </main>
        </div>
    );
}
