import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "@/types/booking";
import { toast } from "sonner";

export const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const data = localStorage.getItem("admin_bookings");
    if (data) {
      setBookings(JSON.parse(data));
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
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

      // Date filter
      if (selectedDate !== "all" && booking.eventDate !== selectedDate) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "all") {
        if (selectedStatus === "paid" && booking.paymentStatus !== "completed") return false;
        if (selectedStatus === "pending" && booking.paymentStatus !== "pending") return false;
        if (selectedStatus === "cancelled" && booking.paymentStatus !== "failed") return false;
      }

      // Group size filter
      if (selectedSize !== "all" && booking.groupSize !== parseInt(selectedSize)) {
        return false;
      }

      // Payment method filter
      if (selectedPayment !== "all" && booking.paymentMethod !== selectedPayment) {
        return false;
      }

      return true;
    });
  }, [bookings, searchQuery, selectedDate, selectedStatus, selectedSize, selectedPayment]);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-success">ชำระแล้ว</Badge>;
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
    setCurrentPage(1);
    toast.success("ล้างตัวกรองแล้ว");
  };

  return (
    <div className="space-y-6">
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                <SelectItem value="2025-10-28">28 ต.ค.</SelectItem>
                <SelectItem value="2025-10-29">29 ต.ค.</SelectItem>
                <SelectItem value="2025-10-30">30 ต.ค.</SelectItem>
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

          {(searchQuery || selectedDate !== "all" || selectedStatus !== "all" || selectedSize !== "all" || selectedPayment !== "all") && (
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
                  <TableHead>Booking ID</TableHead>
                  <TableHead>ชื่อ-นามสกุล</TableHead>
                  <TableHead>ติดต่อ</TableHead>
                  <TableHead>วันที่งาน</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>ยอดเงิน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings.map((booking) => (
                  <TableRow
                    key={booking.bookingId}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedBookings.has(booking.bookingId)}
                        onCheckedChange={(checked) =>
                          handleSelectBooking(booking.bookingId, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.bookingId}
                    </TableCell>
                    <TableCell>
                      {booking.leader.firstName} {booking.leader.lastName}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{booking.leader.email}</div>
                        <div className="text-muted-foreground">
                          {booking.leader.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.eventDate.slice(5)}</TableCell>
                    <TableCell>{booking.groupSize} คน</TableCell>
                    <TableCell>฿{booking.totalPrice.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            ส่งอีเมลใหม่
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            ยกเลิก
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  );
};
