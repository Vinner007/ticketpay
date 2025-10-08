import { AdminUser, AdminSession, Permission } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
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

export const loginAdmin = async (email: string, password: string): Promise<AdminUser | null> => {
  try {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      console.error("Login error:", authError);
      return null;
    }

    // Get user role and profile
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id)
      .single();

    if (roleError || !roleData) {
      console.error("Role fetch error:", roleError);
      await supabase.auth.signOut();
      return null;
    }

    // Get or create admin profile
    const { data: profileData, error: profileError } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Profile fetch error:", profileError);
      await supabase.auth.signOut();
      return null;
    }

    // Update last login
    await supabase
      .from("admin_profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("user_id", authData.user.id);

    const admin: AdminUser = {
      id: authData.user.id,
      email: authData.user.email!,
      fullName: profileData?.full_name || authData.user.email!,
      role: roleData.role,
      status: (profileData?.status as "active" | "inactive") || "active",
      permissions: ROLE_PERMISSIONS[roleData.role] || [],
      createdAt: profileData?.created_at || authData.user.created_at,
      lastLogin: new Date().toISOString(),
    };

    return admin;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  await supabase.auth.signOut();
};

export const getAdminSession = async (): Promise<AdminSession | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleError || !roleData) {
      return null;
    }

    // Get admin profile
    const { data: profileData } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    const admin: AdminUser = {
      id: session.user.id,
      email: session.user.email!,
      fullName: profileData?.full_name || session.user.email!,
      role: roleData.role,
      status: (profileData?.status as "active" | "inactive") || "active",
      permissions: ROLE_PERMISSIONS[roleData.role] || [],
      createdAt: profileData?.created_at || session.user.created_at,
      lastLogin: profileData?.last_login || undefined,
    };

    return {
      user: admin,
      token: session.access_token,
      expiresAt: new Date(session.expires_at! * 1000).toISOString(),
      lastActivity: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
};

export const hasPermission = (
  session: AdminSession | null,
  permission: Permission
): boolean => {
  if (!session) return false;
  if (session.user.role === "super_admin") return true;
  return session.user.permissions.includes(permission);
};

export const requireAuth = async (): Promise<AdminSession> => {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
