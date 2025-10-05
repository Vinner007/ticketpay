import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Ticket,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-09-01',
    to: '2025-10-05',
  });

  // Mock data for charts
  const revenueTrendData = [
    { date: '1 Sep', revenue: 12000, bookings: 15 },
    { date: '5 Sep', revenue: 18000, bookings: 22 },
    { date: '10 Sep', revenue: 25000, bookings: 31 },
    { date: '15 Sep', revenue: 32000, bookings: 40 },
    { date: '20 Sep', revenue: 45000, bookings: 56 },
    { date: '25 Sep', revenue: 58000, bookings: 72 },
    { date: '30 Sep', revenue: 72000, bookings: 90 },
    { date: '5 Oct', revenue: 85000, bookings: 106 },
  ];

  const paymentMethodData = [
    { name: 'PromptPay', value: 45, color: '#FF6B1A' },
    { name: 'Credit Card', value: 35, color: '#8B00FF' },
    { name: 'Bank Transfer', value: 20, color: '#FFB800' },
  ];

  const groupSizeData = [
    { size: '5 คน', count: 60, revenue: 24000 },
    { size: '6 คน', count: 90, revenue: 43200 },
    { size: '7 คน', count: 50, revenue: 28000 },
  ];

  const promoPerformance = [
    {
      code: 'HALLOWEEN10',
      uses: 78,
      totalDiscount: 15600,
      avgDiscount: 200,
      roi: 'Good',
    },
    {
      code: 'EARLYBIRD',
      uses: 95,
      totalDiscount: 4750,
      avgDiscount: 50,
      roi: 'Good',
    },
    {
      code: 'SCARY20',
      uses: 12,
      totalDiscount: 2400,
      avgDiscount: 200,
      roi: 'Medium',
    },
    {
      code: 'TREAT15',
      uses: 45,
      totalDiscount: 6750,
      avgDiscount: 150,
      roi: 'Good',
    },
    {
      code: 'FIRSTTIME',
      uses: 28,
      totalDiscount: 840,
      avgDiscount: 30,
      roi: 'Medium',
    },
  ];

  const summary = useMemo(() => {
    return {
      totalRevenue: 95200,
      totalDiscounts: 30340,
      netRevenue: 64860,
      avgTransaction: 476,
      totalBookings: 200,
      totalAttendees: 1180,
      avgGroupSize: 5.9,
      cancellationRate: 5,
    };
  }, []);

  const handleExportExcel = () => {
    alert('Export to Excel - Feature coming soon!');
  };

  const handleExportPDF = () => {
    alert('Export to PDF - Feature coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-spooky text-primary">รายงานและวิเคราะห์</h1>
            <p className="text-muted-foreground">สถิติและข้อมูลการจอง</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label>จากวันที่</Label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label>ถึงวันที่</Label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDateRange({ from: new Date().toISOString().split('T')[0], to: new Date().toISOString().split('T')[0] })}>
              วันนี้
            </Button>
            <Button variant="outline" onClick={() => {
              const today = new Date();
              const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              setDateRange({ from: lastWeek.toISOString().split('T')[0], to: today.toISOString().split('T')[0] });
            }}>
              7 วันที่แล้ว
            </Button>
            <Button variant="outline" onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
              setDateRange({ from: lastMonth.toISOString().split('T')[0], to: today.toISOString().split('T')[0] });
            }}>
              30 วันที่แล้ว
            </Button>
          </div>
        </div>
      </Card>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">รายได้รวม</p>
              <p className="text-3xl font-bold text-primary">
                ฿{summary.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-primary/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-destructive/10 to-transparent border-2 border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ส่วนลดทั้งหมด</p>
              <p className="text-3xl font-bold text-destructive">
                ฿{summary.totalDiscounts.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-destructive/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">รายได้สุทธิ</p>
              <p className="text-3xl font-bold text-success">
                ฿{summary.netRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-success/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-2 border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ค่าเฉลี่ย/รายการ</p>
              <p className="text-3xl font-bold text-secondary">
                ฿{summary.avgTransaction.toLocaleString()}
              </p>
            </div>
            <Ticket className="w-12 h-12 text-secondary/30" />
          </div>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">แนวโน้มรายได้และการจอง</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#FF6B1A"
              name="รายได้ (บาท)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              stroke="#8B00FF"
              name="การจอง"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment Methods & Group Size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">ช่องทางการชำระเงิน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">การจองตามขนาดกลุ่ม</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupSizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF6B1A" name="จำนวนกลุ่ม" />
              <Bar dataKey="revenue" fill="#8B00FF" name="รายได้ (บาท)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Booking Statistics */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">สถิติการจอง</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">การจองทั้งหมด</p>
            <p className="text-2xl font-bold">{summary.totalBookings}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">ผู้เข้าร่วมทั้งหมด</p>
            <p className="text-2xl font-bold">{summary.totalAttendees} คน</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">ค่าเฉลี่ยต่อกลุ่ม</p>
            <p className="text-2xl font-bold">{summary.avgGroupSize} คน</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">อัตราการยกเลิก</p>
            <p className="text-2xl font-bold">{summary.cancellationRate}%</p>
          </div>
        </div>
      </Card>

      {/* Promo Code Performance */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">ประสิทธิภาพโค้ดส่วนลด</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">โค้ด</th>
                <th className="text-right p-3">ครั้งที่ใช้</th>
                <th className="text-right p-3">ส่วนลดรวม</th>
                <th className="text-right p-3">เฉลี่ย/ครั้ง</th>
                <th className="text-center p-3">ROI</th>
              </tr>
            </thead>
            <tbody>
              {promoPerformance.map((promo) => (
                <tr key={promo.code} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-mono font-bold">{promo.code}</td>
                  <td className="p-3 text-right">{promo.uses}</td>
                  <td className="p-3 text-right">฿{promo.totalDiscount.toLocaleString()}</td>
                  <td className="p-3 text-right">฿{promo.avgDiscount}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        promo.roi === 'Good'
                          ? 'bg-success/20 text-success'
                          : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {promo.roi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
