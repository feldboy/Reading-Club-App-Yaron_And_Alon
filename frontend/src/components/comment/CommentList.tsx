import { useEffect, useState } from 'react';
import { getComments, Comment } from '../../services/comment.api';
import CommentItem from './CommentItem';
import './CommentList.css';

/**
 * Comment List Props
 */
interface CommentListProps {
    reviewId: string;
}

/**
 * Comment List Component
 */
const CommentList = ({ reviewId }: CommentListProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch comments
     */
    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getComments(reviewId);
            setComments(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load comments');
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle comment deletion
     */
    const handleCommentDelete = (commentId: string) => {
        setComments(comments.filter((comment) => comment.id !== commentId));
    };

    useEffect(() => {
        if (reviewId) {
            fetchComments();
        }
    }, [reviewId]);

    if (loading) {
        return (
            <div className="comment-list-loading">
                <p>Loading comments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comment-list-error">
                <p>{error}</p>
                <button onClick={fetchComments}>Retry</button>
            </div>
        );
    }

    return (
        <div className="comment-list">
            <h3 className="comment-list-title">
                Comments ({comments.length})
            </h3>
            {comments.length === 0 ? (
                <p className="comment-list-empty">No comments yet. Be the first to comment!</p>
            ) : (
                <div className="comment-list-items">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            onDelete={handleCommentDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentList;

