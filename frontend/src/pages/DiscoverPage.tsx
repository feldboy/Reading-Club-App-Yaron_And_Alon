import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { Card, Chip, EmptyState, BookCardSkeleton, Badge } from '../components/ui';
import { searchBooks, type Book } from '../services/books.api';

const CATEGORIES = ['All', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Non-Fiction', 'Fiction'];

export default function DiscoverPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Debounce search query to avoid filtering on every keystroke
    const debouncedSearch = useDebounce(searchQuery, 300);

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

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-header px-4 pt-12 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Discover</h1>
                        <p className="text-white/60 text-sm">Find your next great read</p>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="size-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                        aria-label="View profile"
                    >
                        <span className="material-symbols-outlined text-white">person</span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <div className="flex w-full items-stretch rounded-xl h-12 bg-white/10 overflow-hidden group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                        <div className="text-white/40 flex items-center justify-center pl-4 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:ring-0 h-full placeholder:text-white/40 px-3 text-base font-normal leading-normal text-white outline-none"
                            placeholder="Search books, authors..."
                            aria-label="Search books and authors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-white/40 hover:text-white flex items-center justify-center pr-4 transition-colors"
                                aria-label="Clear search"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Category Pills */}
            <div className="px-4 py-4">
                <div className="flex gap-3 overflow-x-auto no-scrollbar" role="listbox" aria-label="Filter by category">
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

            {/* Results Header */}
            <div className="px-4 pb-2 flex items-center justify-between">
                <p className="text-white/60 text-sm">
                    {books.length} {books.length === 1 ? 'book' : 'books'} found
                </p>
                <button
                    className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
                    aria-label="Sort options"
                >
                    <span className="material-symbols-outlined text-base">sort</span>
                    Sort
                </button>
            </div>

            {/* Books Grid */}
            <main className="px-4 pb-8">
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
                            <Link
                                key={book.id}
                                to={`/reviews/${book.id}`}
                                className="group animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Card hoverable className="overflow-hidden p-0 h-full flex flex-col">
                                    <div className="relative">
                                        <div
                                            className="aspect-[3/4.5] bg-center bg-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500 bg-white/10"
                                            style={{ backgroundImage: book.cover ? `url("${book.cover}")` : undefined }}
                                        >
                                            {!book.cover && (
                                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                                    <span className="material-symbols-outlined text-4xl">book</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="primary" size="sm">
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
