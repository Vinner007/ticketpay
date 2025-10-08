import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Shield,
  Edit,
  Trash2,
  Key,
  Power,
  Eye,
  Download,
  History,
  ArrowUpDown,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_ADMINS } from '@/lib/adminAuth';
import type { AdminUser, Permission } from '@/types/admin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActivityLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminName: string;
  action: string;
  target: string;
  targetId: string;
  details: {
    field?: string;
    oldValue?: string;
    newValue?: string;
  };
  ipAddress?: string;
  userAgent?: string;
}

export const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastLogin' | 'createdAt'>('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Activity Log
  const [activityFilter, setActivityFilter] = useState({
    adminUser: 'all',
    dateFrom: '',
    dateTo: '',
    actionType: 'all',
  });
  const [activityPage, setActivityPage] = useState(1);
  const activityPerPage = 50;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as 'super_admin' | 'staff' | 'viewer',
    permissions: [] as Permission[],
    status: 'active' as 'active' | 'inactive',
  });

  const allPermissions: Permission[] = [
    'view_bookings',
    'edit_bookings',
    'delete_bookings',
    'check_in',
    'manage_promo_codes',
    'manage_settings',
    'view_reports',
    'send_messages',
    'manage_admins',
  ];

  const permissionLabels: Record<Permission, string> = {
    view_bookings: 'ดูการจอง',
    edit_bookings: 'แก้ไขการจอง',
    delete_bookings: 'ลบการจอง',
    check_in: 'เช็คอิน',
    manage_promo_codes: 'จัดการโค้ดส่วนลด',
    manage_settings: 'แก้ไขการตั้งค่า',
    view_reports: 'ดูรายงาน',
    send_messages: 'ส่งข้อความ',
    manage_admins: 'จัดการผู้ใช้',
  };

  // Mock Activity Logs
  const mockActivityLogs: ActivityLog[] = [
    {
      id: 'log-1',
      timestamp: '2025-10-05T14:30:00',
      adminEmail: 'admin@ghoulgate.com',
      adminName: 'Super Admin',
      action: 'edit_booking',
      target: 'booking',
      targetId: 'HW25045',
      details: { field: 'status', oldValue: 'pending', newValue: 'confirmed' },
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
    },
    {
      id: 'log-2',
      timestamp: '2025-10-05T13:15:00',
      adminEmail: 'staff@ghoulgate.com',
      adminName: 'Staff User',
      action: 'check_in',
      target: 'booking',
      targetId: 'HW25032',
      details: {},
      ipAddress: '192.168.1.105',
    },
    {
      id: 'log-3',
      timestamp: '2025-10-05T12:00:00',
      adminEmail: 'admin@ghoulgate.com',
      adminName: 'Super Admin',
      action: 'create_promo',
      target: 'promo',
      targetId: 'SCARY20',
      details: {},
    },
    {
      id: 'log-4',
      timestamp: '2025-10-05T10:45:00',
      adminEmail: 'staff@ghoulgate.com',
      adminName: 'Staff User',
      action: 'edit_booking',
      target: 'booking',
      targetId: 'HW25028',
      details: { field: 'groupSize', oldValue: '5', newValue: '6' },
    },
    {
      id: 'log-5',
      timestamp: '2025-10-04T16:20:00',
      adminEmail: 'admin@ghoulgate.com',
      adminName: 'Super Admin',
      action: 'delete_booking',
      target: 'booking',
      targetId: 'HW25015',
      details: {},
    },
  ];

  const sortedUsers = [...DEMO_ADMINS].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      case 'lastLogin':
        if (!a.lastLogin) return 1;
        if (!b.lastLogin) return -1;
        return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredActivityLogs = mockActivityLogs.filter((log) => {
    const matchesAdmin =
      activityFilter.adminUser === 'all' || log.adminEmail === activityFilter.adminUser;
    const matchesAction =
      activityFilter.actionType === 'all' || log.action === activityFilter.actionType;
    return matchesAdmin && matchesAction;
  });

  const paginatedLogs = filteredActivityLogs.slice(
    (activityPage - 1) * activityPerPage,
    activityPage * activityPerPage
  );

  const totalActivityPages = Math.ceil(filteredActivityLogs.length / activityPerPage);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
      permissions: [],
      status: 'active',
    });
    setShowAddModal(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      permissions: user.permissions,
      status: user.status,
    });
    setShowAddModal(true);
  };

  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      toast.success(`ลบผู้ใช้ ${selectedUser.fullName} สำเร็จ`);
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleResetPassword = (user: AdminUser) => {
    setSelectedUser(user);
    setShowResetPasswordDialog(true);
  };

  const confirmResetPassword = () => {
    if (selectedUser) {
      toast.success(`ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${selectedUser.email} แล้ว`);
      setShowResetPasswordDialog(false);
      setSelectedUser(null);
    }
  };

  const handleToggleStatus = (user: AdminUser) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    toast.success(
      `${newStatus === 'active' ? 'เปิด' : 'ปิด'}ใช้งานผู้ใช้ ${user.fullName} สำเร็จ`
    );
  };

  const handleSaveUser = () => {
    // Validation
    if (!formData.fullName.trim()) {
      toast.error('กรุณากรอกชื่อ-นามสกุล');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }

    if (!editingUser) {
      if (!formData.password || formData.password.length < 8) {
        toast.error('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
        return;
      }

      if (!/[A-Z]/.test(formData.password)) {
        toast.error('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว');
        return;
      }

      if (!/[0-9]/.test(formData.password)) {
        toast.error('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว');
        return;
      }

      if (!/[!@#$%^&*]/.test(formData.password)) {
        toast.error('รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('รหัสผ่านไม่ตรงกัน');
        return;
      }
    }

    if (formData.role === 'staff' && formData.permissions.length === 0) {
      toast.error('กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ');
      return;
    }

    // Check email uniqueness
    const emailExists = DEMO_ADMINS.some(
      (u) => u.email === formData.email && u.id !== editingUser?.id
    );
    if (emailExists) {
      toast.error('อีเมลนี้ถูกใช้งานแล้ว');
      return;
    }

    // Save logic here
    toast.success(editingUser ? 'แก้ไขผู้ใช้สำเร็จ' : 'เพิ่มผู้ใช้สำเร็จ');
    setShowAddModal(false);
  };

  const handlePermissionToggle = (permission: Permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p) => p !== permission),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'staff':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'viewer':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'staff':
        return 'Staff';
      case 'viewer':
        return 'Viewer';
      default:
        return role;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create_booking: 'สร้างการจอง',
      edit_booking: 'แก้ไขการจอง',
      delete_booking: 'ลบการจอง',
      check_in: 'เช็คอิน',
      create_promo: 'สร้างโค้ด',
      edit_promo: 'แก้ไขโค้ด',
      delete_promo: 'ลบโค้ด',
      edit_settings: 'แก้ไขการตั้งค่า',
      send_message: 'ส่งข้อความ',
      create_user: 'สร้างผู้ใช้',
      edit_user: 'แก้ไขผู้ใช้',
      delete_user: 'ลบผู้ใช้',
    };
    return labels[action] || action;
  };

  const handleExportActivityLog = () => {
    toast.success('กำลังสร้างไฟล์ CSV...');
    setTimeout(() => {
      toast.success('ดาวน์โหลด Activity Log สำเร็จ!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-spooky text-primary">ผู้ใช้งานระบบ</h1>
            <p className="text-muted-foreground">จัดการบัญชี Admin และดู Activity Log</p>
          </div>
        </div>
        {activeTab === 'users' && (
          <Button onClick={handleOpenAddModal} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มผู้ใช้
          </Button>
        )}
        {activeTab === 'activity' && (
          <Button onClick={handleExportActivityLog} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
            ผู้ใช้งาน
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 font-semibold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'activity'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4" />
            Activity Log
          </button>
        </div>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Filters */}
          <Card className="p-4 border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาชื่อหรืออีเมล..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="บทบาท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกบทบาท</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="active">ใช้งาน</SelectItem>
                  <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="เรียงตาม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">ชื่อ</SelectItem>
                  <SelectItem value="lastLogin">Login ล่าสุด</SelectItem>
                  <SelectItem value="createdAt">วันที่สร้าง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="p-6 hover:shadow-lg transition-all border-primary/20 hover:border-primary/40"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-2 ring-primary/20">
                      <span className="text-xl font-bold text-primary">
                        {user.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold">{user.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        แก้ไข
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                        <Key className="w-4 h-4 mr-2" />
                        รีเซ็ตรหัสผ่าน
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                        <Power className="w-4 h-4 mr-2" />
                        {user.status === 'active' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        ลบผู้ใช้
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">บทบาท:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">สิทธิ์:</span>
                    <span className="text-sm font-semibold">{user.permissions.length} รายการ</span>
                  </div>

                  {user.lastLogin && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">เข้าใช้ล่าสุด:</span>
                      <span className="text-xs">
                        {new Date(user.lastLogin).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">สถานะ:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-success/20 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {user.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <Card className="p-12 text-center border-primary/20">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">ไม่พบผู้ใช้งาน</p>
              <p className="text-sm text-muted-foreground mt-1">ลองเปลี่ยนตัวกรองหรือค้นหาใหม่</p>
            </Card>
          )}
        </>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'activity' && (
        <>
          {/* Activity Filters */}
          <Card className="p-4 border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                value={activityFilter.adminUser}
                onValueChange={(v) => setActivityFilter({ ...activityFilter, adminUser: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ผู้ใช้" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกคน</SelectItem>
                  {DEMO_ADMINS.map((admin) => (
                    <SelectItem key={admin.id} value={admin.email}>
                      {admin.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={activityFilter.dateFrom}
                onChange={(e) => setActivityFilter({ ...activityFilter, dateFrom: e.target.value })}
                placeholder="จากวันที่"
              />
              <Input
                type="date"
                value={activityFilter.dateTo}
                onChange={(e) => setActivityFilter({ ...activityFilter, dateTo: e.target.value })}
                placeholder="ถึงวันที่"
              />
              <Select
                value={activityFilter.actionType}
                onValueChange={(v) => setActivityFilter({ ...activityFilter, actionType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="edit_booking">แก้ไขการจอง</SelectItem>
                  <SelectItem value="check_in">เช็คอิน</SelectItem>
                  <SelectItem value="create_promo">สร้างโค้ด</SelectItem>
                  <SelectItem value="delete_booking">ลบการจอง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Activity Log Table */}
          <Card className="overflow-hidden border-primary/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-semibold">เวลา</th>
                    <th className="text-left p-4 text-sm font-semibold">ผู้ใช้</th>
                    <th className="text-left p-4 text-sm font-semibold">การกระทำ</th>
                    <th className="text-left p-4 text-sm font-semibold">เป้าหมาย</th>
                    <th className="text-left p-4 text-sm font-semibold">รายละเอียด</th>
                    <th className="text-left p-4 text-sm font-semibold">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-4 text-sm">
                        {new Date(log.timestamp).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-sm">{log.adminName}</p>
                          <p className="text-xs text-muted-foreground">{log.adminEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm font-medium capitalize">{log.target}</p>
                          <p className="text-xs text-muted-foreground font-mono">{log.targetId}</p>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        {log.details.field ? (
                          <div className="text-xs">
                            <span className="text-muted-foreground">{log.details.field}: </span>
                            <span className="text-destructive line-through">
                              {log.details.oldValue}
                            </span>
                            <span className="mx-1">→</span>
                            <span className="text-success">{log.details.newValue}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-mono text-muted-foreground">
                          {log.ipAddress || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalActivityPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                  disabled={activityPage === 1}
                >
                  ก่อนหน้า
                </Button>
                <span className="text-sm text-muted-foreground">
                  หน้า {activityPage} จาก {totalActivityPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                  disabled={activityPage === totalActivityPages}
                >
                  ถัดไป
                </Button>
              </div>
            )}
          </Card>

          {paginatedLogs.length === 0 && (
            <Card className="p-12 text-center border-primary/20">
              <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">ไม่พบ Activity Log</p>
              <p className="text-sm text-muted-foreground mt-1">
                ลองเปลี่ยนตัวกรองหรือช่วงเวลา
              </p>
            </Card>
          )}
        </>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลผู้ใช้และกำหนดสิทธิ์การเข้าถึง
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">ข้อมูลพื้นฐาน</h3>

              <div>
                <Label htmlFor="fullName">ชื่อ-นามสกุล *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="สมชาย ใจดี"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">อีเมล *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">
                    รหัสผ่าน {editingUser ? '(ไม่บังคับ)' : '*'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="อย่างน้อย 8 ตัวอักษร"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              {!editingUser && formData.password && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-semibold mb-2">ความแข็งแกร่งของรหัสผ่าน:</p>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-2">
                      {formData.password.length >= 8 ? (
                        <CheckCircle className="w-3 h-3 text-success" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={formData.password.length >= 8 ? 'text-success' : ''}>
                        อย่างน้อย 8 ตัวอักษร
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {/[A-Z]/.test(formData.password) ? (
                        <CheckCircle className="w-3 h-3 text-success" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={/[A-Z]/.test(formData.password) ? 'text-success' : ''}>
                        ตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {/[0-9]/.test(formData.password) ? (
                        <CheckCircle className="w-3 h-3 text-success" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className={/[0-9]/.test(formData.password) ? 'text-success' : ''}>
                        ตัวเลขอย่างน้อย 1 ตัว
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {/[!@#$%^&*]/.test(formData.password) ? (
                        <CheckCircle className="w-3 h-3 text-success" />
                      ) : (
                        <XCircle className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span
                        className={/[!@#$%^&*]/.test(formData.password) ? 'text-success' : ''}
                      >
                        อักขระพิเศษอย่างน้อย 1 ตัว (!@#$%^&*)
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Role & Permissions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">บทบาทและสิทธิ์</h3>

              <div>
                <Label>บทบาท *</Label>
                <div className="space-y-2 mt-2">
                  {[
                    {
                      value: 'super_admin',
                      label: 'Super Admin',
                      desc: 'สิทธิ์เต็ม - เข้าถึงทุกอย่าง',
                    },
                    {
                      value: 'staff',
                      label: 'Staff',
                      desc: 'สิทธิ์จำกัด - เลือกได้เอง',
                    },
                    {
                      value: 'viewer',
                      label: 'Viewer',
                      desc: 'อ่านอย่างเดียว - ไม่สามารถแก้ไข',
                    },
                  ].map((role) => (
                    <label
                      key={role.value}
                      className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.role === 'staff' && (
                <div>
                  <Label>เลือกสิทธิ์ * (อย่างน้อย 1 รายการ)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {allPermissions.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermissionToggle(permission)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">{permissionLabels[permission]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <Label>สถานะ</Label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  id="status"
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? 'active' : 'inactive',
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="status" className="cursor-pointer">
                  ใช้งาน (Active)
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSaveUser} className="bg-primary hover:bg-primary/90">
              {editingUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              ยืนยันการลบผู้ใช้
            </DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedUser.fullName}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                บทบาท: {getRoleLabel(selectedUser.role)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              ลบผู้ใช้
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" />
              รีเซ็ตรหัสผ่าน
            </DialogTitle>
            <DialogDescription>
              ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของผู้ใช้
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedUser.fullName}</p>
              <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPasswordDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={confirmResetPassword} className="bg-primary">
              <Key className="w-4 h-4 mr-2" />
              ส่งลิงก์รีเซ็ต
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
