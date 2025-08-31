-- CMS / CRM
CREATE TABLE IF NOT EXISTS public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text,
  audience jsonb,
  scheduled_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- GPS & ROUTES
CREATE TABLE IF NOT EXISTS public.provider_locations (
  provider_id uuid PRIMARY KEY REFERENCES public.providers(id) ON DELETE CASCADE,
  location geography(Point,4326),
  lat numeric(9,6),
  lng numeric(9,6),
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.booking_route_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  lat numeric(9,6) NOT NULL,
  lng numeric(9,6) NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  status text
);

CREATE INDEX IF NOT EXISTS idx_route_updates_booking ON public.booking_route_updates(booking_id);
CREATE INDEX IF NOT EXISTS idx_route_updates_provider ON public.booking_route_updates(provider_id);

-- ADMIN & AUDIT
CREATE TABLE IF NOT EXISTS public.admin_rights (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  can_add_admins boolean NOT NULL DEFAULT false,
  can_manage_providers boolean NOT NULL DEFAULT true,
  can_manage_cms boolean NOT NULL DEFAULT true,
  can_refund boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.bootstrap_super_admin()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.admin_rights(user_id, can_add_admins, can_manage_providers, can_manage_cms, can_refund)
  SELECT p.id, true, true, true, true
  FROM public.profiles p
  WHERE lower(p.email) = 'helpers0508@gmail.com'
  ON CONFLICT (user_id) DO UPDATE SET can_add_admins = excluded.can_add_admins;
END;$$;

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id text,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);
