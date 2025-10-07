import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DateCardProps {
  date: number;
  dayName: string;
  month: string;
  year: number;
  availableSlots: number;
  totalCapacity?: number;
  status: "available" | "limited" | "full";
  dateValue: string;
  timeSlots?: string;
}

export const DateCard = ({
  date,
  dayName,
  month,
  year,
  availableSlots,
  totalCapacity = 252,
  status,
  dateValue,
  timeSlots = "10:00-17:00",
}: DateCardProps) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-success text-success-foreground">
            เปิดจอง
          </Badge>
        );
      case "limited":
        return (
          <Badge className="bg-warning text-warning-foreground">
            ที่นั่งจำกัด
          </Badge>
        );
      case "full":
        return (
          <Badge variant="destructive">
            เต็มแล้ว
          </Badge>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "border-success";
      case "limited":
        return "border-warning";
      case "full":
        return "border-destructive";
    }
  };

  const handleBooking = () => {
    // Save selected date to localStorage
    localStorage.setItem("selectedDate", dateValue);
    navigate("/booking");
  };

  const percentageBooked = ((totalCapacity - availableSlots * 7) / totalCapacity) * 100;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${getStatusColor()} ${
        status === "full" ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={status !== "full" ? handleBooking : undefined}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />

      <CardContent className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-6xl font-bold text-primary">
              {date}
            </div>
            <div className="text-sm text-muted-foreground">
              {dayName}
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge()}
            <div className="text-xs text-muted-foreground mt-1">
              {month} {year}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>ทีมที่เหลือ</span>
            </div>
            <span className="font-semibold text-foreground">
              {availableSlots} / {Math.ceil(totalCapacity / 7)} ทีม
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>ที่นั่งทั้งหมด</span>
            </div>
            <span className="font-semibold text-foreground">
              {totalCapacity} คน
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>เวลา</span>
            </div>
            <span className="font-semibold text-foreground">
              {timeSlots}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>ความคืบหน้า</span>
              <span>{percentageBooked.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  status === "available"
                    ? "bg-success"
                    : status === "limited"
                    ? "bg-warning"
                    : "bg-destructive"
                }`}
                style={{ width: `${percentageBooked}%` }}
              />
            </div>
          </div>
        </div>

        {/* Special Notes */}
        {dateValue === "2025-10-30" && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-xs text-warning">
              มีพิธีเปิดงาน 13:00-13:30 น.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <Button
          className={`w-full ${
            status === "full"
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          }`}
          size="lg"
          disabled={status === "full"}
          onClick={(e) => {
            e.stopPropagation();
            handleBooking();
          }}
        >
          {status === "full" ? "เต็มแล้ว" : "จองเลย"}
        </Button>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border/50">
          2 เรื่องราวสยองขวัญ • ทีมละ 5-7 คน
        </div>
      </CardContent>
    </Card>
  );
};
