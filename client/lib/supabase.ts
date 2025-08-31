import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for authentication
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Helper functions for database operations
export const db = {
  // Users
  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    return { data, error }
  },

  getUserById: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Profiles
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  // Service Categories
  getServiceCategories: async () => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    return { data, error }
  },

  // Services
  getServices: async () => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          name,
          icon
        )
      `)
      .eq('is_active', true)
      .order('name')
    return { data, error }
  },

  getServicesByCategory: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('name')
    return { data, error }
  },

  // Providers
  getProviders: async () => {
    const { data, error } = await supabase
      .from('providers')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('verification_status', 'verified')
      .order('rating_average', { ascending: false })
    return { data, error }
  },

  // Bookings
  getUserBookings: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (
          name,
          description
        ),
        providers (
          business_name,
          profiles (
            full_name
          )
        )
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  createBooking: async (bookingData: any) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()
    return { data, error }
  },

  // Reviews
  getServiceReviews: async (serviceId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
}