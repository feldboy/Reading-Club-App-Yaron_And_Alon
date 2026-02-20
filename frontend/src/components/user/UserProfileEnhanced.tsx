import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, getWishlist, type UserProfile as UserProfileData, type WishlistItem } from '../../services/user.api';
import { getUserReviews } from '../../services/review.api';
import type { Review } from '../../services/review.api';
import { Badge, Card } from '../ui';
import WishlistButton from '../ui/WishlistButton';
import { resolveInternalImageUrl } from '../../utils/imageUtils';

interface UserProfileEnhancedProps {
    userId?: string;
    onEditClick?: () => void;
}

type TabType = 'reviews' | 'wishlist' | 'stats';

const UserProfileEnhanced = ({ userId, onEditClick }: UserProfileEnhancedProps) => {
    const { user: currentUser, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
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

                // Load user's reviews and wishlist
                try {
                    const [reviewsData, wishlistData] = await Promise.all([
                        getUserReviews(profileData.id),
                        getWishlist()
                    ]);
                    setReviews(reviewsData);
                    setWishlist(wishlistData);
                } catch (err) {
                    console.error('Failed to load reviews/wishlist:', err);
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
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="size-12 border-4 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin mb-4" />
                <p className="text-[#4C1D95] dark:text-white font-medium">Loading profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <span className="material-symbols-outlined text-6xl text-[#7C3AED]/30 dark:text-white/30 mb-4">
                    error
                </span>
                <p className="text-[#4C1D95] dark:text-white text-lg mb-6">{error || 'Profile not found'}</p>
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                    >
                        Go to Login
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#FAF5FF] dark:from-[#1a0f2e] dark:via-[#2d1b4e] dark:to-[#1a0f2e] min-h-screen pb-24">
            {/* Header with Profile Info - No blank space */}
            <div className="relative pt-8">
                {/* Profile Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="size-32 sm:size-40 rounded-3xl overflow-hidden border-4 border-[#7C3AED]/20 dark:border-[#7C3AED]/40 shadow-2xl bg-white dark:bg-[#1a0f2e]">
                                    <img
                                        src={resolveInternalImageUrl(profile.profileImage)}
                                        alt={profile.username}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 size-12 bg-[#22C55E] rounded-full border-4 border-[#FAF5FF] dark:border-[#1a0f2e] flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-white text-xl">check</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left pb-4">
                                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#4C1D95] dark:text-white mb-2">
                                    {profile.username}
                                </h1>
                                <p className="text-[#7C3AED] dark:text-white/70 text-base sm:text-lg mb-3">
                                    {profile.email}
                                </p>
                                {profile.bio && (
                                    <p className="text-[#4C1D95]/70 dark:text-white/70 text-sm sm:text-base max-w-2xl">
                                        {profile.bio}
                                    </p>
                                )}
                                {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                        {profile.favoriteGenres.map((genre, index) => (
                                            <Badge key={index} variant="primary" size="sm">
                                                {genre}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {isOwnProfile && (
                                <div className="flex gap-3 pb-4">
                                    <button
                                        onClick={handleEditClick}
                                        className="px-6 py-3 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="px-6 py-3 bg-white dark:bg-white/5 text-[#7C3AED] dark:text-white hover:bg-[#7C3AED]/10 dark:hover:bg-white/10 rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] border-2 border-[#7C3AED]/20 dark:border-white/10"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Stats - All Consistent */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className="p-6 text-center bg-white dark:bg-white/5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                            >
                                <p className="text-3xl sm:text-4xl font-bold text-[#7C3AED] mb-1">{reviews.length}</p>
                                <p className="font-ui text-[#4C1D95]/70 dark:text-white/70 text-sm sm:text-base font-medium">Reviews</p>
                            </button>
                            <button
                                onClick={() => setActiveTab('wishlist')}
                                className="p-6 text-center bg-white dark:bg-white/5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                            >
                                <p className="text-3xl sm:text-4xl font-bold text-[#7C3AED] mb-1">{wishlist.length}</p>
                                <p className="font-ui text-[#4C1D95]/70 dark:text-white/70 text-sm sm:text-base font-medium">Wishlist</p>
                            </button>
                            <div className="p-6 text-center bg-white dark:bg-white/5 rounded-2xl shadow-sm">
                                <p className="text-3xl sm:text-4xl font-bold text-[#7C3AED] mb-1">
                                    {reviews.reduce((sum, r) => sum + r.likesCount, 0)}
                                </p>
                                <p className="font-ui text-[#4C1D95]/70 dark:text-white/70 text-sm sm:text-base font-medium">Likes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex gap-2 border-b-2 border-[#7C3AED]/10 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-3 font-heading font-bold text-base sm:text-lg transition-all duration-300 cursor-pointer border-b-4 ${activeTab === 'reviews'
                                ? 'border-[#7C3AED] text-[#7C3AED] dark:text-white'
                                : 'border-transparent text-[#4C1D95]/60 dark:text-white/60 hover:text-[#7C3AED] dark:hover:text-white'
                            }`}
                    >
                        Reviews ({reviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`px-6 py-3 font-heading font-bold text-base sm:text-lg transition-all duration-300 cursor-pointer border-b-4 ${activeTab === 'wishlist'
                                ? 'border-[#7C3AED] text-[#7C3AED] dark:text-white'
                                : 'border-transparent text-[#4C1D95]/60 dark:text-white/60 hover:text-[#7C3AED] dark:hover:text-white'
                            }`}
                    >
                        Wishlist ({wishlist.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="animate-fade-in">
                        {reviews.length === 0 ? (
                            <div className="text-center py-16">
                                <span className="material-symbols-outlined text-6xl text-[#7C3AED]/30 dark:text-white/30 mb-4 block">
                                    rate_review
                                </span>
                                <h3 className="font-heading text-2xl font-bold text-[#4C1D95] dark:text-white mb-3">
                                    No reviews yet
                                </h3>
                                <p className="text-[#4C1D95]/70 dark:text-white/70 mb-6">
                                    Start reviewing books you've read!
                                </p>
                                <button
                                    onClick={() => navigate('/create-review')}
                                    className="px-6 py-3 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                                >
                                    Create First Review
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {reviews.map((review) => (
                                    <Link
                                        key={review.id}
                                        to={`/reviews/${review.id}`}
                                        className="block"
                                    >
                                        <Card hoverable className="p-6 flex gap-6 bg-white dark:bg-white/5">
                                            {review.bookImage && (
                                                <div className="flex-shrink-0 w-24 h-36 rounded-xl overflow-hidden shadow-md">
                                                    <img
                                                        src={review.bookImage}
                                                        alt={review.bookTitle}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/uploads/books/default-book.png';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-xl mb-2 line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
                                                    {review.bookTitle}
                                                </h3>
                                                <p className="text-[#7C3AED]/70 dark:text-white/70 text-base mb-3">
                                                    by {review.bookAuthor}
                                                </p>
                                                <div className="flex items-center gap-2 mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`material-symbols-outlined text-lg ${i < review.rating ? 'text-[#7C3AED]' : 'text-[#7C3AED]/20'
                                                                }`}
                                                            style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}
                                                        >
                                                            star
                                                        </span>
                                                    ))}
                                                </div>
                                                <p className="text-[#4C1D95]/70 dark:text-white/70 text-sm line-clamp-2 mb-4">
                                                    {review.reviewText}
                                                </p>
                                                <div className="flex items-center gap-6 text-[#7C3AED]/60 dark:text-white/60 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">favorite</span>
                                                        {review.likesCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-base">comment</span>
                                                        {review.commentsCount}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                    <div className="animate-fade-in">
                        {wishlist.length === 0 ? (
                            <div className="text-center py-16">
                                <span className="material-symbols-outlined text-6xl text-[#7C3AED]/30 dark:text-white/30 mb-4 block">
                                    bookmark
                                </span>
                                <h3 className="font-heading text-2xl font-bold text-[#4C1D95] dark:text-white mb-3">
                                    Your wishlist is empty
                                </h3>
                                <p className="text-[#4C1D95]/70 dark:text-white/70 mb-6">
                                    Save books you want to read later
                                </p>
                                <button
                                    onClick={() => navigate('/discover')}
                                    className="px-6 py-3 bg-[#7C3AED] text-white hover:bg-[#6D31D4] rounded-xl font-medium transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                                >
                                    Discover Books
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {wishlist.map((book, index) => (
                                    <div key={book.bookId} className="group relative animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                                        <Link to={`/reviews/${book.bookId}`} className="block h-full">
                                            <Card hoverable className="overflow-hidden p-0 h-full flex flex-col bg-white dark:bg-white/5">
                                                <div className="relative">
                                                    <div className="aspect-[3/4.5] overflow-hidden">
                                                        <img
                                                            src={book.cover?.replace('http:', 'https:') || 'https://via.placeholder.com/128x192?text=No+Cover'}
                                                            alt={book.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-3 flex-1 flex flex-col">
                                                    <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-sm leading-tight line-clamp-2 mb-2 group-hover:text-[#7C3AED] transition-colors">
                                                        {book.title}
                                                    </h3>
                                                    <p className="font-serif text-[#7C3AED]/70 dark:text-white/60 text-xs italic line-clamp-1">
                                                        {book.authors?.join(', ') || 'Unknown Author'}
                                                    </p>
                                                </div>
                                            </Card>
                                        </Link>
                                        <div className="absolute top-2 right-2 z-10">
                                            <WishlistButton
                                                bookId={book.bookId}
                                                title={book.title}
                                                authors={book.authors}
                                                cover={book.cover}
                                                isInWishlist={true}
                                                onToggle={() => handleWishlistRemove(book.bookId)}
                                                className="bg-black/60 backdrop-blur-sm shadow-lg hover:bg-black/80"
                                            />
                                        </div>
                                    </div>
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
