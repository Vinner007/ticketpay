import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";

interface DateCardProps {
  date: number;
  dayName: string;
  month: string;
  year: number;
  availableSlots: number;
  status: "available" | "limited" | "full" | "sold-out";
  dateValue: string;
  onClick?: () => void;
}

export const DateCard = ({ 
  date, 
  dayName, 
  month, 
  year, 
  availableSlots, 
  status, 
  onClick 
}: DateCardProps) => {
  const statusConfig = {
    available: {
      badge: "มีที่ว่าง",
      badgeClass: "bg-success text-success-foreground glow-gold",
      buttonClass: "",
      disabled: false,
    },
    limited: {
      badge: "เหลือน้อย",
      badgeClass: "bg-primary text-primary-foreground glow-orange",
      buttonClass: "",
      disabled: false,
    },
    full: {
      badge: "เต็มแล้ว",
      badgeClass: "bg-destructive text-destructive-foreground",
      buttonClass: "opacity-50",
      disabled: true,
    },
    "sold-out": {
      badge: "เต็มแล้ว",
      badgeClass: "bg-destructive text-destructive-foreground",
      buttonClass: "opacity-50",
      disabled: true,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="group relative bg-card rounded-xl p-8 border-2 border-border transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-glow-orange">
      <div className="absolute top-4 right-4">
        <Badge className={config.badgeClass}>
          {config.badge}
        </Badge>
      </div>

      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="text-7xl font-spooky text-primary text-glow-orange">
          {date}
        </div>
        <div className="text-center">
          <div className="text-xl font-semibold">{dayName}</div>
          <div className="text-muted-foreground">{month} {year}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2 text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">10:00 - 17:00 น.</span>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 text-muted-foreground">
        <Users className="w-4 h-4" />
        <span className="text-sm">เหลือที่ว่าง: {availableSlots} คน</span>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-accent">80 บาท/คน</div>
      </div>

      <Button
        onClick={onClick}
        disabled={config.disabled}
        className={`w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-orange ${config.buttonClass}`}
      >
        {config.disabled ? "เต็มแล้ว" : "เลือกวันนี้ 🎃"}
      </Button>
    </div>
  );
};
