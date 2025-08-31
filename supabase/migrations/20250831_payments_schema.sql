-- PAYMENTS, INVOICES, WALLET
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  method public.payment_method NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  gateway text,
  transaction_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  authorized_at timestamptz,
  captured_at timestamptz,
  refunded_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  amount_due numeric(12,2) NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  pdf_url text
);

CREATE INDEX IF NOT EXISTS idx_invoices_booking ON public.invoices(booking_id);

CREATE TABLE IF NOT EXISTS public.wallets (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- bump_wallet_updated_at (function)
CREATE OR REPLACE FUNCTION public.bump_wallet_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.wallets SET updated_at = now() WHERE user_id = NEW.user_id;
  RETURN NEW;
END;$$;

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.wallets(user_id) ON DELETE CASCADE,
  flow public.money_flow NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  reason text,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  payment_id uuid REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions(user_id);

DROP TRIGGER IF EXISTS trg_wallet_tx_touch_wallet ON public.wallet_transactions;
CREATE TRIGGER trg_wallet_tx_touch_wallet
AFTER INSERT ON public.wallet_transactions
FOR EACH ROW EXECUTE FUNCTION public.bump_wallet_updated_at();

CREATE TABLE IF NOT EXISTS public.payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'pending',
  period_start date,
  period_end date,
  initiated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payouts_provider ON public.payouts(provider_id);
