import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfToday } from "date-fns";

export const useStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*");

      if (error) throw error;

      const today = startOfToday();
      const todayBookings = bookings?.filter(
        (b) => new Date(b.created_at || "") >= today
      ) || [];

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + parseFloat(b.total_price?.toString() || "0"), 0) || 0;
      const totalAttendees = bookings?.reduce((sum, b) => sum + (b.group_size || 0), 0) || 0;
      const checkedInToday = bookings?.filter((b) => b.check_in_status === "checked-in" && b.check_in_time && new Date(b.check_in_time) >= today).length || 0;

      const todayIncrease = {
        bookings: todayBookings.length,
        revenue: todayBookings.reduce((sum, b) => sum + parseFloat(b.total_price?.toString() || "0"), 0),
        attendees: todayBookings.reduce((sum, b) => sum + (b.group_size || 0), 0),
      };

      return {
        totalBookings,
        totalRevenue,
        totalAttendees,
        checkedInToday,
        todayIncrease,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
