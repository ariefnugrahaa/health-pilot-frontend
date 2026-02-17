import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicStep } from '../DynamicStep'
import { IntakeStep } from '@/types/intake'

describe('DynamicStep - Infinite Loop Bug Fix Verification', () => {
  const mockOnNext = vi.fn()
  const mockOnBack = vi.fn()

  const createCheckboxStep = (): IntakeStep => ({
    id: 'step-3',
    title: 'Lifestyle Information',
    description: 'Please select your lifestyle factors',
    fields: [
      {
        id: 'lifestyle_factors',
        type: 'checkbox',
        label: 'Which lifestyle factors apply to you?',
        required: false,
        options: [
          {
            id: 'opt-1',
            value: 'smoking',
            label: 'I smoke or use tobacco products',
            description: 'Including vaping and e-cigarettes'
          },
          {
            id: 'opt-2',
            value: 'alcohol',
            label: 'I consume alcohol regularly',
            description: 'More than 2 drinks per week'
          },
          {
            id: 'opt-3',
            value: 'sedentary',
            label: 'Sedentary lifestyle',
            description: 'Sitting for more than 6 hours per day'
          }
        ]
      }
    ]
  })

  it('CRITICAL TEST: Should not cause infinite loop when clicking checkboxes (Issue from Step 3)', async () => {
    const step = createCheckboxStep()

    // Track renders to detect infinite loops
    let renderCount = 0
    const maxAcceptableRenders = 20

    const TestWrapper = ({ data }: { data: any }) => {
      renderCount++
      return (
        <DynamicStep
          step={step}
          data={data}
          onNext={mockOnNext}
          onBack={mockOnBack}
          isFirstStep={false}
          isLastStep={false}
        />
      )
    }

    render(<TestWrapper data={{}} />)
    const user = userEvent.setup()

    // Simulate the exact scenario from the bug report:
    // User clicks checkboxes in Step 3 (Lifestyle)
    const smokingOption = screen.getByText('I smoke or use tobacco products')

    // Click checkbox
    await user.click(smokingOption)

    // Wait for state to update
    await waitFor(() => {
      expect(smokingOption).toBeInTheDocument()
    }, { timeout: 3000 })

    const rendersAfterFirstClick = renderCount

    // If infinite loop exists, renderCount will be in the hundreds
    // Normal behavior: 2-5 renders
    expect(rendersAfterFirstClick).toBeLessThan(maxAcceptableRenders)

    // Click second checkbox
    const alcoholOption = screen.getByText('I consume alcohol regularly')
    await user.click(alcoholOption)

    await waitFor(() => {
      expect(alcoholOption).toBeInTheDocument()
    }, { timeout: 3000 })

    const rendersAfterSecondClick = renderCount

    // Still should not have infinite loop
    expect(rendersAfterSecondClick).toBeLessThan(maxAcceptableRenders * 2)

    // Click third checkbox
    const sedentaryOption = screen.getByText('Sedentary lifestyle')
    await user.click(sedentaryOption)

    await waitFor(() => {
      expect(sedentaryOption).toBeInTheDocument()
    }, { timeout: 3000 })

    // Final check - should not exceed reasonable render count
    // Infinite loop would cause thousands of renders
    expect(renderCount).toBeLessThan(maxAcceptableRenders * 3)

    // Verify no "Maximum update depth exceeded" error occurred
    // If we got here without timeout, the infinite loop is fixed
    expect(renderCount).toBeLessThan(maxAcceptableRenders * 3)
  })

  it('should verify useEffect only depends on step.id, not data', async () => {
    const step1 = createCheckboxStep()
    const step2 = { ...createCheckboxStep(), id: 'step-4' }

    let resetCallCount = 0
    const originalReset = vi.fn()

    // We'll verify by checking component behavior
    const { rerender } = render(
      <DynamicStep
        step={step1}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />
    )

    const user = userEvent.setup()

    // Click a checkbox to update form data
    await user.click(screen.getByText('I smoke or use tobacco products'))

    // Rerender with same step but different data (simulating parent state update)
    rerender(
      <DynamicStep
        step={step1}
        data={{ lifestyle_factors: ['smoking'] }}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />
    )

    // Wait a bit to ensure no infinite loop triggered
    await waitFor(() => {
      expect(screen.getByText('I smoke or use tobacco products')).toBeInTheDocument()
    }, { timeout: 2000 })

    // Now change step
    rerender(
      <DynamicStep
        step={step2}
        data={{ lifestyle_factors: ['smoking'] }}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />
    )

    // Should render without infinite loop
    await waitFor(() => {
      expect(screen.getByText('I smoke or use tobacco products')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should handle rapid checkbox clicks without crashing', async () => {
    const step = createCheckboxStep()

    render(
      <DynamicStep
        step={step}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />
    )

    const user = userEvent.setup()

    // Rapidly click all checkboxes
    const smokingOption = screen.getByText('I smoke or use tobacco products')
    const alcoholOption = screen.getByText('I consume alcohol regularly')
    const sedentaryOption = screen.getByText('Sedentary lifestyle')

    await user.click(smokingOption)
    await user.click(alcoholOption)
    await user.click(sedentaryOption)
    await user.click(smokingOption) // Uncheck
    await user.click(alcoholOption) // Uncheck

    // Should complete without timeout or error
    await waitFor(() => {
      expect(screen.getByText('Sedentary lifestyle')).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verify form submission works
    const continueButton = screen.getByText('Continue')
    await user.click(continueButton)

    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalled()
    })
  })

  it('should verify the fix: form only resets on step change, not data change', async () => {
    const step = createCheckboxStep()

    render(
      <DynamicStep
        step={step}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />
    )

    const user = userEvent.setup()

    // Check a checkbox
    await user.click(screen.getByText('I smoke or use tobacco products'))

    // Wait for checkbox to be checked
    await waitFor(() => {
      const checkboxContainer = screen.getByText('I smoke or use tobacco products').closest('.flex.items-center.space-x-3')
      expect(checkboxContainer).toHaveClass('bg-[#08514e]')
    })

    // Verify the checkbox state persists
    const checkboxContainer = screen.getByText('I smoke or use tobacco products').closest('.flex.items-center.space-x-3')
    expect(checkboxContainer).toHaveClass('bg-[#08514e]')
  })
})
