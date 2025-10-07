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
  TrendingUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  QrCode,
  Clock,
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
import { Booking } from "@/types/booking";
import { toast } from "sonner";

type SortField = 'bookingId' | 'leader' | 'eventDate' | 'groupSize' | 'totalPrice' | 'paymentStatus' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedCheckIn, setSelectedCheckIn] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const itemsPerPage = 20;

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'edit' | 'notes' | 'activity'>('details');
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    eventDate: '',
    groupSize: 5,
    leader: { firstName: '', lastName: '', email: '', phone: '', age: 18, lineId: '' },
    paymentStatus: 'pending' as const,
    adminNotes: '',
  });

  const [adminNotes, setAdminNotes] = useState('');
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const data = localStorage.getItem("admin_bookings");
    if (data) {
      setBookings(JSON.parse(data));
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.eventDate === today);
    const totalRevenue = bookings.filter(b => b.paymentStatus === 'completed').reduce((sum, b) => sum + b.totalPrice, 0);
    const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length;
    const checkedIn = bookings.filter(b => b.checkInStatus).length;
    const checkInRate = bookings.length > 0 ? (checkedIn / bookings.length) * 100 : 0;

    return {
      todayBookings: todayBookings.length,
      totalRevenue,
      pendingPayments,
      checkInRate: checkInRate.toFixed(1),
    };
  }, [bookings]);

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
        case 'bookingId':
          aVal = a.bookingId;
          bVal = b.bookingId;
          break;
        case 'leader':
          aVal = `${a.leader.firstName} ${a.leader.lastName}`;
          bVal = `${b.leader.firstName} ${b.leader.lastName}`;
          break;
        case 'eventDate':
          aVal = a.eventDate;
          bVal = b.eventDate;
          break;
        case 'groupSize':
          aVal = a.groupSize;
          bVal = b.groupSize;
          break;
        case 'totalPrice':
          aVal = a.totalPrice;
          bVal = b.totalPrice;
          break;
        case 'paymentStatus':
          aVal = a.paymentStatus;
          bVal = b.paymentStatus;
          break;
        case 'createdAt':
          aVal = a.createdAt || new Date().toISOString();
          bVal = b.createdAt || new Date().toISOString();
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
          booking.bookingId.toLowerCase().includes(query) ||
          booking.leader.firstName.toLowerCase().includes(query) ||
          booking.leader.lastName.toLowerCase().includes(query) ||
          booking.leader.email.toLowerCase().includes(query) ||
          booking.leader.phone.includes(query);
        
        if (!matchesSearch) return false;
      }

      if (selectedDate !== "all" && booking.eventDate !== selectedDate) return false;
      
      if (selectedStatus !== "all") {
        if (selectedStatus === "paid" && booking.paymentStatus !== "completed") return false;
        if (selectedStatus === "pending" && booking.paymentStatus !== "pending") return false;
        if (selectedStatus === "cancelled" && booking.paymentStatus !== "failed") return false;
      }

      if (selectedSize !== "all" && booking.groupSize !== parseInt(selectedSize)) return false;
      if (selectedPayment !== "all" && booking.paymentMethod !== selectedPayment) return false;
      
      if (selectedCheckIn !== "all") {
        if (selectedCheckIn === "checked-in" && !booking.checkInStatus) return false;
        if (selectedCheckIn === "not-checked-in" && booking.checkInStatus) return false;
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
      setSelectedBookings(new Set(paginatedBookings.map(b => b.bookingId)));
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

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setActiveTab('details');
    setShowViewModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      eventDate: booking.eventDate,
      groupSize: booking.groupSize,
      leader: { ...booking.leader },
      paymentStatus: booking.paymentStatus,
      adminNotes: booking.adminNotes || '',
    });
    setActiveTab('edit');
    setShowViewModal(true);
  };

  const handleCheckIn = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCheckInDialog(true);
  };

  const confirmCheckIn = () => {
    if (selectedBooking) {
      const updated = bookings.map(b => 
        b.bookingId === selectedBooking.bookingId 
          ? { ...b, checkInStatus: true, checkInTime: new Date().toISOString() }
          : b
      );
      setBookings(updated);
      localStorage.setItem('admin_bookings', JSON.stringify(updated));
      toast.success(`เช็คอิน ${selectedBooking.bookingId} สำเร็จ`);
      setShowCheckInDialog(false);
      setShowViewModal(false);
    }
  };

  const handleRefund = (booking: Booking) => {
    setSelectedBooking(booking);
    setRefundReason('');
    setShowRefundDialog(true);
  };

  const confirmRefund = () => {
    if (selectedBooking && refundReason.trim()) {
      const updated = bookings.map(b => 
        b.bookingId === selectedBooking.bookingId 
          ? { ...b, paymentStatus: 'failed' as const, cancellationReason: refundReason }
          : b
      );
      setBookings(updated);
      localStorage.setItem('admin_bookings', JSON.stringify(updated));
      toast.success(`คืนเงิน ${selectedBooking.bookingId} สำเร็จ`);
      setShowRefundDialog(false);
      setShowViewModal(false);
    } else {
      toast.error('กรุณาระบุเหตุผลการคืนเงิน');
    }
  };

  const handleDelete = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      const updated = bookings.filter(b => b.bookingId !== selectedBooking.bookingId);
      setBookings(updated);
      localStorage.setItem('admin_bookings', JSON.stringify(updated));
      toast.success(`ลบการจอง ${selectedBooking.bookingId} สำเร็จ`);
      setShowDeleteDialog(false);
      setShowViewModal(false);
    }
  };

  const handleDownloadQR = (booking: Booking) => {
    toast.success(`กำลังดาวน์โหลด QR Code สำหรับ ${booking.bookingId}`);
    // Implementation for QR download would go here
  };

  const handlePrint = (booking: Booking) => {
    toast.success(`กำลังเตรียมพิมพ์รายละเอียดการจอง ${booking.bookingId}`);
    // Implementation for print would go here
  };

  const handleSaveEdit = () => {
    if (selectedBooking) {
      const updated = bookings.map(b => 
        b.bookingId === selectedBooking.bookingId 
          ? { ...b, ...editForm, updatedAt: new Date().toISOString() }
          : b
      );
      setBookings(updated);
      localStorage.setItem('admin_bookings', JSON.stringify(updated));
      toast.success(`แก้ไขการจอง ${selectedBooking.bookingId} สำเร็จ`);
      setShowViewModal(false);
    }
  };

  const handleSaveNotes = () => {
    if (selectedBooking) {
      const updated = bookings.map(b => 
        b.bookingId === selectedBooking.bookingId 
          ? { ...b, adminNotes: adminNotes }
          : b
      );
      setBookings(updated);
      localStorage.setItem('admin_bookings', JSON.stringify(updated));
      toast.success('บันทึกหมายเหตุสำเร็จ');
    }
  };

  const mockActivityLog = [
    { timestamp: '2025-10-05 14:30', admin: 'Admin', action: 'Created booking', details: 'Initial booking created' },
    { timestamp: '2025-10-05 14:35', admin: 'Admin', action: 'Payment confirmed', details: 'PromptPay payment received' },
  ];

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
          <Button className="gap-2 bg-primary">
            <Plus className="h-4 w-4" />
            New Booking
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('bookingId')}>
                    <div className="flex items-center">
                      Booking ID
                      {getSortIcon('bookingId')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('leader')}>
                    <div className="flex items-center">
                      ชื่อ-นามสกุล
                      {getSortIcon('leader')}
                    </div>
                  </TableHead>
                  <TableHead>ติดต่อ</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('eventDate')}>
                    <div className="flex items-center">
                      วันที่งาน
                      {getSortIcon('eventDate')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('groupSize')}>
                    <div className="flex items-center">
                      จำนวน
                      {getSortIcon('groupSize')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('totalPrice')}>
                    <div className="flex items-center">
                      ยอดเงิน
                      {getSortIcon('totalPrice')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('paymentStatus')}>
                    <div className="flex items-center">
                      สถานะ
                      {getSortIcon('paymentStatus')}
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
                      key={booking.bookingId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewBooking(booking)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBookings.has(booking.bookingId)}
                          onCheckedChange={(checked) =>
                            handleSelectBooking(booking.bookingId, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium font-mono">
                        {booking.bookingId}
                      </TableCell>
                      <TableCell>
                        {booking.leader.firstName} {booking.leader.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="text-xs text-muted-foreground">{booking.leader.email}</div>
                          <div className="text-xs text-muted-foreground">
                            {booking.leader.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(booking.eventDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</TableCell>
                      <TableCell>{booking.groupSize} คน</TableCell>
                      <TableCell className="font-semibold">฿{booking.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                      <TableCell>
                        {booking.checkInStatus ? (
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
                            {!booking.checkInStatus && (
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
                            {booking.paymentStatus === 'completed' && (
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

      {/* View/Edit Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>การจอง {selectedBooking?.bookingId}</DialogTitle>
            <DialogDescription>
              รายละเอียดและจัดการการจอง
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex space-x-1">
              {(['details', 'edit', 'notes', 'activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab === 'details' && 'รายละเอียด'}
                  {tab === 'edit' && 'แก้ไข'}
                  {tab === 'notes' && 'บันทึกย่อ'}
                  {tab === 'activity' && 'ประวัติ'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {activeTab === 'details' && selectedBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">ข้อมูลการจอง</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">รหัสจอง:</span>
                        <span className="font-mono font-semibold">{selectedBooking.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">วันที่งาน:</span>
                        <span>{new Date(selectedBooking.eventDate).toLocaleDateString('th-TH')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">จำนวนคน:</span>
                        <span>{selectedBooking.groupSize} คน</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ยอดเงิน:</span>
                        <span className="font-semibold">฿{selectedBooking.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">สถานะ:</span>
                        {getStatusBadge(selectedBooking.paymentStatus)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">เช็คอิน:</span>
                        {selectedBooking.checkInStatus ? (
                          <Badge className="bg-success">เช็คอินแล้ว</Badge>
                        ) : (
                          <Badge variant="secondary">ยังไม่เช็คอิน</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">ข้อมูลหัวหน้ากลุ่ม</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ชื่อ-นามสกุล:</span>
                        <span>{selectedBooking.leader.firstName} {selectedBooking.leader.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">อีเมล:</span>
                        <span>{selectedBooking.leader.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">โทรศัพท์:</span>
                        <span>{selectedBooking.leader.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">อายุ:</span>
                        <span>{selectedBooking.leader.age} ปี</span>
                      </div>
                      {selectedBooking.leader.lineId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Line ID:</span>
                          <span>{selectedBooking.leader.lineId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">สมาชิกในกลุ่ม</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedBooking.members.map((member, index) => (
                      <Card key={index} className="p-4">
                        <div className="text-sm space-y-1">
                          <div className="font-medium">คนที่ {index + 1}</div>
                          <div className="text-muted-foreground">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            อายุ: {member.age} ปี
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit' && selectedBooking && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>วันที่งาน</Label>
                    <Input
                      type="date"
                      value={editForm.eventDate}
                      onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>จำนวนคน</Label>
                    <Select 
                      value={editForm.groupSize.toString()} 
                      onValueChange={(v) => setEditForm({ ...editForm, groupSize: parseInt(v) })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 คน</SelectItem>
                        <SelectItem value="6">6 คน</SelectItem>
                        <SelectItem value="7">7 คน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ชื่อ</Label>
                    <Input
                      value={editForm.leader.firstName}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        leader: { ...editForm.leader, firstName: e.target.value }
                      })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>นามสกุล</Label>
                    <Input
                      value={editForm.leader.lastName}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        leader: { ...editForm.leader, lastName: e.target.value }
                      })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>อีเมล</Label>
                    <Input
                      type="email"
                      value={editForm.leader.email}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        leader: { ...editForm.leader, email: e.target.value }
                      })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>โทรศัพท์</Label>
                    <Input
                      value={editForm.leader.phone}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        leader: { ...editForm.leader, phone: e.target.value }
                      })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>สถานะการชำระเงิน</Label>
                    <Select 
                      value={editForm.paymentStatus} 
                      onValueChange={(v: any) => setEditForm({ ...editForm, paymentStatus: v })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">รอชำระ</SelectItem>
                        <SelectItem value="completed">ชำระแล้ว</SelectItem>
                        <SelectItem value="failed">ยกเลิก</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleSaveEdit} className="w-full bg-primary">
                  บันทึกการแก้ไข
                </Button>
              </div>
            )}

            {activeTab === 'notes' && selectedBooking && (
              <div className="space-y-4">
                <div>
                  <Label>หมายเหตุจาก Admin</Label>
                  <Textarea
                    value={adminNotes || selectedBooking.adminNotes || ''}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="เพิ่มหมายเหตุสำหรับการจองนี้..."
                    rows={10}
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleSaveNotes} className="w-full bg-primary">
                  บันทึกหมายเหตุ
                </Button>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <History className="h-4 w-4" />
                  <span className="text-sm">ประวัติการแก้ไขและกิจกรรม</span>
                </div>
                {mockActivityLog.map((log, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="flex-shrink-0 w-32 text-xs text-muted-foreground">
                      {log.timestamp}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{log.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {log.details}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        โดย: {log.admin}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Check-in Dialog */}
      <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการเช็คอิน</DialogTitle>
            <DialogDescription>
              ยืนยันการเช็คอินสำหรับการจอง {selectedBooking?.bookingId}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ชื่อ:</span>
                    <span className="font-medium">
                      {selectedBooking.leader.firstName} {selectedBooking.leader.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">จำนวน:</span>
                    <span className="font-medium">{selectedBooking.groupSize} คน</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">วันที่:</span>
                    <span className="font-medium">
                      {new Date(selectedBooking.eventDate).toLocaleDateString('th-TH')}
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
              ดำเนินการคืนเงินสำหรับการจอง {selectedBooking?.bookingId}
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
                    ฿{selectedBooking.totalPrice.toLocaleString()}
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
              คุณแน่ใจหรือไม่ว่าต้องการลบการจอง {selectedBooking?.bookingId}? 
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
export default NewBooking;
