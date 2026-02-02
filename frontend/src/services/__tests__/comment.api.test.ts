import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import { addComment, getComments, deleteComment } from '../comment.api';

vi.mock('../api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('Comment API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should add a comment successfully', async () => {
        const mockComment = {
            id: 'comment1',
            reviewId: 'review1',
            userId: 'user1',
            text: 'Great review!',
            createdAt: '2023-01-01',
            user: { id: 'user1', username: 'testuser', profileImage: '' }
        };
        const mockResponse = {
            data: {
                status: 'success',
                message: 'Comment added',
                data: {
                    comment: mockComment
                }
            }
        };

        (api.post as any).mockResolvedValue(mockResponse);

        const result = await addComment('review1', 'Great review!');

        expect(api.post).toHaveBeenCalledWith('/reviews/review1/comments', {
            text: 'Great review!'
        });
        expect(result).toEqual(mockComment);
    });

    it('should get comments successfully', async () => {
        const mockComments = [
            {
                id: 'comment1',
                reviewId: 'review1',
                userId: 'user1',
                text: 'Great review!',
                createdAt: '2023-01-01'
            }
        ];
        const mockResponse = {
            data: {
                status: 'success',
                data: {
                    comments: mockComments
                }
            }
        };

        (api.get as any).mockResolvedValue(mockResponse);

        const result = await getComments('review1');

        expect(api.get).toHaveBeenCalledWith('/reviews/review1/comments');
        expect(result).toEqual(mockComments);
    });

    it('should delete a comment successfully', async () => {
        (api.delete as any).mockResolvedValue({});

        await deleteComment('comment1');

        expect(api.delete).toHaveBeenCalledWith('/comments/comment1');
    });
});
