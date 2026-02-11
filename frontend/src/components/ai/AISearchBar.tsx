import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchBooks, type AIBook } from '../../services/ai.api';
import './AISearchBar.css';

/**
 * AI Search Bar Props
 */
interface AISearchBarProps {
    onBookSelect?: (book: AIBook) => void;
    placeholder?: string;
}

/**
 * AI Search Bar Component
 * Provides AI-powered book search with debounced input
 */
const AISearchBar = ({ onBookSelect, placeholder = 'Search for books using AI...' }: AISearchBarProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<AIBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);
    const debouncedQuery = useDebounce(query, 500);
    const searchRef = useRef<HTMLDivElement>(null);

    /**
     * Handle outside click to close results
     */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Perform search when debounced query changes
     */
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedQuery.trim()) {
                setResults([]);
                setShowResults(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const books = await searchBooks(debouncedQuery.trim());
                setResults(books);
                setShowResults(true);
            } catch (err: any) {
                console.error('AI search failed:', err);
                if (err.response?.status === 429) {
                    setError('Rate limit exceeded. Please try again in a moment.');
                } else {
                    setError(err.response?.data?.message || 'Failed to search books. Please try again.');
                }
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    /**
     * Handle book selection
     */
    const handleBookSelect = (book: AIBook) => {
        onBookSelect?.(book);
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div className="ai-search-bar" ref={searchRef}>
            <div className="ai-search-input-wrapper">
                <span className="ai-search-icon">🤖</span>
                <input
                    type="text"
                    className="ai-search-input"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setError(null);
                    }}
                    placeholder={placeholder}
                    disabled={loading}
                />
                {loading && (
                    <div className="ai-search-spinner">
                        <div className="spinner-small"></div>
                    </div>
                )}
            </div>

            {error && (
                <div className="ai-search-error">
                    {error}
                </div>
            )}

            {showResults && results.length > 0 && (
                <div className="ai-search-results">
                    {results.map((book, index) => (
                        <div
                            key={index}
                            className="ai-search-result-item"
                            onClick={() => handleBookSelect(book)}
                        >
                            <div className="ai-search-result-header">
                                <h4 className="ai-search-result-title">{book.title}</h4>
                                <span className="ai-search-result-author">by {book.author}</span>
                            </div>
                            <p className="ai-search-result-description">{book.description}</p>
                            <div className="ai-search-result-footer">
                                <span className="ai-search-result-genre">{book.genre}</span>
                                {book.matchReason && (
                                    <span className="ai-search-result-match">✨ {book.matchReason}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showResults && results.length === 0 && !loading && debouncedQuery.trim() && (
                <div className="ai-search-no-results">
                    No books found. Try a different search query.
                </div>
            )}
        </div>
    );
};

export default AISearchBar;
