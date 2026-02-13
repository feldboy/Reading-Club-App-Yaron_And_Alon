import { Link } from 'react-router-dom';
import type { Review } from '../../services/review.api';
import LikeButton from './LikeButton';

/**
 * Review Card Props
 */
interface ReviewCardProps {
    review: Review;
    currentUserId?: string;
    onLikeChange?: (reviewId: string, liked: boolean, count: number) => void;
}

/**
 * Star Rating Component - SVG-based stars instead of emojis
 */
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
};

/**
 * Responsive Review Card Component
 */
const ReviewCard = ({ review, currentUserId, onLikeChange }: ReviewCardProps) => {
    const isLiked = currentUserId ? review.likes.includes(currentUserId) : false;

    const handleLikeChange = (liked: boolean, count: number) => {
        onLikeChange?.(review.id, liked, count);
    };

    return (
        <article className="bg-white dark:bg-white/5 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-200 mb-4 sm:mb-6 border border-gray-100 dark:border-white/10">
            {/* Header */}
            <div className="flex justify-between items-start sm:items-center gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                        src={review.user?.profileImage || '/uploads/profiles/default-avatar.png'}
                        alt={`${review.user?.username || 'User'}'s profile picture`}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 border-2 border-primary/20"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                        }}
                    />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {review.user?.username || 'Unknown'}
                    </span>
                </div>
                <div className="shrink-0">
                    <StarRating rating={review.rating} />
                </div>
            </div>

            {/* Book Image */}
            {review.bookImage && (
                <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                        src={review.bookImage}
                        alt={`${review.bookTitle} book cover`}
                        className="w-full max-h-[200px] sm:max-h-[300px] object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Content */}
            <div className="mb-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {review.bookTitle}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 font-medium">
                    by {review.bookAuthor}
                </p>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.reviewText}
                </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/10 gap-3 flex-wrap sm:flex-nowrap">
                <LikeButton
                    reviewId={review.id}
                    initialLikesCount={review.likesCount}
                    initialLiked={isLiked}
                    onLikeChange={handleLikeChange}
                />
                <Link
                    to={`/reviews/${review.id}`}
                    className="min-h-[44px] flex items-center gap-2 text-[#3498db] hover:text-[#2980b9] transition-colors duration-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3498db] focus:ring-offset-2 rounded-lg px-3 py-2 cursor-pointer active:scale-95"
                >
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{review.commentsCount} {review.commentsCount === 1 ? 'comment' : 'comments'}</span>
                </Link>
            </div>
        </article>
    );
};

export default ReviewCard;

