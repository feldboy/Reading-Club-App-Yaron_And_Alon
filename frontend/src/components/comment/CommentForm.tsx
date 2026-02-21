import { useState, useRef, type FormEvent } from 'react';
import { addComment } from '../../services/comment.api';

interface CommentFormProps {
    reviewId: string;
    onCommentAdded: () => void;
}

const CommentForm = ({ reviewId, onCommentAdded }: CommentFormProps) => {
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            await addComment(reviewId, text.trim(), image || undefined);
            setText('');
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            onCommentAdded();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add comment');
            console.error('Error adding comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const charCount = text.length;
    const charNearLimit = charCount > 800;
    const charOverLimit = charCount > 1000;

    return (
        <form
            className="rounded-2xl p-5"
            onSubmit={handleSubmit}
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.04)'
            }}
        >
            {error && (
                <div
                    className="px-4 py-3 rounded-xl mb-4 text-sm font-ui font-medium text-red-300"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 100%)',
                        border: '1px solid rgba(239,68,68,0.2)'
                    }}
                >
                    {error}
                </div>
            )}
            <div className="flex flex-col gap-4">
                <div
                    className={`rounded-xl transition-all duration-300 ${charOverLimit
                        ? 'ring-2 ring-red-400/30'
                        : 'focus-within:ring-2 focus-within:ring-primary/20'
                    }`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 100%)',
                        border: charOverLimit ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.06)'
                    }}
                >
                    <textarea
                        className="w-full p-4 bg-transparent text-white placeholder-white/25 focus:outline-none resize-none min-h-[100px] font-body text-[15px] leading-relaxed"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows={3}
                        maxLength={1050}
                        disabled={isSubmitting}
                    />
                </div>

                {image && (
                    <div className="relative inline-block w-max">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="h-20 w-auto rounded-xl object-cover shadow-lg"
                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                        />
                        <button
                            type="button"
                            onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex justify-between items-center pt-1">
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer text-white/40 hover:text-primary transition-colors flex items-center gap-2 group" title="Attach an image">
                            <span
                                className="p-2 rounded-full transition-all flex items-center justify-center group-hover:bg-primary/10"
                            >
                                <span className="material-symbols-outlined text-lg">image</span>
                            </span>
                            <span className="text-xs font-ui font-semibold hidden sm:inline">Attach</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                disabled={isSubmitting}
                            />
                        </label>
                        <span className={`text-xs font-ui font-semibold transition-colors ${charOverLimit ? 'text-red-400' : charNearLimit ? 'text-yellow-400' : 'text-white/30'}`}>
                            {charCount}/1000
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="relative px-5 py-2.5 text-white font-ui font-bold text-sm rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer overflow-hidden group"
                        disabled={isSubmitting || !text.trim() || charOverLimit}
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            boxShadow: '0 6px 20px -4px rgba(139,92,246,0.35)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">{isSubmitting ? 'Posting...' : 'Post'}</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;
