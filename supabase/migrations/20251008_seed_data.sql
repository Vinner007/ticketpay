-- Seed Data for Ghoul Gate Halloween Event
-- This migration adds initial data to the database

-- Insert sample promo codes (if not already inserted)
INSERT INTO public.promo_codes (code, type, value, description, min_purchase, max_discount, valid_from, valid_until, usage_limit, used_count, is_active)
VALUES
  ('HALLOWEEN10', 'percentage', 10, 'ลด 10% สำหรับทุกการจอง', 0, 100, '2025-09-01', '2025-10-30', 200, 78, true),
  ('EARLYBIRD', 'fixed', 50, 'ลดทันที 50 บาท สำหรับผู้จองก่อน', 400, NULL, '2025-09-01', '2025-10-15', 100, 95, true),
  ('SCARY20', 'percentage', 20, 'ลด 20% สำหรับกลุ่ม 7 คน', 560, 150, '2025-10-01', '2025-10-30', 50, 12, true),
  ('TREAT15', 'percentage', 15, 'ลด 15% สำหรับทุกการจอง', 0, 120, '2025-09-01', '2025-10-30', 150, 45, true),
  ('FIRSTTIME', 'fixed', 30, 'ลด 30 บาท สำหรับผู้จองครั้งแรก', 0, NULL, '2025-09-01', '2025-10-30', 500, 28, true),
  ('GROUP7FOR6', 'fixed', 80, 'โปรโมชั่น มา 7 จ่าย 6', 560, NULL, '2025-09-01', '2025-10-30', 20, 0, true)
ON CONFLICT (code) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  min_purchase = EXCLUDED.min_purchase,
  max_discount = EXCLUDED.max_discount,
  valid_from = EXCLUDED.valid_from,
  valid_until = EXCLUDED.valid_until,
  usage_limit = EXCLUDED.usage_limit,
  used_count = EXCLUDED.used_count,
  is_active = EXCLUDED.is_active;

-- Note: Sample booking data should be generated through the application
-- or use a separate seed script to generate realistic test data
