import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import { likeReview, unlikeReview } from '../review.api';

vi.mock('../api', () => ({
    default: {
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('Review API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should like a review successfully', async () => {
        const mockResponse = {
            data: {
                status: 'success',
                message: 'Review liked',
                data: {
                    likesCount: 10,
                    isLiked: true
                }
            }
        };

        (api.post as any).mockResolvedValue(mockResponse);

        const result = await likeReview('review123');

        expect(api.post).toHaveBeenCalledWith('/reviews/review123/like');
        expect(result).toEqual(mockResponse.data);
    });

    it('should unlike a review successfully', async () => {
        const mockResponse = {
            data: {
                status: 'success',
                message: 'Review unliked',
                data: {
                    likesCount: 9,
                    isLiked: false
                }
            }
        };

        (api.delete as any).mockResolvedValue(mockResponse);

        const result = await unlikeReview('review123');

        expect(api.delete).toHaveBeenCalledWith('/reviews/review123/like');
        expect(result).toEqual(mockResponse.data);
    });
});
