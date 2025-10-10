-- แก้ไข max_capacity ให้วันที่ 30 เป็น 504 เหมือนวันอื่นๆ
UPDATE daily_summary 
SET max_capacity = 504,
    updated_at = NOW()
WHERE event_date = '2025-10-30';