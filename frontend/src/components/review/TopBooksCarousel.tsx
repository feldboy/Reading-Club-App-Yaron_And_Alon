import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks, type Book } from '../../services/books.api';

/**
 * Top Books Carousel Component
 * Displays popular books from Google Books API in a horizontal carousel
 */
export default function TopBooksCarousel() {
    const navigate = useNavigate();
    const [topBooks, setTopBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopBooks = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch popular/bestseller books from Google Books API
                const books = await searchBooks('bestseller fiction');

                // Take top 6 books with highest ratings
                const topRatedBooks = books
                    .filter(book => book.cover) // Only books with covers
                    .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
                    .slice(0, 6);

                setTopBooks(topRatedBooks);
            } catch (err: any) {
                console.error('Failed to load top books:', err);
                setError(err.message || 'Failed to load top books');
            } finally {
                setLoading(false);
            }
        };

        fetchTopBooks();
    }, []);

    const handleBookClick = (book: Book) => {
        // Navigate to book detail page to view info and reviews
        navigate(`/books/${book.id}`);
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error || topBooks.length === 0) {
        return null; // Don't show anything if there's an error or no books
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
                    Popular Books
                </h2>
            </div>

            {/* Carousel with 3D-like covers */}
            <div className="overflow-x-auto no-scrollbar md:overflow-visible">
                <div className="flex items-stretch gap-4 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 py-4">
                    {topBooks.map((book, index) => (
                        <button
                            key={book.id}
                            onClick={() => handleBookClick(book)}
                            className="flex h-full flex-1 flex-col gap-3 sm:gap-4 min-w-[180px] sm:min-w-[200px] md:min-w-0 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark rounded-lg text-left"
                        >
                            {/* Book Cover with 3D effect */}
                            <div
                                className={`w-full bg-center bg-no-repeat aspect-[3/4.5] bg-cover rounded-lg book-shadow transform ${
                                    index % 3 === 0 ? '-rotate-2' : index % 3 === 1 ? 'rotate-2' : '-rotate-1'
                                } group-hover:rotate-0 transition-transform duration-300 group-focus:rotate-0`}
                                style={{ backgroundImage: `url("${book.cover}")` }}
                                role="img"
                                aria-label={`${book.title} book cover`}
                            />

                            {/* Book Info */}
                            <div className="mt-2">
                                <p className="text-white text-base sm:text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                                    {book.title}
                                </p>
                                <p className="text-[#b09db9] text-sm font-medium line-clamp-1">
                                    {book.author}
                                </p>

                                {/* Rating and Review Count */}
                                <div className="flex items-center gap-3 mt-2">
                                    {book.rating > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm">
                                                star
                                            </span>
                                            <span className="text-white text-xs font-medium">
                                                {book.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                    {book.reviewCount > 0 && (
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-gray-400 text-sm">
                                                rate_review
                                            </span>
                                            <span className="text-white text-xs font-medium">
                                                {book.reviewCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
