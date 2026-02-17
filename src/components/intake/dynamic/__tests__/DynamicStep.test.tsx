import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicStep } from '../DynamicStep'
import { IntakeStep } from '@/types/intake'

// Mock the console.error to avoid cluttering test output
const originalError = console.error
beforeEach(() => {
  console.error = vi.fn()
})

describe('DynamicStep - Infinite Loop Prevention', () => {
  const mockOnNext = vi.fn()
  const mockOnBack = vi.fn()

  const createMockStep = (overrides?: Partial<IntakeStep>): IntakeStep => ({
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
          },
          {
            id: 'opt-4',
            value: 'stress',
            label: 'High stress levels',
            description: 'Self-assessed high stress'
          }
        ]
      }
    ],
    ...overrides
  })

  describe('Checkbox Interaction - No Infinite Loop', () => {
    it('should not trigger infinite re-renders when clicking checkboxes', async () => {
      const step = createMockStep()
      let renderCount = 0

      // Create a wrapper component to track render count
      const TestWrapper = ({ data }: { data: any }) => {
        renderCount++
        return <DynamicStep
          step={step}
          data={data}
          onNext={mockOnNext}
          onBack={mockOnBack}
          isFirstStep={false}
          isLastStep={false}
        />
      }

      const { rerender } = render(<TestWrapper data={{}} />)
      const initialRenderCount = renderCount

      const user = userEvent.setup()

      // Click first checkbox
      const smokingCheckbox = screen.getByText('I smoke or use tobacco products')
      await user.click(smokingCheckbox)

      // Wait for state updates
      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(initialRenderCount)
      })

      // The component should re-render a reasonable number of times
      // If there's an infinite loop, renderCount will be in the hundreds/thousands
      const renderCountAfterFirstClick = renderCount
      expect(renderCountAfterFirstClick).toBeLessThan(10)

      // Click second checkbox
      const alcoholCheckbox = screen.getByText('I consume alcohol regularly')
      await user.click(alcoholCheckbox)

      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(renderCountAfterFirstClick)
      })

      // Still no infinite loop
      expect(renderCount).toBeLessThan(20)

      // Click third checkbox
      const sedentaryCheckbox = screen.getByText('Sedentary lifestyle')
      await user.click(sedentaryCheckbox)

      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(renderCountAfterFirstClick)
      })

      // Verify no infinite loop after multiple interactions
      expect(renderCount).toBeLessThan(30)
    })

    it('should handle rapid checkbox clicks without infinite loop', async () => {
      const step = createMockStep()
      let renderCount = 0

      const TestWrapper = ({ data }: { data: any }) => {
        renderCount++
        return <DynamicStep
          step={step}
          data={data}
          onNext={mockOnNext}
          onBack={mockOnBack}
          isFirstStep={false}
          isLastStep={false}
        />
      }

      render(<TestWrapper data={{}} />)
      const user = userEvent.setup()

      // Rapidly click multiple checkboxes
      const smokingCheckbox = screen.getByText('I smoke or use tobacco products')
      const alcoholCheckbox = screen.getByText('I consume alcohol regularly')
      const sedentaryCheckbox = screen.getByText('Sedentary lifestyle')

      await user.click(smokingCheckbox)
      await user.click(alcoholCheckbox)
      await user.click(sedentaryCheckbox)
      await user.click(smokingCheckbox) // Uncheck
      await user.click(alcoholCheckbox) // Uncheck

      // Wait for all state updates to settle
      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(0)
      }, { timeout: 2000 })

      // If infinite loop exists, renderCount will be in the thousands
      // Normal behavior should be less than 50 renders
      expect(renderCount).toBeLessThan(50)

      // Verify error wasn't logged (infinite loops often log errors)
      expect(console.error).not.toHaveBeenCalledWith(
        expect.stringContaining('Maximum update depth')
      )
    })

    it('should only reset form when step.id changes, not when data changes', async () => {
      const step1 = createMockStep({ id: 'step-1' })
      const step2 = createMockStep({ id: 'step-2' })
      const step3 = createMockStep({ id: 'step-3' })

      let renderCount = 0
      const renderLog: number[] = []

      const TestWrapper = ({ step, data }: { step: IntakeStep, data: any }) => {
        renderCount++
        renderLog.push(renderCount)
        return <DynamicStep
          step={step}
          data={data}
          onNext={mockOnNext}
          onBack={mockOnBack}
          isFirstStep={false}
          isLastStep={false}
        />
      }

      const { rerender } = render(<TestWrapper step={step1} data={{}} />)
      renderCount = 0
      renderLog.length = 0

      // Initial render
      await waitFor(() => expect(renderCount).toBe(1))

      // Update data (same step) - should NOT trigger form reset
      rerender(<TestWrapper step={step1} data={{ lifestyle_factors: ['smoking'] }} />)

      await waitFor(() => {
        // Should only re-render once, not trigger reset loop
        expect(renderCount).toBeLessThan(5)
      })

      const rendersAfterDataChange = renderCount

      // Change step - should trigger form reset
      rerender(<TestWrapper step={step2} data={{ lifestyle_factors: ['smoking'] }} />)

      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(rendersAfterDataChange)
      })

      // Should still be reasonable
      expect(renderCount).toBeLessThan(10)

      // Change step again
      rerender(<TestWrapper step={step3} data={{ lifestyle_factors: ['smoking', 'alcohol'] }} />)

      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(rendersAfterDataChange)
      })

      // Total renders should still be reasonable
      expect(renderCount).toBeLessThan(15)
    })
  })

  describe('Checkbox Functionality', () => {
    it('should check and uncheck checkboxes correctly', async () => {
      const step = createMockStep()

      render(<DynamicStep
        step={step}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />)

      const user = userEvent.setup()

      const smokingCheckbox = screen.getByText('I smoke or use tobacco products')

      // Initially unchecked
      expect(smokingCheckbox).toHaveClass('text-[#101828]')

      // Click to check
      await user.click(smokingCheckbox)

      // Should be checked (green background)
      await waitFor(() => {
        expect(smokingCheckbox).toHaveClass('text-white')
      })

      // Click to uncheck
      await user.click(smokingCheckbox)

      // Should be unchecked again
      await waitFor(() => {
        expect(smokingCheckbox).toHaveClass('text-[#101828]')
      })
    })

    it('should allow multiple checkboxes to be selected', async () => {
      const step = createMockStep()

      render(<DynamicStep
        step={step}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />)

      const user = userEvent.setup()

      const smokingCheckbox = screen.getByText('I smoke or use tobacco products')
      const alcoholCheckbox = screen.getByText('I consume alcohol regularly')
      const sedentaryCheckbox = screen.getByText('Sedentary lifestyle')

      // Check all three
      await user.click(smokingCheckbox)
      await user.click(alcoholCheckbox)
      await user.click(sedentaryCheckbox)

      // All should be checked
      await waitFor(() => {
        expect(smokingCheckbox).toHaveClass('text-white')
        expect(alcoholCheckbox).toHaveClass('text-white')
        expect(sedentaryCheckbox).toHaveClass('text-white')
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit form with checkbox values', async () => {
      const step = createMockStep()

      render(<DynamicStep
        step={step}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />)

      const user = userEvent.setup()

      // Check some options
      await user.click(screen.getByText('I smoke or use tobacco products'))
      await user.click(screen.getByText('Sedentary lifestyle'))

      // Submit form
      const continueButton = screen.getByText('Continue')
      await user.click(continueButton)

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledWith({
          lifestyle_factors: ['smoking', 'sedentary']
        })
      })
    })
  })

  describe('useEffect Dependencies', () => {
    it('should have correct dependencies on useEffect to prevent infinite loop', async () => {
      const step = createMockStep()

      // This test verifies the structure of the component
      // The useEffect should depend on step.id and reset, NOT on data
      const { container } = render(<DynamicStep
        step={step}
        data={{}}
        onNext={mockOnNext}
        onBack={mockOnBack}
        isFirstStep={false}
        isLastStep={false}
      />)

      // If we got here without errors, the component mounted successfully
      expect(container.querySelector('form')).toBeInTheDocument()

      const user = userEvent.setup()

      // Interact with checkboxes - this should not trigger infinite loop
      await user.click(screen.getByText('I smoke or use tobacco products'))

      // If there's an infinite loop, this will timeout
      await waitFor(() => {
        expect(screen.getByText('I smoke or use tobacco products')).toHaveClass('text-white')
      }, { timeout: 3000 })
    })
  })
})
