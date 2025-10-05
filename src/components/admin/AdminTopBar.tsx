import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell, Search, User, Settings } from "lucide-react";
import { AdminSession } from "@/types/admin";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface AdminTopBarProps {
  session: AdminSession;
  onMenuClick: () => void;
  pageTitle: string;
}

export const AdminTopBar = ({ session, onMenuClick, pageTitle }: AdminTopBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadCount] = useState(3); // Mock unread notifications

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
      {/* Mobile Menu */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>
        <p className="text-xs text-muted-foreground">
          {format(currentTime, "EEEE d MMMM yyyy • HH:mm", { locale: th })}
        </p>
      </div>

      {/* Search */}
      <div className="hidden w-64 md:block">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหา... (Ctrl+K)"
            className="pl-8"
          />
        </div>
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>การแจ้งเตือน</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-96 overflow-y-auto">
            <DropdownMenuItem className="flex-col items-start py-3">
              <div className="flex w-full items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">การจองใหม่</p>
                  <p className="text-xs text-muted-foreground">
                    มีการจองใหม่ 3 กลุ่ม
                  </p>
                  <p className="text-xs text-muted-foreground">5 นาทีที่แล้ว</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start py-3">
              <div className="flex w-full items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">คำเตือนความจุ</p>
                  <p className="text-xs text-muted-foreground">
                    วันที่ 30 ต.ค. เหลือที่ว่างเพียง 15%
                  </p>
                  <p className="text-xs text-muted-foreground">1 ชั่วโมงที่แล้ว</p>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center">
            ดูทั้งหมด
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
              {session.user.fullName.charAt(0)}
            </div>
            <span className="hidden md:inline">{session.user.fullName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div>
              <p className="font-medium">{session.user.fullName}</p>
              <p className="text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
