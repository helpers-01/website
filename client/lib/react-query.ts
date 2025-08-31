import { QueryClient } from '@tanstack/react-query'

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// Query keys for consistent caching
export const queryKeys = {
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  providers: ['providers'] as const,
  provider: (id: string) => ['providers', id] as const,
  services: ['services'] as const,
  service: (id: string) => ['services', id] as const,
  bookings: ['bookings'] as const,
  booking: (id: string) => ['bookings', id] as const,
  userBookings: (userId: string) => ['bookings', 'user', userId] as const,
  providerBookings: (providerId: string) => ['bookings', 'provider', providerId] as const,
  reviews: ['reviews'] as const,
  serviceReviews: (serviceId: string) => ['reviews', 'service', serviceId] as const,
  categories: ['categories'] as const,
  dashboard: ['dashboard'] as const,
  adminStats: ['admin', 'stats'] as const,
  providerStats: (providerId: string) => ['provider', 'stats', providerId] as const,
}