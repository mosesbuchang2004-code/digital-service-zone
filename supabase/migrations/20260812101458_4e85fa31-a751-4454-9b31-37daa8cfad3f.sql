-- 1. Wallet currency
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'NGN';
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- 2. Enums
DO $$ BEGIN
  CREATE TYPE public.vtu_status AS ENUM ('pending','processing','successful','failed','refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.ledger_type AS ENUM ('funding','purchase','refund','reversal','adjustment');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.vtu_service_type AS ENUM ('airtime','data','electricity','cable','exam');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Wallet ledger
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference text NOT NULL UNIQUE,
  type public.ledger_type NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  balance_before numeric(14,2),
  balance_after numeric(14,2),
  currency text NOT NULL DEFAULT 'NGN',
  status public.vtu_status NOT NULL DEFAULT 'pending',
  description text,
  provider_reference text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own ledger readable" ON public.wallet_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage ledger" ON public.wallet_transactions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS wallet_transactions_user_created_idx
  ON public.wallet_transactions (user_id, created_at DESC);

-- 4. VTU transactions
CREATE TABLE IF NOT EXISTS public.vtu_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference text NOT NULL UNIQUE,
  service_type public.vtu_service_type NOT NULL,
  service_slug text,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  phone_number text,
  network text,
  plan_id text,
  provider_reference text,
  status public.vtu_status NOT NULL DEFAULT 'pending',
  error_message text,
  token text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.vtu_transactions TO authenticated;
GRANT ALL ON public.vtu_transactions TO service_role;
ALTER TABLE public.vtu_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own vtu transactions readable" ON public.vtu_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage vtu transactions" ON public.vtu_transactions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS vtu_transactions_user_created_idx
  ON public.vtu_transactions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vtu_transactions_status_idx
  ON public.vtu_transactions (status);

-- 5. updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS wallet_transactions_updated_at ON public.wallet_transactions;
CREATE TRIGGER wallet_transactions_updated_at BEFORE UPDATE ON public.wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS vtu_transactions_updated_at ON public.vtu_transactions;
CREATE TRIGGER vtu_transactions_updated_at BEFORE UPDATE ON public.vtu_transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Idempotent debit + VTU creation (service-role only; called from server functions)
CREATE OR REPLACE FUNCTION public.begin_vtu_transaction(
  p_user_id uuid,
  p_reference text,
  p_service_type public.vtu_service_type,
  p_amount numeric,
  p_phone_number text DEFAULT NULL,
  p_network text DEFAULT NULL,
  p_plan_id text DEFAULT NULL,
  p_service_slug text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS public.vtu_transactions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_txn public.vtu_transactions;
  v_balance numeric;
BEGIN
  IF p_user_id IS NULL THEN RAISE EXCEPTION 'user_id required'; END IF;
  IF p_reference IS NULL OR length(trim(p_reference)) < 8 THEN RAISE EXCEPTION 'Invalid transaction reference'; END IF;
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 500000 THEN RAISE EXCEPTION 'Invalid amount'; END IF;

  -- Idempotency: same reference never charges twice
  SELECT * INTO v_txn FROM public.vtu_transactions WHERE reference = p_reference;
  IF v_txn.id IS NOT NULL THEN RETURN v_txn; END IF;

  SELECT balance INTO v_balance FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'Wallet not found'; END IF;
  IF v_balance < p_amount THEN RAISE EXCEPTION 'Insufficient wallet balance'; END IF;

  UPDATE public.wallets SET balance = balance - p_amount, updated_at = now() WHERE user_id = p_user_id;

  INSERT INTO public.vtu_transactions (
    user_id, reference, service_type, service_slug, amount,
    phone_number, network, plan_id, status, metadata
  ) VALUES (
    p_user_id, p_reference, p_service_type, p_service_slug, p_amount,
    p_phone_number, p_network, p_plan_id, 'pending', COALESCE(p_metadata, '{}'::jsonb)
  ) RETURNING * INTO v_txn;

  INSERT INTO public.wallet_transactions (
    user_id, reference, type, amount, balance_before, balance_after,
    status, description, metadata
  ) VALUES (
    p_user_id, p_reference || '-DR', 'purchase', p_amount, v_balance, v_balance - p_amount,
    'pending', 'VTU purchase ' || p_service_type::text, jsonb_build_object('vtu_reference', p_reference)
  );

  RETURN v_txn;
END; $$;

REVOKE EXECUTE ON FUNCTION public.begin_vtu_transaction(uuid,text,public.vtu_service_type,numeric,text,text,text,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.begin_vtu_transaction(uuid,text,public.vtu_service_type,numeric,text,text,text,text,jsonb) TO service_role;

CREATE OR REPLACE FUNCTION public.finalize_vtu_transaction(
  p_reference text,
  p_status public.vtu_status,
  p_provider_reference text DEFAULT NULL,
  p_error_message text DEFAULT NULL,
  p_token text DEFAULT NULL,
  p_metadata jsonb DEFAULT NULL
) RETURNS public.vtu_transactions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_txn public.vtu_transactions;
  v_balance numeric;
BEGIN
  SELECT * INTO v_txn FROM public.vtu_transactions WHERE reference = p_reference FOR UPDATE;
  IF v_txn.id IS NULL THEN RAISE EXCEPTION 'Transaction not found'; END IF;
  IF v_txn.status IN ('successful','failed','refunded') THEN RETURN v_txn; END IF;

  UPDATE public.vtu_transactions SET
    status = p_status,
    provider_reference = COALESCE(p_provider_reference, provider_reference),
    error_message = COALESCE(p_error_message, error_message),
    token = COALESCE(p_token, token),
    metadata = COALESCE(metadata || COALESCE(p_metadata, '{}'::jsonb), metadata)
  WHERE id = v_txn.id RETURNING * INTO v_txn;

  UPDATE public.wallet_transactions
    SET status = CASE WHEN p_status = 'successful' THEN 'successful'::public.vtu_status ELSE p_status END,
        provider_reference = COALESCE(p_provider_reference, provider_reference)
  WHERE reference = p_reference || '-DR';

  -- Automatic refund on failure
  IF p_status IN ('failed','refunded') THEN
    SELECT balance INTO v_balance FROM public.wallets WHERE user_id = v_txn.user_id FOR UPDATE;
    UPDATE public.wallets SET balance = balance + v_txn.amount, updated_at = now() WHERE user_id = v_txn.user_id;
    INSERT INTO public.wallet_transactions (
      user_id, reference, type, amount, balance_before, balance_after,
      status, description, provider_reference, metadata
    ) VALUES (
      v_txn.user_id, p_reference || '-RF', 'refund', v_txn.amount, v_balance, v_balance + v_txn.amount,
      'successful', 'Refund for failed VTU purchase', p_provider_reference,
      jsonb_build_object('vtu_reference', p_reference)
    ) ON CONFLICT (reference) DO NOTHING;

    UPDATE public.vtu_transactions SET status = 'refunded' WHERE id = v_txn.id RETURNING * INTO v_txn;
  END IF;

  RETURN v_txn;
END; $$;

REVOKE EXECUTE ON FUNCTION public.finalize_vtu_transaction(text,public.vtu_status,text,text,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.finalize_vtu_transaction(text,public.vtu_status,text,text,text,jsonb) TO service_role;