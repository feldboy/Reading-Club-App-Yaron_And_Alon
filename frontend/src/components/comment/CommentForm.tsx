import { useState, FormEvent } from 'react';
import { addComment } from '../../services/comment.api';
import './CommentForm.css';

/**
 * Comment Form Props
 */
interface CommentFormProps {
    reviewId: string;
    onCommentAdded: () => void;
}

/**
 * Comment Form Component
 */
const CommentForm = ({ reviewId, onCommentAdded }: CommentFormProps) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!text.trim()) {
            setError('Comment cannot be empty');
            return;
        }

        if (text.length > 1000) {
            setError('Comment cannot exceed 1000 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            await addComment(reviewId, text.trim());
            setText('');
            onCommentAdded();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add comment');
            console.error('Error adding comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="comment-form" onSubmit={handleSubmit}>
            {error && <div className="comment-form-error">{error}</div>}
            <div className="comment-form-input-group">
                <textarea
                    className="comment-form-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    maxLength={1000}
                    disabled={isSubmitting}
                />
                <div className="comment-form-footer">
                    <span className="comment-form-char-count">
                        {text.length}/1000
                    </span>
                    <button
                        type="submit"
                        className="comment-form-submit"
                        disabled={isSubmitting || !text.trim()}
                    >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;

