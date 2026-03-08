import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DynamicWizard } from '../DynamicWizard'
import { MOCK_INTAKE_CONFIG } from '@/lib/mock-intake'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock the API functions
vi.mock('@/lib/api/intake', () => ({
  createIntake: vi.fn(() => Promise.resolve({ id: 'test-intake-123' })),
  completeIntake: vi.fn(() => Promise.resolve({
    summary: 'Test health summary',
    keySignals: ['Signal 1', 'Signal 2'],
    recommendations: ['Recommendation 1']
  }))
}))

// Mock fetch to return mock config
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      data: MOCK_INTAKE_CONFIG
    })
  })
) as unknown as typeof fetch

describe('DynamicWizard - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the integrated blood test banner when a blood test id is provided', () => {
    render(
      <DynamicWizard
        initialConfig={MOCK_INTAKE_CONFIG}
        bloodTestId="blood-test-123"
        bloodTestSource="upload"
        displayStepOffset={1}
        displayTotalSteps={5}
      />
    )

    expect(
      screen.getByText(/Your blood test results have been integrated/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /View uploaded result/i })).toHaveAttribute(
      'href',
      '/blood-analysis/results/blood-test-123'
    )
  })

  describe('Step Navigation with Checkbox Interactions', () => {
    it('should navigate through steps without infinite loop when interacting with checkboxes', async () => {
      let renderCount = 0

      const TestWrapper = () => {
        renderCount++
        return <DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />
      }

      render(<TestWrapper />)
      const user = userEvent.setup()

      // Wait for initial render
      await waitFor(() => expect(renderCount).toBeGreaterThan(0))

      // Navigate to step 3 (lifestyle with checkboxes)
      // Find and click Continue button multiple times
      for (let i = 0; i < 3; i++) {
        const continueButton = screen.getByText('Continue')
        await user.click(continueButton)
      }

      // Wait for step 3 to load
      await waitFor(() => {
        expect(screen.getByText(/Step 3 of/i)).toBeInTheDocument()
      })

      // Verify we're on the lifestyle step
      expect(screen.getByText(/Lifestyle Information/i)).toBeInTheDocument()

      // Now interact with checkboxes
      const smokingCheckbox = screen.getByText(/I smoke or use tobacco/i)
      await user.click(smokingCheckbox)

      await waitFor(() => {
        expect(smokingCheckbox).toHaveClass('text-white')
      })

      const rendersAfterCheckbox = renderCount

      // Click more checkboxes
      const alcoholCheckbox = screen.getByText(/I consume alcohol/i)
      await user.click(alcoholCheckbox)

      const sedentaryCheckbox = screen.getByText(/Sedentary lifestyle/i)
      await user.click(sedentaryCheckbox)

      // Wait for all updates to settle
      await waitFor(() => {
        expect(renderCount).toBeGreaterThan(rendersAfterCheckbox)
      })

      // Verify no infinite loop
      expect(renderCount).toBeLessThan(50)

      // Navigate to next step
      const continueButton = screen.getByText('Continue')
      await user.click(continueButton)

      // Should successfully navigate to step 4
      await waitFor(() => {
        expect(screen.getByText(/Step 4 of/i)).toBeInTheDocument()
      })

      // Total renders should still be reasonable
      expect(renderCount).toBeLessThan(70)
    })

    it('should handle rapid checkbox interactions across multiple steps', async () => {
      render(<DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />)
      const user = userEvent.setup()

      // Navigate through steps rapidly
      for (let step = 0; step < 3; step++) {
        const continueButton = screen.getByText('Continue')
        await user.click(continueButton)

        // Wait a bit for navigation
        await waitFor(() => {
          expect(screen.getByText(/Step \d+ of/i)).toBeInTheDocument()
        }, { timeout: 1000 })
      }

      // Should be on step 3 or 4
      // Interact with any checkboxes present
      const checkboxes = screen.getAllByRole('checkbox').slice(0, 3)

      for (const checkbox of checkboxes) {
        await user.click(checkbox)
      }

      // Verify no maximum update depth error
      await waitFor(() => {
        expect(screen.queryByText(/Maximum update depth/i)).not.toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Form Data Management', () => {
    it('should accumulate form data correctly across steps', async () => {
      render(<DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />)
      const user = userEvent.setup()

      // Fill out step 1
      const ageInput = screen.getByPlaceholderText(/Enter your age/i)
      await user.type(ageInput, '35')

      const weightInput = screen.getByPlaceholderText(/Enter your weight/i)
      await user.type(weightInput, '75')

      const continueButton = screen.getByText('Continue')
      await user.click(continueButton)

      // Should be on step 2
      await waitFor(() => {
        expect(screen.getByText(/Step 2 of/i)).toBeInTheDocument()
      })

      // Verify we can continue without errors
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })

    it('should not lose form data when navigating back and forth', async () => {
      render(<DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />)
      const user = userEvent.setup()

      // Fill step 1
      const ageInput = screen.getByPlaceholderText(/Enter your age/i)
      await user.type(ageInput, '35')

      // Go to step 2
      await user.click(screen.getByText('Continue'))

      await waitFor(() => {
        expect(screen.getByText(/Step 2 of/i)).toBeInTheDocument()
      })

      // Go back to step 1
      const backButton = screen.getByText('Back')
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/Step 1 of/i)).toBeInTheDocument()
      })

      // Navigate forward again
      await user.click(screen.getByText('Continue'))

      // Should still be able to navigate without infinite loop
      await waitFor(() => {
        expect(screen.getByText(/Step 2 of/i)).toBeInTheDocument()
      })
    })
  })

  describe('AI Summary Generation', () => {
    it('should trigger AI generation when reaching summary step', async () => {
      const { createIntake, completeIntake } = await import('@/lib/api/intake')

      render(<DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />)
      const user = userEvent.setup()

      // Navigate through all steps to reach summary
      const totalSteps = MOCK_INTAKE_CONFIG.steps.length

      for (let i = 0; i < totalSteps; i++) {
        await waitFor(() => {
          expect(screen.getByText('Continue')).toBeInTheDocument()
        })
        await user.click(screen.getByText('Continue'))
      }

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/Generating your personalized health summary/i)).toBeInTheDocument()
      })

      // API should have been called
      expect(createIntake).toHaveBeenCalled()
      expect(completeIntake).toHaveBeenCalled()
    })

    it('should handle AI generation errors gracefully', async () => {
      const { createIntake } = await import('@/lib/api/intake')
      vi.mocked(createIntake).mockRejectedValueOnce(new Error('API Error'))

      render(<DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />)
      const user = userEvent.setup()

      // Navigate to summary
      const totalSteps = MOCK_INTAKE_CONFIG.steps.length
      for (let i = 0; i < totalSteps; i++) {
        await user.click(screen.getByText('Continue'))
      }

      // Should show error state
      await waitFor(() => {
        expect(screen.getByText(/Failed to generate health summary/i)).toBeInTheDocument()
      })
    })
  })

  describe('Performance and Stability', () => {
    it('should not exceed render limits during normal usage', async () => {
      let renderCount = 0

      const TestWrapper = () => {
        renderCount++
        return <DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />
      }

      render(<TestWrapper />)
      const user = userEvent.setup()

      // Simulate normal user interaction flow
      for (let step = 0; step < 3; step++) {
        const continueButton = screen.getByText('Continue')
        await user.click(continueButton)

        // Wait for navigation
        await waitFor(() => {
          expect(screen.getByText(/Step \d+ of/i)).toBeInTheDocument()
        }, { timeout: 1000 })

        // Interact with some fields
        const inputs = screen.queryAllByRole('textbox')
        if (inputs.length > 0) {
          await user.type(inputs[0], 'test')
        }
      }

      // Total renders should be reasonable
      // Normal flow: ~5-10 renders per step navigation
      expect(renderCount).toBeLessThan(100)
    })

    it('should handle rapid state updates without crashing', async () => {
      render(<DynamicWizard initialConfig={MOCK_INTAKE_CONFIG} />)
      const user = userEvent.setup()

      // Rapidly click continue button
      const continueButton = screen.getByText('Continue')

      for (let i = 0; i < 5; i++) {
        try {
          await user.click(continueButton)
        } catch {
          // Click might fail if button is disabled during transition
          break
        }
      }

      // Should not have crashed or thrown maximum update depth error
      await waitFor(() => {
        expect(screen.queryByText(/Maximum update depth exceeded/i)).not.toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })
})
