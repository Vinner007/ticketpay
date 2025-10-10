-- อัพเดท max_capacity ใน daily_summary ให้เป็น 504 คนต่อวัน (2 เนื้อเรื่อง × 252)
-- available_capacity จะถูกคำนวณอัตโนมัติจาก generated column
UPDATE daily_summary 
SET max_capacity = 504,
    updated_at = NOW()
WHERE event_date IN ('2025-10-29', '2025-10-31');

UPDATE daily_summary 
SET max_capacity = 462,
    updated_at = NOW()
WHERE event_date = '2025-10-30';