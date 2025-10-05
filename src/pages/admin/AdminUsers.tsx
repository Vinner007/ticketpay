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
} from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_ADMINS } from '@/lib/adminAuth';
import type { AdminUser, Permission } from '@/types/admin';

export const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

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
    'manage_promos',
    'edit_settings',
    'view_reports',
    'send_messages',
    'manage_users',
  ];

  const permissionLabels: Record<Permission, string> = {
    view_bookings: 'ดูการจอง',
    edit_bookings: 'แก้ไขการจอง',
    delete_bookings: 'ลบการจอง',
    check_in: 'เช็คอิน',
    manage_promos: 'จัดการโค้ดส่วนลด',
    edit_settings: 'แก้ไขการตั้งค่า',
    view_reports: 'ดูรายงาน',
    send_messages: 'ส่งข้อความ',
    manage_users: 'จัดการผู้ใช้',
  };

  const filteredUsers = DEMO_ADMINS.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

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

      if (formData.password !== formData.confirmPassword) {
        toast.error('รหัสผ่านไม่ตรงกัน');
        return;
      }
    }

    if (formData.role === 'staff' && formData.permissions.length === 0) {
      toast.error('กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-spooky text-primary">ผู้ใช้งานระบบ</h1>
            <p className="text-muted-foreground">จัดการบัญชี Admin</p>
          </div>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มผู้ใช้
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">ทุกบทบาท</option>
              <option value="super_admin">Super Admin</option>
              <option value="staff">Staff</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="active">ใช้งาน</option>
              <option value="inactive">ไม่ใช้งาน</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">
                    {user.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <button className="p-1 hover:bg-muted rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
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
                    {new Date(user.lastLogin).toLocaleDateString('th-TH')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">สถานะ:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.status === 'active'
                      ? 'bg-success/20 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {user.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditUser(user)}
                className="text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                แก้ไข
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                <Power className="w-3 h-3 mr-1" />
                ปิดใช้งาน
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg text-muted-foreground">ไม่พบผู้ใช้งาน</p>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-card z-10">
              <h2 className="text-2xl font-bold">
                {editingUser ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้ใหม่'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                </div>

                {!editingUser && formData.password && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>รหัสผ่านต้องมี:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li className={formData.password.length >= 8 ? 'text-success' : ''}>
                        อย่างน้อย 8 ตัวอักษร
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? 'text-success' : ''}>
                        ตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
                      </li>
                      <li className={/[0-9]/.test(formData.password) ? 'text-success' : ''}>
                        ตัวเลขอย่างน้อย 1 ตัว
                      </li>
                      <li className={/[!@#$%^&*]/.test(formData.password) ? 'text-success' : ''}>
                        อักขระพิเศษอย่างน้อย 1 ตัว
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
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="role"
                        value="super_admin"
                        checked={formData.role === 'super_admin'}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value as any })
                        }
                      />
                      <div>
                        <p className="font-semibold">Super Admin</p>
                        <p className="text-xs text-muted-foreground">
                          สิทธิ์เต็ม - เข้าถึงทุกอย่าง
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="role"
                        value="staff"
                        checked={formData.role === 'staff'}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value as any })
                        }
                      />
                      <div>
                        <p className="font-semibold">Staff</p>
                        <p className="text-xs text-muted-foreground">
                          สิทธิ์จำกัด - เลือกได้เอง
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="role"
                        value="viewer"
                        checked={formData.role === 'viewer'}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value as any })
                        }
                      />
                      <div>
                        <p className="font-semibold">Viewer</p>
                        <p className="text-xs text-muted-foreground">
                          อ่านอย่างเดียว - ไม่สามารถแก้ไข
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.role === 'staff' && (
                  <div>
                    <Label>เลือกสิทธิ์ *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {allPermissions.map((permission) => (
                        <label
                          key={permission}
                          className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-muted"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission)}
                            onChange={() => handlePermissionToggle(permission)}
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
                    ใช้งาน
                  </Label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2 sticky bottom-0 bg-card">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                ยกเลิก
              </Button>
              <Button onClick={handleSaveUser} className="bg-primary hover:bg-primary/90">
                {editingUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
