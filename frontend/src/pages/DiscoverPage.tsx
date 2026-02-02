import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { Card, Chip, EmptyState, BookCardSkeleton, Badge } from '../components/ui';

// Mock data for books
const MOCK_BOOKS = [
    {
        id: '1',
        title: 'Dune',
        author: 'Frank Herbert',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOjistMlapRzrjwK4xf4XveOZaAJjEhDvDiNe3a49v2rG7E6qxLK_LygpZl4Ksuq1BMD2b9rHggK5DGgh6nQVCFoOy81faslkrhAMkNef7Rs0zhUfELCG272oMOyGMVxwRWxhY9mlevXb-49hCPKpBf2lefRVb5Wxr6BML9xRYnqFPrw8MDM_J3213wRIBAa6pV1feOINZlS3n12Yb8z3Wub6G51CSTbxa44I2DhLUWn8Y4hEFnVCZrUvnaUUj5EG6mDSWEsDZPGE',
        category: 'Sci-Fi',
        rating: 4.8,
        reviewCount: 1243
    },
    {
        id: '2',
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtzBppcQA2KqE2fjkn6Zsv6nuhkr3UxZwipQZnGdsHssFpJ_5PtdXbu0Jd9xVifEshnvil0PFVISLdwHg6W4BxNABc4bven1-0I1CkZp2wzJW0__LU-kAHhDbDeiMSM7hvas36ikfkLmuYhF1O1Tyoyc7CFzmnfjxdlIUkrxz7r2Kc8ZsY0t4K76lQAIqndsXOmtu7r-O8bj99XoXAxxSq4u9raA08AHInLAdBB8NfDPGRVOnY1iz25CXDtiL1SjjO05DAGOkvs3Y',
        category: 'Sci-Fi',
        rating: 4.9,
        reviewCount: 892
    },
    {
        id: '3',
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjHXPNu7p3OX38iOTwz03ViflbP58NijCag23xc-J_sXn6PUQfvKXzdnDwoK4uPme-9wAL8MrVyFnWE9F9o8tL4YGhv3Q3aV03aigwEZCKs2j8Kc79GPti3NumxpAaAEyzJYlaqI-65d1eLD1GMGpNRHbBcjGAgaEIZz4xpneXSrxpF2ZTYO2An1Dlp7O9Vndx_MZT4kdB8XxXkHj2sZHXs_xL-F0-EehfcdO-IOofElKNlIgqE5VzUNyaTepNld79KO-yuUnmA8',
        category: 'Thriller',
        rating: 4.5,
        reviewCount: 567
    },
    {
        id: '4',
        title: 'Atomic Habits',
        author: 'James Clear',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTe2FGoMvuUVSK-gy0NOjrX3ZbbTcXrEMSYOWd9rBSrcC1xD40wkHHbPE1gxsVEPWgOW0KbvGKutg4DTQDMXZeTmHob3mzL47XEhiLqckyjeAy6KVfTRCtKk9WJism7do23TTYuQZNVWP73upZlpA_Ne8xLgxq1AktIgQJNMaewAyolwjr1O-mgKa_CJ6dLLPKoKd4-NoZrkETgGxaGeSWxvxLIolCr24i7Ik0KOzDMoAmv9TyATxckq-kX9NZA4s_JUpbEnQzfE',
        category: 'Non-Fiction',
        rating: 4.7,
        reviewCount: 2341
    },
    {
        id: '5',
        title: 'The Fourth Wing',
        author: 'Rebecca Yarros',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrMI4gvpM06Dn7NUyNGBdK9QeyU8CBa_BG7mOm3ej_yKQfUvNRw6GKniJ7zzrhMLx3Aew95FBbkv1nvmxFeZBBuQ4a35BW28K6ThF8Fp7hTiwEhjx5fk-3zHwcj_CJeKCCHGhV_ARD2GLR0VKtAh5QUt_wnpJkxPIh7cBlPHVNsJzAWUBt0ytkIRUFvUMxgda4YpABYp1fAXK7Vmc1RHpTrDdoljJRzG8Qr1JvjV6fjLUNXZBGdqjPwHDB6FQghS-pjB6cd72a6Yc',
        category: 'Fantasy',
        rating: 4.6,
        reviewCount: 1892
    },
    {
        id: '6',
        title: 'It Ends with Us',
        author: 'Colleen Hoover',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6W5qlz7tLks66icc5fkcF7rz9v73VeU-GybzbrEPRb5aeFrcrziXUboEwiZYu6GLcDwEjiB5PN1ZnPxYqI237ZON7953gVIDfbWbUO1UqNXoEluZBu-2vQSxmNwM9BXd41iC7m7CrEJX2T5WTQWm0VmjScicG2SmD2Z3jgbE7qPYtLy2LaBRac-0FZvVHjfKsa8rHWcmkp-b4gEJf9d1sWrtGU9rilR2kXQRh5HtbZc5Ew3x8E6DKxUX0gerNEvRFt1-vOGRVNA',
        category: 'Romance',
        rating: 4.4,
        reviewCount: 3241
    },
    {
        id: '7',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmbnuFqdRi99jKPkeniqvH8Pb26oxui-hjUL3guoCQ-6TM3037TFOLjRopmIFCSPhvwMxDItc3zM5sePWnS-UVXTJqQxZogYU1k6XUW_3lYjVJMPB114uRIW7F_Vc0tb95Wt1fZ9gz-Vn2K1oWGsVh2aRWAKFSi8VGfkuuJ7wl17geG_jJw0DGHcUU9dIGsZl8rMWaQ-oSm5Th94vha2KsrcGJ28oQTlLUHePnOrTBcgc_PLh6n21r9WsjOHuHdgVk849Tmjsebeg',
        category: 'Fiction',
        rating: 4.3,
        reviewCount: 1567
    },
    {
        id: '8',
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzzy_7yNEi0yFnIZmgMt_8iazMX2bZ01dOF8HWod-S2HBEd4Tr8JwKOAg_rV3gXBCY-wN4YPCqL9XyJ0UxdcJLyZEiJXMH3Wy00gkxZMrir6xkANORIZEQM9FnN4Rz5M-t85m5qTUr1JqZ0w9LnJr_C_wndtS3zdoVut2kt_jFDVXQq2CLwZQkgVPcUYxd3Lc8CfDHtV6m-mjDAmP9plUkWlUrvZf-dka66VI-eF_3OWEuae0vASrN_kNxbzDfUNzGsY3pbIfoiF8',
        category: 'Mystery',
        rating: 4.5,
        reviewCount: 2890
    }
];

const CATEGORIES = ['All', 'Sci-Fi', 'Fantasy', 'Romance', 'Mystery', 'Thriller', 'Non-Fiction', 'Fiction'];

export default function DiscoverPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading] = useState(false);

    // Debounce search query to avoid filtering on every keystroke
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filter books based on search and category
    const filteredBooks = useMemo(() => {
        return MOCK_BOOKS.filter(book => {
            const matchesSearch = debouncedSearch === '' ||
                book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                book.author.toLowerCase().includes(debouncedSearch.toLowerCase());

            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
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
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Chip>
                    ))}
                </div>
            </div>

            {/* Results Header */}
            <div className="px-4 pb-2 flex items-center justify-between">
                <p className="text-white/60 text-sm">
                    {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'} found
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
                ) : filteredBooks.length === 0 ? (
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
                        {filteredBooks.map((book, index) => (
                            <Link
                                key={book.id}
                                to={`/reviews/${book.id}`}
                                className="group animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Card hoverable className="overflow-hidden p-0">
                                    <div className="relative">
                                        <div
                                            className="aspect-[3/4.5] bg-center bg-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
                                            style={{ backgroundImage: `url("${book.cover}")` }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge variant="primary" size="sm">
                                                {book.category}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-white/60 text-xs mt-1">{book.author}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                    star
                                                </span>
                                                <span className="text-white text-xs font-bold">{book.rating}</span>
                                            </div>
                                            <span className="text-white/40 text-xs">({book.reviewCount})</span>
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
