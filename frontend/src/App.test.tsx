import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import App from './App';
import * as authApi from './services/auth.api';

// Suppress jsdom/undici unhandled rejection errors (known compatibility issue)
declare var process: any;
let originalListeners: any[];
beforeAll(() => {
    originalListeners = process.rawListeners('unhandledRejection');
    process.removeAllListeners('unhandledRejection');
    process.on('unhandledRejection', (reason: any) => {
        if (reason?.code === 'UND_ERR_INVALID_ARG') return;
        throw reason;
    });
});
afterAll(() => {
    process.removeAllListeners('unhandledRejection');
    originalListeners.forEach((listener: any) => process.on('unhandledRejection', listener));
});

// Mock the auth API to prevent network calls during tests
vi.mock('./services/auth.api', () => ({
    getProfile: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn()
}));

describe('App', () => {
    it('renders without crashing', async () => {
        // Mock getProfile to return null or a user, avoiding actual network call
        (authApi.getProfile as any).mockResolvedValue({ data: { user: null } });

        render(<App />);

        // Wait for any initial effects to complete if necessary
        await waitFor(() => {
            expect(document.body).toBeInTheDocument();
        });
    });
});
