-- ENUMS
CREATE TYPE public.app_role AS ENUM ('user','vendor','admin');
CREATE TYPE public.txn_status AS ENUM ('pending','success','failed','reversed');
CREATE TYPE public.txn_type AS ENUM ('funding','purchase','commission','reversal');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  email text,
  referral_code text UNIQUE,
  referred_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- WALLETS
CREATE TABLE public.wallets (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- TRANSACTIONS
CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.txn_type NOT NULL,
  service_slug text,
  service_name text,
  recipient text,
  amount numeric(14,2) NOT NULL,
  status public.txn_status NOT NULL DEFAULT 'success',
  reference text NOT NULL UNIQUE,
  token text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX transactions_user_created_idx ON public.transactions (user_id, created_at DESC);
GRANT SELECT ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- SERVICES CATALOG (public)
CREATE TABLE public.services (
  slug text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  input_label text NOT NULL DEFAULT 'Phone number',
  fixed_amounts numeric(14,2)[] NOT NULL DEFAULT '{}',
  min_amount numeric(14,2) NOT NULL DEFAULT 50,
  max_amount numeric(14,2) NOT NULL DEFAULT 500000,
  discount_percent numeric(5,2) NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (active);

-- DATA PLANS (public)
CREATE TABLE public.data_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL REFERENCES public.services(slug) ON DELETE CASCADE,
  network text NOT NULL,
  name text NOT NULL,
  validity text NOT NULL,
  price numeric(14,2) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.data_plans TO anon, authenticated;
GRANT ALL ON public.data_plans TO service_role;
ALTER TABLE public.data_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Data plans are publicly readable" ON public.data_plans FOR SELECT USING (active);

-- VENDOR APPLICATIONS
CREATE TABLE public.vendor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_phone text NOT NULL,
  business_address text,
  expected_volume text,
  status text NOT NULL DEFAULT 'pending',
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
GRANT SELECT, INSERT ON public.vendor_applications TO authenticated;
GRANT UPDATE ON public.vendor_applications TO authenticated;
GRANT ALL ON public.vendor_applications TO service_role;
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Own profile readable" ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Own roles readable" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Own wallet readable" ON public.wallets FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Own transactions readable" ON public.transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Own application readable" ON public.vendor_applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Own application insert" ON public.vendor_applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins review applications" ON public.vendor_applications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ACCOUNT BOOTSTRAP
CREATE OR REPLACE FUNCTION public.bootstrap_account(p_full_name text DEFAULT NULL, p_phone text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  INSERT INTO public.profiles (id, full_name, phone, email, referral_code)
  VALUES (v_uid, p_full_name, p_phone, v_email, 'HS' || upper(substr(replace(v_uid::text,'-',''),1,6)))
  ON CONFLICT (id) DO UPDATE
    SET full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        email = COALESCE(EXCLUDED.email, public.profiles.email),
        updated_at = now();

  INSERT INTO public.wallets (user_id) VALUES (v_uid) ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'user') ON CONFLICT DO NOTHING;
END;
$$;
GRANT EXECUTE ON FUNCTION public.bootstrap_account(text, text) TO authenticated;

-- WALLET FUNDING
CREATE OR REPLACE FUNCTION public.fund_wallet(p_amount numeric)
RETURNS public.transactions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_txn public.transactions;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF p_amount IS NULL OR p_amount < 100 OR p_amount > 500000 THEN
    RAISE EXCEPTION 'Funding amount must be between 100 and 500000';
  END IF;

  INSERT INTO public.wallets (user_id, balance) VALUES (v_uid, p_amount)
  ON CONFLICT (user_id) DO UPDATE SET balance = public.wallets.balance + p_amount, updated_at = now();

  INSERT INTO public.transactions (user_id, type, service_name, amount, status, reference)
  VALUES (v_uid, 'funding', 'Wallet funding', p_amount, 'success',
          'HS-FND-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)))
  RETURNING * INTO v_txn;

  RETURN v_txn;
END;
$$;
GRANT EXECUTE ON FUNCTION public.fund_wallet(numeric) TO authenticated;

-- PURCHASE
CREATE OR REPLACE FUNCTION public.purchase_service(
  p_service_slug text,
  p_recipient text,
  p_amount numeric,
  p_meta jsonb DEFAULT '{}'::jsonb
) RETURNS public.transactions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_service public.services;
  v_balance numeric;
  v_txn public.transactions;
  v_token text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO v_service FROM public.services WHERE slug = p_service_slug AND active;
  IF v_service.slug IS NULL THEN RAISE EXCEPTION 'Service not available'; END IF;
  IF p_recipient IS NULL OR length(trim(p_recipient)) < 4 THEN RAISE EXCEPTION 'Invalid recipient details'; END IF;
  IF p_amount IS NULL OR p_amount < v_service.min_amount OR p_amount > v_service.max_amount THEN
    RAISE EXCEPTION 'Amount must be between % and % for %', v_service.min_amount, v_service.max_amount, v_service.name;
  END IF;

  SELECT balance INTO v_balance FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'Wallet not found. Please refresh and try again.'; END IF;
  IF v_balance < p_amount THEN RAISE EXCEPTION 'Insufficient wallet balance. Please fund your wallet.'; END IF;

  UPDATE public.wallets SET balance = balance - p_amount, updated_at = now() WHERE user_id = v_uid;

  IF v_service.category IN ('electricity','exam') THEN
    v_token := upper(substr(replace(gen_random_uuid()::text,'-',''),1,16));
  END IF;

  INSERT INTO public.transactions (user_id, type, service_slug, service_name, recipient, amount, status, reference, token, meta)
  VALUES (v_uid, 'purchase', v_service.slug, v_service.name, trim(p_recipient), p_amount, 'success',
          'HS-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)), v_token, COALESCE(p_meta,'{}'::jsonb))
  RETURNING * INTO v_txn;

  RETURN v_txn;
END;
$$;
GRANT EXECUTE ON FUNCTION public.purchase_service(text, text, numeric, jsonb) TO authenticated;

-- SEED SERVICES
INSERT INTO public.services (slug, name, category, description, input_label, fixed_amounts, min_amount, max_amount, discount_percent, sort_order) VALUES
('mtn-airtime','MTN Airtime','airtime','Instant MTN airtime top-up','Phone number','{100,200,500,1000,2000,5000}',50,50000,3,1),
('airtel-airtime','Airtel Airtime','airtime','Instant Airtel airtime top-up','Phone number','{100,200,500,1000,2000,5000}',50,50000,3,2),
('glo-airtime','Glo Airtime','airtime','Instant Glo airtime top-up','Phone number','{100,200,500,1000,2000,5000}',50,50000,3,3),
('9mobile-airtime','9mobile Airtime','airtime','Instant 9mobile airtime top-up','Phone number','{100,200,500,1000,2000,5000}',50,50000,3,4),
('mtn-data','MTN Data','data','SME, corporate and gifting data bundles','Phone number','{}',100,50000,0,5),
('airtel-data','Airtel Data','data','Airtel data bundles at wholesale rates','Phone number','{}',100,50000,0,6),
('glo-data','Glo Data','data','Glo data bundles, instant delivery','Phone number','{}',100,50000,0,7),
('9mobile-data','9mobile Data','data','9mobile data bundles, instant delivery','Phone number','{}',100,50000,0,8),
('ikeja-electric','Ikeja Electric','electricity','Prepaid and postpaid electricity tokens','Meter number','{1000,2000,5000,10000}',500,200000,0,9),
('eko-electric','Eko Electric','electricity','Buy EKEDC units instantly','Meter number','{1000,2000,5000,10000}',500,200000,0,10),
('ibadan-electric','Ibadan Electric','electricity','IBEDC prepaid token vending','Meter number','{1000,2000,5000,10000}',500,200000,0,11),
('abuja-electric','Abuja Electric','electricity','AEDC prepaid and postpaid payments','Meter number','{1000,2000,5000,10000}',500,200000,0,12),
('dstv','DSTV Subscription','cable','Renew any DSTV bouquet','Smartcard number','{2500,6200,11700,24500}',1000,200000,0,13),
('gotv','GOtv Subscription','cable','Max, Jolli, Jinja and Smallie','IUC number','{1900,3900,5700,9600}',900,100000,0,14),
('startimes','Startimes Subscription','cable','Nova to Super packages','Smartcard number','{1700,2600,3800,6500}',900,100000,0,15),
('waec-pin','WAEC Result Checker','exam','Instant WAEC result checker PIN','Candidate name / phone','{3500}',3500,35000,0,16),
('neco-pin','NECO Token','exam','NECO result token, instant delivery','Candidate name / phone','{1300}',1300,13000,0,17),
('jamb-pin','JAMB ePIN','exam','UTME and Direct Entry registration PIN','Candidate name / phone','{7700}',7700,77000,0,18),
('betting-wallet','Betting Wallet','betting','Fund your bookmaker account instantly','Bet account ID','{500,1000,2000,5000}',100,100000,0,19),
('smile-data','Smile Network','data','Smile bundles and top-ups','Smile account / phone','{}',500,100000,0,20),
('spectranet','Spectranet','data','Instant Spectranet PIN vending','Spectranet account','{}',1000,100000,0,21);

-- SEED DATA PLANS
INSERT INTO public.data_plans (service_slug, network, name, validity, price, sort_order) VALUES
('mtn-data','MTN','500MB','30 days',480,1),
('mtn-data','MTN','1GB','30 days',780,2),
('mtn-data','MTN','2GB','30 days',1520,3),
('mtn-data','MTN','5GB','30 days',3650,4),
('mtn-data','MTN','10GB','30 days',6900,5),
('airtel-data','Airtel','500MB','30 days',490,1),
('airtel-data','Airtel','1GB','30 days',790,2),
('airtel-data','Airtel','2GB','30 days',1550,3),
('airtel-data','Airtel','5GB','30 days',3700,4),
('airtel-data','Airtel','10GB','30 days',7000,5),
('glo-data','Glo','1GB','30 days',740,1),
('glo-data','Glo','2GB','30 days',1450,2),
('glo-data','Glo','5GB','30 days',3400,3),
('glo-data','Glo','10GB','30 days',6600,4),
('9mobile-data','9mobile','1GB','30 days',760,1),
('9mobile-data','9mobile','2GB','30 days',1490,2),
('9mobile-data','9mobile','5GB','30 days',3500,3),
('smile-data','Smile','3GB','30 days',1500,1),
('smile-data','Smile','8GB','30 days',3200,2),
('spectranet','Spectranet','7GB','30 days',4500,1),
('spectranet','Spectranet','20GB','30 days',9500,2);