import { supabase } from '@/lib/supabase';
import { Booking } from '@/types/booking';

export const bookingService = {
  /**
   * สร้างการจองใหม่พร้อม transaction
   */
  async createBooking(bookingData: Booking) {
    try {
      // 1. Insert booking และดึง id กลับมา
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          booking_id: bookingData.bookingId,
          confirmation_code: bookingData.confirmationCode,
          story_theme: bookingData.storyTheme,
          event_date: bookingData.eventDate,
          time_slot: bookingData.timeSlot,
          time_slot_time: bookingData.timeSlotTime,
          group_size: bookingData.groupSize,
          ticket_price: bookingData.ticketPrice,
          subtotal: bookingData.subtotal,
          promo_code: bookingData.promoCode || null,
          total_price: bookingData.totalPrice,
          payment_method: bookingData.paymentMethod,
          payment_status: bookingData.paymentStatus,
          qr_code_data: bookingData.qrCodeData,
          booking_date: bookingData.bookingDate,
          check_in_status: bookingData.checkInStatus,
          source: bookingData.source,
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking insert error:', bookingError);
        throw new Error(`Failed to create booking: ${bookingError.message}`);
      }

      if (!booking) {
        throw new Error('Booking created but no data returned');
      }

      // 2. Insert leader
      const { error: leaderError } = await supabase
        .from('leaders')
        .insert({
          booking_id: booking.id,
          first_name: bookingData.leader.firstName,
          last_name: bookingData.leader.lastName,
          nickname: bookingData.leader.nickname || null,
          email: bookingData.leader.email,
          phone: bookingData.leader.phone,
          age: bookingData.leader.age,
          line_id: bookingData.leader.lineId || null,
        });

      if (leaderError) {
        console.error('Leader insert error:', leaderError);
        // Rollback: ลบ booking ที่สร้างไว้
        await supabase.from('bookings').delete().eq('id', booking.id);
        throw new Error(`Failed to create leader: ${leaderError.message}`);
      }

      // 3. Insert members (ถ้ามี)
      if (bookingData.members && bookingData.members.length > 0) {
        const membersData = bookingData.members.map((member) => ({
          booking_id: booking.id,
          member_id: member.id,
          first_name: member.firstName,
          last_name: member.lastName,
          nickname: member.nickname || null,
          age: member.age,
        }));

        const { error: membersError } = await supabase
          .from('members')
          .insert(membersData);

        if (membersError) {
          console.error('Members insert error:', membersError);
          // Rollback: ลบ booking และ leader
          await supabase.from('bookings').delete().eq('id', booking.id);
          throw new Error(`Failed to create members: ${membersError.message}`);
        }
      }

      return { 
        success: true, 
        data: {
          ...booking,
          leader: bookingData.leader,
          members: bookingData.members,
        }
      };
    } catch (error: any) {
      console.error('Error in createBooking:', error);
      return { 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      };
    }
  },

  /**
   * ดึงข้อมูลการจองด้วย booking_id พร้อมข้อมูลหัวหน้าและสมาชิก
   */
  async getBookingById(bookingId: string) {
    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (bookingError) throw bookingError;
      if (!booking) throw new Error('Booking not found');

      const { data: leader, error: leaderError } = await supabase
        .from('leaders')
        .select('*')
        .eq('booking_id', booking.id)
        .single();

      if (leaderError) throw leaderError;

      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('booking_id', booking.id)
        .order('member_id');

      if (membersError) throw membersError;

      return {
        success: true,
        data: {
          ...booking,
          leader,
          members: members || [],
        },
      };
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  /**
   * ดึงข้อมูลด้วย confirmation code
   */
  async getBookingByConfirmationCode(confirmationCode: string) {
    try {
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          *,
          leaders (*),
          members (*)
        `)
        .eq('confirmation_code', confirmationCode)
        .single();

      if (bookingError) throw bookingError;

      return {
        success: true,
        data: booking,
      };
    } catch (error: any) {
      console.error('Error fetching booking by confirmation code:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * ดึงการจองทั้งหมดตามวันที่
   */
  async getBookingsByDate(eventDate: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          leaders (*),
          members (*)
        `)
        .eq('event_date', eventDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Error fetching bookings by date:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * ดึงการจองทั้งหมดตาม email
   */
  async getBookingsByEmail(email: string) {
    try {
      const { data: leaders, error: leaderError } = await supabase
        .from('leaders')
        .select('booking_id')
        .eq('email', email);

      if (leaderError) throw leaderError;

      const bookingIds = leaders?.map(l => l.booking_id) || [];

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          leaders (*),
          members (*)
        `)
        .in('id', bookingIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error: any) {
      console.error('Error fetching bookings by email:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * อัพเดทสถานะการชำระเงิน
   */
  async updatePaymentStatus(bookingId: string, status: 'pending' | 'completed' | 'failed' | 'refunded') {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ payment_status: status })
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * อัพเดทสถานะ check-in
   */
  async updateCheckInStatus(bookingId: string, status: 'not-checked-in' | 'checked-in' | 'cancelled') {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ check_in_status: status })
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error updating check-in status:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * ลบการจอง (soft delete by updating status)
   */
  async cancelBooking(bookingId: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ 
          check_in_status: 'cancelled',
          payment_status: 'refunded'
        })
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * นับจำนวนการจองตามวันและรอบเวลา
   */
  async getBookingCountByDateAndTimeSlot(eventDate: string, timeSlot: string) {
    try {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('event_date', eventDate)
        .eq('time_slot', timeSlot)
        .neq('check_in_status', 'cancelled');

      if (error) throw error;

      return { success: true, count: count || 0 };
    } catch (error: any) {
      console.error('Error counting bookings:', error);
      return { success: false, error: error.message, count: 0 };
    }
  },
};
