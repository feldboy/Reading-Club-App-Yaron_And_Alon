import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockAxiosInstance = vi.fn() as any;
mockAxiosInstance.interceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
};
mockAxiosInstance.post = vi.fn(); // For manual calls if any on instance

const mockAxios = {
    create: vi.fn(() => mockAxiosInstance),
    post: vi.fn(), // For global axios.post calls
};

vi.mock('axios', () => ({
    default: mockAxios,
    AxiosError: class { },
}));

describe('API Interceptors', () => {
    let api: any;
    let requestInterceptor: any;
    let responseInterceptorSuccess: any;
    let responseInterceptorError: any;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.resetModules();
        localStorage.clear();

        // Re-import api
        const mod = await import('../api');
        api = mod.default;
        void api;

        // Retrieve interceptors
        // The first call to use() on request and response is what we assume sets up the interceptors
        const requestUse = mockAxiosInstance.interceptors.request.use;
        const responseUse = mockAxiosInstance.interceptors.response.use;

        if (requestUse.mock.calls.length > 0) {
            requestInterceptor = requestUse.mock.calls[0][0];
        }
        if (responseUse.mock.calls.length > 0) {
            responseInterceptorSuccess = responseUse.mock.calls[0][0];
            responseInterceptorError = responseUse.mock.calls[0][1];
        }
    });

    afterEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('Request Interceptor: adds bearer token', () => {
        localStorage.setItem('accessToken', 'my-token');
        const config = { headers: {} as any };
        requestInterceptor(config);
        expect(config.headers['Authorization']).toBe('Bearer my-token');
    });

    it('Response Interceptor: returns response on success', () => {
        const resp = { data: 'ok' };
        expect(responseInterceptorSuccess(resp)).toBe(resp);
    });

    it('Response Interceptor: refreshes token on 401', async () => {
        const originalRequest = {
            _retry: false,
            headers: {} as any
        };
        const error = {
            config: originalRequest,
            response: { status: 401 }
        };

        localStorage.setItem('refreshToken', 'valid-refresh-token');

        // Mock successful refresh response
        mockAxios.post.mockResolvedValueOnce({
            data: {
                data: { accessToken: 'new-access-token' }
            }
        });

        // Mock the retry of original request
        mockAxiosInstance.mockResolvedValueOnce({ data: 'retried-success' });

        const result = await responseInterceptorError(error);

        // Check if refresh was called
        expect(mockAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/auth/refresh'),
            { refreshToken: 'valid-refresh-token' }
        );

        // Check if token was updated
        expect(localStorage.getItem('accessToken')).toBe('new-access-token');

        // Check if original request was retried with new token
        expect(originalRequest.headers['Authorization']).toBe('Bearer new-access-token');
        expect(mockAxiosInstance).toHaveBeenCalledWith(originalRequest);
        expect(result).toEqual({ data: 'retried-success' });
    });

    it('Response Interceptor: logs out on refresh failure', async () => {
        const originalRequest = { _retry: false };
        const error = {
            config: originalRequest,
            response: { status: 401 }
        };

        localStorage.setItem('refreshToken', 'bad-token');
        localStorage.setItem('accessToken', 'expired-token');

        // Mock failed refresh
        mockAxios.post.mockRejectedValueOnce(new Error('Refresh failed'));

        // Mock window.location
        const originalLocation = window.location;
        delete (window as any).location;
        (window as any).location = { href: '' };

        try {
            await responseInterceptorError(error);
        } catch (e) {
            expect(e).toBeDefined();
        }

        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        expect(window.location.href).toBe('/login');

        // Restore window.location
        (window as any).location = originalLocation;
    });

    it('Response Interceptor: handles error without config gracefully', async () => {
        const error = {
            response: { status: 401 }
        };
        // No config in error

        await expect(responseInterceptorError(error)).rejects.toEqual(error);
    });
});

