import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Since App has routing, we might check for something generic or just that it mounted.
        // Assuming the initial route renders something or at least mounting works.
        // We can check if document.body is not empty.
        expect(document.body).toBeInTheDocument();
    });
});
