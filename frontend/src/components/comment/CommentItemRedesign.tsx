import { useAuth } from '../../context/AuthContext';
import type { Comment } from '../../types/review';
import { deleteComment } from '../../services/comment.api';
import { useState } from 'react';

interface CommentItemProps {
    comment: Comment;
    onDelete: (commentId: string) => void;
}

const CommentItemRedesign = ({ comment, onDelete }: CommentItemProps) => {
    const { user } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const isOwnComment = user?.id === comment.user.id;

    const formatTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            if (days < 7) {
                return `${days} day${days > 1 ? 's' : ''} ago`;
            } else {
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            setIsDeleting(true);
            try {
                await deleteComment(comment.id);
                onDelete(comment.id);
            } catch (error) {
                console.error('Failed to delete comment:', error);
                alert('Failed to delete comment. Please try again.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="flex gap-4 group">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full border-2 border-rose-100 overflow-hidden flex-shrink-0">
                <img
                    src={comment.user.profileImage || '/uploads/profiles/default-avatar.png'}
                    alt={comment.user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-xl p-4 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 text-sm">
                                {comment.user.username}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {formatTime(comment.createdAt)}
                            </span>
                        </div>

                        {/* Delete Button */}
                        {isOwnComment && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50 cursor-pointer active:scale-95"
                                title="Delete comment"
                                aria-label="Delete comment"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Comment Text */}
                    <p className="text-gray-800 text-sm leading-relaxed break-words">
                        {comment.text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommentItemRedesign;
