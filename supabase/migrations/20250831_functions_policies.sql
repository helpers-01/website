-- ==========================
-- FUNCTIONS THAT REFERENCE TABLES (create after tables exist)
-- ==========================
-- is_admin: check admin_rights OR profiles.role='admin'
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_rights ar WHERE ar.user_id = uid)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = uid AND p.role = 'admin');
$$;

-- sync_profile_from_auth: upsert profiles row from auth.users (call after auth user created)
CREATE OR REPLACE FUNCTION public.sync_profile_from_auth(uid uuid)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
  u record;
  role_text text := 'customer';
BEGIN
  SELECT metadata, email INTO u FROM auth.users WHERE id = uid;
  IF u.metadata IS NOT NULL AND (u.metadata->>'role') IS NOT NULL THEN
    role_text := (u.metadata->>'role')::text;
  END IF;
  INSERT INTO public.profiles (id, role, email, created_at)
  VALUES (uid, role_text::public.user_role, u.email, now())
  ON CONFLICT (id) DO UPDATE SET role = excluded.role, email = excluded.email;
END;$$;

-- ==========================
-- RLS: enable + policies (drop then create)
-- ==========================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_rights ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
DROP POLICY IF EXISTS profiles_self_select ON public.profiles;
CREATE POLICY profiles_self_select
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS profiles_self_update ON public.profiles;
CREATE POLICY profiles_self_update
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS profiles_admin_update ON public.profiles;
CREATE POLICY profiles_admin_update
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ADDRESSES policies
DROP POLICY IF EXISTS addresses_owner_select ON public.addresses;
CREATE POLICY addresses_owner_select
  ON public.addresses
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS addresses_owner_insert ON public.addresses;
CREATE POLICY addresses_owner_insert
  ON public.addresses
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS addresses_owner_update ON public.addresses;
CREATE POLICY addresses_owner_update
  ON public.addresses
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS addresses_owner_delete ON public.addresses;
CREATE POLICY addresses_owner_delete
  ON public.addresses
  FOR DELETE
  USING (user_id = auth.uid());

-- BOOKINGS policies
DROP POLICY IF EXISTS bookings_select ON public.bookings;
CREATE POLICY bookings_select
  ON public.bookings
  FOR SELECT
  USING (
    customer_id = auth.uid() OR provider_id = auth.uid() OR public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS bookings_customer_insert ON public.bookings;
CREATE POLICY bookings_customer_insert
  ON public.bookings
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS bookings_customer_update ON public.bookings;
CREATE POLICY bookings_customer_update
  ON public.bookings
  FOR UPDATE
  USING (customer_id = auth.uid() OR provider_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (true);

-- MESSAGES policies
DROP POLICY IF EXISTS messages_peer_access ON public.messages;
CREATE POLICY messages_peer_access
  ON public.messages
  FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS messages_send ON public.messages;
CREATE POLICY messages_send
  ON public.messages
  FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- NOTIFICATIONS policies
DROP POLICY IF EXISTS notifications_owner ON public.notifications;
CREATE POLICY notifications_owner
  ON public.notifications
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS notifications_insert ON public.notifications;
CREATE POLICY notifications_insert
  ON public.notifications
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- WALLETS policies
DROP POLICY IF EXISTS wallets_owner ON public.wallets;
CREATE POLICY wallets_owner
  ON public.wallets
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS wallet_tx_owner ON public.wallet_transactions;
CREATE POLICY wallet_tx_owner
  ON public.wallet_transactions
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS wallet_tx_insert ON public.wallet_transactions;
CREATE POLICY wallet_tx_insert
  ON public.wallet_transactions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- REVIEWS policies
DROP POLICY IF EXISTS reviews_customer_insert ON public.reviews;
CREATE POLICY reviews_customer_insert
  ON public.reviews
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS reviews_select ON public.reviews;
CREATE POLICY reviews_select
  ON public.reviews
  FOR SELECT
  USING (customer_id = auth.uid() OR provider_id = auth.uid() OR public.is_admin(auth.uid()));

-- ADMIN_RIGHTS policies
DROP POLICY IF EXISTS admin_rights_admins ON public.admin_rights;
CREATE POLICY admin_rights_admins
  ON public.admin_rights
  FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
