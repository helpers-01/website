import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

if (!supabaseAnonKey) {
  throw new Error('SUPABASE_ANON_KEY environment variable is required');
}

// Service role client for server-side operations (full database access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Anon client for client-side-like operations with RLS
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Database table names for type safety
export const TABLES = {
  USERS: 'users',
  PROFILES: 'profiles',
  SERVICE_CATEGORIES: 'service_categories',
  SERVICES: 'services',
  PROVIDERS: 'providers',
  PROVIDER_SERVICES: 'provider_services',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews',
  AVAILABILITY: 'provider_availability',
} as const;

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  logger.error('Supabase Error:', error);
  
  if (error?.code === 'PGRST301') {
    return { message: 'Resource not found', statusCode: 404 };
  }
  
  if (error?.code === '23505') {
    return { message: 'Resource already exists', statusCode: 409 };
  }
  
  if (error?.code === '23503') {
    return { message: 'Referenced resource not found', statusCode: 400 };
  }
  
  if (error?.code === 'auth/user-not-found') {
    return { message: 'User not found', statusCode: 404 };
  }
  
  if (error?.code === 'auth/invalid-email') {
    return { message: 'Invalid email address', statusCode: 400 };
  }
  
  if (error?.code === 'auth/weak-password') {
    return { message: 'Password is too weak', statusCode: 400 };
  }
  
  return { 
    message: error?.message || 'An unexpected error occurred', 
    statusCode: 500 
  };
};

// Helper function to create a user session client
export const createUserClient = (accessToken: string) => {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  
  client.auth.setSession({
    access_token: accessToken,
    refresh_token: '',
  });
  
  return client;
};

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    logger.info('✅ Supabase connection established successfully');
    return true;
  } catch (error) {
    logger.error('❌ Failed to connect to Supabase:', error);
    return false;
  }
};
