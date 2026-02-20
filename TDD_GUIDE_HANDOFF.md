# TDD GUIDE HANDOFF DOCUMENT
## Test-Driven Development Analysis and Strategy

---

## 1. CURRENT TEST COVERAGE ANALYSIS

### Existing Tests Found (6 test files, 20 tests passing)

| File | Tests | Coverage Area |
|------|-------|---------------|
| `src/App.test.tsx` | 1 | Basic app rendering |
| `src/pages/__tests__/ReviewDetailPage.test.tsx` | 5 | Page component |
| `src/services/__tests__/api.test.ts` | 5 | Axios interceptors |
| `src/services/__tests__/auth.api.test.ts` | 4 | Auth service |
| `src/services/__tests__/comment.api.test.ts` | 3 | Comment service |
| `src/services/__tests__/review.api.test.ts` | 2 | Review service |

### Test Infrastructure Status

**Good:**
- Vitest configured with jsdom environment
- React Testing Library installed
- Setup file exists (`setupTests.ts`)
- Test scripts in package.json

**Issues:**
- Unhandled network errors in tests (jsdom/undici issue)
- No coverage threshold configuration
- No component-level tests for UI components

### Components WITHOUT Tests (Critical Gap)

| Component | Priority | Reason |
|-----------|----------|--------|
| `LikeButton.tsx` | HIGH | Contains emoji issue, alert() usage |
| `ReviewCard.tsx` | HIGH | Core component, uses LikeButton |
| `ReviewCardEnhanced.tsx` | MEDIUM | Duplicate of ReviewCard |
| `LoginForm.tsx` | HIGH | Auth flow, form validation |
| `RegisterForm.tsx` | HIGH | Auth flow, form validation |
| `CommentItem.tsx` | MEDIUM | Uses confirm() and alert() |
| `CommentList.tsx` | MEDIUM | List rendering |
| `CommentForm.tsx` | MEDIUM | Form submission |
| `BottomNav.tsx` | LOW | Navigation, uses icons |

---

## 2. CRITICAL ISSUES REQUIRING TEST COVERAGE

### Issue 1: Emoji Usage (Accessibility Problem)

**Files Affected:**
- `/frontend/src/components/review/LikeButton.tsx` (line 75): `❤️` / `🤍`
- `/frontend/src/pages/ReviewDetailPage.tsx` (line 229): `⭐` for ratings
- `/frontend/src/pages/DiscoverPageEnhanced.tsx` (lines 204, 355): `🔥`, `⭐`
- `/frontend/src/components/user/UserProfile.tsx` (lines 170, 177, 181): `📚`, `⭐`, `❤️`

**Test Requirement:**
```typescript
// Test scaffold for LikeButton accessibility
describe('LikeButton', () => {
  it('provides accessible label for screen readers', () => {
    // After fix: verify aria-label exists
    // Verify no emoji in accessible name
  });

  it('communicates state change to assistive technology', () => {
    // Verify aria-pressed or similar attribute
  });
});
```

### Issue 2: Hardcoded localhost URLs

**Files Affected (11 occurrences):**
- `/frontend/src/pages/ReviewDetailPageRedesign.tsx`: lines 178, 291
- `/frontend/src/pages/LoginPage.tsx`: line 144
- `/frontend/src/pages/ReviewDetailPage.tsx`: lines 140, 249
- `/frontend/src/pages/RegisterPage.tsx`: line 171
- `/frontend/src/components/auth/GoogleLoginButton.tsx`: line 19
- `/frontend/src/components/user/EditProfile.tsx`: lines 59, 140
- `/frontend/src/components/user/UserProfile.tsx`: line 114
- `/frontend/src/components/user/UserProfileEnhanced.tsx`: line 128

**Test Requirement:**
```typescript
// Test scaffold for URL configuration
describe('URL Configuration', () => {
  it('uses environment variable for API URL', () => {
    // Mock import.meta.env.VITE_API_URL
    // Verify correct URL is used
  });

  it('falls back to relative URL in production', () => {
    // When VITE_API_URL is undefined
    // Should not contain localhost
  });
});
```

### Issue 3: alert() and confirm() Usage (Not Accessible)

**Files Affected (14 occurrences):**
- `/frontend/src/components/review/LikeButton.tsx`: lines 41, 62
- `/frontend/src/components/comment/CommentItem.tsx`: lines 47, 53
- `/frontend/src/components/comment/CommentItemRedesign.tsx`: lines 44, 51
- `/frontend/src/pages/ReviewDetailPage.tsx`: lines 72, 82, 185, 296
- `/frontend/src/pages/ReviewDetailPageRedesign.tsx`: lines 64, 74, 348
- `/frontend/src/pages/HomePage.tsx`: line 33

**Test Requirement:**
```typescript
// Test scaffold for accessible dialogs
describe('LikeButton - Unauthenticated User', () => {
  it('shows accessible notification instead of alert', () => {
    // Mock unauthenticated state
    // Click like button
    // Verify Toast/Snackbar appears (not alert)
    // Verify role="alert" or aria-live
  });
});

describe('CommentItem - Delete', () => {
  it('shows accessible confirmation dialog', () => {
    // Click delete
    // Verify Dialog component appears
    // Verify focus management
    // Verify keyboard navigation
  });
});
```

### Issue 4: Color Inconsistency (#3498db vs #7C3AED)

**Files Using #3498db (Old Blue):**
- `/frontend/src/components/auth/RegisterForm.tsx`
- `/frontend/src/components/auth/LoginForm.tsx`
- `/frontend/src/components/review/ReviewCard.tsx`
- `/frontend/src/components/layout/Navbar.tsx`
- `/frontend/src/pages/ReviewDetailPage.css`
- `/frontend/src/components/user/UserProfile.css`
- And 6 more CSS files

**Test Approach:**
These are cosmetic changes. No new tests needed, but EXISTING tests must pass after changes.

---

## 3. TESTING STRATEGY RECOMMENDATION

### For Priority 1 Fixes (Color Consistency)

**Approach:** Run existing tests before and after changes

```bash
# Before making changes
npm test -- --run

# Make color changes

# After changes - verify no regressions
npm test -- --run
```

**No new tests needed** - these are pure cosmetic changes that don't affect behavior.

### For Critical Issues (Emoji, URLs, Alerts)

**TDD Approach Required:**

1. **Write failing tests FIRST**
2. **Make minimal changes to pass tests**
3. **Refactor for clarity**

### Test File Structure to Create

```
frontend/src/
  components/
    review/
      __tests__/
        LikeButton.test.tsx      # NEW - Priority HIGH
        ReviewCard.test.tsx      # NEW - Priority HIGH
    auth/
      __tests__/
        LoginForm.test.tsx       # NEW - Priority HIGH
        RegisterForm.test.tsx    # NEW - Priority MEDIUM
    comment/
      __tests__/
        CommentItem.test.tsx     # NEW - Priority MEDIUM
        CommentList.test.tsx     # NEW - Priority LOW
        CommentForm.test.tsx     # NEW - Priority LOW
    layout/
      __tests__/
        BottomNav.test.tsx       # NEW - Priority LOW
  utils/
    __tests__/
      config.test.ts             # NEW - For URL config helper
```

---

## 4. TEST SCAFFOLDS

### LikeButton.test.tsx (Priority: HIGH)

```typescript
// /frontend/src/components/review/__tests__/LikeButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LikeButton from '../LikeButton';
import { AuthContext } from '../../../context/AuthContext';
import * as reviewApi from '../../../services/review.api';

// Mock the API
vi.mock('../../../services/review.api', () => ({
  likeReview: vi.fn(),
  unlikeReview: vi.fn(),
}));

describe('LikeButton', () => {
  const mockAuthContext = {
    user: { id: 'user1', username: 'test' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    loading: false,
    handleOAuthCallback: vi.fn(),
    setUser: vi.fn(),
  };

  const renderWithAuth = (isAuthenticated = true, initialLiked = false) => {
    return render(
      <AuthContext.Provider value={{ ...mockAuthContext, isAuthenticated }}>
        <LikeButton
          reviewId="review1"
          initialLikesCount={5}
          initialLiked={initialLiked}
          onLikeChange={vi.fn()}
        />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has accessible name for screen readers', () => {
      renderWithAuth();
      const button = screen.getByRole('button');
      // After fix: Should have aria-label or visible text
      expect(button).toHaveAccessibleName();
    });

    it('does NOT use emoji as only indicator of state', () => {
      renderWithAuth(true, true);
      const button = screen.getByRole('button');
      // Verify title attribute or aria-label communicates state
      expect(button).toHaveAttribute('title');
    });

    it('communicates liked state via aria attribute', () => {
      renderWithAuth(true, true);
      const button = screen.getByRole('button');
      // After fix: Should have aria-pressed="true"
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // FUNCTIONALITY TESTS
  describe('Like/Unlike Functionality', () => {
    it('calls likeReview when clicking unlliked button', async () => {
      (reviewApi.likeReview as any).mockResolvedValue({
        data: { isLiked: true, likesCount: 6 },
      });

      renderWithAuth(true, false);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(reviewApi.likeReview).toHaveBeenCalledWith('review1');
      });
    });

    it('calls unlikeReview when clicking liked button', async () => {
      (reviewApi.unlikeReview as any).mockResolvedValue({
        data: { isLiked: false, likesCount: 4 },
      });

      renderWithAuth(true, true);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      await waitFor(() => {
        expect(reviewApi.unlikeReview).toHaveBeenCalledWith('review1');
      });
    });

    it('displays correct like count', () => {
      renderWithAuth();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  // UNAUTHENTICATED USER TESTS
  describe('Unauthenticated User', () => {
    it('disables button when not authenticated', () => {
      renderWithAuth(false);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('shows accessible notification instead of alert when unauthenticated', () => {
      // After fix: Should NOT call alert()
      // Instead should show Toast/Snackbar component
      renderWithAuth(false);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      // After implementing Toast:
      // expect(screen.getByRole('alert')).toHaveTextContent('Please login');
    });
  });

  // ERROR HANDLING TESTS
  describe('Error Handling', () => {
    it('shows accessible error message on API failure', async () => {
      (reviewApi.likeReview as any).mockRejectedValue({
        response: { data: { message: 'Error occurred' } },
      });

      renderWithAuth(true, false);
      fireEvent.click(screen.getByRole('button'));

      // After fix: Should show Toast instead of alert
      await waitFor(() => {
        // expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
```

### LoginForm.test.tsx (Priority: HIGH)

```typescript
// /frontend/src/components/auth/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginForm', () => {
  const mockLogin = vi.fn();

  const renderForm = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: null,
          isAuthenticated: false,
          login: mockLogin,
          logout: vi.fn(),
          register: vi.fn(),
          loading: false,
          handleOAuthCallback: vi.fn(),
          setUser: vi.fn(),
        }}>
          <LoginForm />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // FORM RENDERING
  describe('Rendering', () => {
    it('renders email and password inputs', () => {
      renderForm();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders submit button', () => {
      renderForm();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('renders Google login button', () => {
      renderForm();
      // Verify Google OAuth button exists
    });
  });

  // VALIDATION
  describe('Validation', () => {
    it('shows error for empty fields', async () => {
      renderForm();

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/fill in all fields/i);
      });
    });

    it('shows error for invalid email', async () => {
      renderForm();

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
      });
    });
  });

  // SUBMISSION
  describe('Form Submission', () => {
    it('calls login with correct credentials', async () => {
      mockLogin.mockResolvedValue({});
      renderForm();

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
      });
    });

    it('navigates to home on successful login', async () => {
      mockLogin.mockResolvedValue({});
      renderForm();

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('disables submit button while submitting', async () => {
      mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves
      renderForm();

      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
      });
    });
  });

  // ACCESSIBILITY
  describe('Accessibility', () => {
    it('has proper label associations', () => {
      renderForm();
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText(/password/i)).toHaveAttribute('id', 'password');
    });

    it('error message has role="alert"', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
      });
    });
  });
});
```

### config.test.ts (For URL Configuration Fix)

```typescript
// /frontend/src/utils/__tests__/config.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('URL Configuration Helper', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe('getApiUrl', () => {
    it('returns VITE_API_URL when set', async () => {
      vi.stubEnv('VITE_API_URL', 'https://api.production.com');

      const { getApiUrl } = await import('../config');
      expect(getApiUrl()).toBe('https://api.production.com');
    });

    it('returns empty string for relative URLs in production', async () => {
      vi.stubEnv('VITE_API_URL', '');

      const { getApiUrl } = await import('../config');
      expect(getApiUrl()).toBe('');
      expect(getApiUrl()).not.toContain('localhost');
    });
  });

  describe('getImageUrl', () => {
    it('returns full URL for absolute paths', async () => {
      const { getImageUrl } = await import('../config');
      expect(getImageUrl('https://cdn.example.com/image.jpg')).toBe('https://cdn.example.com/image.jpg');
    });

    it('prepends API URL for relative paths', async () => {
      vi.stubEnv('VITE_API_URL', 'https://api.production.com');

      const { getImageUrl } = await import('../config');
      expect(getImageUrl('/uploads/image.jpg')).toBe('https://api.production.com/uploads/image.jpg');
    });

    it('NEVER includes localhost in production', async () => {
      vi.stubEnv('VITE_API_URL', '');
      vi.stubEnv('NODE_ENV', 'production');

      const { getImageUrl } = await import('../config');
      const result = getImageUrl('/uploads/image.jpg');
      expect(result).not.toContain('localhost');
    });
  });
});
```

### CommentItem.test.tsx (Priority: MEDIUM)

```typescript
// /frontend/src/components/comment/__tests__/CommentItem.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CommentItem from '../CommentItem';
import { AuthContext } from '../../../context/AuthContext';
import * as commentApi from '../../../services/comment.api';

vi.mock('../../../services/comment.api');

describe('CommentItem', () => {
  const mockComment = {
    id: 'comment1',
    text: 'Great review!',
    user: { id: 'user1', username: 'testuser', profileImage: '' },
    createdAt: new Date().toISOString(),
  };

  const mockOnDelete = vi.fn();

  const renderWithAuth = (userId = 'user1') => {
    return render(
      <AuthContext.Provider value={{
        user: { id: userId, username: 'testuser' },
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
        loading: false,
        handleOAuthCallback: vi.fn(),
        setUser: vi.fn(),
      }}>
        <CommentItem comment={mockComment} onDelete={mockOnDelete} />
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // RENDERING
  describe('Rendering', () => {
    it('displays comment text', () => {
      renderWithAuth();
      expect(screen.getByText('Great review!')).toBeInTheDocument();
    });

    it('displays username', () => {
      renderWithAuth();
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('shows delete button only for own comments', () => {
      renderWithAuth('user1');
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('hides delete button for other users comments', () => {
      renderWithAuth('user2');
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });
  });

  // DELETE FUNCTIONALITY
  describe('Delete Functionality', () => {
    it('shows accessible confirmation dialog instead of window.confirm', async () => {
      renderWithAuth();

      fireEvent.click(screen.getByRole('button', { name: /delete/i }));

      // After fix: Should show Dialog component
      await waitFor(() => {
        // expect(screen.getByRole('dialog')).toBeInTheDocument();
        // expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
      });
    });

    it('calls deleteComment API on confirmation', async () => {
      (commentApi.deleteComment as any).mockResolvedValue({});
      renderWithAuth();

      // This test will need updating after Dialog implementation
      // Currently uses window.confirm
    });

    it('calls onDelete callback after successful deletion', async () => {
      (commentApi.deleteComment as any).mockResolvedValue({});
      renderWithAuth();

      // After implementing Dialog:
      // fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      // fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      // await waitFor(() => expect(mockOnDelete).toHaveBeenCalledWith('comment1'));
    });
  });

  // ERROR HANDLING
  describe('Error Handling', () => {
    it('shows accessible error message on delete failure', async () => {
      (commentApi.deleteComment as any).mockRejectedValue(new Error('Delete failed'));
      renderWithAuth();

      // After fix: Should show Toast instead of alert
    });
  });

  // TIME FORMATTING
  describe('Time Formatting', () => {
    it('formats recent time as "just now"', () => {
      const recentComment = {
        ...mockComment,
        createdAt: new Date().toISOString(),
      };
      render(
        <AuthContext.Provider value={{ user: null, isAuthenticated: false, login: vi.fn(), logout: vi.fn(), register: vi.fn(), loading: false, handleOAuthCallback: vi.fn(), setUser: vi.fn() }}>
          <CommentItem comment={recentComment} onDelete={mockOnDelete} />
        </AuthContext.Provider>
      );
      expect(screen.getByText('just now')).toBeInTheDocument();
    });
  });
});
```

---

## 5. IMPLEMENTATION RECOMMENDATIONS

### Phase 1: Setup (Before Any Changes)

1. Add coverage configuration to `vite.config.ts`:

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules/', 'src/setupTests.ts'],
    thresholds: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
  },
},
```

2. Add coverage script to `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

3. Run existing tests to establish baseline:

```bash
npm run test:run
```

### Phase 2: Create Utility Module for URLs

Before fixing hardcoded URLs, create and test a helper:

1. Create `/frontend/src/utils/config.ts`:

```typescript
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || '';
};

export const getImageUrl = (path: string): string => {
  if (!path) return '/uploads/profiles/default-avatar.png';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${getApiUrl()}${path}`;
};
```

2. Write tests FIRST (as shown in scaffold above)
3. Run tests - they should pass
4. Then update components to use helper

### Phase 3: Create Toast/Dialog Components

Before fixing alert()/confirm(), create accessible alternatives:

1. Create `/frontend/src/components/ui/Toast.tsx`
2. Create `/frontend/src/components/ui/ConfirmDialog.tsx`
3. Write tests for these components FIRST
4. Then refactor components to use them

### Phase 4: Fix Emoji Issues

1. Write accessibility tests for LikeButton (as shown above)
2. Replace emojis with SVG icons
3. Add proper ARIA attributes
4. Verify tests pass

---

## 6. TESTING COMMANDS

```bash
# Run all tests
npm test

# Run tests once (CI mode)
npm run test:run

# Run specific test file
npm test -- LikeButton.test.tsx

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm test

# Run tests matching pattern
npm test -- --grep "accessibility"
```

---

## 7. FINAL HANDOFF SUMMARY

### Tests to Write BEFORE Making Changes

| Test File | For Component | Priority | Blocks |
|-----------|---------------|----------|--------|
| `LikeButton.test.tsx` | LikeButton.tsx | HIGH | Emoji fix, alert fix |
| `LoginForm.test.tsx` | LoginForm.tsx | HIGH | Color consistency |
| `config.test.ts` | New utility | HIGH | URL hardcoding fix |
| `CommentItem.test.tsx` | CommentItem.tsx | MEDIUM | confirm/alert fix |
| `ReviewCard.test.tsx` | ReviewCard.tsx | MEDIUM | Color consistency |

### Changes That DON'T Need New Tests

1. **Color changes (#3498db to #7C3AED)** - Run existing tests, verify they pass
2. **Font changes** - Visual only, no new tests needed
3. **CSS file consolidation** - Verify existing tests pass

### Changes That DO Need New Tests

1. **Emoji replacement** - Accessibility tests required
2. **URL configuration** - Unit tests for helper function
3. **alert() replacement** - Tests for Toast component
4. **confirm() replacement** - Tests for Dialog component

### Recommended Order of Implementation

1. Add coverage configuration
2. Write `config.test.ts` and implement URL helper
3. Write `LikeButton.test.tsx`
4. Fix emoji and alert issues in LikeButton
5. Write remaining component tests
6. Make color changes (verify existing tests pass)
7. Run full test suite with coverage

---

**HANDOFF TO: Implementation Agent**

The Implementation Agent should:
1. Follow TDD approach: Write tests FIRST
2. Use the scaffolds provided as starting points
3. Run tests after each change
4. Maintain 60%+ coverage (aiming for 80%+)
5. Focus on accessibility improvements

---

*Generated by TDD Guide Agent*
*Date: 2026-02-14*
