import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { DateCard } from "@/components/DateCard";
import { FeatureCard } from "@/components/FeatureCard";
import { AnimatedBats } from "@/components/AnimatedBats";
import { SpiderWeb } from "@/components/SpiderWeb";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Pizza, Camera, Ghost, Sparkles, RefreshCw } from "lucide-react";
import heroImage from "@/assets/hero-halloween.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface DailySummary {
  event_date: string;
  available_capacity: number;
  max_capacity: number;
}

// 🔥 Max Capacity แต่ละวัน
const MAX_CAPACITY_PER_DAY: Record<string, number> = {
  "2025-10-29": 252,
  "2025-10-30": 231,
  "2025-10-31": 252,
};

const Index = () => {
  const navigate = useNavigate();
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 🔥 ดึงข้อมูลจาก Supabase พร้อม Real-time Updates
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
      .channel('daily_summary_changes')
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
      return { 
        label: "กำลังโหลด...", 
        status: "available" as const,
        color: "text-muted-foreground"
      };
    }

    const percentAvailable = (summary.available_capacity / summary.max_capacity) * 100;

    console.log(`📊 Status for ${eventDate}:`, {
      available: summary.available_capacity,
      max: summary.max_capacity,
      percent: percentAvailable.toFixed(1) + '%'
    });

    if (summary.available_capacity === 0) {
      return { 
        label: "เต็มแล้ว", 
        status: "sold-out" as const,
        color: "text-destructive"
      };
    }
    
    if (percentAvailable < 30) {
      return { 
        label: "เหลือน้อย", 
        status: "limited" as const,
        color: "text-warning"
      };
    }
    
    return { 
      label: "มีที่ว่าง", 
      status: "available" as const,
      color: "text-success"
    };
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

    navigate(`/select-story?date=${dateValue}`);
  };

  const features = [
    {
      icon: Ghost,
      title: "Escape Room ผีสิง",
      description: "ภารกิจเอาชีวิตรอดจากบ้านผีสิงที่เต็มไปด้วยปริศนา!",
    },
    {
      icon: Pizza,
      title: "Halloween Market",
      description: "ตลาดนัดที่รวมของกินสุดครีเอตในบรรยากาศขนหัวลุก",
    },
    {
      icon: Sparkles,
      title: "บูธกิจกรรม",
      description: "กิจกรรมสุดหลอนที่รอให้คุณมาท้าทาย!",
    },
    {
      icon: Camera,
      title: "ถ่ายรูปกับผีตัวเป็นๆ",
      description: "กล้องพร้อม... ผีพร้อม... แล้วคุณพร้อมรึยัง?",
    },
  ];

  // 🔥 ข้อมูลวันที่ - ดึงจาก Database
  const dates = [
    {
      date: 29,
      dayName: "วันพุธ",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: dailySummaries.find(s => s.event_date === "2025-10-29")?.available_capacity || 0,
      status: getAvailabilityStatus("2025-10-29").status,
      dateValue: "2025-10-29",
    },
    {
      date: 30,
      dayName: "วันพฤหัสบดี",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: dailySummaries.find(s => s.event_date === "2025-10-30")?.available_capacity || 0,
      status: getAvailabilityStatus("2025-10-30").status,
      dateValue: "2025-10-30",
    },
    {
      date: 31,
      dayName: "วันศุกร์",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: dailySummaries.find(s => s.event_date === "2025-10-31")?.available_capacity || 0,
      status: getAvailabilityStatus("2025-10-31").status,
      dateValue: "2025-10-31",
    },
  ];

  const galleryImages = [
    { src: gallery1, alt: "Halloween Party Atmosphere" },
    { src: gallery2, alt: "Photo Booth Fun" },
    { src: gallery3, alt: "Food and Drinks" },
  ];

  const faqs = [
    {
      question: "จองตั๋วได้กี่คนต่อครั้ง?",
      answer: "แต่ละครั้งสามารถจองได้ 5-7 คนต่อกลุ่มเท่านั้น ไม่สามารถจองน้อยกว่าหรือมากกว่านี้ได้",
    },
    {
      question: "ราคาตั๋วเท่าไหร่?",
      answer: "ราคา 80 บาทต่อคน สำหรับทุกวันที่จัดงาน มีโปรโมชั่นพิเศษ 'มา 7 จ่าย 6' (ใช้โค้ด GROUP7FOR6)",
    },
    {
      question: "มีกี่เรื่องให้เลือกเล่น?",
      answer: "มี 2 เรื่องราวสยองขวัญให้เลือกเล่น: 1) โรงหนังต้องสาป (ความยาก 4⭐ / น่ากลัว 4⭐) และ 2) บทเรียนสีเลือด (ความยาก 3⭐ / น่ากลัว 5⭐) แต่ละเรื่องใช้เวลา 10 นาทีต่อรอบ",
    },
    {
      question: "มีรอบเวลาไหนให้เลือกบ้าง?",
      answer: "เปิดทุกวัน 10:00-17:00 น. แบ่งเป็น 3 รอบหลัก: รอบเช้า (10:00-12:00), รอบเที่ยง (12:30-14:30), และรอบเย็น (15:00-17:00) มีเวลาพักเบรก 12:00-12:30 และ 14:30-15:00 น. วันที่ 30 ตุลาคมมีพิธีเปิดงานพิเศษโดยท่านรองวิรัส เวลา 13:00-13:30",
    },
    {
      question: "จำนวนที่นั่งแต่ละวันเท่าไหร่?",
      answer: "วันที่ 29 ตุลาคม: 252 ที่ (36 รอบ), วันที่ 30 ตุลาคม: 231 ที่ (33 รอบ - มีพิธีเปิดงาน), วันที่ 31 ตุลาคม: 252 ที่ (36 รอบ). รวมทั้ง 3 วันมีที่นั่งทั้งหมด 735 ที่",
    },
    {
      question: "ต้องแต่งชุดฮาโลวีนหรือไม่?",
      answer: "ไม่บังคับ แต่แนะนำให้แต่งชุดธีมผี/แฟนซีฮาโลวีนเพื่อรับ Gift Voucher และเข้าร่วมรับรางวัล!",
    },
    {
      question: "บัตรที่ซื้อใช้ได้กี่วัน?",
      answer: "บัตรมีผลเฉพาะวันที่เลือกไว้เท่านั้น หากไม่มาตามวันที่เลือก ทางทีมงานจะถือว่าสละสิทธิ์และไม่มีการคืนเงิน",
    },
    {
      question: "ต้องเตรียมอะไรบ้างก่อนมางาน?",
      answer: "นำ QR code/บัตรมาแสดงที่จุดลงทะเบียน ห้ามนำโทรศัพท์เข้าไปในบ้านผีสิง (มีจุดรับฝาก) และฝากของมีค่าไว้ที่จุดรับฝาก. คำเตือน: ทั้ง 2 เรื่องมีความน่ากลัวสูงมาก ไม่เหมาะกับผู้มีโรคหัวใจ",
    },
  ];

  // 🔥 คำนวณยอดรวม
  const totalCapacity = 735; // 252 + 231 + 252

  return (
    <div className="relative min-h-screen">
      <AnimatedBats />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        
        <SpiderWeb position="top-left" />
        <SpiderWeb position="top-right" />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-6 text-primary text-glow-orange animate-float font-spooky">
            THE HOMICIDE BLOOD!
          </h1>
          <div className="text-2xl md:text-3xl mb-6 text-foreground font-body">
            มาเฉลิมฉลองคืนฮาโลวีนสุดสยองที่ยิ่งใหญ่ที่สุด! 👻
          </div>
          <div className="text-lg md:text-xl mb-12 text-muted-foreground">
            <span className="text-primary font-semibold">2 เรื่องราวสยองขวัญ</span> • 
            <span className="mx-2">105 รอบ</span> • 
            <span className="mx-2">{totalCapacity} คน</span> • 
            <span className="mx-2">3 วัน</span>
          </div>

          <div className="mb-12">
            <CountdownTimer />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => {
                const element = document.getElementById('date-selection');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="text-2xl px-16 py-8 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange font-bold shadow-2xl"
            >
              จองตั๋วเลย 🎃
            </Button>
          </div>
        </div>
      </section>

      {/* Date Selection Section */}
      <section id="date-selection" className="relative py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SpiderWeb position="top-left" />
            <h2 className="text-5xl md:text-6xl mb-4 text-primary text-glow-orange font-spooky">
              เลือกวันที่เข้าร่วม
            </h2>
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

          {isLoading && !dailySummaries.length ? (
            <div className="text-center text-muted-foreground">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p>กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {dates.map((date) => {
                const statusInfo = getAvailabilityStatus(date.dateValue);
                const maxCap = MAX_CAPACITY_PER_DAY[date.dateValue];
                const isSpecialDay = date.dateValue === "2025-10-30";
                
                return (
                  <div 
                    key={date.date} 
                    onClick={() => handleDateClick(date.dateValue)}
                    className={`cursor-pointer transition-transform hover:scale-105 ${
                      date.status === 'sold-out' ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    <DateCard {...date} />
                    <div className={`text-center mt-2 font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </div>
                    {isSpecialDay && (
                      <div className="text-center mt-1">
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                          🎉 มีพิธีเปิดงาน
                        </span>
                      </div>
                    )}
                    <div className="text-center mt-1 text-xs text-muted-foreground">
                      (ที่นั่งทั้งหมด {maxCap} ที่)
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Live Update Indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>อัพเดทข้อมูลแบบ Real-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-secondary text-glow-purple font-spooky">
              ไฮไลท์ภายในงาน
            </h2>
            <p className="text-xl text-muted-foreground">
              สนุกสนานกับกิจกรรมมากมายตลอดทั้งวัน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-primary text-glow-orange font-spooky">
              บรรยากาศจากปีที่แล้ว
            </h2>
            <p className="text-xl text-muted-foreground">
              ชมภาพบรรยากาศสุดมันส์จากงานปีก่อน
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-video rounded-xl overflow-hidden border-4 border-primary glow-orange">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/20 hover:bg-transparent transition-colors duration-300" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20">
        <SpiderWeb position="bottom-left" />
        <SpiderWeb position="bottom-right" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-secondary text-glow-purple font-spooky">
              คำถามที่พบบ่อย
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border-2 border-border rounded-lg px-6 hover:border-secondary transition-colors"
                >
                  <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 bg-card border-t-2 border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-spooky text-primary mb-4">THE HOMICIDE BLOOD 2025</h3>
              <p className="text-muted-foreground">
                งานฮาโลวีนสุดสยองที่ยิ่งใหญ่ที่สุดแห่งปี
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ที่นั่งทั้งหมด {totalCapacity} ที่ • 3 วัน
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">ติดต่อเรา</h4>
              <p className="text-muted-foreground">Email: info@halloweennight.com</p>
              <p className="text-muted-foreground">Tel: 02-XXX-XXXX</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">สถานที่</h4>
              <p className="text-muted-foreground">ตึก 4 ชั้น 1,2</p>
              <p className="text-muted-foreground">มหาวิทยาลัยศรีปทุม กรุงเทพฯ</p>
            </div>
          </div>
          <div className="text-center text-muted-foreground border-t border-border pt-8">
            <p>
              © 2025{" "}
              
                href="https://www.cxntrolx.in.th/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors duration-300 underline font-semibold"
              >
                Cxntrolx
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
