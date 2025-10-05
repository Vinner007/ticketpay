import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { toast } from 'sonner';

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

  const recipientCount = 200; // Mock count

  const sentMessages = [
    {
      id: 'msg-1',
      subject: 'การแจ้งเตือน: งานเหลือ 3 วัน',
      type: 'email',
      recipientCount: 180,
      sentAt: '2025-10-02T14:30:00',
      status: 'sent',
      stats: { sent: 180, delivered: 175, failed: 5, opened: 120 },
    },
    {
      id: 'msg-2',
      subject: 'ยืนยันการจอง',
      type: 'email',
      recipientCount: 200,
      sentAt: '2025-09-28T10:00:00',
      status: 'sent',
      stats: { sent: 200, delivered: 198, failed: 2, opened: 185 },
    },
    {
      id: 'msg-3',
      subject: 'แจ้งเตือนการชำระเงิน',
      type: 'sms',
      recipientCount: 20,
      sentAt: '2025-09-25T16:00:00',
      status: 'sent',
      stats: { sent: 20, delivered: 20, failed: 0, opened: 0 },
    },
  ];

  const templates = [
    { id: 'reminder', name: 'Reminder - แจ้งเตือนก่อนงาน' },
    { id: 'announcement', name: 'Announcement - ประกาศ' },
    { id: 'thankyou', name: 'Thank You - ขอบคุณ' },
  ];

  const handleSendMessage = () => {
    if (!subject.trim() || !body.trim()) {
      toast.error('กรุณากรอกหัวข้อและเนื้อหาข้อความ');
      return;
    }

    toast.success(`ส่งข้อความถึง ${recipientCount} คน สำเร็จ!`);
    setSubject('');
    setBody('');
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-spooky text-primary">ส่งข้อความ</h1>
            <p className="text-muted-foreground">ส่งอีเมลและ SMS ถึงลูกค้า</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('send')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'send'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            ส่งข้อความ
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            ประวัติการส่ง
          </button>
          <button
            onClick={() => setActiveTab('automated')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'automated'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            ข้อความอัตโนมัติ
          </button>
        </div>
      </div>

      {/* Send Message Tab */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">เลือกผู้รับ</h3>

              <div className="space-y-4">
                <div>
                  <Label>ประเภทผู้รับ</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="recipient"
                        value="all"
                        checked={recipientType === 'all'}
                        onChange={(e) => setRecipientType(e.target.value)}
                      />
                      <span>ทุกคน ({recipientCount} คน)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="recipient"
                        value="by_date"
                        checked={recipientType === 'by_date'}
                        onChange={(e) => setRecipientType(e.target.value)}
                      />
                      <span>ตามวันที่งาน</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="recipient"
                        value="by_status"
                        checked={recipientType === 'by_status'}
                        onChange={(e) => setRecipientType(e.target.value)}
                      />
                      <span>ตามสถานะ</span>
                    </label>
                  </div>
                </div>

                {recipientType === 'by_date' && (
                  <div>
                    <Label>เลือกวันที่</Label>
                    <div className="space-y-2 mt-2">
                      {['2025-10-29', '2025-10-30', '2025-10-31'].map((date) => (
                        <label key={date} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedDates.includes(date)}
                            onChange={() => handleDateToggle(date)}
                          />
                          <span>{date}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {recipientType === 'by_status' && (
                  <div>
                    <Label>เลือกสถานะ</Label>
                    <div className="space-y-2 mt-2">
                      {['confirmed', 'pending', 'checked_in'].map((status) => (
                        <label key={status} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(status)}
                            onChange={() => handleStatusToggle(status)}
                          />
                          <span className="capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">เนื้อหาข้อความ</h3>

              <div className="space-y-4">
                <div>
                  <Label>ประเภทข้อความ</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="messageType"
                        value="email"
                        checked={messageType === 'email'}
                        onChange={(e) => setMessageType(e.target.value)}
                      />
                      <span>Email (ฟรี)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="messageType"
                        value="sms"
                        checked={messageType === 'sms'}
                        onChange={(e) => setMessageType(e.target.value)}
                      />
                      <span>SMS (มีค่าใช้จ่าย)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>Template (ไม่บังคับ)</Label>
                  <select className="w-full p-2 border rounded-md mt-2">
                    <option value="">-- เลือก Template --</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {messageType === 'email' && (
                  <div>
                    <Label>หัวข้อ *</Label>
                    <Input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="หัวข้ออีเมล"
                    />
                  </div>
                )}

                <div>
                  <Label>เนื้อหา *</Label>
                  <Textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="พิมพ์ข้อความที่นี่..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    ใช้ได้: {`{{name}}, {{bookingId}}, {{eventDate}}`}
                  </p>
                </div>

                <div>
                  <Label>กำหนดการส่ง</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="scheduling"
                        value="now"
                        checked={scheduling === 'now'}
                        onChange={(e) => setScheduling(e.target.value)}
                      />
                      <span>ส่งทันที</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="scheduling"
                        value="schedule"
                        checked={scheduling === 'schedule'}
                        onChange={(e) => setScheduling(e.target.value)}
                      />
                      <span>กำหนดเวลา</span>
                    </label>
                  </div>

                  {scheduling === 'schedule' && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">สรุป</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <Users className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">ผู้รับทั้งหมด</p>
                  <p className="text-4xl font-bold text-primary">{recipientCount}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ประเภท:</span>
                    <span className="font-semibold">
                      {messageType === 'email' ? 'Email' : 'SMS'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าใช้จ่าย:</span>
                    <span className="font-semibold">
                      {messageType === 'email' ? 'ฟรี' : `฿${recipientCount * 2}`}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleSendMessage}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!subject.trim() || !body.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  ส่งข้อความ
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Message History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {sentMessages.map((msg) => (
            <Card key={msg.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{msg.subject}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        msg.type === 'email'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-secondary/20 text-secondary'
                      }`}
                    >
                      {msg.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    ส่งเมื่อ {new Date(msg.sentAt).toLocaleString('th-TH')} • {msg.recipientCount}{' '}
                    คน
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Send className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">ส่งแล้ว</p>
                        <p className="font-semibold">{msg.stats.sent}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <div>
                        <p className="text-xs text-muted-foreground">ส่งสำเร็จ</p>
                        <p className="font-semibold">{msg.stats.delivered}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-destructive" />
                      <div>
                        <p className="text-xs text-muted-foreground">ล้มเหลว</p>
                        <p className="font-semibold">{msg.stats.failed}</p>
                      </div>
                    </div>
                    {msg.type === 'email' && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">เปิดอ่าน</p>
                          <p className="font-semibold">{msg.stats.opened}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  ดูรายละเอียด
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Automated Messages Tab */}
      {activeTab === 'automated' && (
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">ข้อความอัตโนมัติ</h3>
          <div className="space-y-4">
            {[
              { name: 'Booking Confirmation', desc: 'ส่งทันทีหลังจองสำเร็จ' },
              { name: 'Payment Received', desc: 'ส่งหลังชำระเงินสำเร็จ' },
              { name: '3-Day Reminder', desc: 'ส่งก่อนงาน 3 วัน' },
              { name: '1-Day Reminder', desc: 'ส่งก่อนงาน 1 วัน' },
              { name: 'Day of Event', desc: 'ส่งในวันงาน' },
            ].map((auto, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{auto.name}</p>
                  <p className="text-sm text-muted-foreground">{auto.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked={index < 2} />
                    <span className="text-sm">เปิดใช้งาน</span>
                  </label>
                  <Button variant="outline" size="sm">
                    แก้ไข
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Messages;
