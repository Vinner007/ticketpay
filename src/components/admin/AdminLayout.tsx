import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { getAdminSession } from "@/lib/adminAuth";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/bookings": "การจัดการการจอง",
  "/admin/check-in": "ระบบเช็คอิน",
  "/admin/promo-codes": "จัดการโค้ดส่วนลด",
  "/admin/settings": "ตั้งค่างาน",
  "/admin/reports": "รายงานและสถิติ",
  "/admin/messages": "ระบบส่งข้อความ",
  "/admin/users": "จัดการผู้ใช้งาน",
};

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(getAdminSession());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentSession = getAdminSession();
    if (!currentSession) {
      navigate("/admin/login");
      return;
    }
    setSession(currentSession);
  }, [navigate]);

  if (!session) {
    return null;
  }

  const pageTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 md:block">
        <AdminSidebar session={session} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar session={session} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar
          session={session}
          pageTitle={pageTitle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
