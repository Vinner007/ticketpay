import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpiderWeb } from "@/components/SpiderWeb";
import { AnimatedBats } from "@/components/AnimatedBats";
import { DateCard } from "@/components/DateCard";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DailySummary {
  event_date: string;
  available_capacity: number;
  max_capacity: number;
}

const DateSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedStory = searchParams.get("story");
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!selectedStory) {
      navigate("/select-story");
    }
  }, [selectedStory, navigate]);

  // 🔥 ดึงข้อมูลจาก Supabase
  const fetchDailySummary = async (showToast = false) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('daily_summary')
        .select('event_date, available_capacity, max_capacity')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('❌ Error fetching daily summary:', error);
        toast.error('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่');
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Loaded data from Supabase:', data);
        setDailySummaries(data);
        setLastUpdated(new Date());
        if (showToast) {
          toast.success('อัพเดทข้อมูลล่าสุดแล้ว');
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySummary();

    // 🔄 Real-time subscription
    const channel = supabase
      .channel('daily_summary_changes_date_selection')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_summary'
        },
        (payload) => {
          console.log('🔔 Real-time update received:', payload);
          fetchDailySummary(true);
        }
      )
      .subscribe();

    // ⏰ Auto-refresh ทุก 30 วินาที
    const interval = setInterval(() => {
      fetchDailySummary();
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  // 🎯 ฟังก์ชันคำนวณสถานะที่นั่ง
  const getAvailabilityStatus = (eventDate: string) => {
    const summary = dailySummaries.find((s) => s.event_date === eventDate);
    
    if (!summary) {
      return "available" as const;
    }

    const percentAvailable = (summary.available_capacity / summary.max_capacity) * 100;

    if (summary.available_capacity === 0) {
      return "sold-out" as const;
    }
    
    if (percentAvailable < 30) {
      return "limited" as const;
    }
    
    return "available" as const;
  };

  // 🔒 เช็คที่นั่งก่อนเข้าหน้าจอง
  const handleDateClick = (dateValue: string) => {
    const summary = dailySummaries.find(s => s.event_date === dateValue);
    
    if (!summary) {
      toast.error("ไม่สามารถโหลดข้อมูลที่นั่งได้ กรุณาลองใหม่");
      return;
    }

    if (summary.available_capacity === 0) {
      toast.error("😢 ขออภัย วันนี้เต็มแล้ว กรุณาเลือกวันอื่น");
      return;
    }

    if (summary.available_capacity < 5) {
      toast.warning(`⚠️ เหลือที่นั่งเพียง ${summary.available_capacity} ที่ กรุณารีบจอง!`);
    }

    navigate(`/booking?story=${selectedStory}&date=${dateValue}`);
  };

  const storyInfo = {
    "cursed-cinema": {
      title: "โรงหนังต้องสาป",
      titleEn: "The Cursed Cinema",
    },
    "lesson-blood": {
      title: "บทเรียนสีเลือด",
      titleEn: "The Lesson Blood",
    },
  };

  const currentStory = selectedStory ? storyInfo[selectedStory as keyof typeof storyInfo] : null;

  const dates = [
    {
      date: 29,
      dayName: "วันพุธ",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: dailySummaries.find(s => s.event_date === "2025-10-29")?.available_capacity || 0,
      status: getAvailabilityStatus("2025-10-29"),
      dateValue: "2025-10-29",
    },
    {
      date: 30,
      dayName: "วันพฤหัสบดี",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: dailySummaries.find(s => s.event_date === "2025-10-30")?.available_capacity || 0,
      status: getAvailabilityStatus("2025-10-30"),
      dateValue: "2025-10-30",
    },
    {
      date: 31,
      dayName: "วันศุกร์",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: dailySummaries.find(s => s.event_date === "2025-10-31")?.available_capacity || 0,
      status: getAvailabilityStatus("2025-10-31"),
      dateValue: "2025-10-31",
    },
  ];

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      <AnimatedBats />
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/select-story")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            เปลี่ยนเรื่อง
          </Button>
        </div>

        {/* Selected Story Info */}
        {currentStory && (
          <Card className="mb-12 p-6 bg-primary/10 border-primary max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">เรื่องที่เลือก</p>
              <h2 className="text-3xl font-spooky text-primary mb-1">
                {currentStory.title}
              </h2>
              <p className="text-sm text-muted-foreground">{currentStory.titleEn}</p>
            </div>
          </Card>
        )}

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-spooky text-primary text-glow-orange mb-4">
            เลือกวันที่เข้าร่วม
          </h1>
          <p className="text-lg text-muted-foreground">
            ที่ ตึก 4 ชั้น 1 และ 2 มหาวิทยาลัยศรีปทุม
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            * แสดงจำนวนคนที่เหลือ (อัพเดทแบบ Real-time)
          </p>

          {/* แสดงเวลาอัพเดทล่าสุด */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              onClick={() => fetchDailySummary(true)}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              อัพเดทข้อมูล
            </Button>
            {lastUpdated && (
              <span className="text-xs text-muted-foreground">
                อัพเดทล่าสุด: {lastUpdated.toLocaleTimeString('th-TH')}
              </span>
            )}
          </div>
        </div>

        {/* Dates Grid */}
        {isLoading && !dailySummaries.length ? (
          <div className="text-center text-muted-foreground">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {dates.map((date) => (
              <DateCard
                key={date.date}
                {...date}
                onClick={() => handleDateClick(date.dateValue)}
              />
            ))}
          </div>
        )}

        {/* Live Update Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>อัพเดทข้อมูลแบบ Real-time</span>
          </div>
        </div>

        {/* Schedule Info */}
        <Card className="mt-12 p-6 bg-card/50 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            ตารางเวลา
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• <span className="text-foreground font-semibold">🌅 รอบเช้า:</span> 10:00 - 12:00 น. (รองรับ 84 คน)</p>
            <p>• <span className="text-foreground font-semibold">พักเบรก:</span> 12:00 - 12:30 น.</p>
            <p>• <span className="text-foreground font-semibold">☀️ รอบบ่าย:</span> 12:30 - 14:30 น. (รองรับ 84 คน)</p>
            <p>• <span className="text-foreground font-semibold">พักเบรก:</span> 14:30 - 15:00 น.</p>
            <p>• <span className="text-foreground font-semibold">🌆 รอบเย็น:</span> 15:00 - 17:00 น. (รองรับ 84 คน)</p>
            <p className="text-primary font-semibold mt-4">📊 รวมต่อวัน: 252 คน (3 รอบ × 84 คน)</p>
            <p className="text-amber-500 mt-4">⚠️ วันที่ 30 ตุลาคม: มีพิธีเปิดงานพิเศษ 13:00-13:30 น. (ท่านรองวิรัส)</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DateSelection;
