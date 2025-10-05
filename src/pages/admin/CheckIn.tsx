import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScanLine, Search, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const CheckIn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats] = useState({
    checkedIn: 145,
    expected: 550,
    remaining: 405,
  });

  const handleSearch = () => {
    if (!searchQuery) {
      toast.error("กรุณากรอก Booking ID, อีเมล หรือเบอร์โทร");
      return;
    }

    // Mock search
    toast.success("ค้นหาเจอแล้ว กำลังเปิดรายละเอียด...");
  };

  const percentage = (stats.checkedIn / stats.expected) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">ระบบเช็คอิน</h2>
        <p className="text-muted-foreground">
          สแกน QR Code หรือค้นหาการจองเพื่อเช็คอิน
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Scanner */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="h-5 w-5" />
                สแกน QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square w-full rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center">
                <div className="text-center">
                  <ScanLine className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    เปิดกล้องเพื่อสแกน QR Code
                  </p>
                  <Button className="mt-4">เปิดกล้อง</Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    หรือค้นหาด้วยตนเอง
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  placeholder="Booking ID, อีเมล หรือเบอร์โทร"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} className="w-full gap-2">
                  <Search className="h-4 w-4" />
                  ค้นหา
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>การสแกนล่าสุด</CardTitle>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">HW2500{i}</p>
                      <p className="text-sm text-muted-foreground">
                        สมชาย ใจดี • 6 คน
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i} นาทีที่แล้ว
                      </p>
                    </div>
                    <Badge variant="default" className="bg-success">
                      เช็คอินแล้ว
                    </Badge>
                  </div>
                ))}
                {[1, 2, 3].length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    ยังไม่มีการสแกน
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สถิติวันนี้</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ความคืบหน้า</span>
                  <span className="text-2xl font-bold text-primary">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-3" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>เช็คอินแล้ว: {stats.checkedIn}</span>
                  <span>คาดว่ามา: {stats.expected}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">
                      {stats.checkedIn}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      เช็คอินแล้ว
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-accent">
                      {stats.remaining}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      เหลือ
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">แยกตามวัน</h4>
                {[
                  { date: "28 ต.ค.", checked: 145, total: 200 },
                  { date: "29 ต.ค.", checked: 0, total: 150 },
                  { date: "30 ต.ค.", checked: 0, total: 200 },
                ].map((day) => {
                  const dayPercentage = (day.checked / day.total) * 100;
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{day.date}</span>
                        <span className="text-muted-foreground">
                          {day.checked}/{day.total}
                        </span>
                      </div>
                      <Progress value={dayPercentage} className="h-2" />
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
