-- ========================================
-- Ghoul Gate - Complete SQL Commands
-- คำสั่ง SQL ทั้งหมดสำหรับ Supabase
-- ========================================

-- ========================================
-- STEP 1: Enable Extensions
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- STEP 2: Create Enum Types
-- ========================================
CREATE TYPE story_theme AS ENUM ('cursed-cinema', 'lesson-blood');
CREATE TYPE payment_method AS ENUM ('credit-card', 'promptpay', 'bank-transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE check_in_status AS ENUM ('checked-in', 'not-checked-in');
CREATE TYPE booking_source AS ENUM ('website', 'manual', 'import');
CREATE TYPE promo_type AS ENUM ('percentage', 'fixed');
CREATE TYPE app_role AS ENUM ('super_admin', 'staff', 'viewer');

-- ========================================
-- STEP 3: Create Tables
-- ========================================

-- Bookings Table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,
  confirmation_code TEXT UNIQUE NOT NULL,
  story_theme story_theme NOT NULL,
  event_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  time_slot_time TEXT NOT NULL,
  group_size INTEGER NOT NULL CHECK (group_size >= 1 AND group_size <= 7),
  ticket_price DECIMAL(10, 2) NOT NULL DEFAULT 80.00,
  subtotal DECIMAL(10, 2) NOT NULL,
  promo_code TEXT,
  promo_discount DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,

  -- Leader information
  leader_first_name TEXT NOT NULL,
  leader_last_name TEXT NOT NULL,
  leader_nickname TEXT,
  leader_email TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  leader_age INTEGER NOT NULL,
  leader_line_id TEXT,

  -- Members stored as JSONB
  members JSONB NOT NULL DEFAULT '[]',

  -- Payment information
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  qr_code_data TEXT,

  -- Check-in information
  check_in_status check_in_status DEFAULT 'not-checked-in',
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_in_by TEXT,

  -- Additional fields
  source booking_source DEFAULT 'website',
  admin_notes TEXT,

  -- Timestamps
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Codes Table
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type promo_type NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  min_purchase DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  usage_limit INTEGER NOT NULL,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Admin Profiles Table
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- STEP 4: Create Indexes
-- ========================================

-- Bookings Indexes
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX idx_bookings_story_theme ON public.bookings(story_theme);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_check_in_status ON public.bookings(check_in_status);
CREATE INDEX idx_bookings_confirmation_code ON public.bookings(confirmation_code);

-- Promo Codes Indexes
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_active ON public.promo_codes(is_active);

-- Activity Logs Indexes
CREATE INDEX idx_activity_logs_timestamp ON public.activity_logs(timestamp DESC);
CREATE INDEX idx_activity_logs_admin ON public.activity_logs(admin_user_id);

-- ========================================
-- STEP 5: Create Functions
-- ========================================

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Check if user is admin (any admin role)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'staff', 'viewer')
  );
$$;

-- Increment promo code usage
CREATE OR REPLACE FUNCTION public.increment_promo_usage(promo_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.promo_codes
  SET used_count = used_count + 1,
      updated_at = NOW()
  WHERE code = promo_code;
END;
$$;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ========================================
-- STEP 6: Create Triggers
-- ========================================

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- STEP 7: Enable Row Level Security (RLS)
-- ========================================

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- STEP 8: Create RLS Policies - Bookings
-- ========================================

-- Allow public to insert bookings (for website booking)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to view their own bookings by confirmation code
CREATE POLICY "Anyone can view bookings with confirmation code"
  ON public.bookings
  FOR SELECT
  TO public
  USING (true);

-- Allow admins to view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Allow admins to update bookings
CREATE POLICY "Admins can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to delete bookings
CREATE POLICY "Admins can delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ========================================
-- STEP 9: Create RLS Policies - Promo Codes
-- ========================================

-- Allow public to view active promo codes
CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes
  FOR SELECT
  TO public
  USING (is_active = true);

-- Allow admins to manage promo codes
CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ========================================
-- STEP 10: Create RLS Policies - User Roles
-- ========================================

-- Only super_admins can view roles
CREATE POLICY "Super admins can view roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Only super_admins can manage roles
CREATE POLICY "Super admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ========================================
-- STEP 11: Create RLS Policies - Admin Profiles
-- ========================================

CREATE POLICY "Admins can view admin profiles"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin profiles"
  ON public.admin_profiles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- ========================================
-- STEP 12: Create RLS Policies - Activity Logs
-- ========================================

CREATE POLICY "Admins can view activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert activity logs"
  ON public.activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- ========================================
-- STEP 13: Insert Initial Promo Codes
-- ========================================

INSERT INTO public.promo_codes (code, type, value, description, min_purchase, max_discount, valid_from, valid_until, usage_limit, used_count, is_active)
VALUES
  ('HALLOWEEN10', 'percentage', 10, 'ลด 10% สำหรับทุกการจอง', 0, 100, '2025-09-01', '2025-10-30', 200, 0, true),
  ('EARLYBIRD', 'fixed', 50, 'ลดทันที 50 บาท สำหรับผู้จองก่อน', 400, NULL, '2025-09-01', '2025-10-15', 100, 0, true),
  ('SCARY20', 'percentage', 20, 'ลด 20% สำหรับกลุ่ม 7 คน', 560, 150, '2025-10-01', '2025-10-30', 50, 0, true),
  ('TREAT15', 'percentage', 15, 'ลด 15% สำหรับทุกการจอง', 0, 120, '2025-09-01', '2025-10-30', 150, 0, true),
  ('FIRSTTIME', 'fixed', 30, 'ลด 30 บาท สำหรับผู้จองครั้งแรก', 0, NULL, '2025-09-01', '2025-10-30', 500, 0, true),
  ('GROUP7FOR6', 'fixed', 80, 'โปรโมชั่น มา 7 จ่าย 6', 560, NULL, '2025-09-01', '2025-10-30', 20, 0, true)
ON CONFLICT (code) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  min_purchase = EXCLUDED.min_purchase,
  max_discount = EXCLUDED.max_discount,
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  usage_limit = EXCLUDED.usage_limit,
  is_active = EXCLUDED.is_active;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check all tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check all functions created
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Check promo codes
SELECT code, type, value, description, is_active
FROM public.promo_codes
ORDER BY code;

-- Check indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ========================================
-- USEFUL QUERIES FOR TESTING
-- ========================================

-- View all bookings
SELECT
  booking_id,
  leader_first_name,
  leader_last_name,
  event_date,
  group_size,
  total_price,
  payment_status,
  check_in_status
FROM public.bookings
ORDER BY created_at DESC
LIMIT 10;

-- View booking statistics
SELECT
  COUNT(*) as total_bookings,
  SUM(total_price) as total_revenue,
  AVG(group_size) as avg_group_size,
  COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as paid_bookings,
  COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_bookings,
  COUNT(CASE WHEN check_in_status = 'checked-in' THEN 1 END) as checked_in
FROM public.bookings;

-- View promo code usage
SELECT
  code,
  type,
  value,
  used_count,
  usage_limit,
  ROUND((used_count::numeric / usage_limit::numeric) * 100, 2) as usage_percentage,
  is_active
FROM public.promo_codes
ORDER BY used_count DESC;

-- View recent activity logs
SELECT
  timestamp,
  admin_name,
  action,
  target,
  details
FROM public.activity_logs
ORDER BY timestamp DESC
LIMIT 20;

-- ========================================
-- CLEANUP QUERIES (USE WITH CAUTION!)
-- ========================================

-- Delete all bookings (for testing)
-- TRUNCATE TABLE public.bookings CASCADE;

-- Reset promo code usage counts
-- UPDATE public.promo_codes SET used_count = 0;

-- Delete all activity logs
-- TRUNCATE TABLE public.activity_logs CASCADE;

-- ========================================
-- END OF SQL COMMANDS
-- ========================================

-- Summary:
-- ✅ 5 Tables created (bookings, promo_codes, user_roles, admin_profiles, activity_logs)
-- ✅ 7 Enum types created
-- ✅ 11 Indexes created
-- ✅ 4 Functions created
-- ✅ 3 Triggers created
-- ✅ Multiple RLS policies created
-- ✅ 6 Initial promo codes inserted

-- Next Steps:
-- 1. Copy this entire file
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Create a new query and paste all SQL
-- 4. Run the query
-- 5. Update your client.ts with Supabase URL and Key
-- 6. Start using the application!

-- For detailed setup guide, see SUPABASE_SETUP.md
