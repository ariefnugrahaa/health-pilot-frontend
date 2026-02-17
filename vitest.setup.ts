import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Polyfill ResizeObserver for Radix UI components
class ResizeObserverMock {
  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
}

global.ResizeObserver = ResizeObserverMock as any

afterEach(() => {
  cleanup()
})
