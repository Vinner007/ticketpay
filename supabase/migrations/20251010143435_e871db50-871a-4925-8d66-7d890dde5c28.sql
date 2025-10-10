-- สร้าง function สำหรับอัปเดต capacity ใน daily_summary
CREATE OR REPLACE FUNCTION public.update_daily_capacity(
  p_event_date DATE,
  p_group_size INTEGER,
  p_is_cancelled BOOLEAN DEFAULT FALSE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_is_cancelled THEN
    -- คืน capacity กรณียกเลิกการจอง
    UPDATE public.daily_summary
    SET current_bookings = GREATEST(0, current_bookings - p_group_size),
        updated_at = NOW()
    WHERE event_date = p_event_date;
  ELSE
    -- ลด capacity กรณีจองใหม่
    UPDATE public.daily_summary
    SET current_bookings = current_bookings + p_group_size,
        updated_at = NOW()
    WHERE event_date = p_event_date;
  END IF;
  
  -- ตรวจสอบว่ามีข้อมูลหรือไม่ ถ้าไม่มีให้สร้างใหม่
  IF NOT FOUND THEN
    INSERT INTO public.daily_summary (
      event_date,
      max_capacity,
      current_bookings,
      total_slots,
      available_slots,
      booked_slots
    )
    VALUES (
      p_event_date,
      252, -- ค่า default
      CASE WHEN p_is_cancelled THEN 0 ELSE p_group_size END,
      36,
      36,
      0
    );
  END IF;
END;
$$;