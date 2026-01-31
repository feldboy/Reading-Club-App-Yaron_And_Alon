import { useAuth } from '../../context/AuthContext';
import { Comment } from '../../services/comment.api';
import { deleteComment } from '../../services/comment.api';
import './CommentItem.css';

/**
 * Comment Item Props
 */
interface CommentItemProps {
    comment: Comment;
    onDelete: (commentId: string) => void;
}

/**
 * Comment Item Component
 */
const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
    const { user } = useAuth();
    const isOwnComment = user?.id === comment.user.id;

    /**
     * Format timestamp to relative time
     */
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
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    };

    /**
     * Handle delete comment
     */
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
        <div className="comment-item">
            <div className="comment-avatar">
                <img
                    src={comment.user.profileImage || '/uploads/profiles/default-avatar.png'}
                    alt={comment.user.username}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/uploads/profiles/default-avatar.png';
                    }}
                />
            </div>
            <div className="comment-content">
                <div className="comment-header">
                    <span className="comment-username">{comment.user.username}</span>
                    <span className="comment-time">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="comment-text">{comment.text}</p>
                {isOwnComment && (
                    <button className="comment-delete-btn" onClick={handleDelete}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentItem;

