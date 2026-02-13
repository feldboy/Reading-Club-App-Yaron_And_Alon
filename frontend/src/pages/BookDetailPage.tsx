import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, type Book } from '../services/books.api';
import { getBookReviews } from '../services/review.api';
import type { Review } from '../services/review.api';
import { EmptyState, Badge } from '../components/ui';
import ReviewCard from '../components/review/ReviewCard';
import WishlistButton from '../components/ui/WishlistButton';
import { useAuth } from '../context/AuthContext';
import { getWishlist } from '../services/user.api';

export default function BookDetailPage() {
    const { googleBookId } = useParams<{ googleBookId: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoadingBook, setIsLoadingBook] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(true);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch book details
    useEffect(() => {
        if (!googleBookId) return;

        const fetchBook = async () => {
            setIsLoadingBook(true);
            try {
                const bookData = await getBookById(googleBookId);
                setBook(bookData);
            } catch (error) {
                console.error('Failed to load book:', error);
            } finally {
                setIsLoadingBook(false);
            }
        };

        fetchBook();
    }, [googleBookId]);

    // Fetch reviews for this book
    useEffect(() => {
        if (!googleBookId) return;

        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const data = await getBookReviews(googleBookId, currentPage, 10);
                setReviews(data.reviews.map((r: any) => ({ ...r, id: r._id })));
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setIsLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [googleBookId, currentPage]);

    // Check wishlist status
    useEffect(() => {
        if (!user || !googleBookId) return;

        const checkWishlist = async () => {
            try {
                const wishlist = await getWishlist();
                setIsInWishlist(wishlist.some(item => item.bookId === googleBookId));
            } catch (error) {
                console.error('Failed to check wishlist:', error);
            }
        };

        checkWishlist();
    }, [user, googleBookId]);

    const handleWriteReview = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (book) {
            navigate('/create-review', {
                state: {
                    selectedBook: {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        cover: book.cover,
                    }
                }
            });
        }
    };

    if (isLoadingBook) {
        return (
            <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] text-white min-h-screen pb-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/60 font-ui text-sm">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] text-white min-h-screen pb-24">
                <EmptyState
                    icon="error"
                    title="Book not found"
                    description="The book you're looking for doesn't exist."
                    action={{
                        label: 'Go Back',
                        onClick: () => navigate(-1)
                    }}
                />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] text-white min-h-screen pb-24">
            {/* Header with Blurred Background */}
            <div className="relative w-full h-[50vh] overflow-hidden">
                {/* Blurred Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-3xl opacity-30"
                    style={{ backgroundImage: `url('${book.cover}')` }}
                />

                {/* Header Navigation */}
                <div className="relative z-10 flex items-center px-4 md:px-6 pt-12 justify-between max-w-6xl mx-auto w-full">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-11 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors duration-200"
                    >
                        <span className="material-symbols-outlined text-white text-xl">arrow_back_ios_new</span>
                    </button>
                    <div className="flex gap-3">
                        {isAuthenticated && (
                            <WishlistButton
                                bookId={book.id}
                                title={book.title}
                                authors={[book.author]}
                                cover={book.cover}
                                isInWishlist={isInWishlist}
                                onToggle={setIsInWishlist}
                                className="size-11 glass-panel shadow-lg"
                            />
                        )}
                    </div>
                </div>

                {/* Book Information */}
                <div className="relative z-10 flex flex-col items-center mt-12 px-4 md:px-6 max-w-4xl mx-auto w-full">
                    <img
                        src={book.cover || '/placeholder-book.png'}
                        alt={book.title}
                        className="w-40 h-56 object-cover rounded-2xl shadow-2xl mb-6"
                    />
                    <div className="text-center">
                        <h1 className="font-heading text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">{book.title}</h1>
                        <p className="font-ui text-primary/90 text-base md:text-lg font-medium mt-2">{book.author}</p>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <Badge variant="primary" size="md">{book.category}</Badge>
                            {book.rating > 0 && (
                                <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full">
                                    <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="text-white text-sm font-bold">{book.rating}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 -mt-16 px-4 md:px-6 max-w-5xl mx-auto w-full">
                {/* Book Description */}
                {book.description && (
                    <div className="glass-panel rounded-3xl p-6 md:p-8 mb-6 shadow-2xl">
                        <h2 className="font-heading text-white text-xl md:text-2xl font-bold mb-4">About this book</h2>
                        <p className="font-body text-white/80 text-sm md:text-base leading-relaxed">
                            {book.description.replace(/<[^>]*>/g, '')}
                        </p>
                    </div>
                )}

                {/* Reviews Section */}
                <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-white text-xl md:text-2xl font-bold">
                            Reviews {!isLoadingReviews && `(${reviews.length})`}
                        </h2>
                        {isAuthenticated && (
                            <button
                                onClick={handleWriteReview}
                                className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2 rounded-xl hover:brightness-110 transition-all duration-200 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                                <span className="font-ui text-sm font-semibold">Write Review</span>
                            </button>
                        )}
                    </div>

                    {isLoadingReviews ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <EmptyState
                            icon="rate_review"
                            title="No reviews yet"
                            description="Be the first to review this book!"
                            action={isAuthenticated ? {
                                label: 'Write a Review',
                                onClick: handleWriteReview
                            } : undefined}
                        />
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-white/10">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-xl glass-panel text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors duration-200"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-white/60 font-ui text-sm">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-xl glass-panel text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors duration-200"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
