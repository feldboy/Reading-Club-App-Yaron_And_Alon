import { useEffect, useState } from 'react';
import type { Comment } from '../../types/review';
import { getComments } from '../../services/comment.api';
import CommentItemRedesign from './CommentItemRedesign';

interface CommentListProps {
    reviewId: string;
}

const CommentListRedesign = ({ reviewId }: CommentListProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-rose-100 rounded w-1/4"></div>
                            <div className="h-4 bg-rose-100 rounded w-full"></div>
                            <div className="h-4 bg-rose-100 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl" role="alert">
                <div className="flex items-start gap-3 mb-4">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900 mb-1">Failed to load comments</h4>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
                <button
                    onClick={fetchComments}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1 font-['Cormorant_Garamond']">
                    No comments yet
                </h4>
                <p className="text-gray-600">
                    Be the first to share your thoughts!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h4>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentItemRedesign
                        key={comment.id}
                        comment={comment}
                        onDelete={handleCommentDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentListRedesign;
