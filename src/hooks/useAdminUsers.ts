import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminUser } from "@/types/admin";
import { toast } from "sonner";

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: adminUsers = [], isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      // Get all users with admin roles
      const { data: usersData, error: usersError } = await supabase
        .from("admin_profiles")
        .select("*");

      if (usersError) throw usersError;

      // Get roles for each user
      const users: AdminUser[] = [];

      for (const profile of usersData || []) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", profile.user_id)
          .single();

        if (roleData) {
          // Get role permissions
          const ROLE_PERMISSIONS: Record<string, any[]> = {
            super_admin: [
              "view_bookings",
              "edit_bookings",
              "delete_bookings",
              "check_in",
              "manage_promo_codes",
              "view_reports",
              "send_messages",
              "manage_settings",
              "manage_admins"
            ],
            staff: [
              "view_bookings",
              "edit_bookings",
              "check_in",
              "manage_promo_codes",
              "view_reports",
            ],
            viewer: [
              "view_bookings",
              "view_reports",
            ],
          };

          users.push({
            id: profile.user_id,
            email: profile.user_id, // We'll need to get email from auth
            fullName: profile.full_name,
            role: roleData.role,
            status: (profile.status as "active" | "inactive") || "active",
            permissions: ROLE_PERMISSIONS[roleData.role] || [],
            createdAt: profile.created_at || new Date().toISOString(),
            lastLogin: profile.last_login || undefined,
          });
        }
      }

      return users;
    },
  });

  return {
    adminUsers,
    isLoading,
  };
};
