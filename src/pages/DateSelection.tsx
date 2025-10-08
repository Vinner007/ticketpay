import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpiderWeb } from "@/components/SpiderWeb";
import { AnimatedBats } from "@/components/AnimatedBats";
import { DateCard } from "@/components/DateCard";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const DateSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedStory = searchParams.get("story");

  useEffect(() => {
    if (!selectedStory) {
      navigate("/select-story");
    }
  }, [selectedStory, navigate]);

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
      availableSlots: 36,
      status: "available" as const,
      dateValue: "2025-10-29",
    },
    {
      date: 30,
      dayName: "วันพฤหัสบดี",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: 36,
      status: "available" as const,
      dateValue: "2025-10-30",
    },
    {
      date: 31,
      dayName: "วันศุกร์",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: 36,
      status: "available" as const,
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
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {dates.map((date) => (
            <DateCard
              key={date.date}
              {...date}
              onClick={() => navigate(`/booking?story=${selectedStory}&date=${date.dateValue}`)}
            />
          ))}
        </div>

        {/* Schedule Info */}
        <Card className="mt-12 p-6 bg-card/50 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            ตารางเวลา
          </h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• <span className="text-foreground font-semibold">รอบที่ 1-2:</span> 10:00 - 12:00 น. (6 กลุ่ม/รอบ)</p>
            <p>• <span className="text-foreground font-semibold">พักเบรก:</span> 12:00 - 12:30 น.</p>
            <p>• <span className="text-foreground font-semibold">รอบที่ 3-4:</span> 12:30 - 14:30 น. (6 กลุ่ม/รอบ)</p>
            <p>• <span className="text-foreground font-semibold">พักเบรก:</span> 14:30 - 15:00 น.</p>
            <p>• <span className="text-foreground font-semibold">รอบที่ 5-6:</span> 15:00 - 17:00 น. (6 กลุ่ม/รอบ)</p>
            <p className="text-amber-500 mt-4">⚠️ วันที่ 30 ตุลาคม: มีพิธีเปิดงานพิเศษ 13:00-13:30 น. (ท่านรองวิรัส)</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DateSelection;
