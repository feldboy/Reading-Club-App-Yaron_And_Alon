import { Link } from 'react-router-dom';
import { Review } from '../../types/review';
import LikeButton from './LikeButton';
import './ReviewCard.css';

/**
 * Review Card Props
 */
interface ReviewCardProps {
    review: Review;
    currentUserId?: string;
    onLikeChange?: (reviewId: string, liked: boolean, count: number) => void;
}

/**
 * Review Card Component
 */
const ReviewCard = ({ review, currentUserId, onLikeChange }: ReviewCardProps) => {
    const isLiked = currentUserId ? review.likes.includes(currentUserId) : false;

    const handleLikeChange = (liked: boolean, count: number) => {
        onLikeChange?.(review.id, liked, count);
    };

    return (
        <div className="review-card">
            <div className="review-card-header">
                <div className="review-card-user">
                    <img
                        src={review.user?.profileImage || '/uploads/profiles/default-avatar.png'}
                        alt={review.user?.username || 'User'}
                        className="review-card-avatar"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                        }}
                    />
                    <span className="review-card-username">{review.user?.username || 'Unknown'}</span>
                </div>
                <div className="review-card-rating">
                    {'⭐'.repeat(review.rating)}
                </div>
            </div>

            {review.bookImage && (
                <img
                    src={review.bookImage}
                    alt={`${review.bookTitle} cover`}
                    className="review-card-book-image"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            )}

            <div className="review-card-content">
                <h3 className="review-card-title">{review.bookTitle}</h3>
                <p className="review-card-author">by {review.bookAuthor}</p>
                <p className="review-card-text">{review.reviewText}</p>
            </div>

            <div className="review-card-footer">
                <LikeButton
                    reviewId={review.id}
                    initialLikesCount={review.likesCount}
                    initialLiked={isLiked}
                    onLikeChange={handleLikeChange}
                />
                <Link
                    to={`/reviews/${review.id}`}
                    className="review-card-comments-link"
                >
                    💬 {review.commentsCount} comments
                </Link>
            </div>
        </div>
    );
};

export default ReviewCard;

