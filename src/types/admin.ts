export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "staff" | "viewer";
  status: "active" | "inactive";
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  targetId: string;
  details?: {
    field?: string;
    oldValue?: string;
    newValue?: string;
  };
  ipAddress?: string;
}

export interface Notification {
  id: string;
  type: "new_booking" | "payment" | "cancellation" | "capacity_warning" | "promo_limit" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
  lastActivity: string;
}

export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalAttendees: number;
  checkedInToday: number;
  todayIncrease: {
    bookings: number;
    revenue: number;
    attendees: number;
  };
}

export interface DateStats {
  date: string;
  dateDisplay: string;
  bookedGroups: number;
  capacity: number;
  totalPeople: number;
  revenue: number;
}
