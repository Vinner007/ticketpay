import { AdminUser, AdminSession } from "@/types/admin";

export const DEMO_ADMINS: AdminUser[] = [
  {
    id: "1",
    email: "admin@ghoulgate.com",
    fullName: "Super Admin",
    role: "super_admin",
    status: "active",
    permissions: ["all"],
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "2",
    email: "staff@ghoulgate.com",
    fullName: "Staff User",
    role: "staff",
    status: "active",
    permissions: [
      "view_bookings",
      "edit_bookings",
      "check_in",
      "manage_promo_codes",
      "view_reports",
    ],
    createdAt: "2025-09-01T00:00:00Z",
  },
];

const DEMO_PASSWORDS: Record<string, string> = {
  "admin@ghoulgate.com": "Admin@2025",
  "staff@ghoulgate.com": "Staff@2025",
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const loginAdmin = (email: string, password: string): AdminUser | null => {
  const admin = DEMO_ADMINS.find((a) => a.email === email);
  
  if (!admin || DEMO_PASSWORDS[email] !== password) {
    return null;
  }

  const session: AdminSession = {
    user: admin,
    token: Math.random().toString(36).substring(2),
    expiresAt: new Date(Date.now() + SESSION_TIMEOUT).toISOString(),
    lastActivity: new Date().toISOString(),
  };

  localStorage.setItem("admin_session", JSON.stringify(session));
  
  // Update last login
  admin.lastLogin = new Date().toISOString();
  
  return admin;
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_session");
};

export const getAdminSession = (): AdminSession | null => {
  const sessionStr = localStorage.getItem("admin_session");
  if (!sessionStr) return null;

  try {
    const session: AdminSession = JSON.parse(sessionStr);
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const lastActivity = new Date(session.lastActivity);

    // Check if session expired
    if (now > expiresAt) {
      logoutAdmin();
      return null;
    }

    // Check if inactive for too long
    if (now.getTime() - lastActivity.getTime() > SESSION_TIMEOUT) {
      logoutAdmin();
      return null;
    }

    // Update last activity
    session.lastActivity = now.toISOString();
    localStorage.setItem("admin_session", JSON.stringify(session));

    return session;
  } catch {
    return null;
  }
};

export const hasPermission = (
  session: AdminSession | null,
  permission: string
): boolean => {
  if (!session) return false;
  if (session.user.role === "super_admin") return true;
  return session.user.permissions.includes(permission);
};

export const requireAuth = (): AdminSession => {
  const session = getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
};
