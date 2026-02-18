import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { Card, Chip, EmptyState, BookCardSkeleton, Badge } from '../components/ui';
import WishlistButton from '../components/ui/WishlistButton';
import { searchBooks, type Book } from '../services/books.api';
import { getWishlist } from '../services/user.api';
import { useAuth } from '../context/AuthContext';

const GENRES = [
    'All',
    'Fiction',
    'Mystery',
    'Thriller',
    'Romance',
    'Sci-Fi',
    'Fantasy',
    'Horror',
    'Literary Fiction',
    'Historical',
    'Non-Fiction',
    'Biography',
    'Self-Help',
    'Business',
];

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
];

const TRENDING_QUERIES = [
    'bestseller 2025',
    'award winning fiction',
    'popular romance novels',
    'science fiction classics',
];

export default function DiscoverPageEnhanced() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedSort, setSelectedSort] = useState('relevance');
    const [showFilters, setShowFilters] = useState(false);
    const [minRating, setMinRating] = useState(0);
    const [books, setBooks] = useState<Book[]>([]);
    const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isTrendingLoading, setIsTrendingLoading] = useState(true);
    const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Fetch trending books on mount
    useEffect(() => {
        const fetchTrending = async () => {
            setIsTrendingLoading(true);
            try {
                const randomQuery = TRENDING_QUERIES[Math.floor(Math.random() * TRENDING_QUERIES.length)];
                const results = await searchBooks(randomQuery);
                setTrendingBooks(results.slice(0, 10));
            } catch (error) {
                console.error('Failed to load trending books:', error);
            } finally {
                setIsTrendingLoading(false);
            }
        };
        fetchTrending();
    }, []);

    // Fetch wishlist
    useEffect(() => {
        if (!user) return;
        const loadWishlist = async () => {
            try {
                const wishlist = await getWishlist();
                setWishlistIds(new Set(wishlist.map(item => item.bookId)));
            } catch (error) {
                console.error('Failed to load wishlist:', error);
            }
        };
        loadWishlist();
    }, [user]);

    // Fetch books based on filters
    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                let query = debouncedSearch;

                if (!query && selectedGenre !== 'All') {
                    query = `subject:${selectedGenre}`;
                }

                const results = await searchBooks(query || 'subject:fiction');

                // Apply client-side filters
                let filteredBooks = results;

                if (minRating > 0) {
                    filteredBooks = filteredBooks.filter(book => book.rating >= minRating);
                }

                // Apply sorting
                if (selectedSort === 'rating') {
                    filteredBooks.sort((a, b) => b.rating - a.rating);
                } else if (selectedSort === 'popular') {
                    filteredBooks.sort((a, b) => b.reviewCount - a.reviewCount);
                }

                setBooks(filteredBooks);
            } catch (error) {
                console.error('Failed to load books:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, [debouncedSearch, selectedGenre, selectedSort, minRating]);

    const handleWishlistToggle = (bookId: string, newState: boolean) => {
        setWishlistIds(prev => {
            const next = new Set(prev);
            if (newState) next.add(bookId);
            else next.delete(bookId);
            return next;
        });
    };

    const clearAllFilters = () => {
        setSelectedGenre('All');
        setMinRating(0);
        setSearchQuery('');
        setSelectedSort('relevance');
    };

    const hasActiveFilters = selectedGenre !== 'All' || minRating > 0 || searchQuery !== '';

    return (
        <div className="bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#FAF5FF] dark:from-[#1a0f2e] dark:via-[#2d1b4e] dark:to-[#1a0f2e] min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#1a0f2e]/80 border-b border-[#7C3AED]/10 dark:border-white/5 px-4 sm:px-6 lg:px-8 pt-6 pb-5 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#4C1D95] dark:text-white tracking-tight">
                                Discover Books
                            </h1>
                            <p className="text-[#7C3AED] dark:text-purple-300/70 text-sm sm:text-base font-light mt-2">
                                Find your next literary adventure
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="group flex-shrink-0 size-12 sm:size-14 rounded-2xl flex items-center justify-center bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 dark:bg-white/5 dark:hover:bg-white/10 border border-[#7C3AED]/20 dark:border-white/10 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a0f2e]"
                            aria-label="View profile"
                        >
                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#7C3AED] dark:text-purple-200 group-hover:text-[#4C1D95] dark:group-hover:text-white transition-colors">
                                person
                            </span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="flex w-full items-stretch rounded-2xl h-14 sm:h-16 bg-white dark:bg-white/5 backdrop-blur-sm border-2 border-[#7C3AED]/20 dark:border-white/10 overflow-hidden group-focus-within:border-[#7C3AED] group-focus-within:ring-4 group-focus-within:ring-[#7C3AED]/20 transition-all duration-300 shadow-lg">
                            <div className="text-[#7C3AED]/50 dark:text-purple-300/50 flex items-center justify-center pl-5 sm:pl-6 group-focus-within:text-[#7C3AED] transition-colors duration-300">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl">search</span>
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-full placeholder:text-[#7C3AED]/30 dark:placeholder:text-purple-300/40 px-4 text-base sm:text-lg font-normal leading-normal text-[#4C1D95] dark:text-white outline-none"
                                placeholder="Search by title, author, ISBN..."
                                aria-label="Search books and authors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="group/clear text-[#7C3AED]/50 dark:text-purple-300/50 hover:text-[#7C3AED] dark:hover:text-white flex items-center justify-center pr-5 sm:pr-6 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#1a0f2e] rounded-full"
                                    aria-label="Clear search"
                                >
                                    <span className="material-symbols-outlined text-xl sm:text-2xl group-hover/clear:rotate-90 transition-transform duration-300">
                                        close
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Trending Section */}
            {!searchQuery && !hasActiveFilters && (
                <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#4C1D95] dark:text-white">
                            🔥 Trending Now
                        </h2>
                    </div>
                    <div className="relative">
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 scroll-smooth snap-x snap-mandatory">
                            {isTrendingLoading ? (
                                [...Array(5)].map((_, i) => <BookCardSkeleton key={i} className="snap-start" />)
                            ) : (
                                trendingBooks.map((book, index) => (
                                    <div
                                        key={book.id}
                                        className="flex-shrink-0 w-[160px] sm:w-[180px] snap-start animate-slide-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <Link to={`/reviews/${book.id}`} className="block group">
                                            <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                                                <div
                                                    className="aspect-[3/4.5] bg-center bg-cover"
                                                    style={{ backgroundImage: book.cover ? `url("${book.cover}")` : undefined }}
                                                >
                                                    {!book.cover && (
                                                        <div className="w-full h-full flex items-center justify-center bg-[#7C3AED]/10 dark:bg-white/10">
                                                            <span className="material-symbols-outlined text-4xl text-[#7C3AED]/30 dark:text-white/20">
                                                                book
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <p className="text-xs font-bold line-clamp-2">{book.title}</p>
                                                    <p className="text-[10px] text-white/80 mt-1">{book.author}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Filters & Sort Bar */}
            <div className="sticky top-[120px] z-30 bg-white/80 dark:bg-[#1a0f2e]/80 backdrop-blur-xl border-b border-[#7C3AED]/10 dark:border-white/5 px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-7xl mx-auto">
                    {/* Genre Chips */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 scroll-smooth mb-4">
                        {GENRES.map((genre) => (
                            <Chip
                                key={genre}
                                selected={selectedGenre === genre}
                                onClick={() => {
                                    setSelectedGenre(genre);
                                    if (genre !== 'All') setSearchQuery('');
                                }}
                            >
                                {genre}
                            </Chip>
                        ))}
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* View Toggle */}
                        <div className="flex bg-[#7C3AED]/10 dark:bg-white/5 rounded-xl p-1">
                            <button
                                onClick={() => setActiveView('grid')}
                                className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                    activeView === 'grid'
                                        ? 'bg-[#7C3AED] text-white shadow-sm'
                                        : 'text-[#7C3AED] dark:text-white/60 hover:text-[#4C1D95] dark:hover:text-white'
                                }`}
                                aria-label="Grid view"
                            >
                                <span className="material-symbols-outlined text-lg">grid_view</span>
                            </button>
                            <button
                                onClick={() => setActiveView('list')}
                                className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                    activeView === 'list'
                                        ? 'bg-[#7C3AED] text-white shadow-sm'
                                        : 'text-[#7C3AED] dark:text-white/60 hover:text-[#4C1D95] dark:hover:text-white'
                                }`}
                                aria-label="List view"
                            >
                                <span className="material-symbols-outlined text-lg">view_list</span>
                            </button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-white/5 border-2 border-[#7C3AED]/20 dark:border-white/10 rounded-xl text-sm text-[#4C1D95] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] cursor-pointer"
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 bg-[#7C3AED]/10 dark:bg-white/5 hover:bg-[#7C3AED]/20 dark:hover:bg-white/10 border-2 border-[#7C3AED]/20 dark:border-white/10 rounded-xl text-sm text-[#7C3AED] dark:text-white font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                            Filters
                            {hasActiveFilters && (
                                <span className="size-2 bg-[#22C55E] rounded-full" />
                            )}
                        </button>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 text-sm text-[#7C3AED] dark:text-white/60 hover:text-[#4C1D95] dark:hover:text-white font-medium transition-colors cursor-pointer"
                            >
                                Clear All
                            </button>
                        )}

                        {/* Results Count */}
                        <p className="ml-auto text-[#7C3AED] dark:text-purple-300/70 text-sm font-light">
                            {books.length} {books.length === 1 ? 'book' : 'books'}
                        </p>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-white dark:bg-white/5 rounded-2xl border-2 border-[#7C3AED]/20 dark:border-white/10 animate-slide-down">
                            <div className="space-y-4">
                                {/* Minimum Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-[#4C1D95] dark:text-white mb-2">
                                        Minimum Rating
                                    </label>
                                    <div className="flex gap-2">
                                        {[0, 3, 4, 4.5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => setMinRating(rating)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                                                    minRating === rating
                                                        ? 'bg-[#7C3AED] text-white shadow-sm'
                                                        : 'bg-[#7C3AED]/10 dark:bg-white/5 text-[#7C3AED] dark:text-white hover:bg-[#7C3AED]/20 dark:hover:bg-white/10'
                                                }`}
                                            >
                                                {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Books Display */}
            <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className={activeView === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' : 'space-y-4'}>
                        {[...Array(10)].map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <EmptyState
                        icon="search_off"
                        title="No books found"
                        description={searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                        action={{
                            label: 'Clear All Filters',
                            onClick: clearAllFilters
                        }}
                    />
                ) : activeView === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {books.map((book, index) => (
                            <div key={book.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                                <Link to={`/reviews/${book.id}`} className="block h-full">
                                    <Card hoverable className="overflow-hidden p-0 h-full flex flex-col bg-white dark:bg-white/5">
                                        <div className="relative">
                                            <div
                                                className="aspect-[3/4.5] bg-center bg-cover rounded-t-2xl"
                                                style={{ backgroundImage: book.cover ? `url("${book.cover}")` : undefined }}
                                            >
                                                {!book.cover && (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#7C3AED]/10 dark:bg-white/10">
                                                        <span className="material-symbols-outlined text-4xl text-[#7C3AED]/30 dark:text-white/20">
                                                            book
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute top-2 right-2 flex gap-1 z-10">
                                                <Badge variant="primary" size="sm" className="shadow-sm">
                                                    {book.category}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col">
                                            <h3 className="text-[#4C1D95] dark:text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-[#7C3AED]/60 dark:text-white/60 text-xs mt-1 line-clamp-1">
                                                {book.author}
                                            </p>
                                            <div className="flex items-center gap-2 mt-auto pt-2">
                                                {book.rating > 0 && (
                                                    <div className="flex items-center gap-0.5">
                                                        <span
                                                            className="material-symbols-outlined text-[#7C3AED] text-xs"
                                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                                        >
                                                            star
                                                        </span>
                                                        <span className="text-[#4C1D95] dark:text-white text-xs font-bold">
                                                            {book.rating}
                                                        </span>
                                                    </div>
                                                )}
                                                {book.reviewCount > 0 && (
                                                    <span className="text-[#7C3AED]/40 dark:text-white/40 text-xs">
                                                        ({book.reviewCount})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                                <div className="absolute top-2 left-2 z-20">
                                    <WishlistButton
                                        bookId={book.id}
                                        title={book.title}
                                        authors={[book.author]}
                                        cover={book.cover || ''}
                                        isInWishlist={wishlistIds.has(book.id)}
                                        onToggle={(state) => handleWishlistToggle(book.id, state)}
                                        className="bg-black/40 backdrop-blur-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {books.map((book, index) => (
                            <Link
                                key={book.id}
                                to={`/reviews/${book.id}`}
                                className="block animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <Card hoverable className="p-4 flex gap-4 bg-white dark:bg-white/5">
                                    <div
                                        className="w-24 h-36 flex-shrink-0 bg-center bg-cover rounded-xl"
                                        style={{ backgroundImage: book.cover ? `url("${book.cover}")` : undefined }}
                                    >
                                        {!book.cover && (
                                            <div className="w-full h-full flex items-center justify-center bg-[#7C3AED]/10 dark:bg-white/10 rounded-xl">
                                                <span className="material-symbols-outlined text-3xl text-[#7C3AED]/30 dark:text-white/20">
                                                    book
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[#4C1D95] dark:text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-[#7C3AED]/60 dark:text-white/60 text-sm mt-1">
                                            {book.author}
                                        </p>
                                        {book.description && (
                                            <p className="text-[#4C1D95]/60 dark:text-white/60 text-sm mt-2 line-clamp-2">
                                                {book.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-3">
                                            {book.rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <span
                                                        className="material-symbols-outlined text-[#7C3AED] text-base"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                                    >
                                                        star
                                                    </span>
                                                    <span className="text-[#4C1D95] dark:text-white text-sm font-bold">
                                                        {book.rating}
                                                    </span>
                                                </div>
                                            )}
                                            <Badge variant="primary" size="sm">
                                                {book.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <WishlistButton
                                            bookId={book.id}
                                            title={book.title}
                                            authors={[book.author]}
                                            cover={book.cover || ''}
                                            isInWishlist={wishlistIds.has(book.id)}
                                            onToggle={(state) => handleWishlistToggle(book.id, state)}
                                        />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
