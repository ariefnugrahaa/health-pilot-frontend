# Testing Guide

## Test Setup

This project uses Vitest for testing with React Testing Library.

### Install Test Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest @vitest/ui jsdom @vitejs/plugin-react
```

### Test Configuration
- **vitest.config.ts** - Vitest configuration
- **vitest.setup.ts** - Test setup with ResizeObserver polyfill
- **package.json** - Test scripts added

## Running Tests

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run specific test file
npm run test:run -- infinite-loop

# Run tests matching a pattern
npm run test:run -- checkbox
```

## Test Structure

```
src/
├── components/
│   └── intake/
│       └── dynamic/
│           ├── __tests__/
│           │   ├── infinite-loop.test.tsx  # Critical: Tests for infinite loop bug
│           │   ├── DynamicStep.test.tsx      # Component tests
│           │   └── DynamicWizard.test.tsx    # Integration tests
```

## Critical Tests

### Infinite Loop Prevention Tests
**File:** `src/components/intake/dynamic/__tests__/infinite-loop.test.tsx`

These tests verify that the checkbox infinite loop bug is fixed:

1. ✅ **CRITICAL TEST**: Should not cause infinite loop when clicking checkboxes
2. ✅ Verify useEffect only depends on step.id, not data
3. ✅ Handle rapid checkbox clicks without crashing
4. ✅ Verify form only resets on step change, not data change

**Run these tests:**
```bash
npm run test:run -- infinite-loop
```

### Expected Results
```
✓ CRITICAL TEST: Should not cause infinite loop when clicking checkboxes (Issue from Step 3)
✓ should verify useEffect only depends on step.id, not data
✓ should handle rapid checkbox clicks without crashing
✓ should verify the fix: form only resets on step change, not data change

Test Files: 1 passed (1)
Tests: 4 passed (4)
```

## Test Coverage

### What's Tested

1. **Component Behavior**
   - Checkbox check/uncheck
   - Multiple selection
   - Form state management
   - Step navigation

2. **Bug Prevention**
   - Infinite loop detection
   - Render count tracking
   - State update patterns
   - useEffect dependencies

3. **Integration**
   - Multi-step form flow
   - Data accumulation
   - Parent-child component interaction
   - AI summary generation

### What's Not Tested

- API endpoints (backend tests)
- Visual styling (snapshot tests not implemented)
- Accessibility (not covered yet)
- Performance benchmarks (basic render counting only)

## Writing New Tests

### Example Test

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should handle user interaction', async () => {
    render(<MyComponent />)
    const user = userEvent.setup()

    const button = screen.getByText('Click me')
    await user.click(button)

    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Best Practices

1. **Use userEvent** instead of fireEvent for more realistic interactions
2. **Wait for assertions** using `waitFor()` for async operations
3. **Query by accessible text** using `getByText()`, `getByRole()`
4. **Avoid implementation details** - test behavior, not internals
5. **Mock external dependencies** - API calls, browser APIs

## Troubleshooting

### ResizeObserver Errors

If you see "ResizeObserver is not defined" errors:
- Ensure `vitest.setup.ts` is configured correctly
- Check that ResizeObserver polyfill is loaded

### Timeout Errors

If tests timeout:
- Increase timeout: `waitFor(() => {}, { timeout: 5000 })`
- Check for infinite loops in component code
- Verify async operations complete properly

### Component Not Found

If `getByText()` can't find elements:
- Verify component renders correctly
- Check for conditional rendering
- Use `waitFor()` to wait for async rendering
- Try `queryByText()` for optional elements

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:run
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [User Event](https://testing-library.com/docs/user-event/intro)
