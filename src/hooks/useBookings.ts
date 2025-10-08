import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Booking } from "@/types/booking";
import { toast } from "sonner";

export const useBookings = () => {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((booking: any) => ({
        bookingId: booking.booking_id,
        confirmationCode: booking.confirmation_code,
        storyTheme: booking.story_theme,
        eventDate: booking.event_date,
        timeSlot: booking.time_slot,
        timeSlotTime: booking.time_slot_time,
        groupSize: booking.group_size,
        ticketPrice: parseFloat(booking.ticket_price),
        subtotal: parseFloat(booking.subtotal),
        promoCode: booking.promo_code ? {
          code: booking.promo_code,
          discount: parseFloat(booking.promo_discount || 0)
        } : undefined,
        totalPrice: parseFloat(booking.total_price),
        leader: {
          firstName: booking.leader_first_name,
          lastName: booking.leader_last_name,
          nickname: booking.leader_nickname,
          email: booking.leader_email,
          phone: booking.leader_phone,
          age: booking.leader_age,
          lineId: booking.leader_line_id,
        },
        members: booking.members || [],
        paymentMethod: booking.payment_method,
        paymentStatus: booking.payment_status,
        qrCodeData: booking.qr_code_data,
        bookingDate: booking.booking_date,
        checkInStatus: booking.check_in_status,
        checkInTime: booking.check_in_time,
        checkInBy: booking.check_in_by,
        source: booking.source,
        adminNotes: booking.admin_notes,
        createdAt: booking.created_at,
      })) as Booking[];
    },
  });

  const createBooking = useMutation({
    mutationFn: async (booking: Omit<Booking, "bookingId" | "confirmationCode" | "createdAt">) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          booking_id: `HW${Date.now().toString().slice(-6)}`,
          confirmation_code: Math.random().toString(36).substring(2, 10).toUpperCase(),
          story_theme: booking.storyTheme,
          event_date: booking.eventDate,
          time_slot: booking.timeSlot,
          time_slot_time: booking.timeSlotTime,
          group_size: booking.groupSize,
          ticket_price: booking.ticketPrice,
          subtotal: booking.subtotal,
          promo_code: booking.promoCode?.code,
          promo_discount: booking.promoCode?.discount || 0,
          total_price: booking.totalPrice,
          leader_first_name: booking.leader.firstName,
          leader_last_name: booking.leader.lastName,
          leader_nickname: booking.leader.nickname,
          leader_email: booking.leader.email,
          leader_phone: booking.leader.phone,
          leader_age: booking.leader.age,
          leader_line_id: booking.leader.lineId,
          members: booking.members,
          payment_method: booking.paymentMethod,
          payment_status: booking.paymentStatus,
          qr_code_data: booking.qrCodeData,
          booking_date: booking.bookingDate,
          check_in_status: booking.checkInStatus || "not-checked-in",
          source: booking.source || "website",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("จองสำเร็จ!");
    },
    onError: (error) => {
      console.error("Booking error:", error);
      toast.error("เกิดข้อผิดพลาดในการจอง");
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Booking> }) => {
      const dbUpdates: any = {};
      
      if (updates.eventDate) dbUpdates.event_date = updates.eventDate;
      if (updates.groupSize) dbUpdates.group_size = updates.groupSize;
      if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
      if (updates.checkInStatus) dbUpdates.check_in_status = updates.checkInStatus;
      if (updates.checkInTime) dbUpdates.check_in_time = updates.checkInTime;
      if (updates.checkInBy) dbUpdates.check_in_by = updates.checkInBy;
      if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;
      if (updates.leader) {
        dbUpdates.leader_first_name = updates.leader.firstName;
        dbUpdates.leader_last_name = updates.leader.lastName;
        dbUpdates.leader_email = updates.leader.email;
        dbUpdates.leader_phone = updates.leader.phone;
      }

      const { data, error } = await supabase
        .from("bookings")
        .update(dbUpdates)
        .eq("booking_id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("อัปเดตการจองสำเร็จ");
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดต");
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("booking_id", bookingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("ลบการจองสำเร็จ");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("เกิดข้อผิดพลาดในการลบ");
    },
  });

  return {
    bookings,
    isLoading,
    error,
    createBooking: createBooking.mutate,
    updateBooking: updateBooking.mutate,
    deleteBooking: deleteBooking.mutate,
  };
};
