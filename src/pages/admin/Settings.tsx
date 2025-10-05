import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings as SettingsIcon,
  Save,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  MessageCircle,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  AlertTriangle,
  Eye,
  TestTube,
  RotateCcw,
  FileText,
  ChevronDown,
  SendHorizontal,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dateToDelete, setDateToDelete] = useState<number | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showTestEmailDialog, setShowTestEmailDialog] = useState(false);
  const [testEmail, setTestEmail] = useState('admin@ghoulgate.com');

  const [generalSettings, setGeneralSettings] = useState({
    eventName: 'Halloween Night 2025',
    eventTagline: 'สัมผัสประสบการณ์สุดหลอนที่คุณไม่เคยลืม',
    venueName: 'มหาวิทยาลัยศรีปทุม',
    venueAddress: 'ตึก 4 ชั้น 1,2 มหาวิทยาลัยศรีปทุม กรุงเทพฯ',
    googleMapsLink: 'https://maps.google.com/?q=Sripatum+University',
    eventStartTime: '10:00',
    eventEndTime: '17:00',
    contactEmail: 'support@ghoulgate.com',
    contactPhone: '02-123-4567',
    facebookUrl: 'https://facebook.com/ghoulgate',
    instagramUrl: 'https://instagram.com/ghoulgate',
    lineUrl: 'https://line.me/ti/p/@ghoulgate',
    termsUrl: 'https://ghoulgate.com/terms',
    privacyUrl: 'https://ghoulgate.com/privacy',
  });

  const [eventDates, setEventDates] = useState([
    {
      date: '2025-10-29',
      dayName: 'วันพุธ',
      status: 'open',
      capacity: 50,
      bookedGroups: 32,
      note: '',
    },
    {
      date: '2025-10-30',
      dayName: 'วันพฤหัสบดี',
      status: 'open',
      capacity: 50,
      bookedGroups: 28,
      note: '',
    },
    {
      date: '2025-10-31',
      dayName: 'วันศุกร์',
      status: 'open',
      capacity: 50,
      bookedGroups: 45,
      note: 'วันสุดท้าย - ที่นั่งเหลือน้อย!',
    },
  ]);

  const [pricingSettings, setPricingSettings] = useState({
    basePrice: 80,
    minGroupSize: 5,
    maxGroupSize: 7,
    currency: 'THB',
    enableDynamicPricing: false,
    serviceFee: 0,
    serviceFeeType: 'fixed', // 'fixed' or 'percentage'
    includeTax: true,
  });

  // Email Templates
  const [selectedTemplate, setSelectedTemplate] = useState('booking_confirmation');
  const [emailSubject, setEmailSubject] = useState('ยืนยันการจอง Halloween Night 2025');
  const [emailBody, setEmailBody] = useState(
    `สวัสดีค่ะคุณ {{name}}

ขอบคุณที่จองบัตร Halloween Night 2025!

รายละเอียดการจอง:
- รหัสจอง: {{bookingId}}
- วันที่งาน: {{eventDate}}
- จำนวนคน: {{groupSize}} คน
- ยอดชำระ: {{totalAmount}} บาท
- สถานที่: {{venue}}

กรุณาแสดง QR Code ด้านล่างเพื่อเข้างาน:
{{qrCode}}

เวลางาน: 10:00 - 17:00 น.
กรุณามาถึงก่อนเวลางาน 30 นาที

หากมีข้อสอบถาม กรุณาติดต่อ:
อีเมล: support@ghoulgate.com
โทร: 02-123-4567

พบกันที่งาน!
ทีมงาน Halloween Night 2025`
  );

  const emailTemplates = [
    {
      id: 'booking_confirmation',
      name: 'Booking Confirmation - ยืนยันการจอง',
      subject: 'ยืนยันการจอง Halloween Night 2025',
      body: `สวัสดีค่ะคุณ {{name}}

ขอบคุณที่จองบัตร Halloween Night 2025!

รายละเอียดการจอง:
- รหัสจอง: {{bookingId}}
- วันที่งาน: {{eventDate}}
- จำนวนคน: {{groupSize}} คน
- ยอดชำระ: {{totalAmount}} บาท
- สถานที่: {{venue}}

กรุณาแสดง QR Code ด้านล่างเพื่อเข้างาน:
{{qrCode}}

พบกันที่งาน!`,
    },
    {
      id: 'payment_received',
      name: 'Payment Received - ชำระเงินสำเร็จ',
      subject: 'ได้รับการชำระเงิน - Halloween Night 2025',
      body: `เรียนคุณ {{name}}

เราได้รับการชำระเงินสำหรับการจอง {{bookingId}} เรียบร้อยแล้ว

ยอดชำระ: {{totalAmount}} บาท
วันที่งาน: {{eventDate}}

ขอบคุณค่ะ!`,
    },
    {
      id: 'reminder_3day',
      name: '3-Day Reminder - แจ้งเตือน 3 วัน',
      subject: 'แจ้งเตือน: งานเหลืออีก 3 วัน!',
      body: `สวัสดีค่ะคุณ {{name}}

งาน Halloween Night 2025 เหลืออีกเพียง 3 วัน!

วันที่งาน: {{eventDate}}
รหัสจอง: {{bookingId}}
สถานที่: {{venue}}

อย่าลืมเตรียม QR Code สำหรับเช็คอิน!`,
    },
    {
      id: 'reminder_1day',
      name: '1-Day Reminder - แจ้งเตือน 1 วัน',
      subject: 'พรุ่งนี้เจอกัน! Halloween Night 2025',
      body: `สวัสดีค่ะคุณ {{name}}

พรุ่งนี้เจอกันแล้ว! 🎃

วันที่: {{eventDate}}
เวลา: 10:00 - 17:00 น.
สถานที่: {{venue}}

เตรียมตัวให้พร้อม และอย่าลืม QR Code!`,
    },
    {
      id: 'day_of_event',
      name: 'Day of Event - วันงาน',
      subject: 'วันนี้! ยินดีต้อนรับสู่ Halloween Night 2025',
      body: `สวัสดีค่ะคุณ {{name}}

วันนี้แล้ว! ยินดีต้อนรับสู่ Halloween Night 2025 🎃

รหัสจอง: {{bookingId}}
เวลาเปิด: 10:00 น.
สถานที่: {{venue}}

พบกันที่งาน!`,
    },
    {
      id: 'booking_cancelled',
      name: 'Booking Cancelled - ยกเลิกการจอง',
      subject: 'ยกเลิกการจอง - Halloween Night 2025',
      body: `เรียนคุณ {{name}}

การจอง {{bookingId}} ได้ถูกยกเลิกแล้ว

หากมีข้อสอบถาม กรุณาติดต่อเรา`,
    },
    {
      id: 'refund_processed',
      name: 'Refund Processed - คืนเงินสำเร็จ',
      subject: 'ดำเนินการคืนเงินสำเร็จ',
      body: `เรียนคุณ {{name}}

เราได้ดำเนินการคืนเงินสำหรับการจอง {{bookingId}} แล้ว
จำนวน: {{totalAmount}} บาท

เงินจะเข้าบัญชีภายใน 7-14 วันทำการ`,
    },
  ];

  const emailVariables = [
    { key: '{{name}}', desc: 'ชื่อลูกค้า' },
    { key: '{{bookingId}}', desc: 'รหัสจอง' },
    { key: '{{eventDate}}', desc: 'วันที่งาน' },
    { key: '{{groupSize}}', desc: 'จำนวนคน' },
    { key: '{{totalAmount}}', desc: 'ยอดเงินรวม' },
    { key: '{{qrCode}}', desc: 'QR Code' },
    { key: '{{venue}}', desc: 'สถานที่' },
  ];

  const tabs = [
    { id: 'general', label: 'ทั่วไป', icon: SettingsIcon },
    { id: 'dates', label: 'วันที่และความจุ', icon: Calendar },
    { id: 'pricing', label: 'ราคา', icon: DollarSign },
    { id: 'email', label: 'Email Templates', icon: Mail },
  ];

  const handleSaveGeneral = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_general_settings', JSON.stringify(generalSettings));
      toast.success('บันทึกการตั้งค่าทั่วไปสำเร็จ');
      setLoading(false);
    }, 1000);
  };

  const handleSaveDateSettings = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_event_dates', JSON.stringify(eventDates));
      toast.success('บันทึกการตั้งค่าวันที่สำเร็จ');
      setLoading(false);
    }, 1000);
  };

  const handleSavePricing = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_pricing_settings', JSON.stringify(pricingSettings));
      toast.success('บันทึกการตั้งค่าราคาสำเร็จ');
      setLoading(false);
    }, 1000);
  };

  const handleSaveEmailTemplate = () => {
    setLoading(true);
    setTimeout(() => {
      const templates = JSON.parse(localStorage.getItem('admin_email_templates') || '{}');
      templates[selectedTemplate] = { subject: emailSubject, body: emailBody };
      localStorage.setItem('admin_email_templates', JSON.stringify(templates));
      toast.success('บันทึก Email Template สำเร็จ');
      setLoading(false);
    }, 1000);
  };

  const handleAddDate = () => {
    const newDate = {
      date: new Date().toISOString().split('T')[0],
      dayName: 'วันใหม่',
      status: 'open' as const,
      capacity: 50,
      bookedGroups: 0,
      note: '',
    };
    setEventDates([...eventDates, newDate]);
    toast.success('เพิ่มวันที่ใหม่สำเร็จ');
  };

  const handleDeleteDate = (index: number) => {
    setDateToDelete(index);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDate = () => {
    if (dateToDelete !== null) {
      const dateInfo = eventDates[dateToDelete];
      if (dateInfo.bookedGroups > 0) {
        toast.error(`ไม่สามารถลบได้ เนื่องจากมีการจอง ${dateInfo.bookedGroups} กลุ่มแล้ว`);
        setShowDeleteDialog(false);
        setDateToDelete(null);
        return;
      }
      const updated = eventDates.filter((_, i) => i !== dateToDelete);
      setEventDates(updated);
      toast.success('ลบวันที่สำเร็จ');
    }
    setShowDeleteDialog(false);
    setDateToDelete(null);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
    }
  };

  const handleResetTemplate = () => {
    const template = emailTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
      toast.success('รีเซ็ตเป็นค่าเริ่มต้นสำเร็จ');
    }
  };

  const handleSendTestEmail = () => {
    if (!testEmail.trim()) {
      toast.error('กรุณากรอกอีเมลสำหรับทดสอบ');
      return;
    }
    setShowTestEmailDialog(false);
    toast.success(`ส่งอีเมลทดสอบไปที่ ${testEmail} สำเร็จ!`);
  };

  const getPreviewEmail = () => {
    const sampleData = {
      '{{name}}': 'สมชาย ใจดี',
      '{{bookingId}}': 'HW25001',
      '{{eventDate}}': '29 ตุลาคม 2025',
      '{{groupSize}}': '6',
      '{{totalAmount}}': '480',
      '{{venue}}': 'มหาวิทยาลัยศรีปทุม กรุงเทพฯ',
      '{{qrCode}}': '[QR CODE IMAGE]',
    };

    let preview = emailBody;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(key, 'g'), value);
    });

    return preview;
  };

  const insertVariable = (variable: string) => {
    setEmailBody(emailBody + variable);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <SettingsIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-spooky text-primary">การตั้งค่างาน</h1>
            <p className="text-muted-foreground">จัดการการตั้งค่าและข้อมูลงาน Halloween Night 2025</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <Card className="p-6 border-primary/20">
        {/* Tab 1: General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-primary">ตั้งค่าทั่วไป</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="eventName" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  ชื่อ งาน *
                </Label>
                <Input
                  id="eventName"
                  value={generalSettings.eventName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventName: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="eventTagline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  คำโปรย / Tagline
                </Label>
                <Input
                  id="eventTagline"
                  value={generalSettings.eventTagline}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventTagline: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="venueName" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ชื่อสถานที่ *
                </Label>
                <Input
                  id="venueName"
                  value={generalSettings.venueName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, venueName: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="venueAddress" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  ที่อยู่ *
                </Label>
                <Input
                  id="venueAddress"
                  value={generalSettings.venueAddress}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, venueAddress: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="googleMapsLink" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Google Maps Link
                </Label>
                <Input
                  id="googleMapsLink"
                  type="url"
                  value={generalSettings.googleMapsLink}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, googleMapsLink: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <Label htmlFor="eventStartTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  เวลาเริ่มงาน *
                </Label>
                <Input
                  id="eventStartTime"
                  type="time"
                  value={generalSettings.eventStartTime}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventStartTime: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="eventEndTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  เวลาสิ้นสุด *
                </Label>
                <Input
                  id="eventEndTime"
                  type="time"
                  value={generalSettings.eventEndTime}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventEndTime: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  อีเมลติดต่อ *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  เบอร์ติดต่อ *
                </Label>
                <Input
                  id="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook URL
                </Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={generalSettings.facebookUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, facebookUrl: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram URL
                </Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={generalSettings.instagramUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, instagramUrl: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <Label htmlFor="lineUrl" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Line URL / ID
                </Label>
                <Input
                  id="lineUrl"
                  type="url"
                  value={generalSettings.lineUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, lineUrl: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://line.me/ti/p/@..."
                />
              </div>

              <div>
                <Label htmlFor="termsUrl" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Terms & Conditions URL
                </Label>
                <Input
                  id="termsUrl"
                  type="url"
                  value={generalSettings.termsUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, termsUrl: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://yoursite.com/terms"
                />
              </div>

              <div>
                <Label htmlFor="privacyUrl" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Privacy Policy URL
                </Label>
                <Input
                  id="privacyUrl"
                  type="url"
                  value={generalSettings.privacyUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, privacyUrl: e.target.value })
                  }
                  className="mt-2"
                  placeholder="https://yoursite.com/privacy"
                />
              </div>
            </div>

            <Button
              onClick={handleSaveGeneral}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        )}

        {/* Tab 2: Dates & Capacity */}
        {activeTab === 'dates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-primary">วันที่และความจุ</h2>
              </div>
              <Button onClick={handleAddDate} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มวันที่ใหม่
              </Button>
            </div>

            <div className="space-y-4">
              {eventDates.map((dateInfo, index) => {
                const availableSlots = dateInfo.capacity - dateInfo.bookedGroups;
                const percentage = (dateInfo.bookedGroups / dateInfo.capacity) * 100;
                const hasBookings = dateInfo.bookedGroups > 0;

                return (
                  <Card key={index} className="p-6 bg-muted/30 border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Label className="text-lg font-semibold">วันที่ {index + 1}</Label>
                          {hasBookings && (
                            <p className="text-xs text-warning flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              มีการจอง {dateInfo.bookedGroups} กลุ่มแล้ว - การเปลี่ยนแปลงอาจส่งผลต่อการจอง
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleDeleteDate(index)}
                          variant="destructive"
                          size="sm"
                          disabled={hasBookings}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          ลบ
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>วันที่</Label>
                          <Input
                            type="date"
                            value={dateInfo.date}
                            onChange={(e) => {
                              const updated = [...eventDates];
                              updated[index].date = e.target.value;
                              setEventDates(updated);
                            }}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>ชื่อวัน (ภาษาไทย)</Label>
                          <Input
                            value={dateInfo.dayName}
                            onChange={(e) => {
                              const updated = [...eventDates];
                              updated[index].dayName = e.target.value;
                              setEventDates(updated);
                            }}
                            className="mt-2"
                            placeholder="เช่น วันพุธ"
                          />
                        </div>

                        <div>
                          <Label>สถานะ</Label>
                          <Select
                            value={dateInfo.status}
                            onValueChange={(value: any) => {
                              const updated = [...eventDates];
                              updated[index].status = value;
                              setEventDates(updated);
                            }}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-success rounded-full" />
                                  เปิดรับจอง
                                </span>
                              </SelectItem>
                              <SelectItem value="closed">
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-destructive rounded-full" />
                                  ปิดรับจอง
                                </span>
                              </SelectItem>
                              <SelectItem value="full">
                                <span className="flex items-center gap-2">
                                  <span className="w-2 h-2 bg-warning rounded-full" />
                                  เต็ม (Full)
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>ความจุ (จำนวนกลุ่ม)</Label>
                          <Input
                            type="number"
                            value={dateInfo.capacity}
                            onChange={(e) => {
                              const updated = [...eventDates];
                              updated[index].capacity = parseInt(e.target.value) || 0;
                              setEventDates(updated);
                            }}
                            className="mt-2"
                            min="0"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <div className="p-4 bg-background rounded-lg border">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">การจอง</span>
                              <span className="text-sm">
                                <span className="font-bold text-primary">{dateInfo.bookedGroups}</span>
                                {' / '}
                                <span className="font-bold">{dateInfo.capacity}</span>
                                {' กลุ่ม'}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full transition-all ${
                                  percentage > 90
                                    ? 'bg-destructive'
                                    : percentage > 60
                                    ? 'bg-warning'
                                    : 'bg-success'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">
                                ที่ว่าง: {availableSlots} กลุ่ม
                              </span>
                              <span className={`text-xs font-semibold ${
                                percentage > 90 ? 'text-destructive' : 
                                percentage > 60 ? 'text-warning' : 'text-success'
                              }`}>
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <Label>หมายเหตุพิเศษ (แสดงบนหน้าเว็บลูกค้า)</Label>
                          <Input
                            value={dateInfo.note}
                            onChange={(e) => {
                              const updated = [...eventDates];
                              updated[index].note = e.target.value;
                              setEventDates(updated);
                            }}
                            className="mt-2"
                            placeholder="เช่น วันสุดท้าย - ที่นั่งเหลือน้อย!"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {eventDates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ยังไม่มีวันที่งาน</p>
                <p className="text-sm">คลิกปุ่ม "เพิ่มวันที่ใหม่" เพื่อเริ่มต้น</p>
              </div>
            )}

            <Button
              onClick={handleSaveDateSettings}
              disabled={loading || eventDates.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        )}

        {/* Tab 3: Pricing */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-primary">การตั้งค่าราคา</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="basePrice">ราคาต่อคน (บาท) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={pricingSettings.basePrice}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, basePrice: parseInt(e.target.value) || 0 })
                  }
                  className="mt-2"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ราคาพื้นฐานต่อบัตร 1 ใบ
                </p>
              </div>

              <div>
                <Label htmlFor="currency">สกุลเงิน</Label>
                <Input
                  id="currency"
                  value={`${pricingSettings.currency} (฿ บาทไทย)`}
                  disabled
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="minGroupSize">จำนวนคนขั้นต่ำ *</Label>
                <Input
                  id="minGroupSize"
                  type="number"
                  value={pricingSettings.minGroupSize}
                  onChange={(e) =>
                    setPricingSettings({
                      ...pricingSettings,
                      minGroupSize: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-2"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="maxGroupSize">จำนวนคนสูงสุด *</Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  value={pricingSettings.maxGroupSize}
                  onChange={(e) =>
                    setPricingSettings({
                      ...pricingSettings,
                      maxGroupSize: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-2"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="serviceFeeType">ประเภทค่าบริการ</Label>
                <Select
                  value={pricingSettings.serviceFeeType}
                  onValueChange={(value: 'fixed' | 'percentage') =>
                    setPricingSettings({ ...pricingSettings, serviceFeeType: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">จำนวนเงินคงที่ (฿)</SelectItem>
                    <SelectItem value="percentage">เปอร์เซ็นต์ (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="serviceFee">
                  ค่าบริการ {pricingSettings.serviceFeeType === 'percentage' ? '(%)' : '(฿)'}
                </Label>
                <Input
                  id="serviceFee"
                  type="number"
                  value={pricingSettings.serviceFee}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, serviceFee: parseInt(e.target.value) || 0 })
                  }
                  className="mt-2"
                  min="0"
                  max={pricingSettings.serviceFeeType === 'percentage' ? '100' : undefined}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {pricingSettings.serviceFeeType === 'fixed' 
                    ? 'ค่าบริการคงที่ต่อ 1 รายการจอง'
                    : 'เปอร์เซ็นต์จากยอดรวม'
                  }
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={pricingSettings.includeTax}
                    onCheckedChange={(checked) =>
                      setPricingSettings({ ...pricingSettings, includeTax: checked as boolean })
                    }
                  />
                  <div>
                    <span className="font-medium">รวมภาษีแล้ว (Tax Included)</span>
                    <p className="text-xs text-muted-foreground">
                      ราคาที่แสดงรวมภาษีมูลค่าเพิ่ม 7% แล้ว
                    </p>
                  </div>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <Checkbox
                    checked={pricingSettings.enableDynamicPricing}
                    onCheckedChange={(checked) =>
                      setPricingSettings({ ...pricingSettings, enableDynamicPricing: checked as boolean })
                    }
                  />
                  <div>
                    <span className="font-medium">เปิดใช้งาน Dynamic Pricing</span>
                    <p className="text-xs text-muted-foreground">
                      กำหนดราคาต่างกันในแต่ละวัน (ฟีเจอร์ขั้นสูง)
                    </p>
                  </div>
                </label>
              </div>

              {pricingSettings.enableDynamicPricing && (
                <div className="md:col-span-2 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-sm text-warning flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>
                      Dynamic Pricing จะต้องตั้งค่าราคาแยกในแต่ละวันที่ Tab "วันที่และความจุ"
                    </span>
                  </p>
                </div>
              )}

              <div className="md:col-span-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2">ตัวอย่างการคำนวณราคา</h4>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>กลุ่ม 6 คน × ฿{pricingSettings.basePrice} = ฿{6 * pricingSettings.basePrice}</p>
                  {pricingSettings.serviceFee > 0 && (
                    <p>
                      + ค่าบริการ: ฿
                      {pricingSettings.serviceFeeType === 'fixed'
                        ? pricingSettings.serviceFee
                        : Math.round((6 * pricingSettings.basePrice * pricingSettings.serviceFee) / 100)
                      }
                    </p>
                  )}
                  <p className="font-semibold text-primary pt-2 border-t">
                    ยอดรวม: ฿
                    {6 * pricingSettings.basePrice +
                      (pricingSettings.serviceFeeType === 'fixed'
                        ? pricingSettings.serviceFee
                        : Math.round((6 * pricingSettings.basePrice * pricingSettings.serviceFee) / 100)
                      )}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSavePricing}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        )}

        {/* Tab 4: Email Templates */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Email Templates</h2>
            </div>
            <p className="text-muted-foreground">
              กำหนด template อีเมลที่จะส่งอัตโนมัติในแต่ละกรณี
            </p>

            <div>
              <Label className="mb-2 block">เลือก Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="emailSubject">หัวข้ออีเมล (Subject Line) *</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="mt-2"
                placeholder="หัวข้ออีเมล"
              />
            </div>

            <div>
              <Label htmlFor="emailBody">เนื้อหาอีเมล (Email Body) *</Label>
              <Textarea
                id="emailBody"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="mt-2 font-mono"
                rows={15}
                placeholder="เนื้อหาอีเมล..."
              />
              <p className="text-xs text-muted-foreground mt-2">
                รองรับ Plain Text และ Markdown
              </p>
            </div>

            <div>
              <Label className="mb-2 block">ตัวแปรที่ใช้ได้ (Variables)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {emailVariables.map((variable) => (
                  <Button
                    key={variable.key}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable.key)}
                    className="justify-start text-xs hover:bg-primary/10 hover:border-primary"
                  >
                    <code className="mr-1">{variable.key}</code>
                  </Button>
                ))}
              </div>
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-semibold mb-2">คำอธิบาย:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {emailVariables.map((variable) => (
                    <div key={variable.key} className="flex gap-2">
                      <code className="text-primary">{variable.key}</code>
                      <span>= {variable.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreviewDialog(true)}
                disabled={!emailBody.trim()}
              >
                <Eye className="w-4 h-4 mr-2" />
                ดูตัวอย่าง
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowTestEmailDialog(true)}
                disabled={!emailSubject.trim() || !emailBody.trim()}
              >
                <TestTube className="w-4 h-4 mr-2" />
                ส่งทดสอบ
              </Button>
              <Button variant="outline" onClick={handleResetTemplate}>
                <RotateCcw className="w-4 h-4 mr-2" />
                รีเซ็ตเป็นค่าเริ่มต้น
              </Button>
            </div>

            <Button
              onClick={handleSaveEmailTemplate}
              disabled={loading || !emailSubject.trim() || !emailBody.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'กำลังบันทึก...' : 'บันทึก Template'}
            </Button>
          </div>
        )}
      </Card>

      {/* Delete Date Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              ยืนยันการลบวันที่
            </DialogTitle>
            <DialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบวันที่นี้? การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          {dateToDelete !== null && eventDates[dateToDelete] && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">
                {eventDates[dateToDelete].date} ({eventDates[dateToDelete].dayName})
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                การจอง: {eventDates[dateToDelete].bookedGroups} / {eventDates[dateToDelete].capacity} กลุ่ม
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDate}>
              <Trash2 className="w-4 h-4 mr-2" />
              ลบวันที่
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Email Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              ตัวอย่าง Email
            </DialogTitle>
            <DialogDescription>
              ตัวอย่างนี้ใช้ข้อมูลจำลอง - อีเมลจริงจะแทนที่ด้วยข้อมูลลูกค้า
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">หัวข้อ:</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg font-medium">{emailSubject}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">เนื้อหา:</Label>
              <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap font-mono text-sm">
                {getPreviewEmail()}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              ปิด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Email Dialog */}
      <Dialog open={showTestEmailDialog} onOpenChange={setShowTestEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5 text-primary" />
              ส่งอีเมลทดสอบ
            </DialogTitle>
            <DialogDescription>
              ส่งอีเมลทดสอบไปยังอีเมลของคุณเพื่อดูผลลัพธ์จริง
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
            <Button variant="outline" onClick={() => setShowTestEmailDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSendTestEmail} className="bg-primary">
              <SendHorizontal className="w-4 h-4 mr-2" />
              ส่งทดสอบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;
