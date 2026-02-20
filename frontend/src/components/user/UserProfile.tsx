import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, type UserProfile as UserProfileData } from '../../services/user.api';
import { getUserReviews } from '../../services/review.api';
import type { Review } from '../../services/review.api';
import { resolveInternalImageUrl } from '../../utils/imageUtils';
import './UserProfile.css';

/**
 * User Profile Component Props
 */
interface UserProfileProps {
    userId?: string; // If provided, show this user's profile, otherwise show current user
    onEditClick?: () => void;
}

/**
 * User Profile Component
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

                // For now, we only support viewing own profile
                // TODO: Add support for viewing other users' profiles
                if (!isOwnProfile) {
                    setError('Viewing other profiles not yet implemented');
                    setLoading(false);
                    return;
                }

                const profileData = await getProfile();
                setProfile(profileData);

                // Load user's reviews
                try {
                    const reviewsData = await getUserReviews(profileData.id);
                    setReviews(reviewsData);
                } catch (err) {
                    console.error('Failed to load reviews:', err);
                    // Don't fail the whole component if reviews fail
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
                        src={resolveInternalImageUrl(profile.profileImage)}
                        alt={profile.username}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                        }}
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
                    <button onClick={handleEditClick} className="btn-secondary edit-profile-btn">
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
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    '/uploads/books/default-book.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="review-item-placeholder">📚</div>
                                    )}
                                </div>
                                <div className="review-item-content">
                                    <h3>{review.bookTitle}</h3>
                                    <p className="review-item-author">by {review.bookAuthor}</p>
                                    <div className="review-item-rating">
                                        {'⭐'.repeat(review.rating)}
                                    </div>
                                    <p className="review-item-text">{review.reviewText}</p>
                                    <div className="review-item-stats">
                                        <span>❤️ {review.likesCount}</span>
                                        <span>💬 {review.commentsCount}</span>
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
