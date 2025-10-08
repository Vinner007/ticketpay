import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PromoCode } from "@/types/booking";
import { toast } from "sonner";

export const usePromoCodes = () => {
  const queryClient = useQueryClient();

  const { data: promoCodes = [], isLoading } = useQuery({
    queryKey: ["promo_codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((promo: any) => ({
        code: promo.code,
        type: promo.type,
        value: parseFloat(promo.value),
        description: promo.description,
        minPurchase: parseFloat(promo.min_purchase || 0),
        maxDiscount: promo.max_discount ? parseFloat(promo.max_discount) : undefined,
        validFrom: promo.valid_from,
        validUntil: promo.valid_until,
        usageLimit: promo.usage_limit,
        usedCount: promo.used_count,
        isActive: promo.is_active,
      })) as PromoCode[];
    },
  });

  const validatePromoCode = useMutation({
    mutationFn: async ({ code, subtotal }: { code: string; subtotal: number }) => {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !data) {
        throw new Error("รหัสโค้ดไม่ถูกต้อง");
      }

      const promo = data;
      const now = new Date();
      const validFrom = new Date(promo.valid_from);
      const validUntil = new Date(promo.valid_until);

      if (now < validFrom || now > validUntil) {
        throw new Error("รหัสโค้ดหมดอายุแล้ว");
      }

      if (promo.used_count >= promo.usage_limit) {
        throw new Error("รหัสโค้ดถูกใช้งานครบแล้ว");
      }

      const minPurchase = typeof promo.min_purchase === 'string' 
        ? parseFloat(promo.min_purchase) 
        : promo.min_purchase || 0;
      
      if (subtotal < minPurchase) {
        throw new Error(`ใช้ได้กับยอดขั้นต่ำ ${minPurchase} บาท`);
      }

      let discount = 0;
      const promoValue = typeof promo.value === 'string' ? parseFloat(promo.value) : promo.value;
      
      if (promo.type === "percentage") {
        discount = Math.floor((subtotal * promoValue) / 100);
        if (promo.max_discount) {
          const maxDiscount = typeof promo.max_discount === 'string' 
            ? parseFloat(promo.max_discount) 
            : promo.max_discount;
          discount = Math.min(discount, maxDiscount);
        }
      } else {
        discount = promoValue;
      }

      return {
        code: promo.code,
        discount,
      };
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const incrementPromoUsage = useMutation({
    mutationFn: async (code: string) => {
      // Get current promo code
      const { data: promo, error: fetchError } = await supabase
        .from("promo_codes")
        .select("used_count")
        .eq("code", code)
        .single();

      if (fetchError) throw fetchError;

      // Increment usage
      const { error: updateError } = await supabase
        .from("promo_codes")
        .update({ used_count: (promo.used_count || 0) + 1 })
        .eq("code", code);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo_codes"] });
    },
  });

  return {
    promoCodes,
    isLoading,
    validatePromoCode: validatePromoCode.mutateAsync,
    incrementPromoUsage: incrementPromoUsage.mutate,
  };
};
