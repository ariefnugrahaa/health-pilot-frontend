# Manual Testing Guide - Checkbox Infinite Loop Fix

## Critical Test: Step 3 Checkbox Interaction

### Test Scenario
Navigate to Step 3 (Lifestyle Information) and test checkbox interactions.

### Expected Behavior (Before Fix)
- ❌ App freezes or crashes when clicking checkboxes
- ❌ "Maximum update depth exceeded" error in console
- ❌ Browser becomes unresponsive

### Expected Behavior (After Fix)
- ✅ Checkboxes toggle smoothly when clicked
- ✅ Multiple checkboxes can be selected
- ✅ No console errors
- ✅ Form submits successfully

### Manual Test Steps

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Navigate to Step 3**
   - Go to http://localhost:3000/intake
   - Fill out Steps 1 and 2 (basic info)
   - Click Continue until you reach Step 3

3. **Test Checkbox Clicking**
   - Click on "I smoke or use tobacco products"
   - Verify: Background turns green, checkmark appears
   - Click again to uncheck
   - Verify: Background returns to white, checkmark disappears

4. **Test Multiple Selection**
   - Click on multiple options (smoking, alcohol, sedentary, stress)
   - Verify: All selected items show green background
   - Uncheck several items
   - Verify: Items uncheck properly

5. **Test Rapid Clicking**
   - Rapidly click the same checkbox 5-10 times
   - Verify: No lag, no freezing, no errors

6. **Check Console**
   - Open browser DevTools (F12)
   - Check Console tab
   - Verify: NO "Maximum update depth exceeded" error
   - Verify: NO React warnings about infinite loops

7. **Submit Form**
   - Select several options
   - Click Continue
   - Verify: Form submits and moves to next step

### Success Criteria

✅ **All checkboxes work smoothly**
✅ **No freezing or lag**
✅ **No console errors**
✅ **Multiple selections work**
✅ **Form submits successfully**

## Automated Tests

Run the automated test suite:

```bash
# Run only the critical infinite loop tests
npm run test:run -- infinite-loop

# Expected output:
# ✓ CRITICAL TEST: Should not cause infinite loop when clicking checkboxes
# ✓ should verify useEffect only depends on step.id, not data
# ✓ should handle rapid checkbox clicks without crashing
# ✓ should verify the fix: form only resets on step change, not data change
#
# Test Files: 1 passed (1)
# Tests: 4 passed (4)
```

## Performance Verification

The tests track render counts to ensure no infinite loop:

- **Normal behavior**: 2-5 renders per checkbox click
- **Infinite loop**: 100+ renders (would cause test to fail)
- **Test threshold**: Fail if >20 renders per interaction

## What Was Fixed

1. **useEffect Dependencies**: Changed from `[step, data, reset]` to `[step.id, reset]`
   - Prevents form reset when data changes
   - Only resets when step changes

2. **Duplicate Click Handler**: Removed `onClick` from checkbox container div
   - Prevents double state updates
   - Label already handles clicks properly

## Files Changed

- `src/components/intake/dynamic/DynamicStep.tsx`
  - Line 28-32: Fixed useEffect dependencies
  - Line 136: Removed duplicate onClick handler
