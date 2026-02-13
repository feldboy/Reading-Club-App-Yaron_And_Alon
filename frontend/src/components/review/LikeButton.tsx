import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { likeReview, unlikeReview } from '../../services/review.api';
import './LikeButton.css';

/**
 * Like Button Props
 */
interface LikeButtonProps {
    reviewId: string;
    initialLikesCount: number;
    initialLiked: boolean;
    onLikeChange?: (liked: boolean, count: number) => void;
}

/**
 * Like Button Component
 */
const LikeButton = ({
    reviewId,
    initialLikesCount,
    initialLiked,
    onLikeChange,
}: LikeButtonProps) => {
    const { isAuthenticated } = useAuth();
    const [liked, setLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLoading, setIsLoading] = useState(false);

    // Update state when props change
    useEffect(() => {
        setLiked(initialLiked);
        setLikesCount(initialLikesCount);
    }, [initialLiked, initialLikesCount]);

    /**
     * Handle like/unlike toggle
     */
    const handleToggle = async () => {
        if (!isAuthenticated) {
            alert('Please login to like reviews');
            return;
        }

        if (isLoading) return;

        setIsLoading(true);
        try {
            if (liked) {
                const response = await unlikeReview(reviewId);
                setLiked(false);
                setLikesCount(response.data.likesCount);
                onLikeChange?.(false, response.data.likesCount);
            } else {
                const response = await likeReview(reviewId);
                setLiked(true);
                setLikesCount(response.data.likesCount);
                onLikeChange?.(true, response.data.likesCount);
            }
        } catch (error: any) {
            console.error('Error toggling like:', error);
            alert(error.response?.data?.message || 'Failed to update like');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={`like-button ${liked ? 'liked' : ''} ${isLoading ? 'loading' : ''} focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark`}
            onClick={handleToggle}
            disabled={isLoading || !isAuthenticated}
            aria-label={isAuthenticated ? (liked ? `Unlike this review (${likesCount} likes)` : `Like this review (${likesCount} likes)`) : 'Login to like reviews'}
            aria-pressed={liked}
        >
            <span className="like-icon" aria-hidden="true">{liked ? '❤️' : '🤍'}</span>
            <span className="like-count">{likesCount}</span>
        </button>
    );
};

export default LikeButton;

