import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviewById, deleteReview, updateReview, type Review } from '../services/review.api';
import { getWishlist } from '../services/user.api';
import LikeButton from '../components/review/LikeButton';
import WishlistButton from '../components/ui/WishlistButton';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import { resolveInternalImageUrl, DEFAULT_BOOK_COVER, handleBookImageError } from '../utils/imageUtils';
import { DEFAULT_AVATAR, handleImageError } from '../utils/imageUtils';

/** Premium star rating with glow effect */
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${star <= rating
                    ? 'text-violet-400 fill-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.7)]'
                    : 'text-white/10 fill-white/10'
                    }`}
                viewBox="0 0 20 20"
                aria-hidden="true"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        <span className="ml-2 text-white/60 text-sm sm:text-base font-bold">{rating}.0</span>
    </div>
);

export default function ReviewDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [commentsKey, setCommentsKey] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Edit modal state
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editText, setEditText] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [editImage, setEditImage] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [removeReviewImage, setRemoveReviewImage] = useState(false); // user wants to delete the image
    const [isUpdating, setIsUpdating] = useState(false);
    const editImageRef = useRef<HTMLInputElement>(null);

    const isOwnReview = user?.id === review?.userId;

    useEffect(() => {
        const loadReviewAndWishlist = async () => {
            if (!id) {
                setError('Review ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const reviewData = await getReviewById(id);
                setReview(reviewData);

                if (user && reviewData) {
                    try {
                        const wishlist = await getWishlist();
                        const bookId = reviewData.googleBookId;
                        if (bookId) {
                            setIsInWishlist(wishlist.some(item => item.bookId === bookId));
                        }
                    } catch (wErr) {
                        console.error('Failed to load wishlist status', wErr);
                    }
                }

            } catch (err: any) {
                console.error('Failed to load review:', err);
                setError(err.response?.data?.message || 'Failed to load review');
            } finally {
                setLoading(false);
            }
        };

        loadReviewAndWishlist();
    }, [id, user]);

    const handleDelete = async () => {
        if (!review || !isOwnReview) return;
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        setIsDeleting(true);
        try {
            await deleteReview(review.id);
            navigate('/');
        } catch (err: any) {
            console.error('Failed to delete review:', err);
            alert(err.response?.data?.message || 'Failed to delete review');
        } finally {
            setIsDeleting(false);
        }
    };

    const openEdit = () => {
        if (!review) return;
        setEditText(review.reviewText);
        setEditRating(review.rating);
        setEditImage(null);
        setRemoveReviewImage(false);
        setEditImagePreview(review.reviewImage ? resolveInternalImageUrl(review.reviewImage) : null);
        setIsEditOpen(true);
    };

    const handleEditImageChange = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
        setEditImage(file);
        setRemoveReviewImage(false);
        const reader = new FileReader();
        reader.onload = (e) => setEditImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleRemoveEditImage = () => {
        setEditImage(null);
        setEditImagePreview(null);
        setRemoveReviewImage(true); // flag: tell backend to delete the image
        if (editImageRef.current) editImageRef.current.value = '';
    };

    const handleEditSubmit = async () => {
        if (!review || !editText.trim()) return;
        setIsUpdating(true);
        try {
            const updated = await updateReview(review.id, {
                reviewText: editText.trim(),
                rating: editRating,
                // If a new file was chosen → upload it
                // If user removed the image → send null to delete it
                // If no change → send undefined (don't touch)
                reviewImage: editImage instanceof File ? editImage
                    : removeReviewImage ? null
                        : undefined,
            });
            setReview({ ...review, ...updated });
            setIsEditOpen(false);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update review');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLikeChange = (liked: boolean, count: number) => {
        if (review) {
            setReview({
                ...review,
                likesCount: count,
                likes: liked
                    ? [...review.likes, user?.id || '']
                    : review.likes.filter((uid) => uid !== user?.id),
            });
        }
    };

    const handleCommentAdded = () => {
        setCommentsKey((prev) => prev + 1);
        if (review) {
            setReview({
                ...review,
                commentsCount: review.commentsCount + 1,
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pb-24 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="size-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/40 font-ui text-sm">Loading review...</p>
                </div>
            </div>
        );
    }

    if (error || !review) {
        return (
            <div className="min-h-screen pb-24 flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
                <div
                    className="rounded-[28px] p-8 max-w-md w-full text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 100%)',
                        border: '1px solid rgba(239,68,68,0.15)',
                        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.4)'
                    }}
                >
                    <span className="material-symbols-outlined text-5xl text-red-400/80 mb-4 block">error</span>
                    <p className="text-white text-xl font-heading font-bold mb-6">{error || 'Review not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 rounded-xl text-white font-ui font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)'
                        }}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const isLiked = user?.id ? review.likes.includes(user.id) : false;
    const bookImageUrl = review.bookImage
        ? resolveInternalImageUrl(review.bookImage)
        : DEFAULT_BOOK_COVER;

    return (
        <div className="min-h-screen pb-24 selection:bg-primary/30" style={{ background: 'linear-gradient(180deg, #030303 0%, #050507 100%)' }}>
            {/* Premium Hero Section with Book Cover */}
            <div className="relative w-full min-h-[50vh] overflow-hidden">
                {/* Ambient background glow from cover */}
                <div
                    className="absolute inset-0 scale-150 blur-[100px] opacity-25"
                    style={{ backgroundImage: `url('${bookImageUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/50 via-transparent to-[#030303]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/30 via-transparent to-[#030303]/30" />

                {/* Header Navigation */}
                <div
                    className="sticky top-0 z-50 flex items-center px-4 md:px-6 py-4 justify-between max-w-6xl mx-auto w-full"
                    style={{
                        background: 'linear-gradient(180deg, rgba(3,3,3,0.9) 0%, transparent 100%)',
                    }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-all duration-300 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-white/70 text-lg">arrow_back_ios_new</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <span className="text-primary font-ui font-bold text-[10px] tracking-[0.2em] uppercase">Reading Club</span>
                        <span className="text-white/60 text-sm font-heading font-semibold tracking-wide">Review</span>
                    </div>
                    <div className="flex gap-2.5">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="size-10 flex items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] transition-all duration-300"
                        >
                            <span className="material-symbols-outlined text-white/70 text-lg">share</span>
                        </button>
                    </div>
                </div>

                {/* Book Cover & Info */}
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 mt-4 px-4 md:px-6 max-w-4xl mx-auto w-full">
                    {/* Premium Book Cover */}
                    <div className="relative shrink-0">
                        <div
                            className="absolute inset-0 -z-10 blur-[40px] opacity-50"
                            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(34,211,238,0.2))' }}
                        />
                        <div className="relative">
                            <img
                                src={bookImageUrl}
                                alt={`${review.bookTitle} cover`}
                                className="w-36 h-[216px] sm:w-44 sm:h-[264px] object-cover rounded-2xl"
                                style={{
                                    boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7), 0 0 50px -15px rgba(139,92,246,0.3)',
                                    border: '1px solid rgba(255,255,255,0.08)'
                                }}
                                onError={handleBookImageError}
                            />
                            {/* Glare effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1] rounded-2xl pointer-events-none" />
                            {/* Wishlist button */}
                            {review.googleBookId && (
                                <div className="absolute top-3 right-3 z-20">
                                    <WishlistButton
                                        bookId={review.googleBookId}
                                        title={review.bookTitle}
                                        authors={[review.bookAuthor]}
                                        cover={review.bookImage || ''}
                                        isInWishlist={isInWishlist}
                                        onToggle={(newState) => setIsInWishlist(newState)}
                                        className="bg-black/50 backdrop-blur-md border border-white/10"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 text-center md:text-left">
                        <Link
                            to={review.googleBookId ? `/books/${review.googleBookId}` : '#'}
                            className="group"
                        >
                            <h1 className="font-heading text-white tracking-tight text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-lg group-hover:text-primary transition-colors duration-300">
                                {review.bookTitle}
                            </h1>
                        </Link>
                        <p className="font-display italic text-white/50 text-base md:text-lg mt-2">
                            by {review.bookAuthor}
                        </p>
                        <div className="mt-5">
                            <StarRating rating={review.rating} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 px-4 md:px-6 max-w-4xl mx-auto w-full -mt-4">
                {/* Reviewer Info Card */}
                <div
                    className="rounded-[28px] p-5 md:p-6 mb-5"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.4)'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {/* Gradient ring */}
                                <div
                                    className="absolute -inset-1 rounded-full opacity-60"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #22d3ee 50%, #f472b6 100%)' }}
                                />
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#030303]">
                                    <img
                                        alt={review.user?.username || 'User'}
                                        className="w-full h-full object-cover"
                                        src={
                                            review.user?.profileImage
                                                ? resolveInternalImageUrl(review.user.profileImage)
                                                : DEFAULT_AVATAR
                                        }
                                        onError={handleImageError}
                                    />
                                </div>
                                {/* Online indicator */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#030303] shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading font-bold text-white text-lg tracking-tight">{review.user?.username || 'Unknown User'}</span>
                                <div className="flex items-center gap-2 text-white/40 text-xs font-ui font-semibold uppercase tracking-wider mt-0.5">
                                    <span>{new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                    <span>{Math.max(1, Math.ceil(review.reviewText.length / 200))} min read</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isOwnReview && (
                                <>
                                    {/* Edit button */}
                                    <button
                                        onClick={openEdit}
                                        className="size-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                                        title="Edit review"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    {/* Delete button */}
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="size-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                                        title="Delete review"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Review Body - Magazine Style */}
                <div
                    className="rounded-[28px] p-6 md:p-10 mb-6 relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.4)'
                    }}
                >
                    {/* Quotation mark decoration */}
                    <div className="absolute -top-8 -left-4 text-[14rem] text-white/[0.02] font-display pointer-events-none select-none leading-none">"</div>

                    {/* Review text with premium typography */}
                    <article className="relative z-10">
                        <p className="font-body text-white/75 text-[17px] md:text-lg leading-[1.9] font-light tracking-[0.01em] whitespace-pre-wrap">
                            {review.reviewText}
                        </p>
                    </article>

                    {/* User's personal photo on the review post */}
                    {review.reviewImage && (
                        <div className="mt-6 rounded-2xl overflow-hidden border border-white/[0.06] shadow-xl">
                            <img
                                src={resolveInternalImageUrl(review.reviewImage)}
                                alt="Photo added to review"
                                className="w-full max-h-96 object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                            />
                        </div>
                    )}

                    {/* Actions Footer */}
                    <div className="mt-10 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <LikeButton
                                reviewId={review.id}
                                initialLikesCount={review.likesCount}
                                initialLiked={isLiked}
                                onLikeChange={handleLikeChange}
                            />
                            <span className="text-white/40 text-sm font-ui font-semibold">
                                {review.likesCount} {review.likesCount === 1 ? 'like' : 'likes'}
                            </span>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard!');
                            }}
                            className="flex items-center gap-2 text-white/40 hover:text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer font-ui text-sm font-semibold"
                            aria-label="Share review"
                        >
                            <span className="material-symbols-outlined text-lg">ios_share</span>
                            <span className="hidden sm:inline">Share</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <section
                    className="rounded-[28px] p-6 md:p-8"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 20px 50px -15px rgba(0,0,0,0.4)'
                    }}
                >
                    <h2 className="font-heading text-white text-lg md:text-xl font-bold tracking-tight mb-6 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">forum</span>
                        Comments
                        <span className="text-white/40 font-normal text-base">({review.commentsCount})</span>
                    </h2>
                    <CommentForm reviewId={review.id} onCommentAdded={handleCommentAdded} />
                    <div className="mt-6">
                        <CommentList key={commentsKey} reviewId={review.id} />
                    </div>
                </section>
            </div>

            {/* Side Floating Actions (Desktop) */}
            <div
                className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4 p-3 rounded-full items-center"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                }}
            >
                <LikeButton
                    reviewId={review.id}
                    initialLikesCount={review.likesCount}
                    initialLiked={isLiked}
                    onLikeChange={handleLikeChange}
                />
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                    }}
                    className="size-11 flex items-center justify-center rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-primary transition-all duration-300 cursor-pointer"
                >
                    <span className="material-symbols-outlined text-lg">share</span>
                </button>
            </div>

            {/* ── Edit Modal ── */}
            {
                isEditOpen && (
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setIsEditOpen(false); }}
                    >
                        <div
                            className="w-full max-w-lg rounded-[28px] p-6 md:p-8 animate-fade-in"
                            style={{
                                background: 'linear-gradient(135deg, rgba(20,10,40,0.98) 0%, rgba(10,5,25,0.98) 100%)',
                                border: '1px solid rgba(139,92,246,0.25)',
                                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px -20px rgba(139,92,246,0.2)'
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading text-white text-xl font-bold">Edit Review</h2>
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="size-9 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-5">
                                <label className="font-heading text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setEditRating(star)} className="focus:outline-none">
                                            <span
                                                className={`material-symbols-outlined text-3xl cursor-pointer transition-all ${star <= editRating ? 'text-primary' : 'text-white/15'}`}
                                                style={star <= editRating ? { fontVariationSettings: "'FILL' 1" } : {}}
                                            >star</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text */}
                            <div className="mb-5">
                                <label className="font-heading text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Review Text</label>
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={6}
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-white text-sm leading-relaxed placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                                    placeholder="Update your review..."
                                />
                            </div>

                            {/* Review Image */}
                            <div className="mb-6">
                                <label className="font-heading text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">
                                    Photo <span className="text-white/20 normal-case font-normal">Optional</span>
                                </label>
                                {editImagePreview ? (
                                    <div className="space-y-3">
                                        <div className="relative rounded-2xl overflow-hidden border border-white/10">
                                            <img src={editImagePreview} alt="Preview" className="w-full h-40 object-cover" />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => editImageRef.current?.click()}
                                                className="flex-1 py-2 bg-white/10 text-white rounded-xl text-sm font-semibold cursor-pointer hover:bg-white/20 transition-colors"
                                            >
                                                Change Photo
                                            </button>
                                            <button
                                                onClick={handleRemoveEditImage}
                                                className="flex-1 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
                                            >
                                                Remove Photo
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => editImageRef.current?.click()}
                                        className="border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-white/[0.02]"
                                    >
                                        <span className="material-symbols-outlined text-2xl text-white/20 block mb-1">add_photo_alternate</span>
                                        <p className="text-white/30 text-xs">Click to add a photo</p>
                                    </div>
                                )}
                                <input
                                    ref={editImageRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleEditImageChange(f); }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="flex-1 py-3 rounded-2xl text-white/60 font-ui font-semibold text-sm bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditSubmit}
                                    disabled={isUpdating || !editText.trim()}
                                    className="flex-1 py-3 rounded-2xl text-white font-ui font-bold text-sm transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow: '0 8px 24px -4px rgba(139,92,246,0.4)' }}
                                >
                                    {isUpdating ? (
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><span className="material-symbols-outlined text-base">save</span> Save Changes</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
