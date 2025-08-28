import { z } from 'zod';

// User Validation Schemas
export const userRoleSchema = z.enum(['customer', 'provider', 'admin']);

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  role: userRoleSchema,
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

// Service Validation Schemas
export const serviceSchema = z.object({
  name: z.string().min(3, 'Service name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().uuid('Invalid category ID'),
  base_price: z.number().min(0, 'Price must be non-negative'),
  duration_minutes: z.number().min(15, 'Duration must be at least 15 minutes'),
  image_url: z.string().url().optional(),
  is_active: z.boolean().default(true),
});

export const serviceCategorySchema = z.object({
  name: z.string().min(3, 'Category name must be at least 3 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
  is_active: z.boolean().default(true),
});

// Address Validation Schema
export const addressSchema = z.object({
  street: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postal_code: z.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid postal code'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
});

// Provider Validation Schemas
export const verificationStatusSchema = z.enum(['pending', 'verified', 'rejected']);

export const availabilitySlotSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  is_available: z.boolean(),
});

export const providerSchema = z.object({
  business_name: z.string().optional(),
  description: z.string().optional(),
  experience_years: z.number().min(0).max(50).optional(),
  hourly_rate: z.number().min(0).optional(),
  availability_schedule: z.array(availabilitySlotSchema).optional(),
  service_areas: z.array(z.string()).min(1, 'At least one service area is required'),
});

export const providerServiceSchema = z.object({
  service_id: z.string().uuid('Invalid service ID'),
  custom_price: z.number().min(0).optional(),
  is_available: z.boolean().default(true),
});

// Booking Validation Schemas
export const bookingStatusSchema = z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']);

export const bookingSchema = z.object({
  service_id: z.string().uuid('Invalid service ID'),
  provider_id: z.string().uuid('Invalid provider ID'),
  booking_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)) && new Date(date) >= new Date(),
    'Booking date must be in the future'
  ),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  address: addressSchema,
  special_instructions: z.string().max(500, 'Instructions must be less than 500 characters').optional(),
});

export const updateBookingStatusSchema = z.object({
  status: bookingStatusSchema,
});

// Review Validation Schemas
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

// Search & Filter Validation Schemas
export const searchFiltersSchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  price_min: z.number().min(0).optional(),
  price_max: z.number().min(0).optional(),
  rating_min: z.number().min(1).max(5).optional(),
  availability_date: z.string().optional(),
  sort_by: z.enum(['price', 'rating', 'distance', 'popularity']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// ID Validation Schemas
export const uuidSchema = z.string().uuid();
export const idParamSchema = z.object({
  id: uuidSchema,
});

// File Upload Schema
export const fileUploadSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});

// Environment Validation Schema
export const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  PORT: z.string().transform(Number).pipe(z.number().min(1000).max(65535)),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string(),
});
