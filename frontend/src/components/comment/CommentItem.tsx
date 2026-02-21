import { useAuth } from '../../context/AuthContext';
import type { Comment } from '../../types/review';
import { deleteComment } from '../../services/comment.api';
import { resolveInternalImageUrl } from '../../utils/imageUtils';
import { DEFAULT_AVATAR, handleImageError } from '../../utils/imageUtils';

interface CommentItemProps {
    comment: Comment;
    onDelete: (commentId: string) => void;
}

const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
    const { user } = useAuth();
    const isOwnComment = user?.id === comment.user.id;

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment(comment.id);
                onDelete(comment.id);
            } catch (error) {
                console.error('Failed to delete comment:', error);
                alert('Failed to delete comment. Please try again.');
            }
        }
    };

    return (
        <div
            className="flex gap-4 p-4 rounded-xl group transition-all duration-300 hover:bg-white/[0.02]"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, rgba(255,255,255,0.005) 100%)',
                border: '1px solid rgba(255,255,255,0.03)'
            }}
        >
            {/* Avatar with subtle glow */}
            <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <img
                    src={comment.user.profileImage ? resolveInternalImageUrl(comment.user.profileImage) : DEFAULT_AVATAR}
                    alt={comment.user.username}
                    onError={handleImageError}
                    className="w-10 h-10 rounded-full object-cover relative z-10 transition-all duration-300 group-hover:border-primary/30"
                    style={{ border: '2px solid rgba(255,255,255,0.06)' }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1.5">
                    <span className="font-heading font-bold text-white text-sm group-hover:text-primary transition-colors duration-300">
                        {comment.user.username}
                    </span>
                    <span className="text-white/30 text-xs font-ui">·</span>
                    <span className="text-white/30 text-xs font-ui">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[15px] font-body font-light">
                    {comment.text}
                </p>
                {comment.image && (
                    <div className="mt-3">
                        <img
                            src={resolveInternalImageUrl(comment.image)}
                            alt="Attached"
                            className="max-h-56 rounded-xl object-contain shadow-lg"
                            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                        />
                    </div>
                )}
                {isOwnComment && (
                    <button
                        className="mt-2.5 text-white/30 hover:text-red-400 text-xs font-ui font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer"
                        onClick={handleDelete}
                        aria-label={`Delete comment by ${comment.user.username}`}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
