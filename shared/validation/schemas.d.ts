import { z } from 'zod';
export declare const userRoleSchema: z.ZodEnum<["customer", "provider", "admin"]>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    full_name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["customer", "provider", "admin"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "customer" | "provider" | "admin";
    full_name: string;
    password: string;
    phone?: string | undefined;
}, {
    email: string;
    role: "customer" | "provider" | "admin";
    full_name: string;
    password: string;
    phone?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    full_name: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    avatar_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    full_name?: string | undefined;
    phone?: string | undefined;
    avatar_url?: string | undefined;
}, {
    full_name?: string | undefined;
    phone?: string | undefined;
    avatar_url?: string | undefined;
}>;
export declare const serviceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    category_id: z.ZodString;
    base_price: z.ZodNumber;
    duration_minutes: z.ZodNumber;
    image_url: z.ZodOptional<z.ZodString>;
    is_active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    category_id: string;
    base_price: number;
    duration_minutes: number;
    is_active: boolean;
    image_url?: string | undefined;
}, {
    name: string;
    description: string;
    category_id: string;
    base_price: number;
    duration_minutes: number;
    image_url?: string | undefined;
    is_active?: boolean | undefined;
}>;
export declare const serviceCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    is_active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    is_active: boolean;
    description?: string | undefined;
    icon?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    is_active?: boolean | undefined;
    icon?: string | undefined;
}>;
export declare const addressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    postal_code: z.ZodString;
    country: z.ZodString;
    coordinates: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
    }, {
        latitude: number;
        longitude: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    } | undefined;
}, {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    } | undefined;
}>;
export declare const verificationStatusSchema: z.ZodEnum<["pending", "verified", "rejected"]>;
export declare const availabilitySlotSchema: z.ZodObject<{
    day_of_week: z.ZodNumber;
    start_time: z.ZodString;
    end_time: z.ZodString;
    is_available: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}, {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
}>;
export declare const providerSchema: z.ZodObject<{
    business_name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    experience_years: z.ZodOptional<z.ZodNumber>;
    hourly_rate: z.ZodOptional<z.ZodNumber>;
    availability_schedule: z.ZodOptional<z.ZodArray<z.ZodObject<{
        day_of_week: z.ZodNumber;
        start_time: z.ZodString;
        end_time: z.ZodString;
        is_available: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_available: boolean;
    }, {
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_available: boolean;
    }>, "many">>;
    service_areas: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    service_areas: string[];
    description?: string | undefined;
    business_name?: string | undefined;
    experience_years?: number | undefined;
    hourly_rate?: number | undefined;
    availability_schedule?: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_available: boolean;
    }[] | undefined;
}, {
    service_areas: string[];
    description?: string | undefined;
    business_name?: string | undefined;
    experience_years?: number | undefined;
    hourly_rate?: number | undefined;
    availability_schedule?: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_available: boolean;
    }[] | undefined;
}>;
export declare const providerServiceSchema: z.ZodObject<{
    service_id: z.ZodString;
    custom_price: z.ZodOptional<z.ZodNumber>;
    is_available: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    is_available: boolean;
    service_id: string;
    custom_price?: number | undefined;
}, {
    service_id: string;
    is_available?: boolean | undefined;
    custom_price?: number | undefined;
}>;
export declare const bookingStatusSchema: z.ZodEnum<["pending", "confirmed", "in_progress", "completed", "cancelled"]>;
export declare const bookingSchema: z.ZodObject<{
    service_id: z.ZodString;
    provider_id: z.ZodString;
    booking_date: z.ZodEffects<z.ZodString, string, string>;
    start_time: z.ZodString;
    address: z.ZodObject<{
        street: z.ZodString;
        city: z.ZodString;
        state: z.ZodString;
        postal_code: z.ZodString;
        country: z.ZodString;
        coordinates: z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
        }, {
            latitude: number;
            longitude: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        } | undefined;
    }, {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        } | undefined;
    }>;
    special_instructions: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    start_time: string;
    service_id: string;
    provider_id: string;
    booking_date: string;
    address: {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        } | undefined;
    };
    special_instructions?: string | undefined;
}, {
    start_time: string;
    service_id: string;
    provider_id: string;
    booking_date: string;
    address: {
        street: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        } | undefined;
    };
    special_instructions?: string | undefined;
}>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "confirmed", "in_progress", "completed", "cancelled"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
}, {
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
}>;
export declare const reviewSchema: z.ZodObject<{
    rating: z.ZodNumber;
    comment: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rating: number;
    comment?: string | undefined;
}, {
    rating: number;
    comment?: string | undefined;
}>;
export declare const searchFiltersSchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    price_min: z.ZodOptional<z.ZodNumber>;
    price_max: z.ZodOptional<z.ZodNumber>;
    rating_min: z.ZodOptional<z.ZodNumber>;
    availability_date: z.ZodOptional<z.ZodString>;
    sort_by: z.ZodOptional<z.ZodEnum<["price", "rating", "distance", "popularity"]>>;
    sort_order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
}, "strip", z.ZodTypeAny, {
    category?: string | undefined;
    location?: string | undefined;
    price_min?: number | undefined;
    price_max?: number | undefined;
    rating_min?: number | undefined;
    availability_date?: string | undefined;
    sort_by?: "rating" | "price" | "distance" | "popularity" | undefined;
    sort_order?: "asc" | "desc" | undefined;
}, {
    category?: string | undefined;
    location?: string | undefined;
    price_min?: number | undefined;
    price_max?: number | undefined;
    rating_min?: number | undefined;
    availability_date?: string | undefined;
    sort_by?: "rating" | "price" | "distance" | "popularity" | undefined;
    sort_order?: "asc" | "desc" | undefined;
}>;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const uuidSchema: z.ZodString;
export declare const idParamSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const fileUploadSchema: z.ZodObject<{
    filename: z.ZodString;
    mimetype: z.ZodString;
    size: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    filename: string;
    mimetype: string;
    size: number;
}, {
    filename: string;
    mimetype: string;
    size: number;
}>;
export declare const envSchema: z.ZodObject<{
    SUPABASE_URL: z.ZodString;
    SUPABASE_ANON_KEY: z.ZodString;
    SUPABASE_SERVICE_ROLE_KEY: z.ZodString;
    SUPABASE_JWT_SECRET: z.ZodString;
    PORT: z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>;
    NODE_ENV: z.ZodEnum<["development", "production", "test"]>;
    JWT_SECRET: z.ZodString;
    CORS_ORIGIN: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "development" | "production" | "test";
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_JWT_SECRET: string;
    PORT: number;
    JWT_SECRET: string;
    CORS_ORIGIN: string;
}, {
    NODE_ENV: "development" | "production" | "test";
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_JWT_SECRET: string;
    PORT: string;
    JWT_SECRET: string;
    CORS_ORIGIN: string;
}>;
//# sourceMappingURL=schemas.d.ts.map