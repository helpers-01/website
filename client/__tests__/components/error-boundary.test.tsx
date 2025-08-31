import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '@/components/error-boundary'

// Component that throws an error
function ErrorComponent() {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  afterEach(() => {
    consoleSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error fallback when error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
  })

  it('calls resetError when Try Again is clicked', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    const tryAgainButton = screen.getByText('Try Again')
    fireEvent.click(tryAgainButton)

    // After reset, the error should be cleared
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('shows error details in development mode', () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Test error')).toBeInTheDocument()

    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })
})