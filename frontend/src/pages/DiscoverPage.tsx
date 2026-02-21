import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { EmptyState } from '../components/ui';
import WishlistButton from '../components/ui/WishlistButton';
import { searchBooks, type Book } from '../services/books.api';
import { getWishlist } from '../services/user.api';
import { useAuth } from '../context/AuthContext';
import { handleBookImageError } from '../utils/imageUtils';

const CATEGORIES = ['All', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Non-Fiction', 'Fiction'];

export default function DiscoverPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [books, setBooks] = useState<Book[]>([]);
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const debouncedSearch = useDebounce(searchQuery, 300);

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

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                let query = debouncedSearch;
                if (!query && selectedCategory !== 'All') {
                    query = `subject:${selectedCategory}`;
                }
                const results = await searchBooks(query);
                setBooks(results);
            } catch (error) {
                console.error('Failed to load books:', error);
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
        <div className="min-h-screen pb-24 selection:bg-primary/30" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            {/* Premium Header */}
            <header
                className="sticky top-0 z-40 px-4 sm:px-6 pt-6 pb-5"
                style={{
                    background: 'linear-gradient(180deg, rgba(3,3,3,0.97) 0%, rgba(3,3,3,0.9) 100%)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between mb-5">
                        <div className="flex-1">
                            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
                                Discover
                            </h1>
                            <p className="text-white/40 text-sm font-medium font-ui">Find your next great read</p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="group flex-shrink-0 size-11 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 cursor-pointer active:scale-95"
                            aria-label="View profile"
                        >
                            <span className="material-symbols-outlined text-xl text-white/50 group-hover:text-white/80 transition-colors">person</span>
                        </button>
                    </div>

                    {/* Premium Search Bar */}
                    <div className="relative group">
                        <div
                            className="flex w-full items-center rounded-full h-12 bg-white/[0.03] border border-white/[0.06] overflow-hidden focus-within:border-primary/40 focus-within:bg-white/[0.05] transition-all duration-500"
                            style={{
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)'
                            }}
                        >
                            <div className="text-white/30 flex items-center justify-center pl-5 group-focus-within:text-primary/70 transition-colors duration-300">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-full placeholder:text-white/25 px-4 text-[15px] font-ui text-white outline-none"
                                placeholder="Search books, authors..."
                                aria-label="Search books and authors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="text-white/30 hover:text-white/60 flex items-center justify-center pr-5 transition-all duration-200 cursor-pointer active:scale-95"
                                    aria-label="Clear search"
                                >
                                    <span className="material-symbols-outlined text-xl">close</span>
                                </button>
                            )}
                        </div>
                        {/* Focus glow effect */}
                        <div className="absolute inset-0 -z-10 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.15), transparent 70%)', filter: 'blur(20px)' }} />
                    </div>
                </div>
            </header>

            {/* Premium Category Pills */}
            <div className="px-4 sm:px-6 py-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth" role="listbox" aria-label="Filter by category">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    if (category !== 'All') setSearchQuery('');
                                }}
                                className={`flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-[13px] font-bold font-ui cursor-pointer transition-all duration-300 active:scale-95 select-none ${
                                    selectedCategory === category
                                        ? 'text-white'
                                        : 'bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.05]'
                                }`}
                                style={selectedCategory === category ? {
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    boxShadow: '0 4px 15px -3px rgba(139,92,246,0.4)'
                                } : undefined}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Header */}
            <div className="px-4 sm:px-6 pb-5 flex items-center justify-between max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: '150ms' }}>
                <p className="text-white/40 text-sm font-medium font-ui">
                    {books.length} {books.length === 1 ? 'book' : 'books'} found
                </p>
                <button
                    className="group text-white/40 hover:text-white/60 text-sm font-semibold flex items-center gap-1.5 transition-colors duration-300 cursor-pointer font-ui"
                    aria-label="Sort options"
                >
                    <span className="material-symbols-outlined text-lg">sort</span>
                    Sort
                </button>
            </div>

            {/* Premium Books Grid */}
            <main className="px-4 sm:px-6 pb-8 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="aspect-[2/3] rounded-2xl bg-white/[0.03] skeleton-wave" />
                                <div className="mt-3 space-y-2">
                                    <div className="h-4 bg-white/[0.03] rounded skeleton-wave" />
                                    <div className="h-3 w-2/3 bg-white/[0.03] rounded skeleton-wave" />
                                </div>
                            </div>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                        {books.map((book, index) => (
                            <div key={book.id} className="relative group animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                                <Link to={`/books/${book.id}`} className="block h-full">
                                    <div className="h-full flex flex-col">
                                        {/* Book Cover */}
                                        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6),0_0_40px_-15px_rgba(139,92,246,0.2)]">
                                            <div className="absolute inset-0 border border-white/[0.06] rounded-2xl z-10 pointer-events-none" />
                                            {book.cover ? (
                                                <img
                                                    src={book.cover}
                                                    alt={`${book.title} cover`}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    onError={handleBookImageError}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0f0a15] to-[#0a0510] flex items-center justify-center p-4 text-center">
                                                    <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/15 rounded-full blur-2xl" />
                                                    <h3 className="font-display font-bold text-sm text-white/80 line-clamp-4 leading-snug relative z-10">{book.title}</h3>
                                                </div>
                                            )}
                                            {/* Glare effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            {/* Category badge */}
                                            <div className="absolute top-2.5 right-2.5 z-10">
                                                <span className="px-2 py-1 rounded-lg text-[10px] font-bold font-ui uppercase tracking-wide text-white/90 bg-black/50 backdrop-blur-md border border-white/10">
                                                    {book.category}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Book Info */}
                                        <div className="pt-3 flex-1 flex flex-col">
                                            <h3 className="text-white font-heading font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 tracking-tight">
                                                {book.title}
                                            </h3>
                                            <p className="text-white/40 text-xs font-medium mt-1.5 line-clamp-1 font-display italic">
                                                {book.author}
                                            </p>
                                            <div className="flex items-center gap-2 mt-auto pt-2">
                                                {book.rating > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-white text-xs font-semibold">{book.rating}</span>
                                                    </div>
                                                )}
                                                {book.reviewCount > 0 && (
                                                    <span className="text-white/30 text-[11px] font-medium">({book.reviewCount})</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                {/* Wishlist button */}
                                <div className="absolute top-2.5 left-2.5 z-20">
                                    <WishlistButton
                                        bookId={book.id}
                                        title={book.title}
                                        authors={[book.author]}
                                        cover={book.cover || ''}
                                        isInWishlist={wishlistIds.has(book.id)}
                                        onToggle={(state) => handleWishlistToggle(book.id, state)}
                                        className="bg-black/50 backdrop-blur-md border border-white/10"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Premium Floating Filter Button (Mobile) */}
            <button
                className="fixed bottom-24 right-4 md:hidden size-12 rounded-full text-white flex items-center justify-center active:scale-90 transition-all duration-300 cursor-pointer"
                style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    boxShadow: '0 8px 25px -5px rgba(139,92,246,0.5), 0 0 40px -10px rgba(139,92,246,0.4)'
                }}
                aria-label="Filter options"
            >
                <span className="material-symbols-outlined text-xl">tune</span>
            </button>
        </div>
    );
}
