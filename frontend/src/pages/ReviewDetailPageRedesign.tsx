import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviewById, deleteReview, type Review } from '../services/review.api';
import { getWishlist } from '../services/user.api';
import LikeButton from '../components/review/LikeButton';
import WishlistButton from '../components/ui/WishlistButton';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';

export default function ReviewDetailPageRedesign() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [commentsKey, setCommentsKey] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const isOwnReview = user?.id === review?.userId;

    useEffect(() => {
        const loadReviewAndWishlist = async () => {
            if (!id) {
                setError('Review ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const reviewData = await getReviewById(id);
                setReview(reviewData);

                if (user && reviewData) {
                    try {
                        const wishlist = await getWishlist();
                        const bookId = reviewData.googleBookId;
                        if (bookId) {
                            setIsInWishlist(wishlist.some(item => item.bookId === bookId));
                        }
                    } catch (wErr) {
                        console.error('Failed to load wishlist status', wErr);
                    }
                }
            } catch (err: any) {
                console.error('Failed to load review:', err);
                setError(err.response?.data?.message || 'Failed to load review');
            } finally {
                setLoading(false);
            }
        };

        loadReviewAndWishlist();
    }, [id, user]);

    const handleDelete = async () => {
        if (!review || !isOwnReview) return;

        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteReview(review.id);
            navigate('/');
        } catch (err: any) {
            console.error('Failed to delete review:', err);
            alert(err.response?.data?.message || 'Failed to delete review');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLikeChange = (liked: boolean, count: number) => {
        if (review) {
            setReview({
                ...review,
                likesCount: count,
                likes: liked
                    ? [...review.likes, user?.id || '']
                    : review.likes.filter((id) => id !== user?.id),
            });
        }
    };

    const handleCommentAdded = () => {
        setCommentsKey((prev) => prev + 1);
        if (review) {
            setReview({
                ...review,
                commentsCount: review.commentsCount + 1,
            });
        }
    };

    const handleRetry = () => {
        window.location.reload();
    };

    // Loading State with Skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
                {/* Header Skeleton */}
                <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 p-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="w-10 h-10 bg-rose-100 rounded-full animate-pulse"></div>
                        <div className="h-6 w-32 bg-rose-100 rounded animate-pulse"></div>
                        <div className="w-10 h-10 bg-rose-100 rounded-full animate-pulse"></div>
                    </div>
                </nav>

                {/* Content Skeleton */}
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-start gap-8 mb-12">
                        <div className="w-32 md:w-48 aspect-[2/3] bg-rose-100 rounded-xl animate-pulse"></div>
                        <div className="flex-1 space-y-4">
                            <div className="h-10 bg-rose-100 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-rose-100 rounded w-1/2 animate-pulse"></div>
                            <div className="h-6 bg-rose-100 rounded w-1/4 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 bg-rose-100 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-rose-100 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-rose-100 rounded w-3/4 animate-pulse"></div>
                    </div>
                </main>
            </div>
        );
    }

    // Error State with Recovery
    if (error || !review) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-rose-100 p-8 text-center" role="alert">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Cormorant_Garamond']">
                        Review Not Found
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {error || 'The review you\'re looking for doesn\'t exist or has been removed.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-rose-100 text-rose-700 rounded-lg font-semibold hover:bg-rose-200 transition-colors duration-200 cursor-pointer"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors duration-200 cursor-pointer"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isLiked = user?.id ? review.likes.includes(user.id) : false;
    const bookImageUrl = review.bookImage
        ? review.bookImage.startsWith('http')
            ? review.bookImage
            : `http://localhost:3000${review.bookImage}`
        : '/uploads/books/default-book.png';

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pb-24">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100 transition-all">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 hover:bg-rose-200 active:scale-95 transition-all cursor-pointer"
                        aria-label="Go back"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-rose-600 font-bold text-xs tracking-widest uppercase">Reading Club</span>
                        <span className="text-sm font-medium tracking-wide uppercase text-gray-500">Review</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOwnReview && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                                title="Delete review"
                                aria-label="Delete review"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Book Header Section */}
                <header className="mb-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
                        <div className="flex items-start gap-8">
                            {/* Book Cover */}
                            <div className="w-32 md:w-48 aspect-[2/3] rounded-xl shadow-lg overflow-hidden relative flex-shrink-0 group cursor-pointer">
                                <img
                                    alt={`${review.bookTitle} cover`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    src={bookImageUrl}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/uploads/books/default-book.png';
                                    }}
                                />
                                {review.googleBookId && (
                                    <div className="absolute top-2 right-2">
                                        <WishlistButton
                                            bookId={review.googleBookId}
                                            title={review.bookTitle}
                                            authors={[review.bookAuthor]}
                                            cover={review.bookImage || ''}
                                            isInWishlist={isInWishlist}
                                            onToggle={(newState) => setIsInWishlist(newState)}
                                            className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Book Info */}
                            <div className="flex-1 space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-['Cormorant_Garamond']">
                                    {review.bookTitle}
                                </h1>
                                <p className="text-xl text-gray-600 font-['Cormorant_Garamond']">
                                    by {review.bookAuthor}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-6 h-6 ${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-gray-600 text-sm font-medium">
                                            {review.rating}/5
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Reviewer Info */}
                <div className="mb-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full border-2 border-rose-200 overflow-hidden flex-shrink-0">
                                <img
                                    alt={review.user?.username || 'User'}
                                    className="w-full h-full object-cover"
                                    src={
                                        review.user?.profileImage
                                            ? review.user.profileImage.startsWith('http')
                                                ? review.user.profileImage
                                                : `http://localhost:3000${review.user.profileImage}`
                                            : '/uploads/profiles/default-avatar.png'
                                    }
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                                    }}
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                    {review.user?.username || 'Unknown User'}
                                </h4>
                                <p className="text-gray-500 text-sm">
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })} • {Math.ceil(review.reviewText.length / 200)} min read
                                </p>
                            </div>
                        </div>
                        {!isOwnReview && (
                            <button className="px-6 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer">
                                Follow
                            </button>
                        )}
                    </div>
                </div>

                {/* Review Content */}
                <article className="mb-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 md:p-12">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-800 leading-relaxed text-lg font-['Libre_Baskerville'] first-letter:text-6xl first-letter:font-bold first-letter:text-rose-600 first-letter:mr-3 first-letter:float-left first-letter:font-['Cormorant_Garamond']">
                                {review.reviewText}
                            </p>
                        </div>
                    </div>
                </article>

                {/* Engagement Section */}
                <div className="mb-12">
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <LikeButton
                                reviewId={review.id}
                                initialLikesCount={review.likesCount}
                                initialLiked={isLiked}
                                onLikeChange={handleLikeChange}
                            />
                            <span className="text-gray-600 font-medium">
                                {review.likesCount} {review.likesCount === 1 ? 'like' : 'likes'}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="p-3 bg-rose-50 rounded-xl text-rose-600 hover:bg-rose-100 active:scale-95 transition-all cursor-pointer"
                            title="Share review"
                            aria-label="Share review"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-3xl font-bold text-gray-900 font-['Cormorant_Garamond']">
                            Discussion
                        </h3>
                        <span className="text-sm text-gray-500 font-medium">
                            {review.commentsCount} {review.commentsCount === 1 ? 'comment' : 'comments'}
                        </span>
                    </div>

                    {/* Comment Form */}
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                        <CommentForm reviewId={review.id} onCommentAdded={handleCommentAdded} />
                    </div>

                    {/* Comments List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                        <CommentList key={commentsKey} reviewId={review.id} />
                    </div>
                </section>
            </main>
        </div>
    );
}
