import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, type Book } from '../services/books.api';
import { getBookReviews } from '../services/review.api';
import type { Review } from '../services/review.api';
import { EmptyState } from '../components/ui';
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

    useEffect(() => {
        if (!googleBookId) return;
        const fetchReviews = async () => {
            setIsLoadingReviews(true);
            try {
                const data = await getBookReviews(googleBookId, currentPage, 10);
                setReviews(data.reviews);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setIsLoadingReviews(false);
            }
        };
        fetchReviews();
    }, [googleBookId, currentPage]);

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
            <div className="min-h-screen pb-24 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/40 font-ui text-sm">Loading book details...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                <EmptyState
                    icon="error"
                    title="Book not found"
                    description="The book you're looking for doesn't exist."
                    action={{ label: 'Go Back', onClick: () => navigate(-1) }}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 selection:bg-primary/30" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            {/* Premium Hero Section */}
            <div className="relative w-full min-h-[55vh] overflow-hidden">
                {/* Ambient background glow from cover */}
                <div
                    className="absolute inset-0 scale-150 blur-[100px] opacity-20"
                    style={{ backgroundImage: `url('${book.cover}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/50 via-transparent to-[#030303]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/30 via-transparent to-[#030303]/30" />

                {/* Header Navigation */}
                <div
                    className="sticky top-0 z-50 flex items-center px-4 md:px-6 py-4 justify-between max-w-6xl mx-auto w-full"
                    style={{
                        background: 'linear-gradient(180deg, rgba(3,3,3,0.9) 0%, transparent 100%)',
                    }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-all duration-300 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-white/70 text-lg">arrow_back_ios_new</span>
                    </button>
                    <div className="flex gap-2.5">
                        {isAuthenticated && (
                            <WishlistButton
                                bookId={book.id}
                                title={book.title}
                                authors={[book.author]}
                                cover={book.cover}
                                isInWishlist={isInWishlist}
                                onToggle={setIsInWishlist}
                                className="size-10 bg-white/[0.05] border border-white/[0.08]"
                            />
                        )}
                        <button className="size-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-all duration-300">
                            <span className="material-symbols-outlined text-white/70 text-lg">share</span>
                        </button>
                    </div>
                </div>

                {/* Book Cover & Info */}
                <div className="relative z-10 flex flex-col items-center mt-4 px-4 md:px-6 max-w-4xl mx-auto w-full">
                    {/* Premium Book Cover */}
                    <div className="relative mb-6">
                        <div
                            className="absolute inset-0 -z-10 blur-[40px] opacity-50"
                            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(34,211,238,0.2))' }}
                        />
                        <img
                            src={book.cover || '/placeholder-book.png'}
                            alt={book.title}
                            className="w-36 h-[216px] sm:w-44 sm:h-[264px] object-cover rounded-2xl"
                            style={{
                                boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7), 0 0 50px -15px rgba(139,92,246,0.3)',
                                border: '1px solid rgba(255,255,255,0.08)'
                            }}
                        />
                        {/* Glare effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1] rounded-2xl pointer-events-none" />
                    </div>

                    {/* Book Info */}
                    <div className="text-center">
                        <h1 className="font-heading text-white tracking-tight text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-lg mx-auto">
                            {book.title}
                        </h1>
                        <p className="font-display italic text-white/50 text-base md:text-lg mt-2">
                            by {book.author}
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold font-ui uppercase tracking-wide text-primary bg-primary/10 border border-primary/20">
                                {book.category}
                            </span>
                            {book.rating > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-white text-sm font-bold">{book.rating}</span>
                                    {book.reviewCount > 0 && (
                                        <span className="text-white/40 text-xs">({book.reviewCount})</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 px-4 md:px-6 max-w-4xl mx-auto w-full -mt-8">
                {/* Book Description */}
                {book.description && (
                    <div
                        className="rounded-[28px] p-6 md:p-8 mb-5"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            boxShadow: '0 20px 50px -15px rgba(0,0,0,0.4)'
                        }}
                    >
                        <h2 className="font-heading text-white text-lg md:text-xl font-bold mb-4 tracking-tight">About this book</h2>
                        <p className="font-body text-white/65 text-[15px] md:text-base leading-[1.8] font-light">
                            {book.description.replace(/<[^>]*>/g, '')}
                        </p>
                    </div>
                )}

                {/* Reviews Section */}
                <div
                    className="rounded-[28px] p-6 md:p-8"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.4)'
                    }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-white text-lg md:text-xl font-bold tracking-tight">
                            Reviews {!isLoadingReviews && <span className="text-white/40 font-normal">({reviews.length})</span>}
                        </h2>
                        {isAuthenticated && (
                            <button
                                onClick={handleWriteReview}
                                className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl transition-all duration-500 cursor-pointer group overflow-hidden relative"
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                    boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="material-symbols-outlined text-lg relative z-10">edit</span>
                                <span className="font-ui text-sm font-semibold relative z-10">Write Review</span>
                            </button>
                        )}
                    </div>

                    {isLoadingReviews ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <EmptyState
                            icon="rate_review"
                            title="No reviews yet"
                            description="Be the first to review this book!"
                            action={isAuthenticated ? { label: 'Write a Review', onClick: handleWriteReview } : undefined}
                        />
                    ) : (
                        <div>
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}

                            {/* Premium Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-white/[0.04]">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.06] transition-all duration-300 cursor-pointer font-ui"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-white/40 font-ui text-sm px-3">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/70 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.06] transition-all duration-300 cursor-pointer font-ui"
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
