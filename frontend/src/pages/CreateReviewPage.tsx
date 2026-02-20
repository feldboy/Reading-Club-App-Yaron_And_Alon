import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { searchBooks, type Book } from '../services/books.api';
import { createReview } from '../services/review.api';

export default function CreateReviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(4);
    const [reviewText, setReviewText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    // Book search state
    const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [popularBooks, setPopularBooks] = useState<Book[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Handle book selection from navigation state (from BookDetailPage or AI search)
    useEffect(() => {
        const bookFromState = (location.state as any)?.selectedBook;
        if (bookFromState) {
            setSelectedBook({
                title: bookFromState.title,
                author: bookFromState.author,
                cover: bookFromState.cover || '',
                id: bookFromState.id,
            });
        }
    }, [location.state]);

    // Load popular books for browsing
    const loadPopularBooks = async () => {
        setIsLoadingPopular(true);
        try {
            // Search for popular fiction books
            const books = await searchBooks('bestseller fiction');
            setPopularBooks(books.slice(0, 12)); // Show first 12 books
        } catch (error) {
            console.error('Failed to load popular books:', error);
        } finally {
            setIsLoadingPopular(false);
        }
    };

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
        if (!selectedBook || !selectedBook.title || !selectedBook.author) {
            setError('Please search and select a book first.');
            return;
        }

        if (!reviewText.trim()) {
            setError('Please write a review before submitting.');
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
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] text-white min-h-screen pb-24">
            {/* Header Section with Dynamic Blurred Background */}
            <div className="relative w-full h-[40vh] md:h-[30vh] overflow-hidden">
                {/* Blurred Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40 transition-all duration-700"
                    role="img"
                    aria-label={`Background image: ${selectedBook?.title || 'Book'} cover`}
                    style={{ backgroundImage: `url('${selectedBook?.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop'}')` }}
                >
                </div>

                {/* Top Navigation - Centered */}
                <div className="relative z-10 w-full px-4 md:px-6 pt-12">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 max-w-2xl mx-auto">
                        <button onClick={() => navigate(-1)} className="size-11 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors duration-200">
                            <span className="material-symbols-outlined text-white text-xl">arrow_back_ios_new</span>
                        </button>
                        <h1 className="text-white text-xl md:text-2xl font-heading font-semibold tracking-tight text-center">Create Review</h1>
                        <div className="size-11 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors duration-200">
                            <span className="material-symbols-outlined text-white text-xl">more_horiz</span>
                        </div>
                    </div>
                </div>

                {/* Book Selection Area - Centered */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 md:px-6 w-full">
                    <div className="w-full max-w-2xl mx-auto space-y-6">
                        {/* Search Bar Component */}
                        <div className="w-full relative" ref={searchRef}>
                            <label htmlFor="book-search" className="sr-only">Search for a book</label>
                            <div className="flex w-full items-stretch rounded-2xl h-14 glass-panel overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                                <div className="text-primary flex items-center justify-center pl-5 pr-3">
                                    <span className="material-symbols-outlined text-2xl">search</span>
                                </div>
                                <input
                                    id="book-search"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value) setShowResults(true);
                                    }}
                                    className="font-ui flex w-full min-w-0 flex-1 text-white focus:outline-none focus:ring-0 border-none bg-transparent placeholder:text-white/40 px-2 text-base font-normal leading-normal"
                                    placeholder={selectedBook ? "Search for a different book" : "Search for a book to review"}
                                />
                                {isSearching && (
                                    <div className="flex items-center justify-center pr-4">
                                        <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>

                            {/* Search Results Dropdown */}
                            {showResults && uniqueResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto z-50">
                                    {uniqueResults.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleSelectBook(book)}
                                            className="flex items-center gap-4 p-4 hover:bg-white/10 cursor-pointer transition-colors duration-200 border-b border-white/5 last:border-0"
                                        >
                                            <img
                                                src={book.cover}
                                                alt={`${book.title} cover`}
                                                className="w-12 h-16 object-cover rounded-lg shadow-sm bg-white/5"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-heading text-white text-base font-semibold truncate">{book.title}</h4>
                                                <p className="font-ui text-white/60 text-sm truncate mt-1">{book.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Headline and Meta Text */}
                        <div className="text-center">
                            {selectedBook ? (
                                <>
                                    <h2 className="font-heading text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">{selectedBook.title}</h2>
                                    <p className="font-ui text-primary/90 text-sm md:text-base font-medium leading-normal mt-3 tracking-wider uppercase">{selectedBook.author}</p>
                                    <button
                                        onClick={() => setSelectedBook(null)}
                                        className="mt-4 text-white/60 hover:text-white text-sm font-ui flex items-center gap-1 mx-auto cursor-pointer transition-colors duration-200"
                                    >
                                        <span className="material-symbols-outlined text-base">close</span>
                                        Change book
                                    </button>
                                </>
                            ) : (
                                <div className="py-8">
                                    <div className="bg-primary/20 p-4 rounded-full inline-flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-primary text-4xl">menu_book</span>
                                    </div>
                                    <h2 className="font-heading text-white/80 tracking-tight text-2xl md:text-3xl font-semibold leading-tight">Choose a book to review</h2>
                                    <p className="font-ui text-white/50 text-sm md:text-base mt-2">Search above or browse popular books</p>
                                    <button
                                        onClick={() => {
                                            setShowBrowse(!showBrowse);
                                            if (!showBrowse && popularBooks.length === 0) {
                                                loadPopularBooks();
                                            }
                                        }}
                                        className="mt-4 bg-primary/20 hover:bg-primary/30 text-white px-6 py-2 rounded-xl font-ui text-sm font-semibold flex items-center gap-2 mx-auto cursor-pointer transition-all duration-200"
                                    >
                                        <span className="material-symbols-outlined text-lg">explore</span>
                                        {showBrowse ? 'Hide Books' : 'Browse Popular Books'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Popular Books Grid */}
                        {showBrowse && !selectedBook && (
                            <div className="mt-6 glass-panel rounded-2xl p-4 max-h-[60vh] overflow-y-auto">
                                {isLoadingPopular ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-ui text-white/60 text-xs text-center mb-4">Select a book to review</p>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                            {popularBooks.map((book) => (
                                                <button
                                                    key={book.id}
                                                    onClick={() => {
                                                        handleSelectBook(book);
                                                        setShowBrowse(false);
                                                    }}
                                                    className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer"
                                                >
                                                    <img
                                                        src={book.cover || '/placeholder-book.png'}
                                                        alt={book.title}
                                                        className="w-full aspect-[2/3] object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                    <div className="text-center w-full">
                                                        <h4 className="font-heading text-white text-xs font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                            {book.title}
                                                        </h4>
                                                        <p className="font-ui text-white/50 text-[10px] line-clamp-1 mt-0.5">{book.author}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Interactive Content Section (Pull-up Feel) - Centered */}
            <div className="relative z-20 -mt-20 w-full flex justify-center px-4 md:px-6">
                <div className="glass-panel rounded-3xl p-8 md:p-12 shadow-2xl space-y-10 w-full max-w-2xl">
                    {/* Neon Star Rating Section */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <label className="font-ui text-white/70 text-xs font-semibold uppercase tracking-[0.15em]">Rating</label>
                        <div className="flex gap-3" role="group" aria-label="Rating selection">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-full"
                                >
                                    <span
                                        className={`material-symbols-outlined text-4xl cursor-pointer ${star <= rating ? 'star-active' : 'text-white/20'}`}
                                        aria-hidden="true"
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Glassmorphic Rich Text Editor Area */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label htmlFor="review-text" className="font-ui text-white/70 text-xs font-semibold uppercase tracking-[0.15em]">Your Review</label>
                            <div className="flex gap-4 text-white/40">
                                <button aria-label="Bold formatting" className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors duration-200">format_bold</button>
                                <button aria-label="Italic formatting" className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors duration-200">format_italic</button>
                                <button aria-label="Bullet list" className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors duration-200">format_list_bulleted</button>
                            </div>
                        </div>
                        <div className="w-full min-h-56 rounded-2xl bg-white/5 border border-white/10 p-6 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
                            <textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="font-body w-full h-full bg-transparent border-none text-white focus:ring-0 p-0 text-base leading-relaxed placeholder:text-white/30 resize-none outline-none"
                                placeholder={selectedBook?.title ? `Share your thoughts about ${selectedBook.title}...` : "Select a book first to write your review..."}
                            ></textarea>
                        </div>
                    </div>

                    {/* Image Upload Zone */}
                    <div className="space-y-4">
                        <label className="font-ui text-white/70 text-xs font-semibold uppercase tracking-[0.15em]">Gallery</label>
                        <button
                            type="button"
                            className="w-full h-36 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center group cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all duration-200"
                        >
                            <div className="bg-primary/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                                <span className="material-symbols-outlined text-primary text-3xl">add_a_photo</span>
                            </div>
                            <p className="font-ui text-white/80 text-sm font-medium">Tap to upload photos</p>
                            <p className="font-ui text-white/40 text-xs mt-2">Maximum 5 photos per review</p>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className="flex items-center justify-between pt-6 mt-2 border-t border-white/10 cursor-pointer group w-full"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`size-10 rounded-full flex items-center justify-center transition-colors duration-200 ${isPublic ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                                <span className="material-symbols-outlined text-xl">{isPublic ? 'public' : 'lock'}</span>
                            </div>
                            <div className="text-left">
                                <p className="font-ui text-sm font-semibold text-white transition-colors duration-200 group-hover:text-primary">{isPublic ? 'Public Review' : 'Private Review'}</p>
                                <p className="font-ui text-xs text-white/50 mt-1">{isPublic ? 'Visible to everyone in the club' : 'Only you can see this'}</p>
                            </div>
                        </div>
                        <div className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${isPublic ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`size-5 bg-white rounded-full absolute top-1 shadow-md transition-all duration-200 ${isPublic ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/95 backdrop-blur-sm text-white px-6 py-3 rounded-2xl shadow-2xl border border-red-400/20 max-w-md mx-4 animate-slide-down">
                    <p className="font-ui text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Floating Action Button */}
            <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Submitting review" : "Submit review"}
                    className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-primary to-[#cc49ff] text-white shadow-[0_0_25px_rgba(164,19,236,0.6)] active:scale-95 transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_35px_rgba(164,19,236,0.8)] group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? (
                        <div className="size-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <span className="material-symbols-outlined text-3xl md:text-4xl group-hover:rotate-12 transition-transform duration-200">send</span>
                    )}
                </button>
            </div>
        </div>
    );
}
