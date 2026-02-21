import { Link } from 'react-router-dom';
import type { Review } from '../../services/review.api';
import LikeButton from './LikeButton';
import { DEFAULT_AVATAR, handleImageError } from '../../utils/imageUtils';

interface ReviewCardEnhancedProps {
    review: Review;
    currentUserId?: string;
    onLikeChange?: (reviewId: string, liked: boolean, count: number) => void;
    variant?: 'default' | 'compact' | 'featured';
}

/**
 * Star Rating Component with elegant animation
 */
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${star <= rating
                            ? 'text-[#7C3AED] fill-[#7C3AED] scale-110'
                            : 'text-gray-300 dark:text-white/20 fill-gray-300 dark:fill-white/20'
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
 * Enhanced Review Card with multiple variants
 */
const ReviewCardEnhanced = ({ review, currentUserId, onLikeChange, variant = 'default' }: ReviewCardEnhancedProps) => {
    const isLiked = currentUserId ? review.likes.includes(currentUserId) : false;

    const handleLikeChange = (liked: boolean, count: number) => {
        onLikeChange?.(review.id, liked, count);
    };

    // Featured variant - hero-style card
    if (variant === 'featured') {
        return (
            <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 animate-fade-in">
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <img
                            src={review.user?.profileImage || DEFAULT_AVATAR}
                            alt={`${review.user?.username || 'User'}'s profile`}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-white/30 shadow-lg group-hover:scale-110 transition-transform duration-300"
                            onError={handleImageError}
                        />
                        <div className="flex-1">
                            <span className="font-display font-bold text-white text-lg sm:text-xl block">
                                {review.user?.username || 'Unknown'}
                            </span>
                            <StarRating rating={review.rating} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                            {review.bookTitle}
                        </h3>
                        <p className="font-body text-base sm:text-lg text-white/90 italic mb-4">
                            by {review.bookAuthor}
                        </p>
                        <p className="font-body text-base sm:text-lg text-white/90 leading-relaxed line-clamp-4">
                            {review.reviewText}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <LikeButton
                            reviewId={review.id}
                            initialLikesCount={review.likesCount}
                            initialLiked={isLiked}
                            onLikeChange={handleLikeChange}
                        />
                        <Link
                            to={`/reviews/${review.id}`}
                            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors duration-200 text-sm sm:text-base font-medium cursor-pointer px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm"
                        >
                            <span className="material-symbols-outlined text-lg">comment</span>
                            <span>{review.commentsCount} {review.commentsCount === 1 ? 'comment' : 'comments'}</span>
                        </Link>
                    </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32 blur-3xl" />
                </div>
            </article>
        );
    }

    // Compact variant - minimal card
    if (variant === 'compact') {
        return (
            <article className="group bg-white dark:bg-white/5 rounded-2xl p-4 border-2 border-transparent hover:border-[#7C3AED]/30 dark:hover:border-white/20 transition-all duration-300 cursor-pointer animate-fade-in">
                <div className="flex gap-4">
                    {/* Book Cover */}
                    {review.bookImage && (
                        <img
                            src={review.bookImage}
                            alt={`${review.bookTitle} cover`}
                            className="w-16 h-24 object-cover rounded-xl shadow-md flex-shrink-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <img
                                    src={review.user?.profileImage || DEFAULT_AVATAR}
                                    alt={`${review.user?.username}'s profile`}
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={handleImageError}
                                />
                                <span className="font-display font-semibold text-[#4C1D95] dark:text-white text-sm">
                                    {review.user?.username || 'Unknown'}
                                </span>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>

                        <h4 className="font-heading font-bold text-[#4C1D95] dark:text-white text-base mb-1 line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                            {review.bookTitle}
                        </h4>
                        <p className="text-[#7C3AED]/60 dark:text-white/60 text-sm line-clamp-2">
                            {review.reviewText}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-xs text-[#7C3AED]/50 dark:text-white/50">
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">favorite</span>
                                {review.likesCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">comment</span>
                                {review.commentsCount}
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // Default variant - standard card
    return (
        <article className="group bg-white dark:bg-white/5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#7C3AED]/20 dark:hover:border-white/10 animate-fade-in">
            {/* Book Image */}
            {review.bookImage && (
                <div className="relative overflow-hidden">
                    <img
                        src={review.bookImage}
                        alt={`${review.bookTitle} cover`}
                        className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight drop-shadow-lg">
                            {review.bookTitle}
                        </h3>
                        <p className="font-serif text-sm sm:text-base text-white/90 italic drop-shadow-md">
                            by {review.bookAuthor}
                        </p>
                    </div>
                </div>
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={review.user?.profileImage || DEFAULT_AVATAR}
                            alt={`${review.user?.username}'s profile`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#7C3AED]/20 dark:border-white/10"
                            onError={handleImageError}
                        />
                        <div>
                            <span className="font-display font-bold text-[#4C1D95] dark:text-white text-base block">
                                {review.user?.username || 'Unknown'}
                            </span>
                            <StarRating rating={review.rating} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                {!review.bookImage && (
                    <div className="mb-4">
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#4C1D95] dark:text-white mb-2 leading-tight">
                            {review.bookTitle}
                        </h3>
                        <p className="font-body text-sm sm:text-base text-[#7C3AED] dark:text-white/70 italic mb-3">
                            by {review.bookAuthor}
                        </p>
                    </div>
                )}
                <p className="font-body text-sm sm:text-base text-[#4C1D95]/80 dark:text-white/80 leading-relaxed mb-4 line-clamp-3">
                    {review.reviewText}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t-2 border-[#7C3AED]/10 dark:border-white/10">
                    <LikeButton
                        reviewId={review.id}
                        initialLikesCount={review.likesCount}
                        initialLiked={isLiked}
                        onLikeChange={handleLikeChange}
                    />
                    <Link
                        to={`/reviews/${review.id}`}
                        className="flex items-center gap-2 text-[#7C3AED] hover:text-[#4C1D95] dark:text-white dark:hover:text-white/80 transition-colors duration-200 text-sm sm:text-base font-medium cursor-pointer px-4 py-2 bg-[#7C3AED]/10 dark:bg-white/5 hover:bg-[#7C3AED]/20 dark:hover:bg-white/10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                    >
                        <span className="material-symbols-outlined text-lg">comment</span>
                        <span>{review.commentsCount}</span>
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ReviewCardEnhanced;
