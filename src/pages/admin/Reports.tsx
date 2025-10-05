import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Ticket,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  Settings,
  ChevronDown,
  ChevronUp,
  Clock,
  Mail,
  MapPin,
  Award,
  Filter,
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
  Area,
  AreaChart,
} from 'recharts';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SortField = 'code' | 'uses' | 'totalDiscount' | 'avgDiscount' | 'roi';
type SortOrder = 'asc' | 'desc';

export const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-09-01',
    to: '2025-10-05',
  });
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [sortField, setSortField] = useState<SortField>('uses');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Custom Report Builder State
  const [selectedMetrics, setSelectedMetrics] = useState({
    revenue: true,
    bookings: true,
    attendees: false,
    avgTransaction: false,
    promoUsage: false,
  });
  const [groupBy, setGroupBy] = useState('date');

  // Mock data for charts
  const revenueTrendData = [
    { date: '1 ก.ย.', revenue: 12000, bookings: 15 },
    { date: '5 ก.ย.', revenue: 18000, bookings: 22 },
    { date: '10 ก.ย.', revenue: 25000, bookings: 31 },
    { date: '15 ก.ย.', revenue: 32000, bookings: 40 },
    { date: '20 ก.ย.', revenue: 45000, bookings: 56 },
    { date: '25 ก.ย.', revenue: 58000, bookings: 72 },
    { date: '30 ก.ย.', revenue: 72000, bookings: 90 },
    { date: '5 ต.ค.', revenue: 85000, bookings: 106 },
  ];

  const revenueByDateTable = [
    { date: '29 ต.ค. 2025', bookings: 65, attendees: 385, revenue: 30800, avgPerBooking: 474 },
    { date: '30 ต.ค. 2025', bookings: 72, attendees: 425, revenue: 34000, avgPerBooking: 472 },
    { date: '31 ต.ค. 2025', bookings: 63, attendees: 370, revenue: 30400, avgPerBooking: 483 },
  ];

  const revenueByPaymentTable = [
    { method: 'PromptPay', bookings: 90, revenue: 42840, percentage: 45 },
    { method: 'Credit Card', bookings: 70, revenue: 33320, percentage: 35 },
    { method: 'Bank Transfer', bookings: 40, revenue: 19040, percentage: 20 },
  ];

  const paymentMethodData = [
    { name: 'PromptPay', value: 45, color: '#FF6B1A' },
    { name: 'Credit Card', value: 35, color: '#8B00FF' },
    { name: 'Bank Transfer', value: 20, color: '#FFB800' },
  ];

  const bookingStatusData = [
    { name: 'ชำระแล้ว', value: 85, color: '#00FF88' },
    { name: 'รอชำระ', value: 10, color: '#FFB800' },
    { name: 'ยกเลิก', value: 5, color: '#FF3366' },
  ];

  const groupSizeData = [
    { size: '5 คน', count: 60, revenue: 24000 },
    { size: '6 คน', count: 90, revenue: 43200 },
    { size: '7 คน', count: 50, revenue: 28000 },
  ];

  const ageDistributionData = [
    { ageGroup: '18-24', count: 45 },
    { ageGroup: '25-29', count: 78 },
    { ageGroup: '30-34', count: 52 },
    { ageGroup: '35-39', count: 35 },
    { ageGroup: '40-45', count: 20 },
  ];

  const emailDomainsData = [
    { domain: 'gmail.com', count: 120, percentage: 60 },
    { domain: 'hotmail.com', count: 40, percentage: 20 },
    { domain: 'yahoo.com', count: 20, percentage: 10 },
    { domain: 'outlook.com', count: 12, percentage: 6 },
    { domain: 'อื่นๆ', count: 8, percentage: 4 },
  ];

  const bookingTimePatterns = [
    { hour: '00:00-03:00', count: 2 },
    { hour: '03:00-06:00', count: 1 },
    { hour: '06:00-09:00', count: 8 },
    { hour: '09:00-12:00', count: 25 },
    { hour: '12:00-15:00', count: 45 },
    { hour: '15:00-18:00', count: 65 },
    { hour: '18:00-21:00', count: 38 },
    { hour: '21:00-00:00', count: 16 },
  ];

  const promoPerformance = [
    {
      code: 'HALLOWEEN10',
      uses: 78,
      totalDiscount: 15600,
      avgDiscount: 200,
      revenueImpact: 62400,
      roi: 'Good',
    },
    {
      code: 'EARLYBIRD',
      uses: 95,
      totalDiscount: 4750,
      avgDiscount: 50,
      revenueImpact: 45125,
      roi: 'Good',
    },
    {
      code: 'SCARY20',
      uses: 12,
      totalDiscount: 2400,
      avgDiscount: 200,
      revenueImpact: 9600,
      roi: 'Medium',
    },
    {
      code: 'TREAT15',
      uses: 45,
      totalDiscount: 6750,
      avgDiscount: 150,
      revenueImpact: 21600,
      roi: 'Good',
    },
    {
      code: 'FIRSTTIME',
      uses: 28,
      totalDiscount: 840,
      avgDiscount: 30,
      revenueImpact: 13440,
      roi: 'Medium',
    },
  ];

  const topCustomers = [
    { name: 'สมชาย ใจดี', email: 'somchai@gmail.com', bookings: 3, totalSpent: 1440, avgSpent: 480 },
    { name: 'สมหญิง รักงาน', email: 'somying@hotmail.com', bookings: 2, totalSpent: 960, avgSpent: 480 },
    { name: 'วิชัย มั่งมี', email: 'wichai@yahoo.com', bookings: 2, totalSpent: 944, avgSpent: 472 },
    { name: 'ประภา สวยงาม', email: 'prapa@gmail.com', bookings: 2, totalSpent: 952, avgSpent: 476 },
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
      conversionRate: 87,
      avgAge: 28.5,
    };
  }, []);

  const sortedPromos = useMemo(() => {
    const sorted = [...promoPerformance].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortField === 'roi') {
        const roiOrder = { 'Good': 3, 'Medium': 2, 'Low': 1 };
        const aRoi = roiOrder[aValue as keyof typeof roiOrder] || 0;
        const bRoi = roiOrder[bValue as keyof typeof roiOrder] || 0;
        return sortOrder === 'asc' ? aRoi - bRoi : bRoi - aRoi;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    return sorted;
  }, [sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleQuickDateRange = (range: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (range) {
      case 'today':
        setDateRange({ from: todayStr, to: todayStr });
        break;
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        setDateRange({ from: yesterdayStr, to: yesterdayStr });
        break;
      case 'last7':
        const last7 = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        setDateRange({ from: last7.toISOString().split('T')[0], to: todayStr });
        break;
      case 'last30':
        const last30 = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        setDateRange({ from: last30.toISOString().split('T')[0], to: todayStr });
        break;
      case 'thisMonth':
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        setDateRange({ from: firstDay.toISOString().split('T')[0], to: todayStr });
        break;
    }
  };

  const handleExportExcel = () => {
    toast.success('กำลังสร้างไฟล์ Excel...');
    setTimeout(() => {
      toast.success('ดาวน์โหลดไฟล์ Excel สำเร็จ!');
    }, 1500);
  };

  const handleExportPDF = () => {
    toast.success('กำลังสร้างไฟล์ PDF...');
    setTimeout(() => {
      toast.success('ดาวน์โหลดไฟล์ PDF สำเร็จ!');
    }, 1500);
  };

  const handleGenerateReport = () => {
    toast.success(`กำลังสร้างรายงานตั้งแต่ ${dateRange.from} ถึง ${dateRange.to}...`);
  };

  const handleGenerateCustomReport = () => {
    const metrics = Object.entries(selectedMetrics)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    if (metrics.length === 0) {
      toast.error('กรุณาเลือกข้อมูลที่ต้องการในรายงาน');
      return;
    }
    
    toast.success(`กำลังสร้างรายงานแบบกำหนดเอง (${metrics.length} รายการ)`);
    setShowCustomReport(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-spooky text-primary">รายงานและวิเคราะห์</h1>
            <p className="text-muted-foreground">สถิติและข้อมูลการจอง Halloween Night 2025</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCustomReport(true)} variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Custom Report
          </Button>
          <Button onClick={handleExportExcel} variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={handleExportPDF} variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-bold">ช่วงเวลา</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3">
            <Label className="mb-2 block">จากวันที่</Label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </div>
          <div className="md:col-span-3">
            <Label className="mb-2 block">ถึงวันที่</Label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </div>
          <div className="md:col-span-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickDateRange('today')}>
              วันนี้
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickDateRange('yesterday')}>
              เมื่อวาน
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickDateRange('last7')}>
              7 วันที่แล้ว
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickDateRange('last30')}>
              30 วันที่แล้ว
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickDateRange('thisMonth')}>
              เดือนนี้
            </Button>
            <Button onClick={handleGenerateReport} className="bg-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              สร้างรายงาน
            </Button>
          </div>
        </div>
      </Card>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-2 border-primary/20 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">รายได้รวม</p>
              <p className="text-3xl font-bold text-primary mb-1">
                ฿{summary.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-success flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15% จากเดือนก่อน
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-primary/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-destructive/10 to-transparent border-2 border-destructive/20 hover:border-destructive/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">ส่วนลดทั้งหมด</p>
              <p className="text-3xl font-bold text-destructive mb-1">
                ฿{summary.totalDiscounts.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                31.8% ของรายได้รวม
              </p>
            </div>
            <Ticket className="w-12 h-12 text-destructive/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/20 hover:border-success/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">รายได้สุทธิ</p>
              <p className="text-3xl font-bold text-success mb-1">
                ฿{summary.netRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-success flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% จากเดือนก่อน
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-success/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-transparent border-2 border-secondary/20 hover:border-secondary/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">ค่าเฉลี่ย/รายการ</p>
              <p className="text-3xl font-bold text-secondary mb-1">
                ฿{summary.avgTransaction.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                จาก {summary.totalBookings} รายการ
              </p>
            </div>
            <Ticket className="w-12 h-12 text-secondary/30" />
          </div>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card className="p-6 border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">แนวโน้มรายได้และการจอง</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={revenueTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis yAxisId="left" stroke="#FF6B1A" />
            <YAxis yAxisId="right" orientation="right" stroke="#8B00FF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#FF6B1A"
              name="รายได้ (฿)"
              strokeWidth={3}
              dot={{ fill: '#FF6B1A', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              stroke="#8B00FF"
              name="การจอง"
              strokeWidth={3}
              dot={{ fill: '#8B00FF', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            รายได้แยกตามวันที่งาน
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold">วันที่</th>
                  <th className="text-right p-3 text-sm font-semibold">จอง</th>
                  <th className="text-right p-3 text-sm font-semibold">คน</th>
                  <th className="text-right p-3 text-sm font-semibold">รายได้</th>
                </tr>
              </thead>
              <tbody>
                {revenueByDateTable.map((row) => (
                  <tr key={row.date} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-3 font-medium">{row.date}</td>
                    <td className="p-3 text-right">{row.bookings}</td>
                    <td className="p-3 text-right">{row.attendees}</td>
                    <td className="p-3 text-right font-bold text-primary">
                      ฿{row.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-muted/30">
                  <td className="p-3">รวม</td>
                  <td className="p-3 text-right">200</td>
                  <td className="p-3 text-right">1,180</td>
                  <td className="p-3 text-right text-primary">฿95,200</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            รายได้แยกตามช่องทางชำระเงิน
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold">ช่องทาง</th>
                  <th className="text-right p-3 text-sm font-semibold">จำนวน</th>
                  <th className="text-right p-3 text-sm font-semibold">รายได้</th>
                  <th className="text-right p-3 text-sm font-semibold">%</th>
                </tr>
              </thead>
              <tbody>
                {revenueByPaymentTable.map((row) => (
                  <tr key={row.method} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-3 font-medium">{row.method}</td>
                    <td className="p-3 text-right">{row.bookings}</td>
                    <td className="p-3 text-right font-bold text-primary">
                      ฿{row.revenue.toLocaleString()}
                    </td>
                    <td className="p-3 text-right">{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Booking Statistics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">สถิติการจอง</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">การจองทั้งหมด</p>
            <p className="text-3xl font-bold text-primary">{summary.totalBookings}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">ผู้เข้าร่วมทั้งหมด</p>
            <p className="text-3xl font-bold text-secondary">{summary.totalAttendees} คน</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-success/10 to-transparent border border-success/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">ค่าเฉลี่ยต่อกลุ่ม</p>
            <p className="text-3xl font-bold text-success">{summary.avgGroupSize} คน</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-warning/10 to-transparent border border-warning/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">อัตราการแปลง</p>
            <p className="text-3xl font-bold text-warning">{summary.conversionRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">สถานะการจอง</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-semibold mb-3">การจองตามขนาดกลุ่ม</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={groupSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="size" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#FF6B1A" name="จำนวนกลุ่ม" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Demographics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">ข้อมูลประชากร</h3>
          </div>
          
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">อายุเฉลี่ยผู้เข้าร่วม</p>
            <p className="text-4xl font-bold text-primary">{summary.avgAge} ปี</p>
          </div>

          <h4 className="font-semibold mb-3">การกระจายตามช่วงอายุ</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="ageGroup" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#8B00FF" name="จำนวนคน" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">Email Domains ยอดนิยม</h3>
          </div>
          
          <div className="space-y-3">
            {emailDomainsData.map((domain, index) => (
              <div key={domain.domain} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{domain.domain}</span>
                    <span className="text-sm text-muted-foreground">
                      {domain.count} คน ({domain.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${domain.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Booking Time Patterns */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">รูปแบบเวลาการจอง</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          จำนวนการจองแยกตามช่วงเวลาที่ทำการจอง (ช่วงเวลาที่มีการจองมากที่สุดคือ 15:00-18:00)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={bookingTimePatterns}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B1A" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF6B1A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="hour" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#FF6B1A"
              fillOpacity={1}
              fill="url(#colorCount)"
              name="จำนวนการจอง"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Promo Code Performance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">ประสิทธิภาพโค้ดส่วนลด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3">
                  <button
                    onClick={() => handleSort('code')}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    โค้ด
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-right p-3">
                  <button
                    onClick={() => handleSort('uses')}
                    className="flex items-center gap-1 ml-auto hover:text-primary transition-colors"
                  >
                    ครั้งที่ใช้
                    {sortField === 'uses' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="text-right p-3">
                  <button
                    onClick={() => handleSort('totalDiscount')}
                    className="flex items-center gap-1 ml-auto hover:text-primary transition-colors"
                  >
                    ส่วนลดรวม
                    {sortField === 'totalDiscount' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="text-right p-3">
                  <button
                    onClick={() => handleSort('avgDiscount')}
                    className="flex items-center gap-1 ml-auto hover:text-primary transition-colors"
                  >
                    เฉลี่ย/ครั้ง
                    {sortField === 'avgDiscount' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="text-right p-3">รายได้ที่เกิด</th>
                <th className="text-center p-3">
                  <button
                    onClick={() => handleSort('roi')}
                    className="flex items-center gap-1 mx-auto hover:text-primary transition-colors"
                  >
                    ROI
                    {sortField === 'roi' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPromos.map((promo) => (
                <tr key={promo.code} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-primary">{promo.code}</td>
                  <td className="p-3 text-right font-semibold">{promo.uses}</td>
                  <td className="p-3 text-right text-destructive">
                    -฿{promo.totalDiscount.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">฿{promo.avgDiscount}</td>
                  <td className="p-3 text-right text-success font-semibold">
                    ฿{promo.revenueImpact.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        promo.roi === 'Good'
                          ? 'bg-success/20 text-success'
                          : promo.roi === 'Medium'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
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

      {/* Top Customers */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">ลูกค้าชั้นนำ</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          ลูกค้าที่มีการจองมากกว่า 1 ครั้ง แสดงความภักดีต่อแบรนด์
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-semibold">อันดับ</th>
                <th className="text-left p-3 text-sm font-semibold">ชื่อ</th>
                <th className="text-left p-3 text-sm font-semibold">อีเมล</th>
                <th className="text-right p-3 text-sm font-semibold">จำนวนจอง</th>
                <th className="text-right p-3 text-sm font-semibold">ยอดรวม</th>
                <th className="text-right p-3 text-sm font-semibold">เฉลี่ย</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
                <tr key={customer.email} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-warning/20 text-warning' :
                      index === 1 ? 'bg-muted text-muted-foreground' :
                      index === 2 ? 'bg-primary/20 text-primary' :
                      'bg-muted/50 text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{customer.name}</td>
                  <td className="p-3 text-muted-foreground text-sm">{customer.email}</td>
                  <td className="p-3 text-right font-semibold">{customer.bookings} ครั้ง</td>
                  <td className="p-3 text-right font-bold text-primary">
                    ฿{customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-muted-foreground">
                    ฿{customer.avgSpent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Custom Report Builder Dialog */}
      <Dialog open={showCustomReport} onOpenChange={setShowCustomReport}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              สร้างรายงานแบบกำหนดเอง
            </DialogTitle>
            <DialogDescription>
              เลือกข้อมูลและการจัดกลุ่มที่ต้องการแสดงในรายงาน
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">
                เลือกข้อมูลที่ต้องการ
              </Label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedMetrics.revenue}
                    onCheckedChange={(checked) =>
                      setSelectedMetrics({ ...selectedMetrics, revenue: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <span className="font-medium">รายได้</span>
                    <p className="text-xs text-muted-foreground">รายได้รวม, สุทธิ, และส่วนลด</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedMetrics.bookings}
                    onCheckedChange={(checked) =>
                      setSelectedMetrics({ ...selectedMetrics, bookings: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <span className="font-medium">การจอง</span>
                    <p className="text-xs text-muted-foreground">จำนวนการจองและสถานะ</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedMetrics.attendees}
                    onCheckedChange={(checked) =>
                      setSelectedMetrics({ ...selectedMetrics, attendees: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <span className="font-medium">ผู้เข้าร่วม</span>
                    <p className="text-xs text-muted-foreground">จำนวนคนและข้อมูลประชากร</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedMetrics.avgTransaction}
                    onCheckedChange={(checked) =>
                      setSelectedMetrics({ ...selectedMetrics, avgTransaction: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <span className="font-medium">ค่าเฉลี่ย</span>
                    <p className="text-xs text-muted-foreground">ค่าเฉลี่ยต่อรายการและต่อคน</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedMetrics.promoUsage}
                    onCheckedChange={(checked) =>
                      setSelectedMetrics({ ...selectedMetrics, promoUsage: checked as boolean })
                    }
                  />
                  <div className="flex-1">
                    <span className="font-medium">โค้ดส่วนลด</span>
                    <p className="text-xs text-muted-foreground">การใช้งานและประสิทธิภาพ</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">
                จัดกลุ่มข้อมูลตาม
              </Label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">วันที่สร้างรายการจอง</SelectItem>
                  <SelectItem value="eventDate">วันที่งาน</SelectItem>
                  <SelectItem value="paymentMethod">ช่องทางชำระเงิน</SelectItem>
                  <SelectItem value="groupSize">ขนาดกลุ่ม</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>หมายเหตุ:</strong> คุณสามารถบันทึก template รายงานนี้เพื่อใช้ในอนาคต
                และกำหนดให้ส่งรายงานอัตโนมัติได้ (ฟีเจอร์ในอนาคต)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomReport(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleGenerateCustomReport} className="bg-primary">
              <BarChart3 className="w-4 h-4 mr-2" />
              สร้างรายงาน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
