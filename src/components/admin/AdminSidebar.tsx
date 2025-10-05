import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminSession } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Ticket,
  ScanLine,
  Tag,
  Settings,
  BarChart3,
  MessageSquare,
  Users,
  LogOut,
  Ghost,
} from "lucide-react";
import { logoutAdmin } from "@/lib/adminAuth";
import { toast } from "sonner";

interface AdminSidebarProps {
  session: AdminSession;
  isCollapsed?: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard", permission: "all" },
  { icon: Ticket, label: "Bookings", path: "/admin/bookings", permission: "view_bookings" },
  { icon: ScanLine, label: "Check-in", path: "/admin/check-in", permission: "check_in" },
  { icon: Tag, label: "Promo Codes", path: "/admin/promo-codes", permission: "manage_promos" },
  { icon: Settings, label: "Event Settings", path: "/admin/settings", permission: "edit_settings" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports", permission: "view_reports" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages", permission: "send_messages" },
  { icon: Users, label: "Admin Users", path: "/admin/users", permission: "manage_users" },
];

export const AdminSidebar = ({ session, isCollapsed }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    toast.success("ออกจากระบบสำเร็จ");
    navigate("/admin/login");
  };

  const hasPermission = (permission: string) => {
    if (session.user.role === "super_admin") return true;
    if (permission === "all") return true;
    return session.user.permissions.includes(permission);
  };

  const visibleItems = menuItems.filter((item) => hasPermission(item.permission));

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Ghost className="h-6 w-6 text-primary" />
          {!isCollapsed && (
            <span className="font-spooky text-xl text-primary">
              Halloween Admin
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    isActive ? "glow-orange" : ""
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* User Profile */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            {session.user.fullName.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {session.user.fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session.user.role.replace("_", " ")}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
