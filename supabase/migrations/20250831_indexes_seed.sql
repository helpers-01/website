-- SEARCH OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_services_tsv ON public.services USING gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(description,'')));
CREATE INDEX IF NOT EXISTS idx_providers_tsv ON public.providers USING gin (to_tsvector('simple', coalesce(company_name,'') || ' ' || coalesce(about,'')));

-- ==========================
-- MIGRATION & INDEX NOTES
-- ==========================
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at_desc ON public.bookings (scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_providers_avg_rating ON public.providers (avg_rating DESC);

-- ==========================
-- REVOKE PUBLIC DIRECT ACCESS (recommended)
-- ==========================
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM public;
REVOKE INSERT, UPDATE, DELETE ON public.bookings FROM public;

-- ==========================
-- SAFE SEED DATA (sample demo rows)
-- ==========================
-- Note: profiles must be created by Supabase Auth first; use public.sync_profile_from_auth(auth_user_id) to create profile rows.

-- Categories
INSERT INTO public.service_categories (id, name, slug)
VALUES
  (gen_random_uuid(), 'Cleaning', 'cleaning'),
  (gen_random_uuid(), 'Plumbing', 'plumbing'),
  (gen_random_uuid(), 'Electrical', 'electrical')
ON CONFLICT (slug) DO NOTHING;

-- Services seeded by category (correct alias usage)
WITH cat AS (SELECT id FROM public.service_categories WHERE slug = 'cleaning')
INSERT INTO public.services (id, category_id, name, slug, description, base_price, unit)
SELECT gen_random_uuid(), cat.id, 'Home Deep Cleaning', 'home-deep-cleaning', 'Thorough cleaning of your home', 1499, 'flat'
FROM cat
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM public.service_categories WHERE slug = 'plumbing')
INSERT INTO public.services (id, category_id, name, slug, description, base_price, unit)
SELECT gen_random_uuid(), cat.id, 'Faucet Repair', 'faucet-repair', 'Repair leaking or broken faucets', 499, 'flat'
FROM cat
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM public.service_categories WHERE slug = 'electrical')
INSERT INTO public.services (id, category_id, name, slug, description, base_price, unit)
SELECT gen_random_uuid(), cat.id, 'Fan Installation', 'fan-installation', 'Ceiling and wall fan installation', 299, 'flat'
FROM cat
ON CONFLICT (slug) DO NOTHING;

-- Sample plan
INSERT INTO public.plans (id, name, for_role, price_monthly, benefits)
VALUES (gen_random_uuid(), 'Premium Provider', 'provider', 499.00, '{"priority_support":true, "boost":true}')
ON CONFLICT DO NOTHING;
