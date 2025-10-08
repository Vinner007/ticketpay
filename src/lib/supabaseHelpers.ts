import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Type aliases for better readability
export type Booking = Tables<"bookings">;
export type BookingInsert = TablesInsert<"bookings">;
export type BookingUpdate = TablesUpdate<"bookings">;
export type PromoCode = Tables<"promo_codes">;
export type PromoCodeInsert = TablesInsert<"promo_codes">;
export type ActivityLog = Tables<"activity_logs">;

// ===== BOOKING FUNCTIONS =====

/**
 * Create a new booking
 */
export async function createBooking(booking: BookingInsert) {
  const { data, error } = await supabase
    .from("bookings")
    .insert(booking)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all bookings with optional filters
 */
export async function getBookings(filters?: {
  eventDate?: string;
  paymentStatus?: string;
  checkInStatus?: string;
  groupSize?: number;
  paymentMethod?: string;
  source?: string;
}) {
  let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });

  if (filters) {
    if (filters.eventDate) {
      query = query.eq("event_date", filters.eventDate);
    }
    if (filters.paymentStatus) {
      query = query.eq("payment_status", filters.paymentStatus);
    }
    if (filters.checkInStatus) {
      query = query.eq("check_in_status", filters.checkInStatus);
    }
    if (filters.groupSize) {
      query = query.eq("group_size", filters.groupSize);
    }
    if (filters.paymentMethod) {
      query = query.eq("payment_method", filters.paymentMethod);
    }
    if (filters.source) {
      query = query.eq("source", filters.source);
    }
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(id: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get a booking by booking ID
 */
export async function getBookingByBookingId(bookingId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get a booking by confirmation code
 */
export async function getBookingByConfirmationCode(confirmationCode: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("confirmation_code", confirmationCode)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a booking
 */
export async function updateBooking(id: string, updates: BookingUpdate) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a booking
 */
export async function deleteBooking(id: string) {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Check in a booking
 */
export async function checkInBooking(id: string, checkInBy: string) {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      check_in_status: "checked-in",
      check_in_time: new Date().toISOString(),
      check_in_by: checkInBy,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Search bookings by query (searches in booking_id, leader name, email, phone)
 */
export async function searchBookings(searchQuery: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .or(
      `booking_id.ilike.%${searchQuery}%,leader_first_name.ilike.%${searchQuery}%,leader_last_name.ilike.%${searchQuery}%,leader_email.ilike.%${searchQuery}%,leader_phone.ilike.%${searchQuery}%`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get booking statistics
 */
export async function getBookingStats() {
  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Get all bookings
  const { data: allBookings, error: allError } = await supabase
    .from("bookings")
    .select("*");

  if (allError) throw allError;

  const bookings = allBookings || [];

  // Calculate stats
  const todayBookings = bookings.filter((b) => b.event_date === today).length;
  const totalRevenue = bookings
    .filter((b) => b.payment_status === "completed")
    .reduce((sum, b) => sum + b.total_price, 0);
  const pendingPayments = bookings.filter((b) => b.payment_status === "pending").length;
  const checkedIn = bookings.filter((b) => b.check_in_status === "checked-in").length;
  const checkInRate = bookings.length > 0 ? (checkedIn / bookings.length) * 100 : 0;

  return {
    todayBookings,
    totalRevenue,
    pendingPayments,
    checkInRate: checkInRate.toFixed(1),
    totalBookings: bookings.length,
  };
}

// ===== PROMO CODE FUNCTIONS =====

/**
 * Get all promo codes
 */
export async function getPromoCodes(activeOnly: boolean = false) {
  let query = supabase.from("promo_codes").select("*").order("created_at", { ascending: false });

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get a promo code by code
 */
export async function getPromoCodeByCode(code: string) {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error) throw error;
  return data;
}

/**
 * Validate and apply a promo code
 */
export async function validatePromoCode(code: string, subtotal: number) {
  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !promo) {
    return { error: "❌ รหัสไม่ถูกต้อง กรุณาลองใหม่" };
  }

  // Check if promo is still valid
  const now = new Date();
  const validFrom = new Date(promo.valid_from);
  const validUntil = new Date(promo.valid_until);

  if (now < validFrom || now > validUntil) {
    return { error: "❌ รหัสนี้หมดอายุแล้ว" };
  }

  // Check usage limit
  if (promo.used_count >= promo.usage_limit) {
    return { error: "❌ รหัสนี้ถูกใช้งานหมดแล้ว" };
  }

  // Check minimum purchase
  if (promo.min_purchase && subtotal < promo.min_purchase) {
    return {
      error: `❌ ใช้ได้กับยอดขั้นต่ำ ${promo.min_purchase} บาท`,
    };
  }

  // Calculate discount
  let discount = 0;
  if (promo.type === "percentage") {
    discount = Math.floor((subtotal * promo.value) / 100);
    if (promo.max_discount) {
      discount = Math.min(discount, promo.max_discount);
    }
  } else {
    discount = promo.value;
  }

  return { discount, code: promo.code, promoId: promo.id };
}

/**
 * Increment promo code usage
 */
export async function incrementPromoUsage(code: string) {
  const { error } = await supabase.rpc("increment_promo_usage", {
    promo_code: code,
  });

  if (error) throw error;
}

/**
 * Create a new promo code
 */
export async function createPromoCode(promoCode: PromoCodeInsert) {
  const { data, error } = await supabase
    .from("promo_codes")
    .insert(promoCode)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a promo code
 */
export async function updatePromoCode(id: string, updates: Partial<PromoCodeInsert>) {
  const { data, error } = await supabase
    .from("promo_codes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a promo code
 */
export async function deletePromoCode(id: string) {
  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Toggle promo code active status
 */
export async function togglePromoCodeStatus(id: string, isActive: boolean) {
  const { data, error } = await supabase
    .from("promo_codes")
    .update({ is_active: isActive })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== ACTIVITY LOG FUNCTIONS =====

/**
 * Create an activity log entry
 */
export async function createActivityLog(log: {
  admin_email: string;
  admin_name: string;
  action: string;
  target: string;
  target_id: string;
  details?: any;
  ip_address?: string;
}) {
  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      ...log,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get activity logs
 */
export async function getActivityLogs(limit: number = 50) {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Get activity logs for a specific target
 */
export async function getActivityLogsByTarget(target: string, targetId: string) {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("target", target)
    .eq("target_id", targetId)
    .order("timestamp", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ===== UTILITY FUNCTIONS =====

/**
 * Generate a unique booking ID
 */
export function generateBookingId(): string {
  return `HW${Date.now().toString().slice(-6)}`;
}

/**
 * Generate a unique confirmation code
 */
export function generateConfirmationCode(): string {
  return Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
}

/**
 * Generate QR code data
 */
export function generateQRCodeData(bookingId: string): string {
  return `HW${Date.now()}-${bookingId}`;
}
