import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: process.env.NODE_ENV === 'development',
    replaysOnErrorSampleRate: 1.0,

    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // You can remove this option if you're not planning to use the Sentry Session Replay feature:
    integrations: [
      // Replay integration removed for compatibility
    ],

    // Performance monitoring
    enabled: process.env.NODE_ENV === 'production',
  })
}

// Error reporting utility
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: {
        component: 'client',
        environment: process.env.NODE_ENV,
      },
      extra: context,
    })
  } else {
    console.error('Error reported:', error, context)
  }
}

// Performance monitoring
// export const startTransaction = (name: string, op: string) => {
//   if (SENTRY_DSN) {
//     return Sentry.startTransaction({
//       name,
//       op,
//     })
//   }
//   return null
// }

// User tracking
export const setUser = (user: { id: string; email?: string; role?: string }) => {
  if (SENTRY_DSN) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    })
  }
}

export { Sentry }