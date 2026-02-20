import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllReviews, type Review } from '../../services/review.api';
import ReviewCard from './ReviewCard';
import { useInfiniteScrollSimple } from '../../hooks/useInfiniteScroll';
import { ReviewCardSkeleton, LoadingSpinner } from '../ui';
import { ErrorState } from '../ui';
import './ReviewFeed.css';

/**
 * Review Feed Component
 * Displays a feed of reviews with infinite scroll
 */
const ReviewFeed = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [totalReviews, setTotalReviews] = useState(0);
    const limit = 10;

    /**
     * Load reviews
     */
    const loadReviews = useCallback(async (page: number, append: boolean = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }
            setError(null);

            const result = await getAllReviews(page, limit);

            if (append) {
                setReviews((prev) => [...prev, ...result.reviews]);
            } else {
                setReviews(result.reviews);
            }

            setCurrentPage(result.currentPage);
            setHasNextPage(result.hasNextPage);
            setTotalReviews(result.totalReviews);
        } catch (err: any) {
            console.error('Failed to load reviews:', err);
            setError(err.response?.data?.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    /**
     * Load more reviews (for infinite scroll)
     */
    const handleLoadMore = useCallback(() => {
        if (!loadingMore && hasNextPage) {
            loadReviews(currentPage + 1, true);
        }
    }, [currentPage, hasNextPage, loadingMore, loadReviews]);

    /**
     * Handle like change
     */
    const handleLikeChange = useCallback((reviewId: string, liked: boolean, count: number) => {
        setReviews((prev) =>
            prev.map((review) =>
                review.id === reviewId
                    ? {
                        ...review,
                        likesCount: count,
                        likes: liked
                            ? [...review.likes, user?.id || '']
                            : review.likes.filter((id) => id !== user?.id),
                    }
                    : review
            )
        );
    }, [user?.id]);

    /**
     * Initial load
     */
    useEffect(() => {
        loadReviews(1, false);
    }, [loadReviews]);

    /**
     * Infinite scroll
     */
    useInfiniteScrollSimple({
        hasNextPage,
        isLoading: loadingMore,
        onLoadMore: handleLoadMore,
    });

    if (loading) {
        return (
            <div className="review-feed-loading space-y-4">
                {[...Array(3)].map((_, i) => (
                    <ReviewCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <ErrorState
                error={error}
                onRetry={() => loadReviews(1, false)}
            />
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="review-feed-empty">
                <p>No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="review-feed">
            <div className="review-feed-header">
                <h2>All Reviews ({totalReviews})</h2>
            </div>

            <div className="review-feed-list">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        currentUserId={user?.id}
                        onLikeChange={handleLikeChange}
                    />
                ))}
            </div>

            {loadingMore && (
                <div className="review-feed-loading-more flex flex-col items-center justify-center py-8">
                    <LoadingSpinner size="md" text="Loading more reviews..." />
                </div>
            )}

            {!hasNextPage && reviews.length > 0 && (
                <div className="review-feed-end">
                    <p>You've reached the end! 🎉</p>
                </div>
            )}
        </div>
    );
};

export default ReviewFeed;
