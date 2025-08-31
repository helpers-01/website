-- PROVIDERS
CREATE TABLE IF NOT EXISTS public.providers (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name text,
  about text,
  years_experience int,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  avg_rating numeric(3,2) DEFAULT 0,
  total_reviews int DEFAULT 0,
  onboarding_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_providers_updated_at ON public.providers;
CREATE TRIGGER trg_providers_updated_at
BEFORE UPDATE ON public.providers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.provider_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_url text NOT NULL,
  status public.verification_status NOT NULL DEFAULT 'pending',
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_provider_documents_provider ON public.provider_documents(provider_id);

CREATE TABLE IF NOT EXISTS public.provider_services (
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  rate numeric(12,2),
  min_price numeric(12,2),
  max_travel_km numeric(6,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (provider_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_provider_services_service ON public.provider_services(service_id);

CREATE TABLE IF NOT EXISTS public.provider_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_holiday boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_provider_availability_provider ON public.provider_availability(provider_id);

CREATE TABLE IF NOT EXISTS public.provider_time_off (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text
);

CREATE INDEX IF NOT EXISTS idx_provider_timeoff_provider ON public.provider_time_off(provider_id);
