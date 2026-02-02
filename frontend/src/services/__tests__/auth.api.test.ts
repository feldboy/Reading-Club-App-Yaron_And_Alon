import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../api';
import { register, login, logout, refreshToken } from '../auth.api';

// Mock the default export 'api' from '../api'
vi.mock('../api', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    },
}));

describe('Auth API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should register a user successfully', async () => {
        const mockResponse = {
            data: {
                status: 'success',
                message: 'User registered successfully',
                data: {
                    user: { id: '1', username: 'test', email: 'test@test.com', profileImage: '' },
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token'
                }
            }
        };

        (api.post as any).mockResolvedValue(mockResponse);

        const result = await register('test', 'test@test.com', 'password');

        expect(api.post).toHaveBeenCalledWith('/auth/register', {
            username: 'test',
            email: 'test@test.com',
            password: 'password'
        });
        expect(result).toEqual(mockResponse.data);
    });

    it('should login a user successfully', async () => {
        const mockResponse = {
            data: {
                status: 'success',
                message: 'Login successful',
                data: {
                    user: { id: '1', username: 'test', email: 'test@test.com', profileImage: '' },
                    accessToken: 'access-token',
                    refreshToken: 'refresh-token'
                }
            }
        };

        (api.post as any).mockResolvedValue(mockResponse);

        const result = await login('test@test.com', 'password');

        expect(api.post).toHaveBeenCalledWith('/auth/login', {
            email: 'test@test.com',
            password: 'password'
        });
        expect(result).toEqual(mockResponse.data);
    });

    it('should logout successfully', async () => {
        (api.post as any).mockResolvedValue({});

        await logout();

        expect(api.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should refresh token successfully', async () => {
        const mockResponse = {
            data: {
                status: 'success',
                message: 'Token refreshed',
                data: {
                    accessToken: 'new-access-token'
                }
            }
        };

        (api.post as any).mockResolvedValue(mockResponse);

        const result = await refreshToken('old-refresh-token');

        expect(api.post).toHaveBeenCalledWith('/auth/refresh', {
            refreshToken: 'old-refresh-token'
        });
        expect(result).toEqual(mockResponse.data);
    });
});
