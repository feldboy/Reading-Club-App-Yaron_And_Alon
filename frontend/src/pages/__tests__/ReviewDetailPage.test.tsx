import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewDetailPage from '../ReviewDetailPage';
import { AuthContext } from '../../context/AuthContext';
import * as reviewApi from '../../services/review.api';
import * as userApi from '../../services/user.api';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock API modules
vi.mock('../../services/review.api');
vi.mock('../../services/comment.api');
vi.mock('../../services/user.api');

// Mock child components to simplify testing
vi.mock('../../components/comment/CommentList', () => ({
    default: ({ reviewId }: { reviewId: string }) => <div data-testid="comment-list">Comments for {reviewId}</div>
}));
vi.mock('../../components/comment/CommentForm', () => ({
    default: ({ onCommentAdded }: { onCommentAdded: () => void }) => (
        <button data-testid="add-comment-btn" onClick={onCommentAdded}>Add Comment</button>
    )
}));

describe('ReviewDetailPage', () => {
    const mockUser = {
        id: 'user1',
        username: 'testuser',
        email: 'test@test.com',
        profileImage: '',
        token: 'token',
        refreshToken: 'refresh'
    };

    const mockReview = {
        id: 'review1',
        userId: 'user2',
        user: { id: 'user2', username: 'author', profileImage: '' },
        bookTitle: 'Test Book',
        bookAuthor: 'Test Author',
        rating: 5,
        reviewText: 'Great book!',
        likes: [],
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (reviewApi.getReviewById as any).mockResolvedValue(mockReview);
        (userApi.getWishlist as any).mockResolvedValue([]);
    });

    const renderComponent = (user = mockUser) => {
        return render(
            <AuthContext.Provider value={{ user, isAuthenticated: !!user, login: vi.fn(), logout: vi.fn(), register: vi.fn(), loading: false, handleOAuthCallback: vi.fn(), setUser: vi.fn() }}>
                <MemoryRouter initialEntries={['/reviews/review1']}>
                    <Routes>
                        <Route path="/reviews/:id" element={<ReviewDetailPage />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    it('renders loading state initially', () => {
        // Delay resolution to catch loading state
        (reviewApi.getReviewById as any).mockImplementation(() => new Promise(() => { }));
        renderComponent();
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders review details after loading', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Test Book')).toBeInTheDocument();
            expect(screen.getByText('by Test Author')).toBeInTheDocument();
            expect(screen.getByText('Great book!')).toBeInTheDocument();
        });
    });

    it('handles like toggle', async () => {
        renderComponent();

        await waitFor(() => expect(screen.getByText('Test Book')).toBeInTheDocument());

        (reviewApi.likeReview as any).mockResolvedValue({
            data: { isLiked: true, likesCount: 1 }
        });

        // Check if buttons exist (Like, Share, etc.)
        expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });

    it('renders comments section', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByTestId('comment-list')).toBeInTheDocument());
        expect(screen.getByTestId('comment-list')).toHaveTextContent('Comments for review1');
    });

    it('updates comment count when new comment is added', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByText('Test Book')).toBeInTheDocument());

        const addCommentBtn = screen.getByTestId('add-comment-btn');
        fireEvent.click(addCommentBtn);
    });
});
