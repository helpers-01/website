'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

function ErrorBoundary({ children, fallback: FallbackComponent }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    // Only add event listeners on the client side
    if (typeof window === 'undefined') return

    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by boundary:', event.error)
      setHasError(true)
      setError(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      setHasError(true)
      setError(new Error(event.reason?.toString() || 'Unhandled promise rejection'))
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const resetError = () => {
    setHasError(false)
    setError(undefined)
  }

  if (hasError) {
    if (FallbackComponent) {
      return <FallbackComponent error={error} resetError={resetError} />
    }

    return <DefaultErrorFallback error={error} resetError={resetError} />
  }

  return <>{children}</>
}

function DefaultErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-border p-6 text-center">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-error" />
        </div>

        <h1 className="text-2xl font-bold text-textPrimary mb-2">Something went wrong</h1>

        <p className="text-textSecondary mb-6">
          We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-surface rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-textPrimary mb-2">Error Details (Development)</h3>
            <pre className="text-sm text-textSecondary whitespace-pre-wrap break-words">
              {error.message}
            </pre>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={resetError}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  )
}

// Hook for functional components to use error boundaries
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    console.error('Error handled by hook:', error, errorInfo)
    // You can integrate with error reporting services here
    // Example: Sentry.captureException(error)
  }
}

export default ErrorBoundary