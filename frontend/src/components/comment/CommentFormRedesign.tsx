import { useState, type FormEvent } from 'react';
import { addComment } from '../../services/comment.api';

interface CommentFormProps {
    reviewId: string;
    onCommentAdded: () => void;
}

const CommentFormRedesign = ({ reviewId, onCommentAdded }: CommentFormProps) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    const remainingChars = 1000 - text.length;
    const isNearLimit = remainingChars < 100;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800 text-sm font-medium">{error}</span>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="comment-text" className="block text-sm font-semibold text-gray-700">
                    Add your thoughts
                </label>
                <textarea
                    id="comment-text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share your thoughts about this review..."
                    rows={4}
                    maxLength={1000}
                    disabled={isSubmitting}
                    aria-describedby="char-count"
                />
            </div>

            <div className="flex items-center justify-between">
                <span
                    id="char-count"
                    className={`text-sm font-medium transition-colors duration-200 ${
                        isNearLimit ? 'text-amber-600' : 'text-gray-500'
                    }`}
                >
                    {remainingChars} characters remaining
                </span>
                <button
                    type="submit"
                    disabled={isSubmitting || !text.trim()}
                    className="px-6 py-2.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600 disabled:active:scale-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                        </span>
                    ) : (
                        'Post Comment'
                    )}
                </button>
            </div>
        </form>
    );
};

export default CommentFormRedesign;
