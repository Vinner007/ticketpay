import { CountdownTimer } from "@/components/CountdownTimer";
import { DateCard } from "@/components/DateCard";
import { FeatureCard } from "@/components/FeatureCard";
import { AnimatedBats } from "@/components/AnimatedBats";
import { SpiderWeb } from "@/components/SpiderWeb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Music, Pizza, Camera, Gift, Ghost, Sparkles, Film, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-halloween.jpg";
import poster1 from "@/assets/123799.jpg";
import poster2 from "@/assets/123800.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const Index = () => {
  const navigate = useNavigate();

  const scrollToStories = () => {
    document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToStorySelection = () => {
    navigate("/story-selection");
  };

  const features = [
    {
      icon: Ghost,
      title: "บ้านผีสิง 2 เรื่อง",
      description: "สัมผัสประสบการณ์สุดระทึกใน 2 เรื่องราวสยองขวัญ",
    },
    {
      icon: Music,
      title: "กิจกรรมสุดมันส์",
      description: "เกมส์และกิจกรรมสนุกๆ ตลอดทั้งวัน",
    },
    {
      icon: Pizza,
      title: "โซนพักผ่อน",
      description: "พื้นที่พักผ่อนสำหรับรอรอบของคุณ พร้อมอาหารและเครื่องดื่ม",
    },
    {
      icon: Camera,
      title: "โซนถ่ายรูป",
      description: "มุมถ่ายรูปสุดปังพร้อมฉากสยองขวัญ",
    },
    {
      icon: Gift,
      title: "ของรางวัลมากมาย",
      description: "แต่งชุดธีมฮาโลวีนรับ Gift Voucher",
    },
    {
      icon: Sparkles,
      title: "ประสบการณ์สุดพิเศษ",
      description: "เล่นเป็นทีม 5-7 คน ความท้าทายรออยู่",
    },
  ];

  const stories = [
    {
      id: 1,
      title: "โรงหนังต้องสาป",
      titleEn: "The Cursed Cinema",
      poster: poster1,
      difficulty: 4,
      scariness: 4,
      tagline: "เปิดรอบฉายอีกครั้ง...คนที่ต้องเข้าไป อาจเป็นคุณ!",
    },
    {
      id: 2,
      title: "บทเรียนสีเลือด",
      titleEn: "The Lesson Blood",
      poster: poster2,
      difficulty: 3,
      scariness: 5,
      tagline: "บทเรียนกลับมาเปิดสอนอีกครั้ง...รอนักศึกษาใหม่",
    },
  ];

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < count ? "fill-primary text-primary" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

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
      availableSlots: 33,
      status: "limited" as const,
      dateValue: "2025-10-30",
    },
    {
      date: 31,
      dayName: "วันศุกร์",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: 36,
      status: "limited" as const,
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
      answer: "มี 2 เรื่องราวสยองขวัญให้เลือกเล่น: 1) โรงหนังต้องสาป (ความยาก 4⭐ / น่ากลัว 4⭐) และ 2) บทเรียนสีเลือด (ความยาก 3⭐ / น่ากลัว 5⭐) แต่ละเรื่องใช้เวลา 10 นาทีต่อรอบ แต่ละเรื่องมี 36 รอบต่อวัน (ยกเว้นวันที่ 30 มี 33 รอบเพราะมีพิธีเปิดงาน)",
    },
    {
      question: "มีรอบเวลาไหนให้เลือกบ้าง?",
      answer: "เปิดทุกวัน 10:00-17:00 น. แต่ละรอบใช้เวลา 10 นาที มีเวลาพักเบรก 12:00-12:30 และ 14:30-15:00 น. (วันที่ 30 ต.ค. มีพิธีเปิดงาน 13:00-13:30) กรุณามาก่อนเวลา 30 นาทีเพื่อลงทะเบียน",
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
          <h1 className="text-6xl md:text-8xl lg:text-9xl mb-6 text-primary text-glow-orange animate-float">
            THE HOMICIDE BLOOD
          </h1>
          <div className="text-2xl md:text-3xl mb-6 text-foreground font-body">
            มาเฉลิมฉลองคืนฮาโลวีนสุดสยองที่ยิ่งใหญ่ที่สุด! 👻
          </div>
          <div className="text-lg md:text-xl mb-12 text-muted-foreground">
            <span className="text-primary font-semibold">2 เรื่องราวสยองขวัญ</span> • 
            <span className="mx-2">72 รอบต่อวัน</span> • 
            <span className="mx-2">504 ที่นั่ง</span> • 
            <span className="mx-2">3 วัน</span>
          </div>

          <div className="mb-12">
            <CountdownTimer />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={goToStorySelection}
              size="lg"
              className="text-xl px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange animate-bounce-slow"
            >
              จองตั๋วเลย 🎃
            </Button>
            <Button
              onClick={scrollToStories}
              size="lg"
              variant="outline"
              className="text-xl px-12 py-6 border-2 border-primary hover:bg-primary/10"
            >
              ดูเรื่องราว 👻
            </Button>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      <section id="stories" className="relative py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="h-8 w-8 text-primary" />
              <h2 className="text-5xl md:text-6xl text-primary text-glow-orange">
                2 เรื่องราวสยองขวัญ
              </h2>
              <Film className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg text-muted-foreground">
              เลือก 1 เรื่องที่คุณกล้าท้าทาย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden border-2 border-primary/30 hover:border-primary transition-all duration-300 group cursor-pointer" onClick={goToStorySelection}>
                <div className="relative aspect-[2/3]">
                  <img
                    src={story.poster}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{story.title}</h3>
                      <p className="text-sm text-muted-foreground italic">{story.titleEn}</p>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">ความยาก</div>
                        {renderStars(story.difficulty)}
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">ความน่ากลัว</div>
                        {renderStars(story.scariness)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{story.tagline}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={goToStorySelection}
              size="lg"
              className="text-lg px-10 py-6 bg-primary hover:bg-primary/90"
            >
              เลือกเรื่องและจองเลย
            </Button>
          </div>
        </div>
      </section>

      {/* Date Selection Section */}
      <section id="date-selection" className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SpiderWeb position="top-left" />
            <h2 className="text-5xl md:text-6xl mb-4 text-secondary text-glow-purple">
              เลือกวันที่เข้าร่วม
            </h2>
            <p className="text-lg text-muted-foreground">
              ที่ ตึก 4 ชั้น 1 และ 2 มหาวิทยาลัยศรีปทุม
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {dates.map((date) => (
              <DateCard key={date.date} {...date} />
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="relative py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-secondary text-glow-purple">
              ไฮไลท์ภายในงาน
            </h2>
            <p className="text-xl text-muted-foreground">
              สนุกสนานกับกิจกรรมมากมายตลอดทั้งวัน
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-primary text-glow-orange">
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
      <section className="relative py-20 bg-background/50">
        <SpiderWeb position="bottom-left" />
        <SpiderWeb position="bottom-right" />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-secondary text-glow-purple">
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
              &copy; 2025{" "}
              <a
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
