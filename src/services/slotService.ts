import { supabase } from '@/lib/supabase';

export interface TimeSlot {
  id: string;
  event_date: string;
  slot_number: number;
  start_time: string;
  end_time: string;
  round_number: number;
  group_number: number;
  is_available: boolean;
  slot_type: 'game' | 'break' | 'ceremony';
  description?: string;
  booking_id?: string;
}

export interface DailySummary {
  event_date: string;
  total_slots: number;
  available_slots: number;
  booked_slots: number;
  max_capacity: number;
  current_bookings: number;
  available_capacity: number;
}

export const slotService = {
  // ดึงสรุปรายวัน
  async getDailySummary(eventDate?: string) {
    try {
      let query = supabase
        .from('daily_summary')
        .select('*')
        .order('event_date', { ascending: true });

      if (eventDate) {
        query = query.eq('event_date', eventDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      return { success: true, data: data as DailySummary[] };
    } catch (error: any) {
      console.error('Error fetching daily summary:', error);
      return { success: false, error: error.message };
    }
  },

  // ดึง time slots ของวันและรอบที่เลือก
  async getAvailableSlots(eventDate: string) {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('event_date', eventDate)
        .eq('is_available', true)
        .eq('slot_type', 'game')
        .is('booking_id', null)
        .order('slot_number', { ascending: true });

      if (error) throw error;
      return { success: true, data: data as TimeSlot[] };
    } catch (error: any) {
      console.error('Error fetching slots:', error);
      return { success: false, error: error.message };
    }
  },

  // เช็คว่าจองได้หรือไม่
  async canBook(eventDate: string, groupSize: number) {
    try {
      const summaryResult = await this.getDailySummary(eventDate);
      if (!summaryResult.success || !summaryResult.data) return false;

      const summary = summaryResult.data[0];
      return summary.available_capacity >= groupSize && summary.available_slots > 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  },

  // Subscribe Real-time changes
  subscribeToSlots(callback: (payload: any) => void) {
    const channel = supabase
      .channel('slot-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'time_slots',
        },
        callback
      )
      .subscribe();

    return channel;
  },

  subscribeToDailySummary(callback: (payload: any) => void) {
    const channel = supabase
      .channel('summary-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_summary',
        },
        callback
      )
      .subscribe();

    return channel;
  },
};
