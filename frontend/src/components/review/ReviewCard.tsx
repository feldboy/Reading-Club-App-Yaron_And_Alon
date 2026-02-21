import { Link } from 'react-router-dom';
import type { Review } from '../../services/review.api';
import LikeButton from './LikeButton';
import { DEFAULT_AVATAR, handleImageError, DEFAULT_BOOK_COVER, handleBookImageError } from '../../utils/imageUtils';

interface ReviewCardProps {
    review: Review;
    currentUserId?: string;
    onLikeChange?: (reviewId: string, liked: boolean, count: number) => void;
}

/** Format date as "Feb 21" */
const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return '';
    }
};

/** Premium star rating with glow effect */
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-4 h-4 transition-all duration-300 ${
                    star <= rating
                        ? 'text-violet-400 fill-violet-400 drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]'
                        : 'text-white/10 fill-white/10'
                }`}
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="ml-1.5 text-white/50 text-xs font-semibold">{rating}.0</span>
    </div>
);

/** $1M Premium Magazine-style review card */
const ReviewCard = ({ review, currentUserId, onLikeChange }: ReviewCardProps) => {
    const isLiked = currentUserId ? review.likes.includes(currentUserId) : false;

    const handleLikeChange = (liked: boolean, count: number) => {
        onLikeChange?.(review.id, liked, count);
    };

    return (
        <article className="group relative flex flex-col sm:flex-row gap-5 sm:gap-7 rounded-[28px] bg-gradient-to-br from-white/[0.025] to-white/[0.01] border border-white/[0.04] p-5 sm:p-7 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] mb-5 hover:bg-gradient-to-br hover:from-white/[0.04] hover:to-white/[0.02] hover:border-white/[0.08] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_-15px_rgba(139,92,246,0.15)]">
            {/* Subtle gradient accent line on hover */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/30 transition-all duration-500" />

            {/* Book cover - left column with premium shadow */}
            <Link
                to={`/reviews/${review.id}`}
                className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-2xl overflow-hidden self-start sm:sticky sm:top-24 transition-all duration-500"
                tabIndex={-1}
                aria-hidden="true"
            >
                <div className="relative">
                    <img
                        src={review.bookImage || DEFAULT_BOOK_COVER}
                        alt={`${review.bookTitle} cover`}
                        className="w-[88px] h-[132px] sm:w-[100px] sm:h-[150px] lg:w-[112px] lg:h-[168px] object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] bg-surface-dark rounded-xl"
                        style={{
                            boxShadow: '0 15px 35px -10px rgba(0,0,0,0.6), 0 0 25px -10px rgba(139,92,246,0.2)'
                        }}
                        onError={handleBookImageError}
                    />
                    {/* Glare overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                </div>
            </Link>

            {/* Right column - content */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Header: title + date */}
                <div className="flex items-start justify-between gap-4 mb-2">
                    <Link
                        to={`/reviews/${review.id}`}
                        className="group/title focus:outline-none flex-1"
                    >
                        <h3 className="text-white text-xl sm:text-2xl font-heading font-bold leading-[1.2] tracking-tight group-hover/title:text-primary transition-colors duration-300 line-clamp-2">
                            {review.bookTitle}
                        </h3>
                    </Link>
                    <span className="shrink-0 text-white/30 text-[11px] font-bold uppercase tracking-[0.1em] mt-1.5 font-ui">
                        {formatDate(review.createdAt)}
                    </span>
                </div>

                {/* Author with elegant styling */}
                <p className="text-white/45 text-sm mb-3 truncate flex items-center gap-1.5 font-body">
                    <span className="font-display italic text-white/35">by</span>
                    <span className="font-medium">{review.bookAuthor}</span>
                </p>

                {/* Star rating */}
                <StarRating rating={review.rating} />

                {/* Review text with premium typography */}
                <p className="text-white/70 text-[15px] sm:text-base leading-[1.7] mt-4 line-clamp-3 font-body font-light tracking-[0.01em]">
                    {review.reviewText}
                </p>

                {/* Footer: user + actions */}
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                    {/* User info */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative">
                            <img
                                src={review.user?.profileImage || DEFAULT_AVATAR}
                                alt={review.user?.username || 'User'}
                                className="w-8 h-8 rounded-full object-cover border-2 border-white/[0.08] shrink-0 transition-all duration-300 group-hover:border-primary/30"
                                onError={handleImageError}
                            />
                            {/* Online indicator dot */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#030303] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <span className="text-white/60 text-sm font-semibold truncate hover:text-white transition-colors cursor-pointer font-ui">
                            {review.user?.username || 'Unknown'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                        <LikeButton
                            reviewId={review.id}
                            initialLikesCount={review.likesCount}
                            initialLiked={isLiked}
                            onLikeChange={handleLikeChange}
                        />
                        <Link
                            to={`/reviews/${review.id}`}
                            className="flex items-center gap-1.5 text-white/40 hover:text-primary hover:bg-primary/10 transition-all duration-300 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] rounded-xl px-3 py-2 cursor-pointer font-ui"
                            aria-label={`${review.commentsCount} comments on ${review.bookTitle}`}
                        >
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chat_bubble_outline</span>
                            <span>{review.commentsCount}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ReviewCard;
