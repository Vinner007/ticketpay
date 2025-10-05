import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAdminSession, hasPermission } from "@/lib/adminAuth";
import { AdminSession } from "@/types/admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const location = useLocation();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSession = getAdminSession();
    setSession(currentSession);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p>กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    // Store intended destination
    sessionStorage.setItem("admin_redirect", location.pathname);
    return <Navigate to="/admin/login" replace />;
  }

  // Check permission if required
  if (requiredPermission && !hasPermission(session, requiredPermission)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-destructive mb-4">403</h1>
          <h2 className="text-2xl font-semibold mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-muted-foreground mb-6">
            คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบ
          </p>
          <a
            href="/admin/dashboard"
            className="text-primary hover:underline"
          >
            กลับไปหน้าแรก
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
