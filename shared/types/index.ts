// User & Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'customer' | 'provider' | 'admin';

export interface AuthUser {
  user: User | null;
  session: any | null;
  loading: boolean;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  category_id: string;
  base_price: number;
  duration_minutes: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: ServiceCategory;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
}

// Provider Types
export interface Provider {
  id: string;
  user_id: string;
  business_name?: string;
  description?: string;
  experience_years?: number;
  hourly_rate?: number;
  availability_schedule?: AvailabilitySlot[];
  service_areas: string[];
  verification_status: VerificationStatus;
  rating_average?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
  user?: User;
  services?: ProviderService[];
}

export interface ProviderService {
  id: string;
  provider_id: string;
  service_id: string;
  custom_price?: number;
  is_available: boolean;
  service?: Service;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface AvailabilitySlot {
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:mm format
  end_time: string; // HH:mm format
  is_available: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  customer_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_amount: number;
  special_instructions?: string;
  address: Address;
  created_at: string;
  updated_at: string;
  customer?: User;
  provider?: Provider;
  service?: Service;
  review?: Review;
}

export type BookingStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Review Types
export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  provider_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  updated_at: string;
  customer?: User;
  booking?: Booking;
}

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface BookingForm {
  service_id: string;
  provider_id: string;
  booking_date: string;
  start_time: string;
  address: Address;
  special_instructions?: string;
}

export interface ReviewForm {
  rating: number;
  comment?: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Search & Filter Types
export interface SearchFilters {
  category?: string;
  location?: string;
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  availability_date?: string;
  sort_by?: 'price' | 'rating' | 'distance' | 'popularity';
  sort_order?: 'asc' | 'desc';
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export * from './database';
