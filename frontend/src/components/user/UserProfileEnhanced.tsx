import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, getWishlist, getLikedReviews, type UserProfile as UserProfileData, type WishlistItem } from '../../services/user.api';
import { getUserReviews } from '../../services/review.api';
import type { Review } from '../../services/review.api';
import WishlistButton from '../ui/WishlistButton';
import { resolveInternalImageUrl, handleBookImageError, DEFAULT_AVATAR, handleImageError } from '../../utils/imageUtils';

interface UserProfileEnhancedProps {
    userId?: string;
    onEditClick?: () => void;
}

type TabType = 'reviews' | 'wishlist' | 'likes';

/** Premium star rating with glow */
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-4 h-4 transition-all ${
                    star <= rating
                        ? 'text-violet-400 fill-violet-400 drop-shadow-[0_0_4px_rgba(167,139,250,0.5)]'
                        : 'text-white/10 fill-white/10'
                }`}
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const UserProfileEnhanced = ({ userId, onEditClick }: UserProfileEnhancedProps) => {
    const { user: currentUser, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [likedReviews, setLikedReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('reviews');
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
                    const [reviewsData, wishlistData, likedReviewsData] = await Promise.all([
                        getUserReviews(profileData.id),
                        getWishlist(),
                        getLikedReviews()
                    ]);
                    setReviews(reviewsData);
                    setWishlist(wishlistData);
                    setLikedReviews(likedReviewsData);
                } catch (err) {
                    console.error('Failed to load user data:', err);
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

    const handleWishlistRemove = (bookId: string) => {
        setWishlist(prev => prev.filter(item => item.bookId !== bookId));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-white/40 font-ui text-sm">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                <span className="material-symbols-outlined text-6xl text-white/20 mb-4">error</span>
                <p className="text-white text-lg font-heading font-bold mb-6">{error || 'Profile not found'}</p>
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 rounded-xl text-white font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                        }}
                    >
                        Go to Login
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-24 selection:bg-primary/30" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            {/* Profile Header Section */}
            <div className="relative pt-8 pb-6">
                {/* Ambient glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[200px] rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                />

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar with gradient ring */}
                        <div className="relative">
                            <div
                                className="absolute -inset-1 rounded-3xl opacity-70"
                                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 50%, #f472b6 100%)' }}
                            />
                            <div className="relative size-28 sm:size-36 rounded-3xl overflow-hidden border-3 border-[#030303]">
                                <img
                                    src={profile.profileImage ? resolveInternalImageUrl(profile.profileImage) : DEFAULT_AVATAR}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                />
                            </div>
                            {/* Verified badge */}
                            <div className="absolute -bottom-1 -right-1 size-8 bg-emerald-500 rounded-full border-3 border-[#030303] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                <span className="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {profile.username}
                            </h1>
                            <p className="text-white/40 text-sm font-ui mt-1">
                                {profile.email}
                            </p>
                            {profile.bio && (
                                <p className="text-white/60 text-sm font-body mt-3 max-w-lg leading-relaxed">
                                    {profile.bio}
                                </p>
                            )}
                            {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                                    {profile.favoriteGenres.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 rounded-full text-xs font-bold font-ui uppercase tracking-wide text-primary bg-primary/10 border border-primary/20"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        {isOwnProfile && (
                            <div className="flex gap-3 mt-2 sm:mt-0">
                                <button
                                    onClick={handleEditClick}
                                    className="relative px-5 py-2.5 rounded-xl text-white font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 overflow-hidden group"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        boxShadow: '0 6px 20px -4px rgba(139,92,246,0.35)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="material-symbols-outlined text-lg relative z-10">edit</span>
                                    <span className="relative z-10">Edit</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2.5 rounded-xl font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-white/70 hover:text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8">
                        {[
                            { label: 'Reviews', value: reviews.length, tab: 'reviews' as TabType },
                            { label: 'Wishlist', value: wishlist.length, tab: 'wishlist' as TabType },
                            { label: 'Likes', value: reviews.reduce((sum, r) => sum + r.likesCount, 0), tab: null }
                        ].map((stat) => (
                            <button
                                key={stat.label}
                                onClick={() => stat.tab && setActiveTab(stat.tab)}
                                disabled={!stat.tab}
                                className="p-4 sm:p-6 text-center rounded-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 disabled:cursor-default disabled:hover:translate-y-0"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                                }}
                            >
                                <p className="text-2xl sm:text-3xl font-heading font-extrabold text-primary mb-1">{stat.value}</p>
                                <p className="font-ui text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-wider">{stat.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
                <div className="flex gap-1 border-b border-white/[0.06]">
                    {[
                        { id: 'reviews' as TabType, label: 'Reviews', count: reviews.length },
                        { id: 'wishlist' as TabType, label: 'Wishlist', count: wishlist.length },
                        { id: 'likes' as TabType, label: 'Liked', count: likedReviews.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 font-ui font-bold text-sm transition-all duration-300 cursor-pointer border-b-2 ${
                                activeTab === tab.id
                                    ? 'border-primary text-white'
                                    : 'border-transparent text-white/40 hover:text-white/70'
                            }`}
                        >
                            {tab.label} ({tab.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div>
                        {reviews.length === 0 ? (
                            <div
                                className="text-center py-16 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                                    border: '1px dashed rgba(255,255,255,0.06)'
                                }}
                            >
                                <span className="material-symbols-outlined text-5xl text-white/20 mb-4 block">rate_review</span>
                                <h3 className="font-heading text-xl font-bold text-white mb-2">No reviews yet</h3>
                                <p className="text-white/40 font-body mb-6">Start reviewing books you've read!</p>
                                <button
                                    onClick={() => navigate('/create-review')}
                                    className="px-6 py-3 rounded-xl text-white font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                                    }}
                                >
                                    Create First Review
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <Link
                                        key={review.id}
                                        to={`/reviews/${review.id}`}
                                        className="block group"
                                    >
                                        <div
                                            className="flex gap-5 p-5 rounded-2xl transition-all duration-500 hover:-translate-y-1"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {review.bookImage && (
                                                <div className="flex-shrink-0 w-20 h-[120px] rounded-xl overflow-hidden" style={{ boxShadow: '0 10px 25px -8px rgba(0,0,0,0.5)' }}>
                                                    <img
                                                        src={review.bookImage}
                                                        alt={review.bookTitle}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={handleBookImageError}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-heading font-bold text-white text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                                    {review.bookTitle}
                                                </h3>
                                                <p className="text-white/40 text-sm font-display italic mb-2">
                                                    by {review.bookAuthor}
                                                </p>
                                                <div className="mb-2">
                                                    <StarRating rating={review.rating} />
                                                </div>
                                                <p className="text-white/60 text-sm font-body line-clamp-2 mb-3">
                                                    {review.reviewText}
                                                </p>
                                                <div className="flex items-center gap-4 text-white/40 text-xs font-ui font-semibold">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm text-red-400">favorite</span>
                                                        {review.likesCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm text-primary">chat_bubble</span>
                                                        {review.commentsCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                    <div>
                        {wishlist.length === 0 ? (
                            <div
                                className="text-center py-16 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                                    border: '1px dashed rgba(255,255,255,0.06)'
                                }}
                            >
                                <span className="material-symbols-outlined text-5xl text-white/20 mb-4 block">bookmark</span>
                                <h3 className="font-heading text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
                                <p className="text-white/40 font-body mb-6">Save books you want to read later</p>
                                <button
                                    onClick={() => navigate('/discover')}
                                    className="px-6 py-3 rounded-xl text-white font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                                    }}
                                >
                                    Discover Books
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {wishlist.map((book, index) => (
                                    <div
                                        key={book.bookId}
                                        className="group relative"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <Link to={`/books/${book.bookId}`} className="block">
                                            <div
                                                className="rounded-2xl overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.4)'
                                                }}
                                            >
                                                <div className="aspect-[2/3] overflow-hidden">
                                                    <img
                                                        src={book.cover?.replace('http:', 'https:') || '/placeholder-book.png'}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        loading="lazy"
                                                        onError={handleBookImageError}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <h3 className="font-heading font-bold text-white text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                        {book.title}
                                                    </h3>
                                                    <p className="font-display text-white/40 text-xs italic mt-1 line-clamp-1">
                                                        {book.authors?.join(', ') || 'Unknown Author'}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className="absolute top-2 right-2 z-10">
                                            <WishlistButton
                                                bookId={book.bookId}
                                                title={book.title}
                                                authors={book.authors}
                                                cover={book.cover}
                                                isInWishlist={true}
                                                onToggle={() => handleWishlistRemove(book.bookId)}
                                                className="bg-black/60 backdrop-blur-md border border-white/10"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Likes Tab */}
                {activeTab === 'likes' && (
                    <div>
                        {likedReviews.length === 0 ? (
                            <div
                                className="text-center py-16 rounded-2xl"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                                    border: '1px dashed rgba(255,255,255,0.06)'
                                }}
                            >
                                <span className="material-symbols-outlined text-5xl text-white/20 mb-4 block">favorite</span>
                                <h3 className="font-heading text-xl font-bold text-white mb-2">No liked reviews</h3>
                                <p className="text-white/40 font-body mb-6">You haven't liked any reviews yet.</p>
                                <button
                                    onClick={() => navigate('/discover')}
                                    className="px-6 py-3 rounded-xl text-white font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                                    }}
                                >
                                    Discover Reviews
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {likedReviews.map((review) => (
                                    <Link
                                        key={review.id}
                                        to={`/reviews/${review.id}`}
                                        className="block group"
                                    >
                                        <div
                                            className="flex gap-5 p-5 rounded-2xl transition-all duration-500 hover:-translate-y-1"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {review.bookImage && (
                                                <div className="flex-shrink-0 w-20 h-[120px] rounded-xl overflow-hidden" style={{ boxShadow: '0 10px 25px -8px rgba(0,0,0,0.5)' }}>
                                                    <img
                                                        src={review.bookImage}
                                                        alt={review.bookTitle}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={handleBookImageError}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-heading font-bold text-white text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                                    {review.bookTitle}
                                                </h3>
                                                <p className="text-white/40 text-sm font-display italic mb-2">
                                                    by {review.bookAuthor}
                                                </p>
                                                <div className="mb-2">
                                                    <StarRating rating={review.rating} />
                                                </div>
                                                <p className="text-white/60 text-sm font-body line-clamp-2 mb-3">
                                                    {review.reviewText}
                                                </p>
                                                <div className="flex items-center gap-4 text-white/40 text-xs font-ui font-semibold">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm text-red-400">favorite</span>
                                                        {review.likesCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm text-primary">chat_bubble</span>
                                                        {review.commentsCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileEnhanced;
