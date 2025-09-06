// Import Supabase client from the proper location
export { supabase } from './supabase/client';

// Note: Stripe and Razorpay clients have been moved to server-side API routes
// for security reasons. They should not be initialized on the client side.
// Use API routes at /api/payments/stripe and /api/payments/razorpay instead.
