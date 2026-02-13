import { Link } from 'react-router-dom';
import { Badge } from '../ui';
import WishlistButton from '../ui/WishlistButton';

interface BookCardProps {
    book: {
        id: string;
        title: string;
        author: string;
        cover?: string;
        category?: string;
        rating?: number;
        reviewCount?: number;
        description?: string;
    };
    isInWishlist?: boolean;
    onWishlistToggle?: (bookId: string, state: boolean) => void;
    variant?: 'grid' | 'list' | 'featured';
    showActions?: boolean;
}

/**
 * Versatile Book Card Component with multiple display variants
 */
export default function BookCard({
    book,
    isInWishlist = false,
    onWishlistToggle,
    variant = 'grid',
    showActions = true,
}: BookCardProps) {
    // Featured variant - large hero card
    if (variant === 'featured') {
        return (
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7C3AED] via-[#A78BFA] to-[#7C3AED] shadow-2xl hover:shadow-3xl transition-all duration-500 animate-scale-in">
                <div className="flex flex-col md:flex-row gap-8 p-8">
                    {/* Book Cover */}
                    <div className="relative flex-shrink-0">
                        <div className="w-48 h-72 sm:w-64 sm:h-96 rounded-2xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                            {book.cover ? (
                                <img
                                    src={book.cover}
                                    alt={`${book.title} cover`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-6xl text-white/30">book</span>
                                </div>
                            )}
                        </div>
                        {showActions && onWishlistToggle && (
                            <div className="absolute top-4 right-4">
                                <WishlistButton
                                    bookId={book.id}
                                    title={book.title}
                                    authors={[book.author]}
                                    cover={book.cover || ''}
                                    isInWishlist={isInWishlist}
                                    onToggle={(state) => onWishlistToggle(book.id, state)}
                                    className="bg-white/20 backdrop-blur-md hover:bg-white/30"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-center text-white">
                        {book.category && (
                            <Badge variant="primary" size="md" className="self-start mb-4 bg-white/20 text-white backdrop-blur-sm">
                                {book.category}
                            </Badge>
                        )}
                        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                            {book.title}
                        </h2>
                        <p className="font-serif text-xl sm:text-2xl italic mb-6 text-white/90">
                            by {book.author}
                        </p>
                        {book.description && (
                            <p className="font-body text-base sm:text-lg mb-8 text-white/80 leading-relaxed line-clamp-4">
                                {book.description}
                            </p>
                        )}
                        <div className="flex items-center gap-6 mb-8">
                            {book.rating && book.rating > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-2xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        star
                                    </span>
                                    <span className="font-bold text-2xl">{book.rating}</span>
                                    {book.reviewCount && book.reviewCount > 0 && (
                                        <span className="text-white/60 text-lg">({book.reviewCount} reviews)</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <Link
                            to={`/reviews/${book.id}`}
                            className="self-start px-8 py-4 bg-white text-[#7C3AED] hover:bg-white/90 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                        >
                            Read Reviews
                        </Link>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>
            </div>
        );
    }

    // List variant - horizontal card
    if (variant === 'list') {
        return (
            <Link
                to={`/reviews/${book.id}`}
                className="group flex gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border-2 border-transparent hover:border-[#7C3AED]/30 dark:hover:border-white/20 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in cursor-pointer"
            >
                {/* Book Cover */}
                <div className="relative flex-shrink-0 w-24 h-36 rounded-xl overflow-hidden shadow-md">
                    {book.cover ? (
                        <img
                            src={book.cover}
                            alt={`${book.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#7C3AED]/10 dark:bg-white/10">
                            <span className="material-symbols-outlined text-3xl text-[#7C3AED]/30 dark:text-white/20">
                                book
                            </span>
                        </div>
                    )}
                    {showActions && onWishlistToggle && (
                        <div className="absolute top-2 right-2">
                            <WishlistButton
                                bookId={book.id}
                                title={book.title}
                                authors={[book.author]}
                                cover={book.cover || ''}
                                isInWishlist={isInWishlist}
                                onToggle={(state) => onWishlistToggle(book.id, state)}
                                className="bg-black/40 backdrop-blur-sm shadow-sm scale-75"
                            />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-lg leading-tight line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                            {book.title}
                        </h3>
                        {book.category && (
                            <Badge variant="primary" size="sm" className="flex-shrink-0">
                                {book.category}
                            </Badge>
                        )}
                    </div>
                    <p className="font-serif text-[#7C3AED]/70 dark:text-white/60 text-sm mb-3 italic">
                        by {book.author}
                    </p>
                    {book.description && (
                        <p className="font-body text-[#4C1D95]/60 dark:text-white/60 text-sm leading-relaxed line-clamp-2 mb-3">
                            {book.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3">
                        {book.rating && book.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[#7C3AED] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    star
                                </span>
                                <span className="font-bold text-[#4C1D95] dark:text-white text-sm">{book.rating}</span>
                                {book.reviewCount && book.reviewCount > 0 && (
                                    <span className="text-[#7C3AED]/40 dark:text-white/40 text-xs">
                                        ({book.reviewCount})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    }

    // Grid variant - vertical card (default)
    return (
        <div className="group relative animate-fade-in">
            <Link
                to={`/reviews/${book.id}`}
                className="block h-full"
            >
                <div className="h-full flex flex-col bg-white dark:bg-white/5 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-[#7C3AED]/20 dark:hover:border-white/10 transition-all duration-300 cursor-pointer">
                    {/* Book Cover */}
                    <div className="relative">
                        <div className="aspect-[3/4.5] overflow-hidden">
                            {book.cover ? (
                                <img
                                    src={book.cover}
                                    alt={`${book.title} cover`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#7C3AED]/10 dark:bg-white/10">
                                    <span className="material-symbols-outlined text-5xl text-[#7C3AED]/30 dark:text-white/20">
                                        book
                                    </span>
                                </div>
                            )}
                        </div>
                        {book.category && (
                            <div className="absolute top-2 right-2">
                                <Badge variant="primary" size="sm" className="shadow-md backdrop-blur-sm">
                                    {book.category}
                                </Badge>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-base sm:text-lg leading-tight line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors">
                            {book.title}
                        </h3>
                        <p className="font-serif text-[#7C3AED]/70 dark:text-white/60 text-sm italic line-clamp-1 mb-auto">
                            by {book.author}
                        </p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t-2 border-[#7C3AED]/10 dark:border-white/10">
                            {book.rating && book.rating > 0 && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[#7C3AED] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            star
                                        </span>
                                        <span className="font-bold text-[#4C1D95] dark:text-white text-sm">
                                            {book.rating}
                                        </span>
                                    </div>
                                    {book.reviewCount && book.reviewCount > 0 && (
                                        <span className="text-[#7C3AED]/40 dark:text-white/40 text-xs">
                                            ({book.reviewCount})
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Wishlist Button */}
            {showActions && onWishlistToggle && (
                <div className="absolute top-2 left-2 z-10">
                    <WishlistButton
                        bookId={book.id}
                        title={book.title}
                        authors={[book.author]}
                        cover={book.cover || ''}
                        isInWishlist={isInWishlist}
                        onToggle={(state) => onWishlistToggle(book.id, state)}
                        className="bg-black/40 backdrop-blur-sm shadow-sm"
                    />
                </div>
            )}
        </div>
    );
}
