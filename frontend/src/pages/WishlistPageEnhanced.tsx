import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, EmptyState, Badge } from '../components/ui';
import WishlistButton from '../components/ui/WishlistButton';
import { getWishlist, type WishlistItem } from '../services/user.api';
import { DEFAULT_BOOK_COVER } from '../utils/imageUtils';

type ViewMode = 'grid' | 'list';
type SortBy = 'recent' | 'title' | 'author';

export default function WishlistPageEnhanced() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<SortBy>('recent');

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await getWishlist();
                setWishlist(data);
            } catch (error) {
                console.error('Failed to load wishlist:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = (bookId: string) => {
        setWishlist(prev => prev.filter(item => item.bookId !== bookId));
    };

    // Sort wishlist
    const sortedWishlist = [...wishlist].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return (a.authors?.[0] || '').localeCompare(b.authors?.[0] || '');
            case 'recent':
            default:
                return 0; // Keep original order (most recent first)
        }
    });

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#FAF5FF] dark:from-[#1a0f2e] dark:via-[#2d1b4e] dark:to-[#1a0f2e] min-h-screen pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="h-12 w-64 bg-[#7C3AED]/10 dark:bg-white/10 rounded-2xl animate-pulse mb-4" />
                    <div className="h-6 w-48 bg-[#7C3AED]/10 dark:bg-white/10 rounded-lg animate-pulse mb-8" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <div key={i} className="aspect-[3/4.5] bg-[#7C3AED]/10 dark:bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#FAF5FF] dark:from-[#1a0f2e] dark:via-[#2d1b4e] dark:to-[#1a0f2e] min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#1a0f2e]/80 border-b border-[#7C3AED]/10 dark:border-white/5 px-4 sm:px-6 lg:px-8 py-6 shadow-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-[#4C1D95] dark:text-white tracking-tight">
                                My Wishlist
                            </h1>
                            <p className="text-[#7C3AED] dark:text-purple-300/70 text-base sm:text-lg mt-2">
                                {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved for later
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="group flex-shrink-0 size-12 sm:size-14 rounded-2xl flex items-center justify-center bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 dark:bg-white/5 dark:hover:bg-white/10 border border-[#7C3AED]/20 dark:border-white/10 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                            aria-label="View profile"
                        >
                            <span className="material-symbols-outlined text-2xl sm:text-3xl text-[#7C3AED] dark:text-purple-200 group-hover:text-[#4C1D95] dark:group-hover:text-white transition-colors">
                                person
                            </span>
                        </button>
                    </div>

                    {/* Controls */}
                    {wishlist.length > 0 && (
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* View Toggle */}
                            <div className="flex bg-[#7C3AED]/10 dark:bg-white/5 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'grid'
                                        ? 'bg-[#7C3AED] text-white shadow-sm'
                                        : 'text-[#7C3AED] dark:text-white/60 hover:text-[#4C1D95] dark:hover:text-white'
                                        }`}
                                    aria-label="Grid view"
                                >
                                    <span className="material-symbols-outlined text-lg">grid_view</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${viewMode === 'list'
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
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="px-4 py-2 bg-white dark:bg-white/5 border-2 border-[#7C3AED]/20 dark:border-white/10 rounded-xl text-sm text-[#4C1D95] dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] cursor-pointer"
                            >
                                <option value="recent">Recently Added</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="author">Author (A-Z)</option>
                            </select>

                            {/* Discover Books Button */}
                            <button
                                onClick={() => navigate('/discover')}
                                className="ml-auto px-4 py-2 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span className="hidden sm:inline">Add Books</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {wishlist.length === 0 ? (
                    <div className="mt-12">
                        <EmptyState
                            icon="bookmark"
                            title="Your wishlist is empty"
                            description="Save books you want to read later. They will appear here."
                            action={{
                                label: 'Discover Books',
                                onClick: () => navigate('/discover'),
                            }}
                        />
                    </div>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {sortedWishlist.map((book, index) => (
                            <div
                                key={book.bookId}
                                className="group relative animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <Link to={`/books/${book.bookId}`} className="block h-full">
                                    <Card
                                        hoverable
                                        className="overflow-hidden p-0 h-full flex flex-col bg-white dark:bg-white/5"
                                    >
                                        <div className="relative">
                                            <div className="aspect-[3/4.5] overflow-hidden">
                                                <img
                                                    src={
                                                        book.cover?.replace('http:', 'https:') ||
                                                        DEFAULT_BOOK_COVER
                                                    }
                                                    alt={book.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        <div className="p-3 flex-1 flex flex-col">
                                            <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-sm leading-tight line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors">
                                                {book.title}
                                            </h3>
                                            <p className="font-body text-[#7C3AED]/70 dark:text-white/60 text-xs italic line-clamp-1 mb-auto">
                                                {book.authors?.join(', ') || 'Unknown Author'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t-2 border-[#7C3AED]/10 dark:border-white/10">
                                                <Badge variant="primary" size="sm" className="text-[10px]">
                                                    Saved
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>

                                {/* Wishlist Button */}
                                <div className="absolute top-2 right-2 z-10">
                                    <WishlistButton
                                        bookId={book.bookId}
                                        title={book.title}
                                        authors={book.authors}
                                        cover={book.cover}
                                        isInWishlist={true}
                                        onToggle={() => handleRemove(book.bookId)}
                                        className="bg-black/60 backdrop-blur-sm shadow-lg hover:bg-black/80"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-4">
                        {sortedWishlist.map((book, index) => (
                            <Link
                                key={book.bookId}
                                to={`/books/${book.bookId}`}
                                className="block animate-fade-in"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <Card
                                    hoverable
                                    className="p-4 sm:p-6 flex gap-4 sm:gap-6 bg-white dark:bg-white/5"
                                >
                                    {/* Book Cover */}
                                    <div className="flex-shrink-0 w-24 sm:w-32 h-36 sm:h-48 rounded-xl overflow-hidden shadow-md">
                                        <img
                                            src={
                                                book.cover?.replace('http:', 'https:') ||
                                                DEFAULT_BOOK_COVER
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1">
                                                <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-lg sm:text-xl leading-tight line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors">
                                                    {book.title}
                                                </h3>
                                                <p className="font-body text-[#7C3AED]/70 dark:text-white/70 text-sm sm:text-base italic">
                                                    by {book.authors?.join(', ') || 'Unknown Author'}
                                                </p>
                                            </div>
                                            <Badge variant="primary" size="sm">
                                                Saved
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigate(`/books/${book.bookId}`);
                                                }}
                                                className="px-4 py-2 bg-[#7C3AED]/10 dark:bg-white/5 hover:bg-[#7C3AED]/20 dark:hover:bg-white/10 text-[#7C3AED] dark:text-white rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                                            >
                                                View Details
                                            </button>
                                            <WishlistButton
                                                bookId={book.bookId}
                                                title={book.title}
                                                authors={book.authors}
                                                cover={book.cover}
                                                isInWishlist={true}
                                                onToggle={() => handleRemove(book.bookId)}
                                                className="bg-[#7C3AED]/10 dark:bg-white/5 hover:bg-[#7C3AED]/20 dark:hover:bg-white/10"
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Quick Actions FAB */}
            {wishlist.length > 0 && (
                <button
                    onClick={() => navigate('/discover')}
                    className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 size-14 sm:size-16 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white shadow-2xl shadow-[#7C3AED]/30 flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7C3AED]/30 z-40"
                    aria-label="Add more books"
                >
                    <span className="material-symbols-outlined text-3xl">add</span>
                </button>
            )}
        </div>
    );
}
