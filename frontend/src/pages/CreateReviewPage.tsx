import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { searchBooks, type Book } from '../services/books.api';
import { createReview } from '../services/review.api';
import { handleBookImageError } from '../utils/imageUtils';

// ── Step indicator ────────────────────────────────────────────────────────────
const steps = [
    { id: 1, label: 'Pick Book', icon: 'menu_book' },
    { id: 2, label: 'Rate', icon: 'star' },
    { id: 3, label: 'Write', icon: 'edit' },
    { id: 4, label: 'Publish', icon: 'send' },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <div className="flex items-center justify-center gap-0 w-full max-w-xs mx-auto" role="list" aria-label="Review steps">
            {steps.map((step, i) => {
                const done = step.id < currentStep;
                const active = step.id === currentStep;
                return (
                    <div key={step.id} className="flex items-center" role="listitem">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${done
                                    ? 'bg-primary text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)]'
                                    : active
                                        ? 'bg-gradient-to-tr from-[#8b5cf6] to-[#a78bfa] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-110'
                                        : 'bg-white/[0.03] border border-white/10 text-white/30'
                                    }`}
                                aria-label={`Step ${step.id}: ${step.label}${done ? ' (completed)' : active ? ' (current)' : ''}`}
                            >
                                {done ? (
                                    <span className="material-symbols-outlined text-sm font-black" aria-hidden="true">check</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm" aria-hidden="true">{step.icon}</span>
                                )}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-semibold transition-colors mt-1 ${active ? 'text-white' : 'text-white/40'}`}>
                                {step.label}
                            </span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-6 sm:w-10 h-[2px] mx-2 mb-5 rounded-full transition-colors duration-300 ${done ? 'bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]' : 'bg-white/[0.08]'}`} aria-hidden="true" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MAX_CHARS = 2000;

function getStep(selectedBook: boolean, rating: number, reviewText: string): number {
    if (!selectedBook) return 1;
    if (rating === 0) return 2;
    if (!reviewText.trim()) return 3;
    return 4;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CreateReviewPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [popularBooks, setPopularBooks] = useState<Book[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Derived state
    const currentStep = getStep(!!selectedBook, rating, reviewText);
    const charCount = reviewText.length;
    const charNearLimit = charCount > MAX_CHARS * 0.8;
    const charOverLimit = charCount > MAX_CHARS;

    // Pre-select book from navigation state
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

    // Load popular books
    const loadPopularBooks = async () => {
        setIsLoadingPopular(true);
        try {
            const books = await searchBooks('bestseller fiction');
            setPopularBooks(books.slice(0, 12));
        } catch (err) {
            console.error('Failed to load popular books:', err);
        } finally {
            setIsLoadingPopular(false);
        }
    };

    // Deduplicate search results
    const uniqueResults = searchResults.filter((book, idx, self) =>
        idx === self.findIndex((b) => b.id === book.id)
    );

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Search effect
    useEffect(() => {
        const doSearch = async () => {
            if (!debouncedSearch.trim()) { setSearchResults([]); return; }
            setIsSearching(true);
            try {
                const results = await searchBooks(debouncedSearch);
                setSearchResults(results);
                setShowResults(true);
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setIsSearching(false);
            }
        };
        doSearch();
    }, [debouncedSearch]);

    // Auto-dismiss error after 4 seconds
    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => setError(null), 4000);
        return () => clearTimeout(t);
    }, [error]);

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setSearchQuery('');
        setShowResults(false);
        setSearchResults([]);
        // Advance to rating step on selection
        if (rating === 0) setRating(0); // keep 0 to nudge user to rate
    };

    const handleSubmit = async () => {
        if (!selectedBook?.title || !selectedBook?.author) {
            setError('Please search and select a book first.');
            return;
        }
        if (rating === 0) {
            setError('Please choose a star rating.');
            return;
        }
        if (!reviewText.trim()) {
            setError('Please write your review before publishing.');
            return;
        }
        if (charOverLimit) {
            setError(`Review is too long. Please stay under ${MAX_CHARS} characters.`);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await createReview({
                bookTitle: selectedBook.title,
                bookAuthor: selectedBook.author,
                bookImage: selectedBook.cover || '',
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
        <div className="bg-background-dark font-body text-white min-h-screen pb-24 selection:bg-primary/30">

            {/* ── Hero Header with blurred book background ── */}
            <div className="relative w-full overflow-hidden" style={{ minHeight: '38vh' }}>
                {/* Blurred background */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30 transition-all duration-700"
                    aria-hidden="true"
                    style={{
                        backgroundImage: `url('${selectedBook?.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop'}')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background-dark/40 via-background-dark/80 to-background-dark" aria-hidden="true" />

                {/* Top navigation */}
                <div className="relative z-10 w-full px-4 md:px-6 pt-12">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 max-w-2xl mx-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="size-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 cursor-pointer shadow-sm backdrop-blur-md"
                            aria-label="Go back"
                        >
                            <span className="material-symbols-outlined text-white/80 text-xl">arrow_back_ios_new</span>
                        </button>
                        <h1 className="text-white text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-center">
                            Write a Review
                        </h1>
                        <div className="size-11" aria-hidden="true" />
                    </div>

                    {/* Step indicator */}
                    <div className="mt-8 px-4">
                        <StepIndicator currentStep={currentStep} />
                    </div>
                </div>

                {/* Book search area */}
                <div className="relative z-10 flex flex-col items-center px-4 md:px-6 mt-8 w-full pb-8">
                    <div className="w-full max-w-2xl mx-auto space-y-4">
                        {/* Search bar */}
                        <div className="w-full relative" ref={searchRef}>
                            <label htmlFor="book-search" className="sr-only">Search for a book</label>
                            <div className="flex w-full items-center rounded-full h-14 sm:h-16 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] overflow-hidden focus-within:border-primary/50 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.15),0_8px_30px_rgba(139,92,246,0.2)] transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.4)]">
                                <div className="text-white/40 flex items-center justify-center pl-5 sm:pl-6 group-focus-within:text-primary transition-colors duration-300">
                                    <span className="material-symbols-outlined text-xl sm:text-2xl">search</span>
                                </div>
                                <input
                                    id="book-search"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value) setShowResults(true);
                                    }}
                                    className="font-body flex w-full min-w-0 flex-1 text-white focus:outline-none focus:ring-0 border-none bg-transparent placeholder:text-white/30 px-4 text-base font-normal"
                                    placeholder={selectedBook ? 'Search a different book…' : 'Search for a book to review…'}
                                />
                                {isSearching && (
                                    <div className="flex items-center justify-center pr-5 sm:pr-6">
                                        <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Dropdown */}
                            {showResults && uniqueResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(139,92,246,0.1)] overflow-hidden max-h-72 overflow-y-auto z-50">
                                    {uniqueResults.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => handleSelectBook(book)}
                                            className="flex items-center gap-4 p-4 hover:bg-white/[0.05] cursor-pointer transition-colors duration-150 border-b border-white/5 last:border-0"
                                            role="option"
                                            aria-selected={false}
                                        >
                                            {book.cover && book.cover !== '' ? (
                                                <img
                                                    src={book.cover}
                                                    alt={`${book.title} cover`}
                                                    className="w-10 h-14 object-cover rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-white/5 shrink-0"
                                                    onError={handleBookImageError}
                                                />
                                            ) : (
                                                <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-primary/30 to-background-dark/80 flex items-center justify-center p-1 text-center border border-white/5 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                                                    <span className="font-heading font-bold text-[8px] text-white/80 line-clamp-3 leading-tight">{book.title}</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-heading text-white text-sm font-semibold truncate">{book.title}</h4>
                                                <p className="font-body text-white/50 text-xs truncate mt-0.5">{book.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected book display / empty state */}
                        <div className="text-center mt-6">
                            {selectedBook ? (
                                <div className="flex items-center gap-5 justify-center animate-fade-in bg-white/[0.02] border border-white/5 p-4 rounded-3xl max-w-lg mx-auto shadow-xl">
                                    {selectedBook.cover && selectedBook.cover !== '' ? (
                                        <img
                                            src={selectedBook.cover}
                                            alt={`${selectedBook.title} cover`}
                                            className="w-16 h-[96px] object-cover rounded-xl shadow-lg shrink-0"
                                            onError={handleBookImageError}
                                        />
                                    ) : (
                                        <div className="w-16 h-[96px] rounded-xl bg-gradient-to-br from-primary/30 to-background-dark/80 flex items-center justify-center p-2 text-center border border-white/5 shadow-lg shrink-0">
                                            <span className="font-heading font-bold text-[10px] text-white/90 line-clamp-4 leading-tight">{selectedBook.title}</span>
                                        </div>
                                    )}
                                    <div className="text-left flex-1 min-w-0">
                                        <h2 className="font-heading text-white text-xl font-bold leading-tight line-clamp-2">{selectedBook.title}</h2>
                                        <p className="font-body text-white/50 text-sm font-medium mt-1 truncate italic"><span className="text-white/30 not-italic mr-1">by</span>{selectedBook.author}</p>
                                        <button
                                            onClick={() => { setSelectedBook(null); setRating(0); setReviewText(''); }}
                                            className="mt-3 text-white/40 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors px-3 py-1.5 bg-white/5 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                            Change book
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setShowBrowse(!showBrowse);
                                            if (!showBrowse && popularBooks.length === 0) loadPopularBooks();
                                        }}
                                        className="mt-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-2.5 rounded-full font-body text-sm font-semibold flex items-center gap-2 mx-auto cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-white/20 active:scale-95"
                                    >
                                        <span className="material-symbols-outlined text-lg">{showBrowse ? 'expand_less' : 'explore'}</span>
                                        {showBrowse ? 'Hide popular books' : 'Browse popular books'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Popular books grid */}
                        {showBrowse && !selectedBook && (
                            <div className="mt-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 max-h-[50vh] overflow-y-auto shadow-xl no-scrollbar">
                                {isLoadingPopular ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="font-heading font-semibold text-white/50 text-xs text-center mb-4 uppercase tracking-wider">Popular right now</p>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                            {popularBooks.map((book) => (
                                                <button
                                                    key={book.id}
                                                    onClick={() => { handleSelectBook(book); setShowBrowse(false); }}
                                                    className="group flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-white/[0.04] transition-all duration-200 cursor-pointer overflow-hidden"
                                                >
                                                    {book.cover && book.cover !== '' ? (
                                                        <img
                                                            src={book.cover}
                                                            alt={book.title}
                                                            className="w-full aspect-[2/3] object-cover rounded-xl shadow-md group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(139,92,246,0.2)] transition-all duration-300"
                                                            onError={handleBookImageError}
                                                        />
                                                    ) : (
                                                        <div className="w-full aspect-[2/3] rounded-xl bg-gradient-to-br from-primary/30 to-background-dark/80 flex items-center justify-center p-2 text-center border border-white/5 shadow-md group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(139,92,246,0.2)] transition-all duration-300">
                                                            <span className="font-heading font-bold text-xs text-white/90 line-clamp-4 leading-snug">{book.title}</span>
                                                        </div>
                                                    )}
                                                    <h4 className="font-heading text-white/90 text-xs font-semibold line-clamp-2 text-center group-hover:text-primary transition-colors">
                                                        {book.title}
                                                    </h4>
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

            {/* ── Main content panel ── */}
            <div className="relative z-20 w-full flex justify-center px-4 md:px-6 -mt-8">
                <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-[2rem] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] space-y-8 w-full max-w-2xl transform transition-all">

                    {/* Step 2: Star Rating */}
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <label className="font-heading text-white/50 text-[11px] font-bold uppercase tracking-[0.2em]">
                            Your Rating
                        </label>
                        <div className="flex gap-2 sm:gap-3" role="group" aria-label="Star rating selection">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-full transition-transform hover:scale-110 active:scale-95"
                                >
                                    <span
                                        className={`material-symbols-outlined text-[40px] sm:text-[48px] cursor-pointer transition-all duration-300 ${star <= rating
                                            ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] scale-110'
                                            : 'text-white/10 hover:text-white/20 hover:scale-105'
                                            }`}
                                        aria-hidden="true"
                                        style={star <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="h-4 w-full flex justify-center">
                            {rating > 0 && (
                                <p className="text-white/60 text-sm font-body font-medium animate-fade-in text-center">
                                    {['', 'Didn\'t like it', 'It was ok', 'Liked it', 'Really liked it', 'It was amazing!'][rating]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Review textarea */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label htmlFor="review-text" className="font-heading text-white/50 text-[11px] font-bold uppercase tracking-[0.2em]">
                                Your Review
                            </label>
                            <span className={`text-xs font-body font-medium transition-colors ${charOverLimit ? 'text-red-400' : charNearLimit ? 'text-yellow-400' : 'text-white/40'}`}>
                                {charCount}/{MAX_CHARS}
                            </span>
                        </div>
                        <div className={`w-full min-h-48 rounded-2xl bg-black/20 border p-5 transition-all duration-300 ${charOverLimit
                            ? 'border-red-400/60 ring-2 ring-red-400/30'
                            : 'border-white/10 hover:border-white/15 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20'
                            }`}>
                            <textarea
                                id="review-text"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="font-body w-full h-full bg-transparent border-none text-white focus:ring-0 p-0 text-base leading-relaxed placeholder:text-white/25 resize-none outline-none min-h-[160px]"
                                placeholder={
                                    selectedBook?.title
                                        ? `Share your thoughts about "${selectedBook.title}"…`
                                        : 'Select a book first, then share your thoughts…'
                                }
                                maxLength={MAX_CHARS + 50}
                            />
                        </div>
                    </div>

                    {/* Visibility toggle */}
                    <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className="flex items-center justify-between pt-6 border-t border-white/[0.08] cursor-pointer group w-full"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-300 ${isPublic ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 border border-white/10 text-white/40'}`}>
                                <span className="material-symbols-outlined text-[24px]">{isPublic ? 'public' : 'lock'}</span>
                            </div>
                            <div className="text-left">
                                <p className="font-heading text-sm font-bold text-white group-hover:text-primary transition-colors">
                                    {isPublic ? 'Public Review' : 'Private Review'}
                                </p>
                                <p className="font-body text-xs text-white/50 mt-0.5 font-medium">
                                    {isPublic ? 'Visible to everyone in the club' : 'Only you can see this'}
                                </p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 border ${isPublic ? 'bg-primary border-primary' : 'bg-white/5 border-white/20'}`}>
                            <div className={`size-4 bg-white rounded-full absolute top-0.5 shadow-md transition-all duration-300 ${isPublic ? 'right-1' : 'left-1 opacity-50'}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Error toast */}
            {error && (
                <div
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/95 backdrop-blur-sm text-white px-6 py-3 rounded-2xl shadow-2xl border border-red-400/20 max-w-sm mx-4 animate-slide-down text-center"
                    role="alert"
                >
                    <p className="font-ui text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Submit FAB */}
            <div className="fixed bottom-8 right-6 md:bottom-12 md:right-12 z-50">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || charOverLimit}
                    aria-label={isSubmitting ? 'Submitting review…' : 'Publish review'}
                    className={`flex items-center gap-3 h-14 px-8 rounded-full text-white font-bold shadow-[0_10px_25px_-5px_rgba(139,92,246,0.3)] active:scale-95 transition-all duration-300 group cursor-pointer border border-white/10 ${isSubmitting || charOverLimit
                        ? 'opacity-50 cursor-not-allowed bg-black/50'
                        : 'bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] hover:brightness-110 hover:shadow-[0_15px_35px_-5px_rgba(139,92,246,0.5)] hover:-translate-y-1'
                        }`}
                >
                    {isSubmitting ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">send</span>
                            <span className="text-sm font-heading tracking-wide hidden sm:inline uppercase">Publish Review</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
