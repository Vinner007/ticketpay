import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  Calendar,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  QrCode,
  Printer,
  History,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  getBookings,
  getBookingStats,
  updateBooking,
  deleteBooking,
  checkInBooking,
  searchBookings,
  createActivityLog,
  getActivityLogsByTarget,
  type Booking,
} from "@/lib/supabaseHelpers";

type SortField = 'booking_id' | 'leader_first_name' | 'event_date' | 'group_size' | 'total_price' | 'payment_status' | 'created_at';
type SortOrder = 'asc' | 'desc';

export const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedCheckIn, setSelectedCheckIn] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const itemsPerPage = 20;

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'notes' | 'activity'>('details');
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Edit form state
  const [editForm, setEditForm] = useState({
    event_date: '',
    group_size: 5,
    leader_first_name: '',
    leader_last_name: '',
    leader_email: '',
    leader_phone: '',
    payment_status: 'pending' as const,
    admin_notes: '',
  });

  const [adminNotes, setAdminNotes] = useState('');
  const [refundReason, setRefundReason] = useState('');

  // Stats state
  const [stats, setStats] = useState({
    todayBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    checkInRate: '0',
  });

  useEffect(() => {
    loadBookings();
    loadStats();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("ไม่สามารถโหลดข้อมูลการจองได้");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getBookingStats();
      setStats(statsData as any);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case 'booking_id':
          aVal = a.booking_id;
          bVal = b.booking_id;
          break;
        case 'leader_first_name':
          aVal = `${a.leader_first_name} ${a.leader_last_name}`;
          bVal = `${b.leader_first_name} ${b.leader_last_name}`;
          break;
        case 'event_date':
          aVal = a.event_date;
          bVal = b.event_date;
          break;
        case 'group_size':
          aVal = a.group_size;
          bVal = b.group_size;
          break;
        case 'total_price':
          aVal = a.total_price;
          bVal = b.total_price;
          break;
        case 'payment_status':
          aVal = a.payment_status;
          bVal = b.payment_status;
          break;
        case 'created_at':
          aVal = a.created_at || new Date().toISOString();
          bVal = b.created_at || new Date().toISOString();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [bookings, sortField, sortOrder]);

  const filteredBookings = useMemo(() => {
    return sortedBookings.filter((booking) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          booking.booking_id.toLowerCase().includes(query) ||
          booking.leader_first_name.toLowerCase().includes(query) ||
          booking.leader_last_name.toLowerCase().includes(query) ||
          booking.leader_email.toLowerCase().includes(query) ||
          booking.leader_phone.includes(query);

        if (!matchesSearch) return false;
      }

      if (selectedDate !== "all" && booking.event_date !== selectedDate) return false;

      if (selectedStatus !== "all") {
        if (selectedStatus === "paid" && booking.payment_status !== "completed") return false;
        if (selectedStatus === "pending" && booking.payment_status !== "pending") return false;
        if (selectedStatus === "cancelled" && booking.payment_status !== "failed") return false;
      }

      if (selectedSize !== "all" && booking.group_size !== parseInt(selectedSize)) return false;
      if (selectedPayment !== "all" && booking.payment_method !== selectedPayment) return false;

      if (selectedCheckIn !== "all") {
        if (selectedCheckIn === "checked-in" && booking.check_in_status !== "checked-in") return false;
        if (selectedCheckIn === "not-checked-in" && booking.check_in_status !== "not-checked-in") return false;
      }

      if (selectedSource !== "all" && booking.source !== selectedSource) return false;

      return true;
    });
  }, [sortedBookings, searchQuery, selectedDate, selectedStatus, selectedSize, selectedPayment, selectedCheckIn, selectedSource]);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">ชำระแล้ว</Badge>;
      case "pending":
        return <Badge variant="secondary">รอชำระ</Badge>;
      case "failed":
        return <Badge variant="destructive">ยกเลิก</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookings(new Set(paginatedBookings.map(b => b.booking_id)));
    } else {
      setSelectedBookings(new Set());
    }
  };

  const handleSelectBooking = (bookingId: string, checked: boolean) => {
    const newSelected = new Set(selectedBookings);
    if (checked) {
      newSelected.add(bookingId);
    } else {
      newSelected.delete(bookingId);
    }
    setSelectedBookings(newSelected);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDate("all");
    setSelectedStatus("all");
    setSelectedSize("all");
    setSelectedPayment("all");
    setSelectedCheckIn("all");
    setSelectedSource("all");
    setCurrentPage(1);
    toast.success("ล้างตัวกรองแล้ว");
  };

  const handleViewBooking = async (booking: Booking) => {
    setSelectedBooking(booking);
    setActiveTab('details');

    // Load activity logs
    try {
      const logs = await getActivityLogsByTarget('booking', booking.id);
      setActivityLogs(logs);
    } catch (error) {
      console.error("Error loading activity logs:", error);
    }

    setShowViewModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      event_date: booking.event_date,
      group_size: booking.group_size,
      leader_first_name: booking.leader_first_name,
      leader_last_name: booking.leader_last_name,
      leader_email: booking.leader_email,
      leader_phone: booking.leader_phone,
      payment_status: booking.payment_status as "pending",
      admin_notes: booking.admin_notes || '',
    });
    setActiveTab('edit');
    setShowViewModal(true);
  };

  const handleCheckIn = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCheckInDialog(true);
  };

  const confirmCheckIn = async () => {
    if (selectedBooking) {
      try {
        await checkInBooking(selectedBooking.id, "admin@ghoulgate.com");

        // Log activity
        await createActivityLog({
          admin_email: "admin@ghoulgate.com",
          admin_name: "Admin",
          action: "check_in",
          target: "booking",
          target_id: selectedBooking.id,
          details: { booking_id: selectedBooking.booking_id },
        });

        toast.success(`เช็คอิน ${selectedBooking.booking_id} สำเร็จ`);
        setShowCheckInDialog(false);
        setShowViewModal(false);
        loadBookings();
      } catch (error) {
        console.error("Error checking in:", error);
        toast.error("ไม่สามารถเช็คอินได้");
      }
    }
  };

  const handleRefund = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundReason('');
    setShowRefundDialog(true);
  };

  const confirmRefund = async () => {
    if (selectedBooking && refundReason.trim()) {
      try {
        await updateBooking(selectedBooking.id, {
          payment_status: 'failed',
          admin_notes: `คืนเงิน: ${refundReason}`
        });

        // Log activity
        await createActivityLog({
          admin_email: "admin@ghoulgate.com",
          admin_name: "Admin",
          action: "refund",
          target: "booking",
          target_id: selectedBooking.id,
          details: { booking_id: selectedBooking.booking_id, reason: refundReason },
        });

        toast.success(`คืนเงิน ${selectedBooking.booking_id} สำเร็จ`);
        setShowRefundDialog(false);
        setShowViewModal(false);
        loadBookings();
      } catch (error) {
        console.error("Error refunding:", error);
        toast.error("ไม่สามารถคืนเงินได้");
      }
    } else {
      toast.error('กรุณาระบุเหตุผลการคืนเงิน');
    }
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedBooking) {
      try {
        await deleteBooking(selectedBooking.id);

        // Log activity
        await createActivityLog({
          admin_email: "admin@ghoulgate.com",
          admin_name: "Admin",
          action: "delete_booking",
          target: "booking",
          target_id: selectedBooking.id,
          details: { booking_id: selectedBooking.booking_id },
        });

        toast.success(`ลบการจอง ${selectedBooking.booking_id} สำเร็จ`);
        setShowDeleteDialog(false);
        setShowViewModal(false);
        loadBookings();
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("ไม่สามารถลบการจองได้");
      }
    }
  };

  const handleDownloadQR = (booking: Booking) => {
    toast.success(`กำลังดาวน์โหลด QR Code สำหรับ ${booking.booking_id}`);
  };

  const handlePrint = (booking: Booking) => {
    toast.success(`กำลังเตรียมพิมพ์รายละเอียดการจอง ${booking.booking_id}`);
  };

  const handleSaveEdit = async () => {
    if (selectedBooking) {
      try {
        await updateBooking(selectedBooking.id, editForm);

        // Log activity
        await createActivityLog({
          admin_email: "admin@ghoulgate.com",
          admin_name: "Admin",
          action: "edit_booking",
          target: "booking",
          target_id: selectedBooking.id,
          details: { booking_id: selectedBooking.booking_id, changes: editForm },
        });

        toast.success(`แก้ไขการจอง ${selectedBooking.booking_id} สำเร็จ`);
        setShowViewModal(false);
        loadBookings();
      } catch (error) {
        console.error("Error saving:", error);
        toast.error("ไม่สามารถบันทึกการแก้ไขได้");
      }
    }
  };

  const handleSaveNotes = async () => {
    if (selectedBooking) {
      try {
        await updateBooking(selectedBooking.id, { admin_notes: adminNotes });
        toast.success('บันทึกหมายเหตุสำเร็จ');
      } catch (error) {
        console.error("Error saving notes:", error);
        toast.error("ไม่สามารถบันทึกหมายเหตุได้");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จองวันนี้</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayBookings}</div>
            <p className="text-xs text-muted-foreground">การจองใหม่</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">จากการจองทั้งหมด</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอชำระ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">รายการรอชำระเงิน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เช็คอินแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkInRate}%</div>
            <p className="text-xs text-muted-foreground">อัตราการเช็คอิน</p>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">จัดการการจอง</h2>
          <p className="text-muted-foreground">
            พบ {filteredBookings.length} รายการ
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={loadBookings}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหา ID, ชื่อ, อีเมล, เบอร์โทร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="วันที่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกวัน</SelectItem>
                <SelectItem value="2025-10-29">29 ต.ค.</SelectItem>
                <SelectItem value="2025-10-30">30 ต.ค.</SelectItem>
                <SelectItem value="2025-10-31">31 ต.ค.</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="paid">ชำระแล้ว</SelectItem>
                <SelectItem value="pending">รอชำระ</SelectItem>
                <SelectItem value="cancelled">ยกเลิก</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCheckIn} onValueChange={setSelectedCheckIn}>
              <SelectTrigger>
                <SelectValue placeholder="เช็คอิน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="checked-in">เช็คอินแล้ว</SelectItem>
                <SelectItem value="not-checked-in">ยังไม่เช็คอิน</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="จำนวน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกขนาด</SelectItem>
                <SelectItem value="5">5 คน</SelectItem>
                <SelectItem value="6">6 คน</SelectItem>
                <SelectItem value="7">7 คน</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger>
                <SelectValue placeholder="การชำระ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกวิธี</SelectItem>
                <SelectItem value="promptpay">PromptPay</SelectItem>
                <SelectItem value="credit-card">บัตรเครดิต</SelectItem>
                <SelectItem value="bank-transfer">โอนเงิน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || selectedDate !== "all" || selectedStatus !== "all" || selectedSize !== "all" || selectedPayment !== "all" || selectedCheckIn !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="mt-4"
            >
              <Filter className="mr-2 h-4 w-4" />
              ล้างตัวกรอง
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedBookings.size > 0 && (
        <Card className="border-primary">
          <CardContent className="flex items-center justify-between py-4">
            <span className="text-sm">
              เลือก {selectedBookings.size} รายการ
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                ส่งอีเมล
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                ลบ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBookings.size === paginatedBookings.length && paginatedBookings.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('booking_id')}>
                    <div className="flex items-center">
                      Booking ID
                      {getSortIcon('booking_id')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('leader_first_name')}>
                    <div className="flex items-center">
                      ชื่อ-นามสกุล
                      {getSortIcon('leader_first_name')}
                    </div>
                  </TableHead>
                  <TableHead>ติดต่อ</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('event_date')}>
                    <div className="flex items-center">
                      วันที่งาน
                      {getSortIcon('event_date')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('group_size')}>
                    <div className="flex items-center">
                      จำนวน
                      {getSortIcon('group_size')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('total_price')}>
                    <div className="flex items-center">
                      ยอดเงิน
                      {getSortIcon('total_price')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('payment_status')}>
                    <div className="flex items-center">
                      สถานะ
                      {getSortIcon('payment_status')}
                    </div>
                  </TableHead>
                  <TableHead>เช็คอิน</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Users className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">ไม่พบข้อมูลการจอง</p>
                        <p className="text-sm">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBookings.map((booking) => (
                    <TableRow
                      key={booking.booking_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewBooking(booking)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBookings.has(booking.booking_id)}
                          onCheckedChange={(checked) =>
                            handleSelectBooking(booking.booking_id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium font-mono">
                        {booking.booking_id}
                      </TableCell>
                      <TableCell>
                        {booking.leader_first_name} {booking.leader_last_name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-xs text-muted-foreground">{booking.leader_email}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.leader_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(booking.event_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</TableCell>
                      <TableCell>{booking.group_size} คน</TableCell>
                      <TableCell className="font-semibold">฿{booking.total_price.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(booking.payment_status)}</TableCell>
                      <TableCell>
                        {booking.check_in_status === "checked-in" ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewBooking(booking)}>
                              <Eye className="mr-2 h-4 w-4" />
                              ดูรายละเอียด
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                              <Edit className="mr-2 h-4 w-4" />
                              แก้ไข
                            </DropdownMenuItem>
                            {booking.check_in_status !== "checked-in" && (
                              <DropdownMenuItem onClick={() => handleCheckIn(booking)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                เช็คอิน
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDownloadQR(booking)}>
                              <QrCode className="mr-2 h-4 w-4" />
                              ดาวน์โหลด QR
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(booking)}>
                              <Printer className="mr-2 h-4 w-4" />
                              พิมพ์
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              ส่งอีเมลใหม่
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {booking.payment_status === 'completed' && (
                              <DropdownMenuItem onClick={() => handleRefund(booking)}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                คืนเงิน
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(booking)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              ลบการจอง
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            แสดง {((currentPage - 1) * itemsPerPage) + 1} ถึง{" "}
            {Math.min(currentPage * itemsPerPage, filteredBookings.length)} จาก{" "}
            {filteredBookings.length} รายการ
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </Button>
          </div>
        </div>
      )}

      {/* View/Edit/Notes/Activity Modal - Simplified */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>การจอง {selectedBooking?.booking_id}</DialogTitle>
            <DialogDescription>
              รายละเอียดและจัดการการจอง
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">ข้อมูลการจอง</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">รหัสจอง:</span>
                      <span className="font-mono font-semibold">{selectedBooking.booking_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">วันที่งาน:</span>
                      <span>{new Date(selectedBooking.event_date).toLocaleDateString('th-TH')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">จำนวนคน:</span>
                      <span>{selectedBooking.group_size} คน</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ยอดเงิน:</span>
                      <span className="font-semibold">฿{selectedBooking.total_price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">สถานะ:</span>
                      {getStatusBadge(selectedBooking.payment_status)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">ข้อมูลหัวหน้ากลุ่ม</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ชื่อ-นามสกุล:</span>
                      <span>{selectedBooking.leader_first_name} {selectedBooking.leader_last_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">อีเมล:</span>
                      <span>{selectedBooking.leader_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">โทรศัพท์:</span>
                      <span>{selectedBooking.leader_phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">อายุ:</span>
                      <span>{selectedBooking.leader_age} ปี</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Check-in Dialog */}
      <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการเช็คอิน</DialogTitle>
            <DialogDescription>
              ยืนยันการเช็คอินสำหรับการจอง {selectedBooking?.booking_id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ชื่อ:</span>
                    <span className="font-medium">
                      {selectedBooking.leader_first_name} {selectedBooking.leader_last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">จำนวน:</span>
                    <span className="font-medium">{selectedBooking.group_size} คน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">วันที่:</span>
                    <span className="font-medium">
                      {new Date(selectedBooking.event_date).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-warning">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">การเช็คอินไม่สามารถยกเลิกได้</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmCheckIn} className="bg-success">
              <CheckCircle className="mr-2 h-4 w-4" />
              ยืนยันเช็คอิน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>คืนเงิน</DialogTitle>
            <DialogDescription>
              ดำเนินการคืนเงินสำหรับการจอง {selectedBooking?.booking_id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>เหตุผลการคืนเงิน *</Label>
              <Textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="ระบุเหตุผลการคืนเงิน..."
                rows={4}
                className="mt-2"
              />
            </div>
            {selectedBooking && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">จำนวนเงินที่จะคืน:</span>
                  <span className="font-bold text-lg">
                    ฿{selectedBooking.total_price.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmRefund} variant="destructive">
              <DollarSign className="mr-2 h-4 w-4" />
              ยืนยันคืนเงิน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              ยืนยันการลบ
            </DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบการจอง {selectedBooking?.booking_id}?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              ลบการจอง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
