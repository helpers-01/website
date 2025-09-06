import { z } from 'zod'

// Authentication schemas
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
})

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      'Please enter a valid phone number'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters'),
})

export const helperLoginSchema = z.object({
  employeeId: z
    .string()
    .min(1, 'Employee ID is required')
    .max(20, 'Employee ID must be less than 20 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
})

export const userLoginSchema = z.object({
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      'Please enter a valid phone number'
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      'Please enter a valid email address'
    ),
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
}).refine(
  (data) => data.phoneNumber || data.email,
  {
    message: 'Either phone number or email is required',
    path: ['phoneNumber'],
  }
)

// User profile schemas
export const userProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{1,14}$/.test(val),
      'Please enter a valid phone number'
    ),
  avatar_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
})

// Provider profile schemas
export const providerProfileSchema = z.object({
  business_name: z
    .string()
    .max(100, 'Business name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  experience_years: z
    .number()
    .min(0, 'Experience years cannot be negative')
    .max(50, 'Experience years seems too high')
    .optional(),
  hourly_rate: z
    .number()
    .min(0, 'Hourly rate cannot be negative')
    .max(10000, 'Hourly rate seems too high')
    .optional(),
  service_areas: z
    .array(z.string())
    .max(10, 'Maximum 10 service areas allowed')
    .optional(),
})

// Booking schemas
export const bookingSchema = z.object({
  service_id: z.string().min(1, 'Service is required'),
  booking_date: z
    .string()
    .min(1, 'Booking date is required')
    .refine(
      (date) => {
        const bookingDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return bookingDate >= today
      },
      'Booking date cannot be in the past'
    ),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  special_instructions: z
    .string()
    .max(500, 'Instructions must be less than 500 characters')
    .optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP code is required'),
    instructions: z.string().optional(),
  }),
}).refine(
  (data) => {
    if (data.start_time && data.end_time) {
      const start = new Date(`2000-01-01T${data.start_time}`)
      const end = new Date(`2000-01-01T${data.end_time}`)
      return end > start
    }
    return true
  },
  {
    message: 'End time must be after start time',
    path: ['end_time'],
  }
)

// Service schemas
export const serviceSchema = z.object({
  name: z
    .string()
    .min(2, 'Service name must be at least 2 characters')
    .max(100, 'Service name must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  category_id: z.string().min(1, 'Category is required'),
  base_price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(100000, 'Price seems too high'),
  duration_minutes: z
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(480, 'Duration cannot exceed 8 hours'),
  image_url: z
    .string()
    .url('Please enter a valid image URL')
    .optional()
    .or(z.literal('')),
})

// Review schemas
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z
    .string()
    .max(500, 'Comment must be less than 500 characters')
    .optional(),
})

// Search and filter schemas
export const searchSchema = z.object({
  query: z
    .string()
    .max(100, 'Search query too long')
    .optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z
    .number()
    .min(0, 'Minimum price cannot be negative')
    .optional(),
  maxPrice: z
    .number()
    .min(0, 'Maximum price cannot be negative')
    .optional(),
  rating: z
    .number()
    .min(1, 'Rating filter must be at least 1')
    .max(5, 'Rating filter cannot exceed 5')
    .optional(),
}).refine(
  (data) => {
    if (data.minPrice !== undefined && data.maxPrice !== undefined) {
      return data.maxPrice >= data.minPrice
    }
    return true
  },
  {
    message: 'Maximum price must be greater than minimum price',
    path: ['maxPrice'],
  }
)

// Type exports for form usage
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>
export type HelperLoginFormData = z.infer<typeof helperLoginSchema>
export type UserLoginFormData = z.infer<typeof userLoginSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type ProviderProfileFormData = z.infer<typeof providerProfileSchema>
export type BookingFormData = z.infer<typeof bookingSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type SearchFormData = z.infer<typeof searchSchema>