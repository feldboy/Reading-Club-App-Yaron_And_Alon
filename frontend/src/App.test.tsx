import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as authApi from './services/auth.api';

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
