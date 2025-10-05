import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Mail,
  SendHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Upload,
  Eye,
  TestTube,
  Save,
  MoreVertical,
  Search,
  Filter,
  Calendar,
  Copy,
  RefreshCw,
  FileText,
  Edit,
  History,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Messages = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [recipientType, setRecipientType] = useState('all');
  const [messageType, setMessageType] = useState('email');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [scheduling, setScheduling] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [testEmail, setTestEmail] = useState('admin@ghoulgate.com');
  
  // Message History filters
  const [historySearch, setHistorySearch] = useState('');
  const [historyDateRange, setHistoryDateRange] = useState('all');
  const [historyType, setHistoryType] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const mockBookings = {
    all: 200,
    '2025-10-29': 65,
    '2025-10-30': 72,
    '2025-10-31': 63,
    confirmed: 170,
    pending: 20,
    checked_in: 10,
  };

  const getRecipientCount = () => {
    if (recipientType === 'all') return mockBookings.all;
    if (recipientType === 'by_date') {
      return selectedDates.reduce((sum, date) => sum + (mockBookings[date as keyof typeof mockBookings] as number || 0), 0);
    }
    if (recipientType === 'by_status') {
      return selectedStatuses.reduce((sum, status) => sum + (mockBookings[status as keyof typeof mockBookings] as number || 0), 0);
    }
    return 0;
  };

  const recipientCount = getRecipientCount();

  const sentMessages = [
    {
      id: 'msg-1',
      subject: 'การแจ้งเตือน: งานเหลือ 3 วัน',
      type: 'email',
      recipientCount: 180,
      sentAt: '2025-10-02T14:30:00',
      status: 'delivered',
      stats: { sent: 180, delivered: 175, failed: 5, opened: 120 },
    },
    {
      id: 'msg-2',
      subject: 'ยืนยันการจอง - Halloween Night 2025',
      type: 'email',
      recipientCount: 200,
      sentAt: '2025-09-28T10:00:00',
      status: 'delivered',
      stats: { sent: 200, delivered: 198, failed: 2, opened: 185 },
    },
    {
      id: 'msg-3',
      subject: 'แจ้งเตือนการชำระเงิน',
      type: 'sms',
      recipientCount: 20,
      sentAt: '2025-09-25T16:00:00',
      status: 'delivered',
      stats: { sent: 20, delivered: 20, failed: 0, opened: 0 },
    },
    {
      id: 'msg-4',
      subject: 'ขอบคุณที่มาร่วมงาน',
      type: 'email',
      recipientCount: 150,
      sentAt: '2025-09-20T09:00:00',
      status: 'delivered',
      stats: { sent: 150, delivered: 148, failed: 2, opened: 95 },
    },
    {
      id: 'msg-5',
      subject: 'อัพเดทข้อมูลสถานที่จัดงาน',
      type: 'email',
      recipientCount: 200,
      sentAt: '2025-09-15T15:30:00',
      status: 'delivered',
      stats: { sent: 200, delivered: 195, failed: 5, opened: 160 },
    },
  ];

  const templates = [
    { id: 'reminder', name: 'Reminder - แจ้งเตือนก่อนงาน', subject: 'แจ้งเตือน: งาน Halloween Night เหลืออีก {{days}} วัน!', body: 'สวัสดีค่ะคุณ {{name}}\n\nงาน Halloween Night 2025 เหลืออีกเพียง {{days}} วัน!\n\nรายละเอียดการจอง:\n- รหัสจอง: {{bookingId}}\n- วันที่งาน: {{eventDate}}\n- จำนวนคน: {{groupSize}} คน\n- สถานที่: {{venue}}\n\nกรุณามาถึงก่อนเวลางาน 30 นาทีเพื่อเช็คอิน\nแสดง QR Code ด้านล่างเพื่อเข้างาน\n\n{{qrCode}}\n\nพบกันที่งาน!' },
    { id: 'announcement', name: 'Announcement - ประกาศ', subject: 'ประกาศสำคัญ - Halloween Night 2025', body: 'เรียนคุณ {{name}}\n\nเรามีประกาศสำคัญที่ต้องการแจ้งให้ทราบ...\n\n[เพิ่มรายละเอียดที่นี่]' },
    { id: 'thankyou', name: 'Thank You - ขอบคุณ', subject: 'ขอบคุณที่มาร่วมงาน Halloween Night 2025', body: 'สวัสดีค่ะคุณ {{name}}\n\nขอบคุณที่มาร่วมงาน Halloween Night 2025!\nหวังว่าคุณจะสนุกและประทับใจกับงานของเรา\n\nพบกันใหม่ปีหน้านะคะ!' },
  ];

  const variables = [
    { key: '{{name}}', label: 'ชื่อลูกค้า' },
    { key: '{{bookingId}}', label: 'รหัสจอง' },
    { key: '{{eventDate}}', label: 'วันที่งาน' },
    { key: '{{groupSize}}', label: 'จำนวนคน' },
    { key: '{{qrCode}}', label: 'QR Code' },
    { key: '{{venue}}', label: 'สถานที่' },
    { key: '{{totalAmount}}', label: 'ยอดเงิน' },
  ];

  const automatedMessages = [
    { id: 'booking_confirmation', name: 'Booking Confirmation', desc: 'ส่งทันทีหลังจองสำเร็จ', enabled: true },
    { id: 'payment_received', name: 'Payment Received', desc: 'ส่งหลังชำระเงินสำเร็จ', enabled: true },
    { id: 'reminder_3day', name: '3-Day Reminder', desc: 'ส่งก่อนงาน 3 วัน', enabled: true },
    { id: 'reminder_1day', name: '1-Day Reminder', desc: 'ส่งก่อนงาน 1 วัน', enabled: true },
    { id: 'day_of_event', name: 'Day of Event', desc: 'ส่งในวันงาน', enabled: false },
    { id: 'post_event', name: 'Post-Event Thank You', desc: 'ส่งหลังงานเสร็จ 1 วัน', enabled: false },
  ];

  const handleDateToggle = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const insertVariable = (variable: string) => {
    setBody(prev => prev + variable);
  };

  const handleSendTest = () => {
    if (!testEmail.trim()) {
      toast.error('กรุณากรอกอีเมลสำหรับทดสอบ');
      return;
    }
    setShowTestDialog(false);
    toast.success(`ส่งข้อความทดสอบไปที่ ${testEmail} สำเร็จ!`);
  };

  const handleSendMessage = () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('กรุณากรอกหัวข้อและเนื้อหาข้อความ');
      return;
    }

    if (recipientCount === 0) {
      toast.error('กรุณาเลือกผู้รับข้อความ');
      return;
    }

    setShowConfirmDialog(false);
    
    if (scheduling === 'schedule') {
      toast.success(`กำหนดการส่งข้อความถึง ${recipientCount} คน เมื่อ ${scheduledDate} ${scheduledTime} สำเร็จ!`);
    } else {
      toast.success(`กำลังส่งข้อความถึง ${recipientCount} คน...`);
    }
    
    // Reset form
    setSubject('');
    setBody('');
    setSelectedTemplate('');
    setSelectedDates([]);
    setSelectedStatuses([]);
  };

  const handleSaveDraft = () => {
    if (!subject.trim() && !body.trim()) {
      toast.error('ไม่มีเนื้อหาที่จะบันทึก');
      return;
    }
    toast.success('บันทึก Draft สำเร็จ!');
  };

  const getPreviewContent = () => {
    const sampleData = {
      '{{name}}': 'สมชาย ใจดี',
      '{{bookingId}}': 'HW25001',
      '{{eventDate}}': '29 ตุลาคม 2025',
      '{{groupSize}}': '6',
      '{{venue}}': 'GhoulGate Arena, กรุงเทพฯ',
      '{{totalAmount}}': '480',
      '{{qrCode}}': '[QR CODE]',
      '{{days}}': '3',
    };

    let preview = body;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key, 'g'), value);
    });

    return preview;
  };

  const filteredMessages = sentMessages.filter(msg => {
    if (historySearch && !msg.subject.toLowerCase().includes(historySearch.toLowerCase())) {
      return false;
    }
    if (historyType !== 'all' && msg.type !== historyType) {
      return false;
    }
    return true;
  });

  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-spooky text-primary">ระบบส่งข้อความ</h1>
            <p className="text-muted-foreground">ส่งอีเมลและ SMS ถึงผู้เข้าร่วมงาน</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === 'send'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <SendHorizontal className="w-4 h-4 inline mr-2" />
            ส่งข้อความ
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            ประวัติการส่ง
          </button>
          <button
            onClick={() => setActiveTab('automated')}
            className={`px-6 py-3 font-semibold transition-all border-b-2 ${
              activeTab === 'automated'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            ข้อความอัตโนมัติ
          </button>
        </div>
      </div>

      {/* Send Message Tab */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Recipient Selection */}
            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">เลือกผู้รับ</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">ประเภทผู้รับ</Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="recipient"
                        value="all"
                        checked={recipientType === 'all'}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium">ทุกคน</span>
                      <span className="text-muted-foreground">({mockBookings.all} คน)</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="recipient"
                        value="by_date"
                        checked={recipientType === 'by_date'}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium">ตามวันที่งาน</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="recipient"
                        value="by_status"
                        checked={recipientType === 'by_status'}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium">ตามสถานะการจอง</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="recipient"
                        value="csv"
                        checked={recipientType === 'csv'}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="font-medium">อัพโหลด CSV</span>
                    </label>
                  </div>
                </div>

                {recipientType === 'by_date' && (
                  <div className="pl-4 border-l-2 border-primary/30">
                    <Label className="text-base mb-3 block">เลือกวันที่งาน</Label>
                    <div className="space-y-3">
                      {[
                        { date: '2025-10-29', label: '29 ตุลาคม 2025 (วันพุธ)', count: mockBookings['2025-10-29'] },
                        { date: '2025-10-30', label: '30 ตุลาคม 2025 (วันพฤหัสบดี)', count: mockBookings['2025-10-30'] },
                        { date: '2025-10-31', label: '31 ตุลาคม 2025 (วันศุกร์)', count: mockBookings['2025-10-31'] },
                      ].map((item) => (
                        <label key={item.date} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedDates.includes(item.date)}
                            onChange={() => handleDateToggle(item.date)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="flex-1">{item.label}</span>
                          <span className="text-primary font-semibold">{item.count} คน</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {recipientType === 'by_status' && (
                  <div className="pl-4 border-l-2 border-primary/30">
                    <Label className="text-base mb-3 block">เลือกสถานะ</Label>
                    <div className="space-y-3">
                      {[
                        { status: 'confirmed', label: 'ชำระเงินแล้ว', count: mockBookings.confirmed },
                        { status: 'pending', label: 'รอชำระเงิน', count: mockBookings.pending },
                        { status: 'checked_in', label: 'เช็คอินแล้ว', count: mockBookings.checked_in },
                      ].map((item) => (
                        <label key={item.status} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(item.status)}
                            onChange={() => handleStatusToggle(item.status)}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="flex-1">{item.label}</span>
                          <span className="text-primary font-semibold">{item.count} คน</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {recipientType === 'csv' && (
                  <div className="pl-4 border-l-2 border-primary/30">
                    <Label className="text-base mb-3 block">อัพโหลดไฟล์ CSV</Label>
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">คลิกเพื่ออัพโหลดไฟล์ CSV</p>
                      <p className="text-xs text-muted-foreground">รองรับไฟล์ .csv เท่านั้น</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Message Composition */}
            <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold">เนื้อหาข้อความ</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base mb-3 block">ประเภทข้อความ</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      messageType === 'email' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                    }`}>
                      <input
                        type="radio"
                        name="messageType"
                        value="email"
                        checked={messageType === 'email'}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-xs text-success">ฟรี - ไม่มีค่าใช้จ่าย</div>
                      </div>
                    </label>
                    <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      messageType === 'sms' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
                    }`}>
                      <input
                        type="radio"
                        name="messageType"
                        value="sms"
                        checked={messageType === 'sms'}
                        onChange={(e) => setMessageType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-semibold">SMS</div>
                        <div className="text-xs text-warning">฿2 ต่อข้อความ</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <Label className="text-base mb-3 block">Template (ไม่บังคับ)</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- เลือก Template --" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {messageType === 'email' && (
                  <div>
                    <Label className="text-base mb-2 block">หัวข้อ *</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="หัวข้ออีเมล"
                      className="text-base"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-base mb-2 block">เนื้อหาข้อความ *</Label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="พิมพ์ข้อความที่นี่..."
                    rows={10}
                    className="text-base font-mono"
                  />
                </div>

                <div>
                  <Label className="text-base mb-2 block">แทรกตัวแปร (Variables)</Label>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((v) => (
                      <Button
                        key={v.key}
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(v.key)}
                        className="text-xs hover:bg-primary/10 hover:border-primary"
                      >
                        {v.label}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    คลิกเพื่อแทรกตัวแปรลงในเนื้อหา ระบบจะแทนที่ด้วยข้อมูลจริงเมื่อส่ง
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    disabled={!body.trim()}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    ดูตัวอย่าง
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowTestDialog(true)}
                    disabled={!subject.trim() || !body.trim()}
                    className="flex-1"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    ส่งทดสอบ
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Label className="text-base mb-3 block">กำหนดการส่ง</Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="scheduling"
                        value="now"
                        checked={scheduling === 'now'}
                        onChange={(e) => setScheduling(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <SendHorizontal className="w-4 h-4 text-primary" />
                      <span className="font-medium">ส่งทันที</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="scheduling"
                        value="schedule"
                        checked={scheduling === 'schedule'}
                        onChange={(e) => setScheduling(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">กำหนดเวลา</span>
                    </label>
                  </div>

                  {scheduling === 'schedule' && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pl-4 border-l-2 border-primary/30">
                      <div>
                        <Label className="text-sm mb-2 block">วันที่</Label>
                        <Input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm mb-2 block">เวลา</Label>
                        <Input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6 border-primary/20">
              <h3 className="text-xl font-bold mb-4">สรุป</h3>
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-sm text-muted-foreground mb-1">ผู้รับทั้งหมด</p>
                  <p className="text-5xl font-bold text-primary mb-1">{recipientCount}</p>
                  <p className="text-xs text-muted-foreground">คน</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">ประเภท:</span>
                    <span className="font-semibold">
                      {messageType === 'email' ? 'Email' : 'SMS'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">ค่าใช้จ่าย:</span>
                    <span className={`font-semibold ${messageType === 'email' ? 'text-success' : 'text-warning'}`}>
                      {messageType === 'email' ? 'ฟรี' : `฿${(recipientCount * 2).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-muted-foreground">กำหนดการส่ง:</span>
                    <span className="font-semibold">
                      {scheduling === 'now' ? 'ทันที' : 'กำหนดเวลา'}
                    </span>
                  </div>
                </div>

                {messageType === 'sms' && recipientCount > 100 && (
                  <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-warning">
                      การส่ง SMS ปริมาณมากอาจใช้เวลานาน กรุณาตรวจสอบยอดเงินคงเหลือ
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t">
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    disabled={!subject.trim() || !body.trim() || recipientCount === 0}
                  >
                    <SendHorizontal className="w-5 h-5 mr-2" />
                    ส่งข้อความ
                  </Button>
                  <Button
                    onClick={handleSaveDraft}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    บันทึก Draft
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Message History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาจากหัวข้อ..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={historyType} onValueChange={setHistoryType}>
                <SelectTrigger>
                  <SelectValue placeholder="ประเภทข้อความ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
              <Select value={historyDateRange} onValueChange={setHistoryDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="ช่วงเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="today">วันนี้</SelectItem>
                  <SelectItem value="week">7 วันที่แล้ว</SelectItem>
                  <SelectItem value="month">30 วันที่แล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Messages List */}
          <div className="space-y-4">
            {paginatedMessages.map((msg) => (
              <Card key={msg.id} className="p-6 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{msg.subject}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          msg.type === 'email'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/20 text-secondary'
                        }`}
                      >
                        {msg.type.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/20 text-success">
                        {msg.status === 'delivered' ? 'ส่งสำเร็จ' : 'กำลังส่ง'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      <Clock className="w-3 h-3 inline mr-1" />
                      ส่งเมื่อ {new Date(msg.sentAt).toLocaleString('th-TH', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} • {msg.recipientCount} คน
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <SendHorizontal className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">ส่งแล้ว</p>
                          <p className="font-bold text-lg">{msg.stats.sent}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-xs text-muted-foreground">ส่งสำเร็จ</p>
                          <p className="font-bold text-lg text-success">{msg.stats.delivered}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                        <XCircle className="w-5 h-5 text-destructive" />
                        <div>
                          <p className="text-xs text-muted-foreground">ล้มเหลว</p>
                          <p className="font-bold text-lg text-destructive">{msg.stats.failed}</p>
                        </div>
                      </div>
                      {msg.type === 'email' && (
                        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                          <Mail className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">เปิดอ่าน</p>
                            <p className="font-bold text-lg text-primary">{msg.stats.opened}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="w-4 h-4 mr-2" />
                        รายชื่อผู้รับ
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        ส่งซ้ำ (ล้มเหลว)
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        คัดลอกข้อความ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Automated Messages Tab */}
      {activeTab === 'automated' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold">ข้อความอัตโนมัติ</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            กำหนดข้อความที่ส่งอัตโนมัติตามเงื่อนไข เช่น หลังจองสำเร็จ หรือก่อนถึงวันงาน
          </p>
          <div className="space-y-4">
            {automatedMessages.map((auto) => (
              <div
                key={auto.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/40 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-base">{auto.name}</p>
                  <p className="text-sm text-muted-foreground">{auto.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={auto.enabled}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm font-medium">เปิดใช้งาน</span>
                  </label>
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    แก้ไข Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <TestTube className="w-3 h-3 mr-1" />
                    ทดสอบ
                  </Button>
                  <Button variant="ghost" size="sm">
                    <History className="w-3 h-3 mr-1" />
                    ประวัติ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              ตัวอย่างข้อความ
            </DialogTitle>
            <DialogDescription>
              ตัวอย่างนี้แสดงข้อความที่จะส่งให้ลูกค้า (ใช้ข้อมูลตัวอย่าง)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {messageType === 'email' && (
              <div>
                <Label className="text-sm font-semibold">หัวข้อ:</Label>
                <p className="mt-1 p-3 bg-muted rounded-lg">{subject}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-semibold">เนื้อหา:</Label>
              <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap font-mono text-sm">
                {getPreviewContent()}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Send Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              ส่งข้อความทดสอบ
            </DialogTitle>
            <DialogDescription>
              ส่งข้อความทดสอบไปยังอีเมลของคุณเพื่อตรวจสอบความถูกต้อง
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label className="mb-2 block">อีเมลสำหรับทดสอบ</Label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSendTest} className="bg-primary">
              <SendHorizontal className="w-4 h-4 mr-2" />
              ส่งทดสอบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Send Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              ยืนยันการส่งข้อความ
            </DialogTitle>
            <DialogDescription>
              กรุณาตรวจสอบรายละเอียดก่อนส่งข้อความ การกระทำนี้ไม่สามารถยกเลิกได้
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ผู้รับทั้งหมด:</span>
                <span className="font-bold">{recipientCount} คน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ประเภทข้อความ:</span>
                <span className="font-bold">{messageType === 'email' ? 'Email' : 'SMS'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ค่าใช้จ่าย:</span>
                <span className={`font-bold ${messageType === 'email' ? 'text-success' : 'text-warning'}`}>
                  {messageType === 'email' ? 'ฟรี' : `฿${(recipientCount * 2).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">กำหนดการส่ง:</span>
                <span className="font-bold">
                  {scheduling === 'now' ? 'ทันที' : `${scheduledDate} ${scheduledTime}`}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              ข้อความจะถูกส่งไปยังผู้รับทั้งหมด คุณแน่ใจหรือไม่?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSendMessage} className="bg-primary">
              <SendHorizontal className="w-4 h-4 mr-2" />
              ยืนยันการส่ง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
