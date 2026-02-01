import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/review/LikeButton';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import './ReviewDetailPage.css';

/**
 * Review Detail Page
 * Note: This is a placeholder that will be completed when Review API is available
 */
const ReviewDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [review, setReview] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentKey, setCommentKey] = useState(0); // Force re-render of CommentList

    /**
     * Fetch review details
     * TODO: Replace with actual API call when Review API is available
     */
    useEffect(() => {
        // Placeholder - will be replaced with actual API call
        setLoading(false);
        setReview({
            id: id,
            bookTitle: 'Sample Book',
            bookAuthor: 'Sample Author',
            rating: 5,
            reviewText: 'This is a placeholder review. Review API integration coming soon.',
            likesCount: 0,
            commentsCount: 0,
            likes: [],
        });
    }, [id]);

    /**
     * Handle comment added - refresh comment list
     */
    const handleCommentAdded = () => {
        setCommentKey((prev) => prev + 1);
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
                    : review.likes.filter((likeId: string) => likeId !== user?.id),
            });
        }
    };

    if (loading) {
        return (
            <div className="review-detail-loading">
                <p>Loading review...</p>
            </div>
        );
    }

    if (error || !review) {
        return (
            <div className="review-detail-error">
                <p>{error || 'Review not found'}</p>
                <Link to="/">Back to Home</Link>
            </div>
        );
    }

    const isLiked = user ? review.likes.includes(user.id) : false;

    return (
        <div className="review-detail-page">
            <div className="review-detail-header">
                <Link to="/" className="review-detail-back">
                    ← Back to Home
                </Link>
            </div>

            <div className="review-detail-card">
                <div className="review-detail-content">
                    <h1 className="review-detail-title">{review.bookTitle}</h1>
                    <p className="review-detail-author">by {review.bookAuthor}</p>
                    <div className="review-detail-rating">
                        {'⭐'.repeat(review.rating)}
                    </div>
                    <p className="review-detail-text">{review.reviewText}</p>
                </div>

                <div className="review-detail-actions">
                    <LikeButton
                        reviewId={review.id}
                        initialLikesCount={review.likesCount}
                        initialLiked={isLiked}
                        onLikeChange={handleLikeChange}
                    />
                </div>
            </div>

            <div className="review-detail-comments">
                <CommentList key={commentKey} reviewId={review.id} />
                <CommentForm reviewId={review.id} onCommentAdded={handleCommentAdded} />
            </div>
        </div>
    );
};

export default ReviewDetailPage;

