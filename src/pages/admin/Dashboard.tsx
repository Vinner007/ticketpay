import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  DollarSign,
  Ticket,
  CheckCircle,
  TrendingUp,
  Calendar,
  Plus,
  FileText,
  Settings,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalAttendees: 0,
    checkedInToday: 0,
    todayIncrease: {
      bookings: 0,
      revenue: 0,
      attendees: 0,
    },
  });

  useEffect(() => {
    // Load bookings and calculate stats
    const bookingsData = localStorage.getItem("admin_bookings");
    if (bookingsData) {
      const bookings = JSON.parse(bookingsData);
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.totalPrice, 0);
      const totalAttendees = bookings.reduce((sum: number, b: any) => sum + b.groupSize, 0);
      
      setStats({
        totalBookings,
        totalRevenue,
        totalAttendees,
        checkedInToday: 145,
        todayIncrease: {
          bookings: 12,
          revenue: 5760,
          attendees: 72,
        },
      });
    }
  }, []);

  const dateStats = [
    {
      date: "2025-10-28",
      dateDisplay: "28 ตุลาคม 2568",
      bookedGroups: 45,
      capacity: 200,
      totalPeople: 270,
      revenue: 21600,
    },
    {
      date: "2025-10-29",
      dateDisplay: "29 ตุลาคม 2568",
      bookedGroups: 82,
      capacity: 200,
      totalPeople: 492,
      revenue: 39360,
    },
    {
      date: "2025-10-30",
      dateDisplay: "30 ตุลาคม 2568",
      bookedGroups: 56,
      capacity: 250,
      totalPeople: 336,
      revenue: 26720,
    },
  ];

  const bookingTrendData = [
    { date: "01/10", bookings: 5, revenue: 2400 },
    { date: "02/10", bookings: 8, revenue: 3840 },
    { date: "03/10", bookings: 12, revenue: 5760 },
    { date: "04/10", bookings: 15, revenue: 7200 },
    { date: "05/10", bookings: 18, revenue: 8640 },
  ];

  const topPromoCodes = [
    { code: "HALLOWEEN10", uses: 78, discount: 7800 },
    { code: "SCARY20", uses: 45, discount: 9000 },
    { code: "EARLYBIRD", uses: 32, discount: 1600 },
  ];

  const paymentMethods = [
    { name: "PromptPay", value: 102, color: "#FF6B1A" },
    { name: "Credit Card", value: 56, color: "#8B00FF" },
    { name: "Bank Transfer", value: 25, color: "#FFB800" },
  ];

  const recentBookings = [
    {
      id: "HW25183",
      name: "สมชาย ใจดี",
      date: "30 ต.ค.",
      amount: 480,
      time: "2 นาทีที่แล้ว",
    },
    {
      id: "HW25182",
      name: "สมหญิง สวยงาม",
      date: "29 ต.ค.",
      amount: 400,
      time: "15 นาทีที่แล้ว",
    },
    {
      id: "HW25181",
      name: "สมปอง รักสนุก",
      date: "28 ต.ค.",
      amount: 560,
      time: "32 นาทีที่แล้ว",
    },
  ];

  const getCapacityColor = (percentage: number) => {
    if (percentage < 60) return "text-success";
    if (percentage < 90) return "text-accent";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              +{stats.todayIncrease.bookings} วันนี้
            </p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ฿{stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              +฿{stats.todayIncrease.revenue.toLocaleString()} วันนี้
            </p>
          </CardContent>
        </Card>

        <Card className="border-accent/20 hover:border-accent/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-success" />
              +{stats.todayIncrease.attendees} วันนี้
            </p>
          </CardContent>
        </Card>

        <Card className="border-success/20 hover:border-success/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Checked In Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedInToday}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.checkedInToday / stats.totalAttendees) * 100)}% ของทั้งหมด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            การจองแยกตามวัน
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dateStats.map((stat) => {
            const percentage = (stat.bookedGroups / stat.capacity) * 100;
            return (
              <div key={stat.date} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{stat.dateDisplay}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.bookedGroups} / {stat.capacity} กลุ่ม ({stat.totalPeople} คน)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ฿{stat.revenue.toLocaleString()}
                    </p>
                    <Badge
                      variant={percentage < 60 ? "default" : percentage < 90 ? "secondary" : "destructive"}
                      className="mt-1"
                    >
                      {percentage.toFixed(0)}% Full
                    </Badge>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Booking Trend Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Booking Trend (Last 5 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Bookings"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Revenue (฿)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Top Promo Codes */}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Top Promo Codes</h4>
              <div className="space-y-2">
                {topPromoCodes.map((promo) => (
                  <div key={promo.code} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{promo.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {promo.uses} uses
                      </p>
                    </div>
                    <p className="font-semibold text-destructive">
                      -฿{promo.discount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="mb-3 text-sm font-semibold">Payment Methods</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: method.color }}
                      />
                      <span>{method.name}</span>
                    </div>
                    <span className="font-semibold">{method.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.id} • {booking.date}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking.time}</p>
                  </div>
                  <p className="font-semibold">฿{booking.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button className="h-auto flex-col gap-2 p-4" variant="outline">
              <Plus className="h-6 w-6" />
              <span>New Manual Booking</span>
            </Button>
            <Button className="h-auto flex-col gap-2 p-4" variant="outline">
              <Bell className="h-6 w-6" />
              <span>Send Notification</span>
            </Button>
            <Button className="h-auto flex-col gap-2 p-4" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Export Report</span>
            </Button>
            <Button className="h-auto flex-col gap-2 p-4" variant="outline">
              <Settings className="h-6 w-6" />
              <span>Event Settings</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
