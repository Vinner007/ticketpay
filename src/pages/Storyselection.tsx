import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Ghost, Star, Skull, ArrowRight, Users, Clock, AlertTriangle } from "lucide-react";
import { AnimatedBats } from "@/components/AnimatedBats";
import { SpiderWeb } from "@/components/SpiderWeb";
import poster1 from "@/assets/123799.jpg";
import poster2 from "@/assets/123800.jpg";

export const StorySelection = () => {
  const navigate = useNavigate();

  const stories = [
    {
      id: 1,
      title: "โรงหนังต้องสาป",
      titleEn: "The Cursed Cinema",
      poster: poster1,
      difficulty: 4,
      scariness: 4,
      description: "ในอดีต โรงภาพยนตร์แห่งนี้เคยโด่งดัง ก่อนเกิดโศกนาฏกรรมร้าย คืนหนึ่งชายปริศนาบุกเข้ามาจุดไฟเผาและยิงผู้ชมในโรงจนไม่มีใครรอด เสียงกรีดร้องและกลิ่นไหม้ยังคงหลงเหลืออยู่",
      tagline: "เมื่อกลุ่มนักสำรวจตัดสินใจ 'เปิดรอบฉายอีกครั้ง' เพื่อหาความจริง แต่รอบนี้...คนที่ต้องเข้าไป อาจเป็นคุณ!",
      color: "from-orange-500/20 to-red-600/20",
      borderColor: "border-orange-500/50",
    },
    {
      id: 2,
      title: "บทเรียนสีเลือด",
      titleEn: "The Lesson Blood",
      poster: poster2,
      difficulty: 3,
      scariness: 5,
      description: '"แพรวา" นักศึกษาหญิงผู้หลงใหลการแพทย์ ถูกอาจารย์ของเธอ เลือกให้เป็นส่วนหนึ่งของบทเรียน "การทดลองที่ไม่มีวันสำเร็จ" คืนหนึ่งไฟในห้องแล็บดับลง เสียงกรีดร้องครั้งสุดท้ายของเธอดังก้องไม่จางหาย',
      tagline: "ตั้งแต่นั้นมา บทเรียนนั้นเหมือนถูกลืมและปิดไปอย่างลึกลับ ตอนนี้บทเรียนที่ถูกปิดตัวได้กลับมา เปิดสอนอีกครั้ง และกำลังรอนักศึกษาใหม่อย่างคุณ มาท้าทาย!",
      color: "from-purple-500/20 to-pink-600/20",
      borderColor: "border-purple-500/50",
    },
  ];

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < count ? "fill-primary text-primary" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  const handleSelectStory = (storyId: number) => {
    localStorage.setItem("selectedStory", storyId.toString());
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-background py-12 sm:py-16 md:py-20">
      <AnimatedBats />
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Ghost className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-float" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-spooky text-primary text-glow-orange">
              เลือกเรื่องที่จะเล่น
            </h1>
            <Skull className="h-10 w-10 sm:h-12 sm:w-12 text-secondary animate-float" />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground">
            เลือก 1 จาก 2 เรื่องราวสยองขวัญ แล้วเตรียมตัวให้พร้อม...
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {stories.map((story) => (
            <Card
              key={story.id}
              className={`relative overflow-hidden border-2 ${story.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer group`}
              onClick={() => handleSelectStory(story.id)}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-50`} />

              <CardContent className="relative p-0">
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={story.poster}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  
                  {/* Story Number Badge */}
                  <Badge className="absolute top-4 left-4 text-lg px-4 py-2 bg-background/80 backdrop-blur">
                    เรื่องที่ {story.id}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">{story.title}</h2>
                    <p className="text-base sm:text-lg text-muted-foreground italic">
                      {story.titleEn}
                    </p>
                  </div>

                  {/* Ratings */}
                  <div className="flex gap-4 sm:gap-6 py-3 border-y border-border">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-2">ความยาก</div>
                      {renderStars(story.difficulty)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-2">ความน่ากลัว</div>
                      {renderStars(story.scariness)}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {story.description}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {story.tagline}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full text-base sm:text-lg py-5 sm:py-6 group-hover:bg-primary/90 transition-colors"
                    size="lg"
                  >
                    เลือกเรื่องนี้
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur border-2 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Ghost className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">ข้อมูลสำคัญ</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>แต่ละเรื่องใช้เวลา <span className="text-primary font-semibold">10 นาที</span> ต่อรอบ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>เล่นเป็นทีม <span className="text-primary font-semibold">5-7 คน</span> ต่อรอบ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-destructive font-semibold">ทั้ง 2 เรื่องมีความน่ากลัวสูงมาก ไม่เหมาะกับผู้มีโรคหัวใจ</span>
                    </div>
                  </div>
                  <p className="text-sm">หลังเลือกเรื่องแล้ว คุณจะไปเลือกวันและเวลาที่สะดวกต่อไป</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StorySelection;
