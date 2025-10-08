# 🎃 Ghoul Gate - Supabase Setup Guide

คู่มือการตั้งค่า Supabase และ SQL สำหรับโปรเจกต์ Ghoul Gate Halloween Event

## 📋 สารบัญ
1. [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
2. [การตั้งค่า Supabase](#การตั้งค่า-supabase)
3. [คำสั่ง SQL ทั้งหมด](#คำสั่ง-sql-ทั้งหมด)
4. [การใช้งาน Helper Functions](#การใช้งาน-helper-functions)
5. [การอัพเดทโค้ด](#การอัพเดทโค้ด)

---

## ข้อกำหนดเบื้องต้น

✅ บัญชี Supabase (ฟรี)
✅ Project URL และ Anon Key จาก Supabase
✅ Node.js และ npm ติดตั้งแล้ว

---

## การตั้งค่า Supabase

### 1. สร้างโปรเจกต์ใหม่ใน Supabase

1. ไปที่ https://supabase.com
2. สร้าง Project ใหม่
3. คัดลอก **Project URL** และ **Anon Key**

### 2. อัพเดท Configuration

แก้ไขไฟล์ `/src/integrations/supabase/client.ts`:

```typescript
const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY";
```

---

## คำสั่ง SQL ทั้งหมด

### 📌 ขั้นตอนที่ 1: รัน Migration หลัก

Migration นี้อยู่ใน `supabase/migrations/` แล้ว:
- `20251008120804_ed8e9ba0-5923-400e-88b7-7a9e455c2fe0.sql`
- `20251008120928_cb768c79-1a42-49d5-9502-f694eacc700f.sql`

**หรือคัดลอก SQL ด้านล่างนี้และรันใน Supabase SQL Editor:**

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE story_theme AS ENUM ('cursed-cinema', 'lesson-blood');
CREATE TYPE payment_method AS ENUM ('credit-card', 'promptpay', 'bank-transfer');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE check_in_status AS ENUM ('checked-in', 'not-checked-in');
CREATE TYPE booking_source AS ENUM ('website', 'manual', 'import');
CREATE TYPE promo_type AS ENUM ('percentage', 'fixed');
CREATE TYPE app_role AS ENUM ('super_admin', 'staff', 'viewer');

-- Create bookings table
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

-- Create indexes for faster queries
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date);
CREATE INDEX idx_bookings_story_theme ON public.bookings(story_theme);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_bookings_check_in_status ON public.bookings(check_in_status);
CREATE INDEX idx_bookings_confirmation_code ON public.bookings(confirmation_code);

-- Create promo_codes table
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

-- Create index for promo codes
CREATE INDEX idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX idx_promo_codes_active ON public.promo_codes(is_active);

-- Create user_roles table for admin permissions
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create admin_profiles table
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
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

-- Create index for activity logs
CREATE INDEX idx_activity_logs_timestamp ON public.activity_logs(timestamp DESC);
CREATE INDEX idx_activity_logs_admin ON public.activity_logs(admin_user_id);

-- Create functions
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
    WHERE user_id = _user_id AND role = _role
  );
$$;

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

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can view bookings with confirmation code"
  ON public.bookings FOR SELECT TO public USING (true);

CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- RLS Policies for promo_codes
CREATE POLICY "Anyone can view active promo codes"
  ON public.promo_codes FOR SELECT TO public
  USING (is_active = true);

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Super admins can view roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for admin_profiles
CREATE POLICY "Admins can view admin profiles"
  ON public.admin_profiles FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage admin profiles"
  ON public.admin_profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for activity_logs
CREATE POLICY "Admins can view activity logs"
  ON public.activity_logs FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert activity logs"
  ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Create triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

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
\`\`\`

### 📌 ขั้นตอนที่ 2: เพิ่มข้อมูล Promo Codes

```sql
INSERT INTO public.promo_codes (code, type, value, description, min_purchase, max_discount, valid_from, valid_until, usage_limit, used_count, is_active)
VALUES
  ('HALLOWEEN10', 'percentage', 10, 'ลด 10% สำหรับทุกการจอง', 0, 100, '2025-09-01', '2025-10-30', 200, 0, true),
  ('EARLYBIRD', 'fixed', 50, 'ลดทันที 50 บาท สำหรับผู้จองก่อน', 400, NULL, '2025-09-01', '2025-10-15', 100, 0, true),
  ('SCARY20', 'percentage', 20, 'ลด 20% สำหรับกลุ่ม 7 คน', 560, 150, '2025-10-01', '2025-10-30', 50, 0, true),
  ('TREAT15', 'percentage', 15, 'ลด 15% สำหรับทุกการจอง', 0, 120, '2025-09-01', '2025-10-30', 150, 0, true),
  ('FIRSTTIME', 'fixed', 30, 'ลด 30 บาท สำหรับผู้จองครั้งแรก', 0, NULL, '2025-09-01', '2025-10-30', 500, 0, true),
  ('GROUP7FOR6', 'fixed', 80, 'โปรโมชั่น มา 7 จ่าย 6', 560, NULL, '2025-09-01', '2025-10-30', 20, 0, true)
ON CONFLICT (code) DO NOTHING;
```

---

## การใช้งาน Helper Functions

ไฟล์ `/src/lib/supabaseHelpers.ts` มี functions ทั้งหมดที่คุณต้องใช้:

### Booking Functions

```typescript
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  checkInBooking,
  searchBookings,
  getBookingStats,
} from "@/lib/supabaseHelpers";

// สร้างการจองใหม่
const booking = await createBooking({
  booking_id: "HW12345",
  confirmation_code: "ABC123",
  story_theme: "cursed-cinema",
  event_date: "2025-10-29",
  // ... ข้อมูลอื่นๆ
});

// ดึงการจองทั้งหมด
const bookings = await getBookings();

// ดึงการจองที่มีเงื่อนไข
const filteredBookings = await getBookings({
  eventDate: "2025-10-29",
  paymentStatus: "completed",
});

// อัพเดทการจอง
await updateBooking(bookingId, {
  payment_status: "completed",
});

// เช็คอิน
await checkInBooking(bookingId, "admin@example.com");

// ค้นหา
const results = await searchBookings("john");

// สถิติ
const stats = await getBookingStats();
```

### Promo Code Functions

```typescript
import {
  getPromoCodes,
  validatePromoCode,
  incrementPromoUsage,
  createPromoCode,
} from "@/lib/supabaseHelpers";

// ดึงโค้ดส่วนลดทั้งหมด
const promoCodes = await getPromoCodes();

// เช็คและใช้โค้ด
const result = await validatePromoCode("HALLOWEEN10", 500);
if ("discount" in result) {
  console.log(`ส่วนลด: ${result.discount} บาท`);
  await incrementPromoUsage("HALLOWEEN10");
}
```

### Activity Log Functions

```typescript
import {
  createActivityLog,
  getActivityLogs,
} from "@/lib/supabaseHelpers";

// บันทึก activity
await createActivityLog({
  admin_email: "admin@example.com",
  admin_name: "Admin Name",
  action: "create_booking",
  target: "booking",
  target_id: "booking-id",
  details: { note: "Created via website" },
});

// ดึง logs
const logs = await getActivityLogs(50); // 50 รายการล่าสุด
```

---

## การอัพเดทโค้ด

### 1. แทนที่ไฟล์เดิม

```bash
# แทนที่ Bookings.tsx (admin)
mv src/pages/admin/Bookings.tsx src/pages/admin/Bookings.old.tsx
mv src/pages/admin/BookingsNew.tsx src/pages/admin/Bookings.tsx
```

### 2. ไฟล์ที่อัพเดทแล้ว

✅ `/src/pages/NewBooking.tsx` - ใช้ Supabase แล้ว
✅ `/src/lib/supabaseHelpers.ts` - Helper functions ใหม่
✅ `/src/pages/admin/BookingsNew.tsx` - Admin bookings ใหม่

### 3. ไฟล์ที่ต้องอัพเดทเพิ่มเติม (ถ้าต้องการ)

- `/src/pages/admin/PromoCodes.tsx` - แก้ไขให้ใช้ `getPromoCodes()` แทน localStorage
- `/src/pages/admin/CheckIn.tsx` - แก้ไขให้ใช้ `getBookings()` และ `checkInBooking()`
- `/src/pages/admin/Reports.tsx` - แก้ไขให้ใช้ `getBookingStats()`

---

## 🧪 การทดสอบ

### 1. ทดสอบการจอง

```bash
npm run dev
```

ไปที่ `http://localhost:5173` และทดสอบ:
1. เลือกวันที่และรอบเวลา
2. กรอกข้อมูล
3. ใช้โค้ดส่วนลด
4. ชำระเงิน

### 2. ตรวจสอบใน Supabase

ไปที่ Supabase Dashboard → Table Editor → bookings

คุณจะเห็นข้อมูลการจองที่ถูกบันทึกแล้ว!

---

## 📊 โครงสร้างฐานข้อมูล

### Tables

1. **bookings** - การจองทั้งหมด
2. **promo_codes** - โค้ดส่วนลด
3. **user_roles** - บทบาทของ admin
4. **admin_profiles** - ข้อมูล admin
5. **activity_logs** - บันทึกการกระทำ

### Functions

1. **has_role()** - เช็คบทบาท
2. **is_admin()** - เช็คว่าเป็น admin หรือไม่
3. **increment_promo_usage()** - เพิ่มจำนวนการใช้โค้ด

---

## 🚀 คำสั่งที่มีประโยชน์

### ดูข้อมูลทั้งหมด

```sql
-- ดูการจองทั้งหมด
SELECT * FROM public.bookings ORDER BY created_at DESC LIMIT 10;

-- ดูโค้ดส่วนลด
SELECT * FROM public.promo_codes WHERE is_active = true;

-- ดูสถิติ
SELECT
  COUNT(*) as total_bookings,
  SUM(total_price) as total_revenue,
  AVG(group_size) as avg_group_size
FROM public.bookings
WHERE payment_status = 'completed';
```

### ลบข้อมูลทดสอบ

```sql
-- ลบการจองทั้งหมด (ระวัง!)
DELETE FROM public.bookings;

-- Reset promo code usage
UPDATE public.promo_codes SET used_count = 0;
```

---

## ❓ FAQ

### Q: ฉันต้องลบ localStorage ไหม?
A: ไม่จำเป็น แต่คุณสามารถลบโค้ดที่เกี่ยวข้องกับ localStorage ใน `mockData.ts` ได้

### Q: RLS คืออะไร?
A: Row Level Security - ระบบรักษาความปลอดภัยที่ควบคุมว่าใครเข้าถึงข้อมูลอะไรได้บ้าง

### Q: ฉันต้องจ่ายเงินไหม?
A: Supabase Free Tier เพียงพอสำหรับโปรเจกต์ขนาดเล็ก (500MB database, 50MB file storage)

### Q: Error "relation does not exist"?
A: ให้แน่ใจว่ารัน SQL migrations ครบทั้งหมดแล้ว

---

## 🎯 สรุป

1. ✅ รัน SQL ใน Supabase SQL Editor
2. ✅ อัพเดท client.ts ด้วย URL และ Key
3. ✅ ใช้ helper functions จาก `supabaseHelpers.ts`
4. ✅ ทดสอบการจองและตรวจสอบใน Supabase

**ตอนนี้โปรเจกต์ของคุณใช้ Supabase แทน localStorage แล้ว! 🎉**

---

## 📞 ต้องการความช่วยเหลือ?

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

---

**Created with ❤️ for Ghoul Gate Halloween Event 2025** 🎃👻
