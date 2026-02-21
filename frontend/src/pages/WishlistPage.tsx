import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EmptyState } from '../components/ui';
import WishlistButton from '../components/ui/WishlistButton';
import { getWishlist, type WishlistItem } from '../services/user.api';
import { handleBookImageError } from '../utils/imageUtils';

export default function WishlistPage() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return (
            <div className="min-h-screen pb-24 pt-8 px-4 md:px-6 max-w-4xl mx-auto" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                {/* Header skeleton */}
                <div className="mb-8">
                    <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse mb-3" />
                    <div className="h-5 w-32 bg-white/5 rounded-lg animate-pulse" />
                </div>
                {/* Grid skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="flex flex-col gap-3">
                            <div className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
                            <div className="h-4 w-3/4 bg-white/5 rounded-lg animate-pulse" />
                            <div className="h-3 w-1/2 bg-white/5 rounded-lg animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 selection:bg-primary/30" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            {/* Header */}
            <header className="pt-8 pb-6 px-4 md:px-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-all duration-300 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-white/70 text-lg">arrow_back_ios_new</span>
                    </button>
                    <div>
                        <h1 className="font-heading text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                            My Wishlist
                        </h1>
                        <p className="font-body text-white/40 text-sm mt-1">
                            {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved for later
                        </p>
                    </div>
                </div>
            </header>

            <div className="px-4 md:px-6 max-w-4xl mx-auto">
                {wishlist.length === 0 ? (
                    <div className="mt-8">
                        <EmptyState
                            icon="bookmark"
                            title="Your wishlist is empty"
                            description="Save books you want to read later. They will appear here."
                            action={{
                                label: "Discover Books",
                                onClick: () => navigate('/discover')
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                        {wishlist.map((book, index) => (
                            <div
                                key={book.bookId}
                                className="group relative"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Link
                                    to={`/books/${book.bookId}`}
                                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-2xl"
                                >
                                    <div
                                        className="rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)'
                                        }}
                                    >
                                        {/* Book Cover */}
                                        <div className="aspect-[2/3] w-full overflow-hidden relative">
                                            <img
                                                src={book.cover?.replace('http:', 'https:') || '/placeholder-book.png'}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                onError={handleBookImageError}
                                            />
                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {/* Glare effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        </div>

                                        {/* Book Info */}
                                        <div className="p-3 sm:p-4">
                                            <h3 className="font-heading text-white text-sm sm:text-base font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
                                                {book.title}
                                            </h3>
                                            <p className="font-display text-white/40 text-xs sm:text-sm italic mt-1.5 line-clamp-1">
                                                {book.authors?.join(', ') || 'Unknown Author'}
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Wishlist Button */}
                                <div className="absolute top-3 right-3 z-10">
                                    <WishlistButton
                                        bookId={book.bookId}
                                        title={book.title}
                                        authors={book.authors}
                                        cover={book.cover}
                                        isInWishlist={true}
                                        onToggle={() => handleRemove(book.bookId)}
                                        className="bg-black/60 backdrop-blur-md border border-white/10 shadow-lg"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
