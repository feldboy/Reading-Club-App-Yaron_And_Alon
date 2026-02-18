import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, EmptyState } from '../components/ui';
import WishlistButton from '../components/ui/WishlistButton';
import { getWishlist, type WishlistItem } from '../services/user.api';

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
            <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] font-[Libre_Baskerville] text-white min-h-screen pb-24 pt-8 px-6 max-w-screen-md mx-auto">
                <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] font-[Libre_Baskerville] text-white min-h-screen pb-24 pt-8 px-6 max-w-screen-md mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    My Wishlist
                </h1>
                <p className="text-white/60 mt-2">
                    {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved for later
                </p>
            </header>

            {wishlist.length === 0 ? (
                <div className="mt-12">
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
                    {wishlist.map((book) => (
                        <Card
                            key={book.bookId}
                            variant="glass"
                            className="group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <div className="aspect-[2/3] w-full overflow-hidden rounded-t-xl relative">
                                <img
                                    src={book.cover?.replace('http:', 'https:') || 'https://via.placeholder.com/128x192?text=No+Cover'}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-2 right-2">
                                    <WishlistButton
                                        bookId={book.bookId}
                                        title={book.title}
                                        authors={book.authors}
                                        cover={book.cover}
                                        isInWishlist={true}
                                        onToggle={() => handleRemove(book.bookId)}
                                        className="bg-black/40 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div className="p-3">
                                <h3 className="font-bold text-sm line-clamp-1 text-white" title={book.title}>
                                    {book.title}
                                </h3>
                                <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                                    {book.authors?.join(', ') || 'Unknown Author'}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
