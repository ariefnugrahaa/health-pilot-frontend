import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { IntakeStep } from '@/types/intake'

// Create a mock step with checkboxes for testing
export const createMockCheckboxStep = (overrides?: Partial<IntakeStep>): IntakeStep => ({
  id: 'step-checkbox',
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

// Helper to track render counts
export function useRenderCounter() {
  const renders = React.useRef(0)
  React.useEffect(() => {
    renders.current++
  })
  return renders.current
}

// Helper to detect infinite loops
export function detectInfiniteLoop(
  renderCount: number,
  threshold: number = 100
): boolean {
  return renderCount > threshold
}

// Custom render function with common providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options)
}
