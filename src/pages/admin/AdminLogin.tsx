import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Ghost, Loader2 } from "lucide-react";
import { loginAdmin, getAdminSession } from "@/lib/adminAuth";
import { toast } from "sonner";

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const session = getAdminSession();
    if (session) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = loginAdmin(email, password);

    if (user) {
      toast.success("เข้าสู่ระบบสำเร็จ");
      navigate("/admin/dashboard");
    } else {
      toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }

    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating ghosts */}
      <div className="absolute left-10 top-20 animate-float opacity-20">
        <Ghost className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute right-20 bottom-20 animate-float-random opacity-20">
        <Ghost className="h-20 w-20 text-secondary" />
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md border-primary/20 shadow-[0_0_40px_rgba(255,107,26,0.2)]">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Ghost className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-spooky">
            🎃 Admin Panel
          </CardTitle>
          <CardDescription className="text-base">
            Halloween Night 2025
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ghoulgate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked as boolean)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  จำฉันไว้
                </Label>
              </div>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm"
                disabled={isLoading}
              >
                ลืมรหัสผ่าน?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full glow-orange"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg border border-muted bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              Demo Accounts:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Super Admin: admin@ghoulgate.com / Admin@2025</p>
              <p>Staff: staff@ghoulgate.com / Staff@2025</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
