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
import { Music, Pizza, Camera, Gift, Ghost, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-halloween.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const Index = () => {
  const scrollToBooking = () => {
    document.getElementById("date-selection")?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: Ghost,
      title: "ปาร์ตี้คอสตูม",
      description: "แต่งชุดฮาโลวีนสุดเจ๋ง ลุ้นรางวัลชุดสวยสุด",
    },
    {
      icon: Music,
      title: "ดีเจสุดมันส์",
      description: "ดนตรีเสียงดังสุดยอดจาก DJ ชื่อดัง",
    },
    {
      icon: Pizza,
      title: "อาหารและเครื่องดื่ม",
      description: "บุฟเฟ่ต์อาหารและเครื่องดื่มไม่อ้ันตลอดงาน",
    },
    {
      icon: Camera,
      title: "โซนถ่ายรูป",
      description: "มุมถ่ายรูปสุดปังพร้อมฉากสยองขวัญ",
    },
    {
      icon: Gift,
      title: "ของรางวัลมากมาย",
      description: "เกมส์สนุกๆ มีของรางวัลมูลค่าสูง",
    },
    {
      icon: Sparkles,
      title: "บ้านผีสิง",
      description: "สัมผัสประสบการณ์สุดระทึกในบ้านผีสิง",
    },
  ];

  const dates = [
    {
      date: 28,
      dayName: "วันอังคาร",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: 15,
      status: "available" as const,
      dateValue: "2025-10-28",
    },
    {
      date: 29,
      dayName: "วันพุธ",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: 8,
      status: "limited" as const,
      dateValue: "2025-10-29",
    },
    {
      date: 30,
      dayName: "วันพฤหัสบดี",
      month: "ตุลาคม",
      year: 2568,
      availableSlots: 3,
      status: "limited" as const,
      dateValue: "2025-10-30",
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
      answer: "ราคา 80 บาทต่อคน สำหรับทุกวันที่จัดงาน รวมอาหาร เครื่องดื่ม และกิจกรรมทั้งหมด",
    },
    {
      question: "ต้องแต่งชุดฮาโลวีนหรือไม่?",
      answer: "ไม่บังคับ แต่แนะนำให้แต่งชุดเพื่อความสนุกและมีโอกาสลุ้นรางวัลชุดสวยที่สุด!",
    },
    {
      question: "สามารถยกเลิกหรือขอเงินคืนได้ไหม?",
      answer: "สามารถยกเลิกและขอเงินคืนได้เต็มจำนวนก่อนงาน 7 วัน หลังจากนั้นจะคืน 50% ของราคาตั๋ว",
    },
    {
      question: "มีที่จอดรถหรือไม่?",
      answer: "มีที่จอดรถฟรีสำหรับผู้มีตั๋วเข้างาน บริเวณ Haunted Arena",
    },
    {
      question: "เด็กต้องซื้อตั๋วไหม?",
      answer: "เด็กอายุต่ำกว่า 5 ปีเข้าฟรี ส่วนเด็กที่มีอายุ 5 ปีขึ้นไปต้องซื้อตั๋วเหมือนผู้ใหญ่",
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
            Halloween Night 2025
          </h1>
          <div className="text-2xl md:text-3xl mb-12 text-foreground font-body">
            มาเฉลิมฉลองคืนฮาโลวีนสุดสยองที่ยิ่งใหญ่ที่สุด! 👻
          </div>

          <div className="mb-12">
            <CountdownTimer />
          </div>

          <Button
            onClick={scrollToBooking}
            size="lg"
            className="text-xl px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange animate-bounce-slow"
          >
            จองตั๋วเลย 🎃
          </Button>
        </div>
      </section>

      {/* Date Selection Section */}
      <section id="date-selection" className="relative py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SpiderWeb position="top-left" />
            <h2 className="text-5xl md:text-6xl mb-4 text-primary text-glow-orange">
              เลือกวันที่เข้าร่วม
            </h2>
            <p className="text-xl text-muted-foreground">
              เวลา 18:00 - 23:00 น. ที่ Haunted Arena, กรุงเทพฯ
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
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl mb-4 text-secondary text-glow-purple">
              ไฮไลท์ภายในงาน
            </h2>
            <p className="text-xl text-muted-foreground">
              สนุกสนานกับกิจกรรมมากมายตลอดทั้งคืน
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
      <section className="relative py-20 bg-background/50">
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
      <section className="relative py-20">
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
              <h3 className="text-2xl font-spooky text-primary mb-4">Halloween Night 2025</h3>
              <p className="text-muted-foreground">
                งานฮาโลวีนสุดมันส์ที่ยิ่งใหญ่ที่สุดแห่งปี
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">ติดต่อเรา</h4>
              <p className="text-muted-foreground">Email: info@halloweennight.com</p>
              <p className="text-muted-foreground">Tel: 02-XXX-XXXX</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">สถานที่</h4>
              <p className="text-muted-foreground">Haunted Arena</p>
              <p className="text-muted-foreground">กรุงเทพฯ ประเทศไทย</p>
            </div>
          </div>
          <div className="text-center text-muted-foreground border-t border-border pt-8">
            <p>&copy; 2025 Halloween Night. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
