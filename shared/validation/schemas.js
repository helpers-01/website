"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = exports.fileUploadSchema = exports.idParamSchema = exports.uuidSchema = exports.paginationSchema = exports.searchFiltersSchema = exports.reviewSchema = exports.updateBookingStatusSchema = exports.bookingSchema = exports.bookingStatusSchema = exports.providerServiceSchema = exports.providerSchema = exports.availabilitySlotSchema = exports.verificationStatusSchema = exports.addressSchema = exports.serviceCategorySchema = exports.serviceSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = exports.userRoleSchema = void 0;
const zod_1 = require("zod");
exports.userRoleSchema = zod_1.z.enum(['customer', 'provider', 'admin']);
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    full_name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    phone: zod_1.z.string().optional(),
    role: exports.userRoleSchema,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.updateProfileSchema = zod_1.z.object({
    full_name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: zod_1.z.string().optional(),
    avatar_url: zod_1.z.string().url().optional(),
});
exports.serviceSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Service name must be at least 3 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    category_id: zod_1.z.string().uuid('Invalid category ID'),
    base_price: zod_1.z.number().min(0, 'Price must be non-negative'),
    duration_minutes: zod_1.z.number().min(15, 'Duration must be at least 15 minutes'),
    image_url: zod_1.z.string().url().optional(),
    is_active: zod_1.z.boolean().default(true),
});
exports.serviceCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Category name must be at least 3 characters'),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().default(true),
});
exports.addressSchema = zod_1.z.object({
    street: zod_1.z.string().min(5, 'Street address must be at least 5 characters'),
    city: zod_1.z.string().min(2, 'City must be at least 2 characters'),
    state: zod_1.z.string().min(2, 'State must be at least 2 characters'),
    postal_code: zod_1.z.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid postal code'),
    country: zod_1.z.string().min(2, 'Country must be at least 2 characters'),
    coordinates: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
    }).optional(),
});
exports.verificationStatusSchema = zod_1.z.enum(['pending', 'verified', 'rejected']);
exports.availabilitySlotSchema = zod_1.z.object({
    day_of_week: zod_1.z.number().min(0).max(6),
    start_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    end_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    is_available: zod_1.z.boolean(),
});
exports.providerSchema = zod_1.z.object({
    business_name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    experience_years: zod_1.z.number().min(0).max(50).optional(),
    hourly_rate: zod_1.z.number().min(0).optional(),
    availability_schedule: zod_1.z.array(exports.availabilitySlotSchema).optional(),
    service_areas: zod_1.z.array(zod_1.z.string()).min(1, 'At least one service area is required'),
});
exports.providerServiceSchema = zod_1.z.object({
    service_id: zod_1.z.string().uuid('Invalid service ID'),
    custom_price: zod_1.z.number().min(0).optional(),
    is_available: zod_1.z.boolean().default(true),
});
exports.bookingStatusSchema = zod_1.z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']);
exports.bookingSchema = zod_1.z.object({
    service_id: zod_1.z.string().uuid('Invalid service ID'),
    provider_id: zod_1.z.string().uuid('Invalid provider ID'),
    booking_date: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)) && new Date(date) >= new Date(), 'Booking date must be in the future'),
    start_time: zod_1.z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    address: exports.addressSchema,
    special_instructions: zod_1.z.string().max(500, 'Instructions must be less than 500 characters').optional(),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    status: exports.bookingStatusSchema,
});
exports.reviewSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: zod_1.z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});
exports.searchFiltersSchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    price_min: zod_1.z.number().min(0).optional(),
    price_max: zod_1.z.number().min(0).optional(),
    rating_min: zod_1.z.number().min(1).max(5).optional(),
    availability_date: zod_1.z.string().optional(),
    sort_by: zod_1.z.enum(['price', 'rating', 'distance', 'popularity']).optional(),
    sort_order: zod_1.z.enum(['asc', 'desc']).optional(),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number().min(1).default(1),
    limit: zod_1.z.number().min(1).max(100).default(10),
});
exports.uuidSchema = zod_1.z.string().uuid();
exports.idParamSchema = zod_1.z.object({
    id: exports.uuidSchema,
});
exports.fileUploadSchema = zod_1.z.object({
    filename: zod_1.z.string(),
    mimetype: zod_1.z.string(),
    size: zod_1.z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});
exports.envSchema = zod_1.z.object({
    SUPABASE_URL: zod_1.z.string().url(),
    SUPABASE_ANON_KEY: zod_1.z.string(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string(),
    SUPABASE_JWT_SECRET: zod_1.z.string(),
    PORT: zod_1.z.string().transform(Number).pipe(zod_1.z.number().min(1000).max(65535)),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']),
    JWT_SECRET: zod_1.z.string().min(32),
    CORS_ORIGIN: zod_1.z.string(),
});
//# sourceMappingURL=schemas.js.map