import '@testing-library/jest-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// Polyfill for Node environments if needed, though jsdom usually handles it. 
// However, sometimes undici conflicts. 
// We generally don't need explicit fetch polyfill with Node 18+, but for tests it can help.
// If this doesn't work, we'll proceed.
