-- Create function to increment promo code usage
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