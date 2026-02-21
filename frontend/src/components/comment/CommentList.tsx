import { useEffect, useState } from 'react';
import type { Comment } from '../../types/review';
import { getComments } from '../../services/comment.api';
import CommentItem from './CommentItem';

interface CommentListProps {
    reviewId: string;
}

const CommentList = ({ reviewId }: CommentListProps) => {
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
            <div className="flex flex-col items-center justify-center py-12">
                <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-white/40 font-ui text-sm">Loading comments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex flex-col items-center justify-center p-6 rounded-2xl mb-6"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 100%)',
                    border: '1px solid rgba(239,68,68,0.15)'
                }}
            >
                <p className="text-red-300 font-body mb-4">{error}</p>
                <button
                    onClick={fetchComments}
                    className="px-4 py-2 rounded-xl font-ui font-semibold text-sm text-white cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            {comments.length === 0 ? (
                <div
                    className="text-center py-10 px-6 rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                        border: '1px dashed rgba(255,255,255,0.06)'
                    }}
                >
                    <span className="material-symbols-outlined text-4xl text-white/20 mb-3 block">forum</span>
                    <p className="text-white/40 font-body">No comments yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-3">
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
