import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { searchBooks, type Book } from '../services/books.api';
import { createReview } from '../services/review.api';
import type { AIBook } from '../services/ai.api';

// Default book fallback if none selected
const DEFAULT_BOOK: Partial<Book> = {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaYrSzk_7tIIqD8SqfK5WkgG_Dzt9xoXE6fFXjDu08sLDRSO4RkJ3AFNtcOwTeeTJOXuUJfGYiYowasYO9zpd0oBr8Vd1PVHA6PNsewDLo0okVWVajQ20qFovRMCnNce2i6K3mm6hRZozQHOrFuyNEZt50eVCpgfrL37U_yTp_pqnpCsWGAvvU76_tmzGKeqeiyWBAtSbhb78oU1v8YBnI2kiSwgFVONTjsSgUlEn_E9obkXxAnwFcQLJstWkULkCP4tzWjfoa5jI'
};

export default function CreateReviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(4);
    const [reviewText, setReviewText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    // Book search state
    const [selectedBook, setSelectedBook] = useState<Partial<Book>>(DEFAULT_BOOK);
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Handle AI book selection from navigation state
    useEffect(() => {
        const aiBook = (location.state as any)?.selectedBook as AIBook | undefined;
        if (aiBook) {
            setSelectedBook({
                title: aiBook.title,
                author: aiBook.author,
                cover: '', // AI books don't have covers
                id: undefined,
            });
        }
    }, [location.state]);

    // Filter out duplicate results by ID
    const uniqueResults = searchResults.filter((book, index, self) =>
        index === self.findIndex((b) => b.id === book.id)
    );

    // Handle outside click to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search effect
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearch.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const results = await searchBooks(debouncedSearch);
                setSearchResults(results);
                setShowResults(true);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [debouncedSearch]);

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setSearchQuery(''); // Clear search logic? or keep it? Clearing looks cleaner.
        setShowResults(false);
        // Clean up results on selection
        setSearchResults([]);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!reviewText.trim()) {
            setError('Please write a review before submitting.');
            return;
        }

        if (!selectedBook.title || !selectedBook.author) {
            setError('Please select a book first.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await createReview({
                bookTitle: selectedBook.title,
                bookAuthor: selectedBook.author,
                bookImage: selectedBook.cover || undefined,
                bookISBN: selectedBook.id || undefined,
                googleBookId: selectedBook.id || undefined,
                rating,
                reviewText: reviewText.trim(),
            });

            navigate('/');
        } catch (err: any) {
            console.error('Failed to create review:', err);
            setError(err.response?.data?.message || 'Failed to create review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display pb-24">
            {/* Header Section with Dynamic Blurred Background */}
            <div className="relative w-full h-[40vh] md:h-[30vh] overflow-hidden">
                {/* Blurred Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40 transition-all duration-700"
                    style={{ backgroundImage: `url('${selectedBook.cover || DEFAULT_BOOK.cover}')` }}
                >
                </div>

                <div className="relative z-10 flex items-center p-4 pt-12 justify-between max-w-screen-xl mx-auto w-full">
                    <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-wider uppercase">Create Review</h2>
                    <div className="size-10 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-white">more_horiz</span>
                    </div>
                </div>

                {/* Book Selection Area */}
                <div className="relative z-10 flex flex-col items-center mt-4 px-6">
                    {/* Search Bar Component */}
                    <div className="w-full max-w-md px-4 py-3 relative" ref={searchRef}>
                        <label className="flex flex-col min-w-40 h-12 w-full">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full glass-panel overflow-hidden">
                                <div className="text-primary flex items-center justify-center pl-4 pr-2">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value) setShowResults(true);
                                    }}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border-none bg-transparent placeholder:text-white/40 px-2 text-base font-normal leading-normal"
                                    placeholder="Search for a different book"
                                />
                                {isSearching && (
                                    <div className="flex items-center justify-center pr-3">
                                        <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </label>

                        {/* Search Results Dropdown */}
                        {showResults && uniqueResults.length > 0 && (
                            <div className="absolute top-full left-4 right-4 mt-2 bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-50">
                                {uniqueResults.map((book) => (
                                    <div
                                        key={book.id}
                                        onClick={() => handleSelectBook(book)}
                                        className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <img
                                            src={book.cover}
                                            alt={book.title}
                                            className="w-10 h-14 object-cover rounded shadow-sm bg-white/5"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white text-sm font-bold truncate">{book.title}</h4>
                                            <p className="text-white/60 text-xs truncate">{book.author}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Headline and Meta Text */}
                    <div className="text-center mt-2 animate-fade-in">
                        <h2 className="text-white tracking-tight text-3xl font-bold leading-tight">{selectedBook.title}</h2>
                        <p className="text-primary/80 text-sm font-medium leading-normal mt-1 tracking-widest uppercase">{selectedBook.author}</p>
                    </div>
                </div>
            </div>

            {/* Interactive Content Section (Pull-up Feel) */}
            <div className="relative z-20 -mt-16 px-4 max-w-screen-md mx-auto w-full">
                <div className="glass-panel rounded-xl p-6 md:p-10 shadow-2xl space-y-8">
                    {/* Neon Star Rating Section */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Rating</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)}>
                                    <span
                                        className={`material-symbols-outlined text-4xl cursor-pointer ${star <= rating ? 'star-active' : 'text-white/20'}`}
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Glassmorphic Rich Text Editor Area */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Your Review</span>
                            <div className="flex gap-4 text-white/40">
                                <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">format_bold</span>
                                <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">format_italic</span>
                                <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">format_list_bulleted</span>
                            </div>
                        </div>
                        <div className="w-full min-h-48 rounded-xl bg-white/5 border border-white/10 p-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full h-full bg-transparent border-none text-white focus:ring-0 p-0 text-base leading-relaxed placeholder:text-white/20 resize-none outline-none"
                                placeholder={`Share your cosmic journey through ${selectedBook.title}...`}
                            ></textarea>
                        </div>
                    </div>

                    {/* Image Upload Zone */}
                    <div className="space-y-3">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Gallery</span>
                        <div className="neon-border-dash w-full h-32 flex flex-col items-center justify-center group cursor-pointer hover:bg-primary/5 transition-colors">
                            <div className="bg-primary/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                            </div>
                            <p className="text-white/80 text-sm font-medium">Tap to upload photos</p>
                            <p className="text-white/40 text-[10px] mt-1">Maximum 5 photos per review</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsPublic(!isPublic)}
                        className="flex items-center justify-between pt-4 border-t border-white/10 cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${isPublic ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                                <span className="material-symbols-outlined text-sm">{isPublic ? 'public' : 'lock'}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white transition-colors group-hover:text-primary">{isPublic ? 'Public Review' : 'Private Review'}</p>
                                <p className="text-[10px] text-white/40">{isPublic ? 'Visible to everyone in the club' : 'Only you can see this'}</p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${isPublic ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`size-4 bg-white rounded-full absolute top-1 shadow-md transition-all ${isPublic ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg">
                    {error}
                </div>
            )}

            {/* Floating Action Button */}
            <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-primary to-[#cc49ff] text-white shadow-[0_0_25px_rgba(164,19,236,0.6)] active:scale-95 transition-all hover:brightness-110 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <span className="material-symbols-outlined text-3xl md:text-4xl group-hover:rotate-12 transition-transform">send</span>
                    )}
                </button>
            </div>
        </div>
    );
}
