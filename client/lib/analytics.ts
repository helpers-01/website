// Analytics and Performance Monitoring
import { reportError } from './sentry'

// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    })

    window.gtag = gtag
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    })
  }
}

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track user interactions
export const trackUserAction = (action: string, details?: Record<string, any>) => {
  trackEvent(action, 'user_interaction', JSON.stringify(details))
}

// Track performance metrics
export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'web_vitals', metric, value)
}

// Track errors
export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent('error', 'application_error', error.message)
  reportError(error, context)
}

// Web Vitals tracking
export const trackWebVitals = (metric: any) => {
  trackPerformance(metric.name, Math.round(metric.value))
}

// Custom analytics for business metrics
export const trackBusinessMetric = (
  metric: string,
  value: number,
  metadata?: Record<string, any>
) => {
  trackEvent('business_metric', metric, JSON.stringify(metadata), value)
}

// User engagement tracking
export const trackEngagement = (action: string, duration?: number) => {
  trackEvent('engagement', action, undefined, duration)
}

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number) => {
  trackEvent('conversion', conversionType, undefined, value)
}

// E-commerce tracking (for future use)
export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'INR',
      items: items,
    })
  }
}

// Session tracking
export const trackSessionStart = () => {
  trackEvent('session_start', 'user_session')
}

export const trackSessionEnd = (duration: number) => {
  trackEvent('session_end', 'user_session', undefined, duration)
}

// Feature usage tracking
export const trackFeatureUsage = (feature: string, action: string) => {
  trackEvent('feature_usage', feature, action)
}

// Type definitions for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}