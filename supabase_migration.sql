-- Complete Database Setup for Helpers Platform
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types/enums
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'customer',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- User profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Service categories
CREATE TABLE IF NOT EXISTS public.service_categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category_id uuid REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  base_price decimal(10,2) NOT NULL CHECK (base_price >= 0),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Service providers
CREATE TABLE IF NOT EXISTS public.providers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  business_name text,
  description text,
  experience_years integer CHECK (experience_years >= 0),
  hourly_rate decimal(10,2) CHECK (hourly_rate >= 0),
  service_areas text[] DEFAULT '{}',
  verification_status verification_status DEFAULT 'pending',
  rating_average decimal(3,2) CHECK (rating_average >= 0 AND rating_average <= 5),
  total_reviews integer DEFAULT 0 CHECK (total_reviews >= 0),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Provider services (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.provider_services (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  custom_price decimal(10,2) CHECK (custom_price >= 0),
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, service_id)
);

-- Provider availability
CREATE TABLE IF NOT EXISTS public.provider_availability (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL CHECK (end_time > start_time),
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(provider_id, day_of_week, start_time, end_time)
);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.services(id) ON DELETE RESTRICT,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL CHECK (end_time > start_time),
  status booking_status DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  special_instructions text,
  address jsonb NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_method text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE,
  customer_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES public.providers(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
  CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
  CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
  CREATE INDEX IF NOT EXISTS idx_providers_verification ON public.providers(verification_status);
  CREATE INDEX IF NOT EXISTS idx_providers_rating ON public.providers(rating_average);
  CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_provider ON public.bookings(provider_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
  CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
  CREATE INDEX IF NOT EXISTS idx_reviews_provider ON public.reviews(provider_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
DO $$ BEGIN
  DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
  CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
  CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_service_categories_updated_at ON public.service_categories;
  CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
  CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_providers_updated_at ON public.providers;
  CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_provider_services_updated_at ON public.provider_services;
  CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON public.provider_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_provider_availability_updated_at ON public.provider_availability;
  CREATE TRIGGER update_provider_availability_updated_at BEFORE UPDATE ON public.provider_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
  CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  
  DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
  CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END $$;

-- Function to update provider rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.providers 
  SET 
    rating_average = (
      SELECT AVG(rating)::decimal(3,2) 
      FROM public.reviews 
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to update provider rating
DROP TRIGGER IF EXISTS update_provider_rating_trigger ON public.reviews;
CREATE TRIGGER update_provider_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Service categories policies (public read)
DROP POLICY IF EXISTS "Anyone can view active service categories" ON public.service_categories;
CREATE POLICY "Anyone can view active service categories" ON public.service_categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage service categories" ON public.service_categories;
CREATE POLICY "Admins can manage service categories" ON public.service_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Services policies (public read for active services)
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Providers policies
DROP POLICY IF EXISTS "Anyone can view verified providers" ON public.providers;
CREATE POLICY "Anyone can view verified providers" ON public.providers
  FOR SELECT USING (verification_status = 'verified');

DROP POLICY IF EXISTS "Providers can update their own data" ON public.providers;
CREATE POLICY "Providers can update their own data" ON public.providers
  FOR UPDATE USING (
    user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can create provider profile" ON public.providers;
CREATE POLICY "Users can create provider profile" ON public.providers
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'provider'
    )
  );

-- Bookings policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Customers can create bookings" ON public.bookings;
CREATE POLICY "Customers can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "Customers can update their bookings" ON public.bookings;
CREATE POLICY "Customers can update their bookings" ON public.bookings
  FOR UPDATE USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Providers can update assigned bookings" ON public.bookings;
CREATE POLICY "Providers can update assigned bookings" ON public.bookings
  FOR UPDATE USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can create reviews for their bookings" ON public.reviews;
CREATE POLICY "Customers can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND customer_id = auth.uid() AND status = 'completed'
    )
  );

DROP POLICY IF EXISTS "Customers can update their own reviews" ON public.reviews;
CREATE POLICY "Customers can update their own reviews" ON public.reviews
  FOR UPDATE USING (customer_id = auth.uid());

-- Insert default service categories
INSERT INTO public.service_categories (name, description, icon) VALUES
('Home Cleaning', 'Professional house cleaning services', 'home'),
('Plumbing', 'Plumbing repair and installation services', 'wrench'),
('Electrical', 'Electrical repair and installation', 'zap'),
('Painting', 'Interior and exterior painting services', 'palette'),
('Gardening', 'Garden maintenance and landscaping', 'tree'),
('Appliance Repair', 'Repair services for home appliances', 'settings'),
('Pest Control', 'Professional pest control services', 'bug'),
('AC Repair', 'Air conditioning repair and maintenance', 'thermometer')
ON CONFLICT (name) DO NOTHING;

-- Insert sample services
INSERT INTO public.services (name, description, category_id, base_price, duration_minutes, image_url) VALUES
(
  'Deep House Cleaning',
  'Comprehensive deep cleaning service including all rooms, bathrooms, and kitchen',
  (SELECT id FROM public.service_categories WHERE name = 'Home Cleaning'),
  150.00,
  180,
  '/images/deep-cleaning.jpg'
),
(
  'Regular House Cleaning',
  'Standard house cleaning service for maintenance',
  (SELECT id FROM public.service_categories WHERE name = 'Home Cleaning'),
  80.00,
  120,
  '/images/regular-cleaning.jpg'
),
(
  'Pipe Leak Repair',
  'Professional pipe leak detection and repair',
  (SELECT id FROM public.service_categories WHERE name = 'Plumbing'),
  120.00,
  90,
  '/images/pipe-repair.jpg'
),
(
  'Interior Painting',
  'Professional interior wall painting service',
  (SELECT id FROM public.service_categories WHERE name = 'Painting'),
  300.00,
  480,
  '/images/interior-painting.jpg'
)
ON CONFLICT DO NOTHING;
