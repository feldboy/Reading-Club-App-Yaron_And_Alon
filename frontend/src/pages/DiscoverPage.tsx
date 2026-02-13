import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { Card, Chip, EmptyState, BookCardSkeleton, Badge } from '../components/ui';
import WishlistButton from '../components/ui/WishlistButton';
import { searchBooks, type Book } from '../services/books.api';
import { getWishlist } from '../services/user.api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Non-Fiction', 'Fiction'];

export default function DiscoverPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [books, setBooks] = useState<Book[]>([]);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    // Debounce search query to avoid filtering on every keystroke
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Fetch wishlist IDs to check status
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

    // Fetch books based on search query or selected category
    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                // Construct query: prioritize search bar, otherwise filter by category
                let query = debouncedSearch;

                if (!query && selectedCategory !== 'All') {
                    query = `subject:${selectedCategory}`;
                }

                // If "All" is selected and no search, we pass empty string which defaults to 'subject:fiction' or similar in the API service
                // to ensure we have a rich initial state.
                const results = await searchBooks(query);
                setBooks(results);
            } catch (error) {
                console.error('Failed to load books:', error);
                // Optionally handle error state here
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, [debouncedSearch, selectedCategory]);

    const handleWishlistToggle = (bookId: string, newState: boolean) => {
        setWishlistIds(prev => {
            const next = new Set(prev);
            if (newState) next.add(bookId);
            else next.delete(bookId);
            return next;
        });
    };

    return (
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] font-[Libre_Baskerville] text-white min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#1a0f2e]/80 border-b border-white/5 px-4 sm:px-6 pt-6 pb-5 shadow-lg shadow-black/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="font-[Cormorant_Garamond] text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2 tracking-tight">
                                Discover
                            </h1>
                            <p className="text-purple-300/70 text-sm sm:text-base font-light">Find your next great read</p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="group flex-shrink-0 size-12 sm:size-14 rounded-2xl flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e]"
                            aria-label="View profile"
                        >
                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-purple-200 group-hover:text-white transition-colors">person</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <div className="flex w-full items-stretch rounded-2xl h-14 sm:h-16 bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group-focus-within:border-[#7C3AED]/50 group-focus-within:ring-2 group-focus-within:ring-[#7C3AED]/20 transition-all duration-300 shadow-lg shadow-black/5">
                            <div className="text-purple-300/50 flex items-center justify-center pl-5 sm:pl-6 group-focus-within:text-[#7C3AED] transition-colors duration-300">
                                <span className="material-symbols-outlined text-2xl sm:text-3xl">search</span>
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-full placeholder:text-purple-300/40 px-4 text-base sm:text-lg font-normal leading-normal text-white outline-none"
                                placeholder="Search books, authors..."
                                aria-label="Search books and authors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="group/clear text-purple-300/50 hover:text-white flex items-center justify-center pr-5 sm:pr-6 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e] rounded-full"
                                    aria-label="Clear search"
                                >
                                    <span className="material-symbols-outlined text-xl sm:text-2xl group-hover/clear:rotate-90 transition-transform duration-300">close</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Category Pills */}
            <div className="px-4 sm:px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 scroll-smooth" role="listbox" aria-label="Filter by category">
                        {CATEGORIES.map((category) => (
                            <Chip
                                key={category}
                                selected={selectedCategory === category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    // If user clicks a category tag while searching, clear search to see category specifically?
                                    // Or keep search and filter? Google API treats q parameter as one string.
                                    // For simplicity/UX, selecting a pill often clears specific text search or appends to it.
                                    // Here let's clear search if they pick a category to emulate "Browsing" mode.
                                    if (category !== 'All') setSearchQuery('');
                                }}
                            >
                                {category}
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="px-4 sm:px-6 pb-4 flex items-center justify-between max-w-7xl mx-auto">
                <p className="text-purple-300/70 text-sm sm:text-base font-light">
                    {books.length} {books.length === 1 ? 'book' : 'books'} found
                </p>
                <button
                    className="group text-[#7C3AED] text-sm sm:text-base font-medium flex items-center gap-2 hover:text-[#A78BFA] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e] rounded-lg px-2 py-1"
                    aria-label="Sort options"
                >
                    <span className="material-symbols-outlined text-lg sm:text-xl group-hover:rotate-180 transition-transform duration-300">sort</span>
                    Sort
                </button>
            </div>

            {/* Books Grid */}
            <main className="px-4 sm:px-6 pb-8 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(8)].map((_, i) => (
                            <BookCardSkeleton key={i} />
                        ))}
                    </div>
                ) : books.length === 0 ? (
                    <EmptyState
                        icon="search_off"
                        title="No books found"
                        description={searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different category'}
                        action={searchQuery ? {
                            label: 'Clear Search',
                            onClick: () => setSearchQuery('')
                        } : undefined}
                    />
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {books.map((book, index) => (
                            <div key={book.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <Link
                                    to={`/books/${book.id}`}
                                    className="block h-full"
                                >
                                    <Card hoverable className="overflow-hidden p-0 h-full flex flex-col">
                                        <div className="relative">
                                            <div
                                                className="aspect-[3/4.5] bg-center bg-cover rounded-t-2xl bg-white/10"
                                                style={{ backgroundImage: book.cover ? `url("${book.cover}")` : undefined }}
                                            >
                                                {!book.cover && (
                                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                                        <span className="material-symbols-outlined text-4xl">book</span>
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
                                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="text-white/60 text-xs mt-1 line-clamp-1">{book.author}</p>
                                            <div className="flex items-center gap-2 mt-auto pt-2">
                                                {book.rating > 0 && (
                                                    <div className="flex items-center gap-0.5">
                                                        <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                            star
                                                        </span>
                                                        <span className="text-white text-xs font-bold">{book.rating}</span>
                                                    </div>
                                                )}
                                                {book.reviewCount > 0 && (
                                                    <span className="text-white/40 text-xs">({book.reviewCount})</span>
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
                )}
            </main>

            {/* Floating Filter Button (Mobile) */}
            <button
                className="fixed bottom-24 right-4 md:hidden size-14 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Filter options"
            >
                <span className="material-symbols-outlined text-2xl">tune</span>
            </button>
        </div>
    );
}
