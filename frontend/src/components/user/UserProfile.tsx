import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, type UserProfile as UserProfileData } from '../../services/user.api';
import { getUserReviews } from '../../services/review.api';
import type { Review } from '../../services/review.api';
import { resolveInternalImageUrl, handleBookImageError, DEFAULT_AVATAR, handleImageError } from '../../utils/imageUtils';
import './UserProfile.css';

/** Premium star rating display */
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-3.5 h-3.5 transition-all ${
                    star <= rating
                        ? 'text-violet-400 fill-violet-400'
                        : 'text-white/10 fill-white/10'
                }`}
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

/**
 * User Profile Component Props
 */
interface UserProfileProps {
    userId?: string;
    onEditClick?: () => void;
}

/**
 * Premium User Profile Component
 */
const UserProfile = ({ userId, onEditClick }: UserProfileProps) => {
    const { user: currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOwnProfile = !userId || userId === currentUser?.id;

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!isOwnProfile) {
                    setError('Viewing other profiles not yet implemented');
                    setLoading(false);
                    return;
                }

                const profileData = await getProfile();
                setProfile(profileData);

                try {
                    const reviewsData = await getUserReviews(profileData.id);
                    setReviews(reviewsData);
                } catch (err) {
                    console.error('Failed to load reviews:', err);
                }
            } catch (err: any) {
                console.error('Failed to load profile:', err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadProfile();
        } else {
            setLoading(false);
            setError('Please login to view profile');
        }
    }, [isAuthenticated, userId, isOwnProfile]);

    const handleEditClick = () => {
        if (onEditClick) {
            onEditClick();
        } else {
            navigate('/profile/edit');
        }
    };

    if (loading) {
        return (
            <div className="user-profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-profile-error">
                <p>{error}</p>
                {!isAuthenticated && (
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Go to Login
                    </button>
                )}
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="user-profile-error">
                <p>Profile not found</p>
            </div>
        );
    }

    return (
        <div className="user-profile">
            <div className="user-profile-header">
                <div className="user-profile-avatar">
                    <img
                        src={profile.profileImage ? resolveInternalImageUrl(profile.profileImage) : DEFAULT_AVATAR}
                        alt={profile.username}
                        onError={handleImageError}
                    />
                </div>
                <div className="user-profile-info">
                    <h1 className="user-profile-username">{profile.username}</h1>
                    <p className="user-profile-email">{profile.email}</p>
                    {profile.bio && <p className="user-profile-bio">{profile.bio}</p>}
                    {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
                        <div className="user-profile-genres">
                            {profile.favoriteGenres.map((genre, index) => (
                                <span key={index} className="genre-tag">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                {isOwnProfile && (
                    <button onClick={handleEditClick} className="edit-profile-btn">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', marginRight: '6px' }}>edit</span>
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="user-profile-reviews">
                <h2>My Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <p>No reviews yet. Start reviewing books!</p>
                        <button onClick={() => navigate('/create-review')} className="btn-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                            Create First Review
                        </button>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="review-item"
                                onClick={() => navigate(`/reviews/${review.id}`)}
                            >
                                <div className="review-item-image">
                                    {review.bookImage ? (
                                        <img
                                            src={review.bookImage}
                                            alt={review.bookTitle}
                                            onError={handleBookImageError}
                                        />
                                    ) : (
                                        <div className="review-item-placeholder">📚</div>
                                    )}
                                </div>
                                <div className="review-item-content">
                                    <h3>{review.bookTitle}</h3>
                                    <p className="review-item-author">by {review.bookAuthor}</p>
                                    <div className="review-item-rating">
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <p className="review-item-text">{review.reviewText}</p>
                                    <div className="review-item-stats">
                                        <span>
                                            <svg className="w-4 h-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            {review.likesCount}
                                        </span>
                                        <span>
                                            <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                            </svg>
                                            {review.commentsCount}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
