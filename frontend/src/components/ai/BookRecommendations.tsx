import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRecommendations, type AIBook } from '../../services/ai.api';
import { searchBooks } from '../../services/books.api';
import './BookRecommendations.css';

/**
 * Book Recommendations Component
 * Provides personalized book recommendations based on user preferences
 */
const BookRecommendations = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<AIBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRecommendations, setShowRecommendations] = useState(false);

    /**
     * Navigate to book detail page
     */
    const handleBookClick = async (book: AIBook) => {
        try {
            const results = await searchBooks(`${book.title} ${book.author}`);
            if (results.length > 0) {
                navigate(`/books/${results[0].id}`);
            } else {
                navigate('/create-review', { state: { selectedBook: book } });
            }
        } catch (error) {
            console.error('Failed to find book:', error);
            navigate('/create-review', { state: { selectedBook: book } });
        }
    };

    /**
     * Fetch recommendations
     */
    const handleGetRecommendations = async () => {
        if (!user) {
            setError('Please login to get personalized recommendations');
            return;
        }

        setLoading(true);
        setError(null);
        setShowRecommendations(false);

        try {
            const results = await getRecommendations();
            setRecommendations(results);
            setShowRecommendations(true);
        } catch (err: any) {
            console.error('Failed to get recommendations:', err);
            if (err.response?.status === 429) {
                setError('Rate limit exceeded. Please try again in a moment.');
            } else {
                setError(err.response?.data?.message || 'Failed to get recommendations. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-recommendations">
            <button
                className="book-recommendations-button"
                onClick={handleGetRecommendations}
                disabled={loading || !user}
            >
                {loading ? (
                    <>
                        <div className="spinner-small"></div>
                        <span>Getting Recommendations...</span>
                    </>
                ) : (
                    <>
                        <span className="recommendations-icon">✨</span>
                        <span>Get AI Recommendations</span>
                    </>
                )}
            </button>

            {error && (
                <div className="book-recommendations-error">
                    {error}
                </div>
            )}

            {showRecommendations && recommendations.length > 0 && (
                <div className="book-recommendations-results">
                    <h3 className="book-recommendations-title">
                        Personalized Recommendations for {user?.username}
                    </h3>
                    <div className="book-recommendations-grid">
                        {recommendations.map((book, index) => (
                            <div
                                key={index}
                                className="book-recommendation-card book-recommendation-card-clickable"
                                onClick={() => handleBookClick(book)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleBookClick(book)}
                            >
                                <div className="book-recommendation-header">
                                    <h4 className="book-recommendation-title">{book.title}</h4>
                                    <span className="book-recommendation-author">by {book.author}</span>
                                </div>
                                <p className="book-recommendation-description">{book.description}</p>
                                <div className="book-recommendation-footer">
                                    <span className="book-recommendation-genre">{book.genre}</span>
                                    {book.similarityScore !== undefined && (
                                        <span className="book-recommendation-score">
                                            Match: {book.similarityScore}%
                                        </span>
                                    )}
                                </div>
                                {book.matchReason && (
                                    <div className="book-recommendation-match">
                                        ✨ {book.matchReason}
                                    </div>
                                )}
                                <div className="book-recommendation-view-hint">
                                    Click to view book →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookRecommendations;
