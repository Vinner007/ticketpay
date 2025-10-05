import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    eventName: 'Halloween Night 2025',
    eventTagline: 'สัมผัสประสบการณ์สุดหลอนที่คุณไม่เคยลืม',
    venueName: 'มหาวิทยาลัยศรีปทุม',
    venueAddress: 'ตึก 4 ชั้น 1,2 มหาวิทยาลัยศรีปทุม กรุงเทพฯ',
    googleMapsLink: 'https://maps.google.com',
    eventStartTime: '10:00',
    eventEndTime: '17:00',
    contactEmail: 'support@ghoulgate.com',
    contactPhone: '02-123-4567',
    facebookUrl: 'https://facebook.com/ghoulgate',
    instagramUrl: 'https://instagram.com/ghoulgate',
    lineUrl: 'https://line.me/ghoulgate',
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
    includeTax: true,
  });

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

  const tabs = [
    { id: 'general', label: 'ทั่วไป' },
    { id: 'dates', label: 'วันที่และความจุ' },
    { id: 'pricing', label: 'ราคา' },
    { id: 'email', label: 'Email Templates' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-spooky text-primary">การตั้งค่างาน</h1>
            <p className="text-muted-foreground">จัดการการตั้งค่าและข้อมูลงาน</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <Card className="p-6">
        {/* Tab 1: General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">ตั้งค่าทั่วไป</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="eventName">ชื่องาน *</Label>
                <Input
                  id="eventName"
                  value={generalSettings.eventName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="eventTagline">คำโปรย</Label>
                <Input
                  id="eventTagline"
                  value={generalSettings.eventTagline}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventTagline: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="venueName">ชื่อสถานที่ *</Label>
                <Input
                  id="venueName"
                  value={generalSettings.venueName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, venueName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="venueAddress">ที่อยู่ *</Label>
                <Input
                  id="venueAddress"
                  value={generalSettings.venueAddress}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, venueAddress: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="eventStartTime">เวลาเริ่มงาน *</Label>
                <Input
                  id="eventStartTime"
                  type="time"
                  value={generalSettings.eventStartTime}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventStartTime: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="eventEndTime">เวลาสิ้นสุด *</Label>
                <Input
                  id="eventEndTime"
                  type="time"
                  value={generalSettings.eventEndTime}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, eventEndTime: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">อีเมลติดต่อ *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">เบอร์ติดต่อ *</Label>
                <Input
                  id="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={generalSettings.facebookUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, facebookUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={generalSettings.instagramUrl}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, instagramUrl: e.target.value })
                  }
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
            <h2 className="text-2xl font-bold text-primary">วันที่และความจุ</h2>

            <div className="space-y-4">
              {eventDates.map((dateInfo, index) => (
                <Card key={dateInfo.date} className="p-6 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>วันที่</Label>
                      <p className="text-lg font-semibold">
                        {dateInfo.date} ({dateInfo.dayName})
                      </p>
                    </div>

                    <div>
                      <Label>สถานะ</Label>
                      <select
                        value={dateInfo.status}
                        onChange={(e) => {
                          const updated = [...eventDates];
                          updated[index].status = e.target.value as any;
                          setEventDates(updated);
                        }}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="open">เปิดรับจอง</option>
                        <option value="closed">ปิดรับจอง</option>
                        <option value="full">เต็ม</option>
                      </select>
                    </div>

                    <div>
                      <Label>ความจุ (กลุ่ม)</Label>
                      <Input
                        type="number"
                        value={dateInfo.capacity}
                        onChange={(e) => {
                          const updated = [...eventDates];
                          updated[index].capacity = parseInt(e.target.value);
                          setEventDates(updated);
                        }}
                      />
                    </div>

                    <div>
                      <Label>จองแล้ว</Label>
                      <p className="text-lg">
                        {dateInfo.bookedGroups} / {dateInfo.capacity} กลุ่ม
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            (dateInfo.bookedGroups / dateInfo.capacity) * 100 > 90
                              ? 'bg-destructive'
                              : (dateInfo.bookedGroups / dateInfo.capacity) * 100 > 60
                              ? 'bg-warning'
                              : 'bg-success'
                          }`}
                          style={{
                            width: `${(dateInfo.bookedGroups / dateInfo.capacity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label>หมายเหตุพิเศษ</Label>
                      <Input
                        value={dateInfo.note}
                        onChange={(e) => {
                          const updated = [...eventDates];
                          updated[index].note = e.target.value;
                          setEventDates(updated);
                        }}
                        placeholder="แสดงบนหน้าเว็บลูกค้า"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleSaveDateSettings}
              disabled={loading}
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
            <h2 className="text-2xl font-bold text-primary">การตั้งค่าราคา</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="basePrice">ราคาต่อคน (บาท) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={pricingSettings.basePrice}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, basePrice: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label htmlFor="currency">สกุลเงิน</Label>
                <Input id="currency" value={pricingSettings.currency} disabled />
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
                      minGroupSize: parseInt(e.target.value),
                    })
                  }
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
                      maxGroupSize: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="serviceFee">ค่าบริการ (บาท)</Label>
                <Input
                  id="serviceFee"
                  type="number"
                  value={pricingSettings.serviceFee}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, serviceFee: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  id="includeTax"
                  type="checkbox"
                  checked={pricingSettings.includeTax}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, includeTax: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="includeTax" className="cursor-pointer">
                  รวมภาษีแล้ว
                </Label>
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
            <h2 className="text-2xl font-bold text-primary">Email Templates</h2>
            <p className="text-muted-foreground">ฟีเจอร์นี้กำลังพัฒนา...</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Settings;
