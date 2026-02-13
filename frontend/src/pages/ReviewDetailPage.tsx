import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviewById, deleteReview, type Review } from '../services/review.api';
import { getWishlist } from '../services/user.api';
import LikeButton from '../components/review/LikeButton';
import WishlistButton from '../components/ui/WishlistButton';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import './ReviewDetailPage.css';

export default function ReviewDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [commentsKey, setCommentsKey] = useState(0); // Force re-render of CommentList
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

                // Load review
                const reviewData = await getReviewById(id);
                setReview(reviewData);

                // Check wishlist status if user is logged in
                if (user && reviewData) {
                    try {
                        const wishlist = await getWishlist();
                        // reviewData has googleBookId which corresponds to the bookId in wishlist
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

    /**
     * Handle delete review
     */
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

    /**
     * Handle like change
     */
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

    /**
     * Handle comment added - refresh comment list
     */
    const handleCommentAdded = () => {
        setCommentsKey((prev) => prev + 1);
        if (review) {
            setReview({
                ...review,
                commentsCount: review.commentsCount + 1,
            });
        }
    };

    if (loading) {
        return (
            <div className="review-detail-loading">
                <div className="spinner"></div>
                <p>Loading review...</p>
            </div>
        );
    }

    if (error || !review) {
        return (
            <div className="review-detail-error">
                <p>{error || 'Review not found'}</p>
                <button onClick={() => navigate('/')} className="btn-primary">
                    Go Home
                </button>
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
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] font-[Libre_Baskerville] text-white selection:bg-primary/30 min-h-screen pb-24">
            {/* Context Header */}
            <nav className="sticky top-0 z-50 glass border-x-0 border-t-0 p-4 transition-all flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-primary font-display font-bold text-xs tracking-widest uppercase">Reading Club</span>
                    <span className="text-sm font-medium tracking-widest uppercase opacity-70">Review</span>
                </div>
                <div className="flex items-center gap-4">
                    {isOwnReview && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                            title="Delete review"
                        >
                            <span className="material-symbols-outlined">delete</span>
                        </button>
                    )}
                    <span className="material-symbols-outlined text-white cursor-pointer hover:text-primary transition-colors">more_vert</span>
                </div>
            </nav>

            {/* Side Floating Actions (Desktop) */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 p-2 glass rounded-full items-center hidden md:flex">
                <div className="flex flex-col items-center group">
                    <LikeButton
                        reviewId={review.id}
                        initialLikesCount={review.likesCount}
                        initialLiked={isLiked}
                        onLikeChange={handleLikeChange}
                    />
                </div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                    }}
                    className="flex flex-col items-center group"
                >
                    <div className="p-3 rounded-full glass text-white group-active:scale-95 transition-all hover:bg-white/10">
                        <span className="material-symbols-outlined !text-[20px]">share</span>
                    </div>
                    <span className="text-[10px] mt-1 font-bold">Share</span>
                </button>
            </div>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Book Meta Section */}
                <header className="mb-16">
                    <div className="flex items-start gap-8">
                        <div className="w-32 md:w-48 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden glass group cursor-pointer relative">
                            <img
                                alt={`${review.bookTitle} cover`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src={bookImageUrl}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/uploads/books/default-book.png';
                                }}
                            />
                            {/* WishlistButton Overlay - only show if googleBookId is present */}
                            {review.googleBookId && (
                                <div className="absolute top-2 right-2">
                                    <WishlistButton
                                        bookId={review.googleBookId}
                                        title={review.bookTitle}
                                        authors={[review.bookAuthor]}
                                        cover={review.bookImage || ''}
                                        isInWishlist={isInWishlist}
                                        onToggle={(newState) => setIsInWishlist(newState)}
                                        className="bg-black/40 backdrop-blur-sm shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-4 pt-2">
                            <h1 className="text-4xl md:text-5xl font-bold font-display leading-[1.1] text-white">{review.bookTitle}</h1>
                            <p className="text-xl md:text-2xl text-slate-400">by {review.bookAuthor}</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {'⭐'.repeat(review.rating)}
                                    <span className="text-slate-400 text-sm ml-2">({review.rating}/5)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Reviewer Info */}
                <div className="mb-12">
                    <div className="glass rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
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
                                <h4 className="font-bold text-white text-base">{review.user?.username || 'Unknown User'}</h4>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.05em]">
                                    {new Date(review.createdAt).toLocaleDateString()} • {Math.ceil(review.reviewText.length / 200)} min read
                                </p>
                            </div>
                        </div>
                        {!isOwnReview && (
                            <button className="px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 bg-primary hover:bg-primary/90 text-white">
                                Follow
                            </button>
                        )}
                    </div>
                </div>

                {/* Review Body */}
                <article className="prose prose-invert prose-lg max-w-none space-y-8 text-slate-300 leading-relaxed">
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left pt-2">
                        {review.reviewText}
                    </p>
                </article>

                {/* Like/Share Section */}
                <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <LikeButton
                            reviewId={review.id}
                            initialLikesCount={review.likesCount}
                            initialLiked={isLiked}
                            onLikeChange={handleLikeChange}
                        />
                        <span className="text-sm text-slate-500 font-medium">
                            {review.likesCount} {review.likesCount === 1 ? 'like' : 'likes'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="p-3 glass rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all"
                            title="Share review"
                        >
                            <span className="material-symbols-outlined">ios_share</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <section className="mt-24 space-y-8 pb-32">
                    <h3 className="text-2xl font-display font-bold text-white">Join the Discussion</h3>
                    <CommentList key={commentsKey} reviewId={review.id} />
                    <CommentForm reviewId={review.id} onCommentAdded={handleCommentAdded} />
                </section>
            </main>
        </div>
    );
}
