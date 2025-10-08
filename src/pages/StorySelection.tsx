import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpiderWeb } from "@/components/SpiderWeb";
import { AnimatedBats } from "@/components/AnimatedBats";
import { ArrowLeft, Star, Clock, Users, Calendar, Skull, Ghost, AlertTriangle, CheckCircle } from "lucide-react";
import story1 from "@/assets/123799.jpg";
import story2 from "@/assets/123800.jpg";

const stories = [
  {
    id: "cursed-cinema",
    title: "โรงหนังต้องสาป",
    titleEn: "The Cursed Cinema",
    image: story1,
    difficulty: 4,
    scary: 4,
    tagline: "เปิดรอบฉายอีกครั้ง...คนที่ต้องเข้าไป อาจเป็นคุณ!",
    description:
      'ในอดีต โรงภาพยนตร์แห่งนี้เคยโด่งดัง ก่อนเกิดโศกนาฏกรรมร้าย คืนหนึ่งชายปริศนาบุกเข้ามาจุดไฟเผาและยิงผู้ชมในโรงจนไม่มีใครรอด เสียงกรีดร้องและกลิ่นไหม้ยังคงหลงเหลืออยู่ เมื่อกลุ่มนักสำรวจตัดสินใจ "เปิดรอบฉายอีกครั้ง" เพื่อหาความจริง แต่รอบนี้...คนที่ต้องเข้าไป อาจเป็นคุณ!',
    color: "orange",
    bgGradient: "from-orange-500/20 to-red-600/30",
    borderColor: "border-orange-500/50",
    glowColor: "shadow-orange-500/50",
  },
  {
    id: "lesson-blood",
    title: "บทเรียนสีเลือด",
    titleEn: "The Lesson Blood",
    image: story2,
    difficulty: 3,
    scary: 5,
    tagline: "บทเรียนกลับมาเปิดสอนอีกครั้ง...รอนักศึกษาใหม่",
    description:
      '"แพรวา" นักศึกษาหญิงผู้หลงใหลการแพทย์ ถูกอาจารย์ของเธอ เลือกให้เป็นส่วนหนึ่งของบทเรียน "การทดลองที่ไม่มีวันสำเร็จ" คืนหนึ่งไฟในห้องแล็บดับลง เสียงกรีดร้องครั้งสุดท้ายของเธอดังก้องไม่จางหาย ตั้งแต่นั้นมา บทเรียนนั้นเหมือนถูกลืมและปิดไปอย่างลึกลับ ตอนนี้บทเรียนที่ถูกปิดตัวได้กลับมา เปิดสอนอีกครั้ง และกำลังรอนักศึกษาใหม่อย่างคุณ มาท้าทาย!',
    color: "purple",
    bgGradient: "from-purple-500/20 to-pink-600/30",
    borderColor: "border-purple-500/50",
    glowColor: "shadow-purple-500/50",
  },
];

const StorySelection = () => {
  const navigate = useNavigate();

  const handleStorySelect = (storyId: string) => {
    localStorage.setItem("selectedStory", storyId);
    navigate(`/select-date?story=${storyId}`);
  };

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
            onClick={() => navigate("/")}
            className="gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 glow-orange-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Button>
        </div>

        {/* Title with Animation */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Ghost className="h-10 w-10 text-primary animate-float" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-spooky text-primary text-glow-orange animate-pulse-slow">
              เลือกเรื่องที่จะเล่น
            </h1>
            <Skull className="h-10 w-10 text-secondary animate-float" style={{ animationDelay: "0.5s" }} />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground">
            💀 เลือก 1 จาก 2 เรื่องราวสยองขวัญ แล้วเตรียมตัวให้พร้อม... 💀
          </p>
          <div className="inline-block px-4 py-2 bg-destructive/20 border border-destructive rounded-lg">
            <p className="text-sm text-destructive font-semibold">⚠️ ความน่ากลัวระดับสูง • ไม่เหมาะกับผู้มีโรคหัวใจ</p>
          </div>
        </div>

        {/* Stories Grid with Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {stories.map((story, index) => (
            <Card
              key={story.id}
              className={`group overflow-hidden border-2 ${story.borderColor} hover:border-${story.color}-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${story.glowColor} hover:shadow-lg cursor-pointer relative`}
              onClick={() => handleStorySelect(story.id)}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Story Number Badge */}
              <div className="absolute top-4 left-4 z-20">
                <Badge
                  className={`text-lg px-4 py-2 ${story.color === "orange" ? "bg-orange-500" : "bg-purple-500"} text-white font-bold shadow-lg`}
                >
                  เรื่องที่ {index + 1}
                </Badge>
              </div>

              {/* Image with Overlay */}
              <div className="relative h-[450px] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-sm"
                />
                {/* Dark Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${story.bgGradient} via-background/70 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500`}
                />

                {/* Floating Ghost Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-all duration-500">
                  <Ghost className="h-32 w-32 text-white animate-float" />
                </div>

                {/* Title on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                  <h2
                    className={`text-4xl md:text-5xl font-spooky mb-2 ${story.color === "orange" ? "text-orange-500 text-glow-orange" : "text-purple-500 text-glow-purple"}`}
                  >
                    {story.title}
                  </h2>
                  <p className="text-sm text-muted-foreground italic mb-2">{story.titleEn}</p>
                  <p className="text-sm text-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {story.tagline}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Ratings with Enhanced Style */}
                <div className="flex gap-8 pb-4 border-b-2 border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle
                        className={`h-4 w-4 ${story.color === "orange" ? "text-orange-500" : "text-purple-500"}`}
                      />
                      <p className="text-sm font-semibold">ความยาก</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 transition-all duration-300 ${
                            i < story.difficulty
                              ? story.color === "orange"
                                ? "fill-orange-500 text-orange-500 drop-shadow-glow"
                                : "fill-purple-500 text-purple-500 drop-shadow-glow"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skull className="h-4 w-4 text-destructive" />
                      <p className="text-sm font-semibold">ความน่ากลัว</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 transition-all duration-300 ${
                            i < story.scary
                              ? "fill-destructive text-destructive drop-shadow-glow"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="min-h-[120px]">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5 group-hover:line-clamp-none transition-all duration-300">
                    {story.description}
                  </p>
                </div>

                {/* Stats Row - แก้ไข "ที่นั่ง" เป็น "คน" */}
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-primary">36</div>
                    <div className="text-xs text-muted-foreground">รอบ/เรื่อง</div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="text-2xl font-bold text-secondary">252</div>
                    <div className="text-xs text-muted-foreground">คน/เรื่อง</div>
                  </div>
                </div>

                {/* CTA Button with Enhanced Design */}
                <Button
                  className={`w-full py-6 text-lg font-bold relative overflow-hidden group/btn ${
                    story.color === "orange"
                      ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  } text-white shadow-lg transition-all duration-300`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStorySelect(story.id);
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    เลือกเรื่องนี้
                    <Ghost className="h-5 w-5 group-hover/btn:animate-bounce" />
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Sections with Enhanced Design */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Main Stats with Halloween Theme - แก้ "ที่นั่ง" เป็น "คน" */}
          <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/30 shadow-2xl">
            <div className="absolute top-0 right-0 opacity-5">
              <Ghost className="h-64 w-64 text-primary" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-spooky text-primary mb-8 text-center flex items-center justify-center gap-3">
                <Skull className="h-8 w-8 animate-float" />
                📊 ข้อมูลการจัดงาน
                <Skull className="h-8 w-8 animate-float" style={{ animationDelay: "0.5s" }} />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative text-center p-6 bg-card/50 backdrop-blur rounded-xl border-2 border-orange-500/30 hover:border-orange-500 transition-all duration-300 hover:scale-105">
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-600 mb-2 animate-pulse-slow">
                      72
                    </div>
                    <p className="text-sm font-semibold mb-1">รอบรวมทั้ง 2 เรื่อง</p>
                    <p className="text-xs text-muted-foreground">(36 รอบต่อเรื่อง)</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative text-center p-6 bg-card/50 backdrop-blur rounded-xl border-2 border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:scale-105">
                    <div
                      className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-pink-600 mb-2 animate-pulse-slow"
                      style={{ animationDelay: "0.2s" }}
                    >
                      504
                    </div>
                    <p className="text-sm font-semibold mb-1">คนรวมทั้งหมด</p>
                    <p className="text-xs text-muted-foreground">(252 คนต่อเรื่อง)</p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative text-center p-6 bg-card/50 backdrop-blur rounded-xl border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:scale-105">
                    <div
                      className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-emerald-600 mb-2 animate-pulse-slow"
                      style={{ animationDelay: "0.4s" }}
                    >
                      5-7
                    </div>
                    <p className="text-sm font-semibold mb-1">คนต่อทีม</p>
                    <p className="text-xs text-muted-foreground">(72 ทีมทั้งหมด)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Schedule with Better Visual Hierarchy */}
          <Card className="p-8 bg-card/50 backdrop-blur border-2 border-secondary/30 shadow-xl">
            <h3 className="text-3xl font-spooky text-secondary mb-8 flex items-center gap-3">
              <Clock className="h-8 w-8 animate-spin-slow" />
              ตารางเวลารายละเอียด
            </h3>

            <div className="space-y-6">
              {/* Day 29 */}
              <div className="group hover:bg-primary/5 p-4 rounded-xl transition-all duration-300">
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-6 w-6 text-orange-500" />
                    <h4 className="text-xl font-bold text-orange-500">29 ตุลาคม 2568</h4>
                    <Badge className="bg-orange-500/20 text-orange-500 border-orange-500">วันพุธ</Badge>
                  </div>
                  <div className="space-y-2 text-sm ml-9">
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 1-2:</span>
                      <span className="font-semibold">10:00-12:00 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-warning/10">
                      <span className="text-warning font-semibold">☕ พักเบรก:</span>
                      <span className="font-semibold text-warning">12:00-12:30</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 3-4:</span>
                      <span className="font-semibold">12:30-14:30 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-warning/10">
                      <span className="text-warning font-semibold">☕ พักเบรก:</span>
                      <span className="font-semibold text-warning">14:30-15:00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 5-6:</span>
                      <span className="font-semibold">15:00-17:00 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-orange-500/10 border-t-2 border-orange-500/30 mt-2">
                      <span className="text-orange-500 font-bold">รวม:</span>
                      <span className="font-bold text-orange-500">36 รอบ × 2 เรื่อง = 72 รอบ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 30 with Special Event */}
              <div className="group hover:bg-secondary/5 p-4 rounded-xl transition-all duration-300">
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-6 w-6 text-purple-500" />
                    <h4 className="text-xl font-bold text-purple-500">30 ตุลาคม 2568</h4>
                    <Badge className="bg-purple-500/20 text-purple-500 border-purple-500">วันพฤหัสบดี</Badge>
                    <Badge className="bg-accent/20 text-accent border-accent animate-pulse">มีพิธีเปิดงาน</Badge>
                  </div>
                  <div className="space-y-2 text-sm ml-9">
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 1-2:</span>
                      <span className="font-semibold">10:00-12:00 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-warning/10">
                      <span className="text-warning font-semibold">☕ พักเบรก:</span>
                      <span className="font-semibold text-warning">12:00-12:30</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 3:</span>
                      <span className="font-semibold">12:30-13:00 (6 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 border-2 border-accent animate-pulse-slow">
                      <span className="font-bold text-accent flex items-center gap-2">🎉 พิธีเปิดงาน :</span>
                      <span className="font-bold text-accent">13:00-13:30</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 4:</span>
                      <span className="font-semibold">13:30-14:30 (6 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-warning/10">
                      <span className="text-warning font-semibold">☕ พักเบรก:</span>
                      <span className="font-semibold text-warning">14:30-15:00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 5-6:</span>
                      <span className="font-semibold">15:00-17:00 (9 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-purple-500/10 border-t-2 border-purple-500/30 mt-2">
                      <span className="text-purple-500 font-bold">รวม:</span>
                      <span className="font-bold text-purple-500">33 รอบ × 2 เรื่อง = 66 รอบ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 31 */}
              <div className="group hover:bg-accent/5 p-4 rounded-xl transition-all duration-300">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-6 w-6 text-green-500" />
                    <h4 className="text-xl font-bold text-green-500">31 ตุลาคม 2568</h4>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500">วันศุกร์</Badge>
                    <Badge className="bg-destructive/20 text-destructive border-destructive">วันสุดท้าย</Badge>
                  </div>
                  <div className="space-y-2 text-sm ml-9">
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 1-2:</span>
                      <span className="font-semibold">10:00-12:00 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-warning/10">
                      <span className="text-warning font-semibold">☕ พักเบรก:</span>
                      <span className="font-semibold text-warning">12:00-12:30</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 3-4:</span>
                      <span className="font-semibold">12:30-14:30 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-warning/10">
                      <span className="text-warning font-semibold">☕ พักเบรก:</span>
                      <span className="font-semibold text-warning">14:30-15:00</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground">รอบที่ 5-6:</span>
                      <span className="font-semibold">15:00-17:00 (12 รอบ)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-green-500/10 border-t-2 border-green-500/30 mt-2">
                      <span className="text-green-500 font-bold">รวม:</span>
                      <span className="font-bold text-green-500">36 รอบ × 2 เรื่อง = 72 รอบ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-muted to-muted/50 rounded-xl border-2 border-primary/30 text-center">
              <p className="text-sm flex items-center justify-center gap-2">
                <Clock className="inline h-4 w-4 text-primary animate-spin-slow" />
                <strong>แต่ละรอบใช้เวลา 10 นาที</strong> • กรุณามาถึงก่อนเวลา{" "}
                <strong className="text-primary">30 นาที</strong> เพื่อลงทะเบียน
              </p>
            </div>
          </Card>

          {/* Important Warnings with Strong Visual */}
          <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-destructive/10 via-destructive/5 to-background border-2 border-destructive/50 shadow-2xl shadow-destructive/20">
            <div className="absolute top-0 right-0 opacity-5">
              <AlertTriangle className="h-64 w-64 text-destructive" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-destructive mb-6 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 animate-bounce" />
                คำเตือนสำคัญ
                <AlertTriangle className="h-8 w-8 animate-bounce" style={{ animationDelay: "0.3s" }} />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { text: "ทั้ง 2 เรื่องมีความน่ากลัวสูงมาก ไม่เหมาะกับผู้มีโรคหัวใจและเด็กเล็ก", icon: Skull },
                  { text: "แต่ละเรื่องมี 36 รอบ ให้เลือกในแต่ละวัน (ยกเว้นวันที่ 30 มี 33 รอบ)", icon: Calendar },
                  { text: "เล่นเป็นทีม 5-7 คน ต่อรอบเท่านั้น (ไม่รับจองน้อยกว่า 5 คน)", icon: Users },
                  { text: "ห้ามนำโทรศัพท์เข้าไปในบ้านผีสิง (มีจุดรับฝากของด้านหน้า)", icon: AlertTriangle },
                  { text: "มาสายจะไม่คืนเงินและไม่สามารถเปลี่ยนรอบได้", icon: Clock },
                  { text: "บัตรมีผลเฉพาะวันที่เลือกไว้เท่านั้น ไม่สามารถเปลี่ยนวันได้", icon: CheckCircle },
                ].map((warning, index) => {
                  const Icon = warning.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-destructive/20 hover:border-destructive/50 transition-all duration-300"
                    >
                      <Icon className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{warning.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* How it Works with Step Design */}
          <Card className="p-8 bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-2 border-primary/30 shadow-xl">
            <h3 className="text-2xl font-spooky text-primary mb-6 flex items-center justify-center gap-3">
              <Ghost className="h-6 w-6 animate-float" />
              วิธีการจอง
              <Ghost className="h-6 w-6 animate-float" style={{ animationDelay: "0.5s" }} />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: 1, title: "เลือกเรื่อง", desc: "เลือก 1 จาก 2 เรื่อง", color: "orange" },
                { step: 2, title: "เลือกวัน", desc: "29, 30 หรือ 31 ต.ค.", color: "purple" },
                { step: 3, title: "เลือกเวลา", desc: "รอบที่ว่าง", color: "green" },
                { step: 4, title: "ชำระเงิน", desc: "80 บาท/คน", color: "blue" },
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div
                    className={`absolute inset-0 bg-${item.color}-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300`}
                  />
                  <div className="relative text-center p-6 bg-card rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-3 shadow-lg">
                      {item.step}
                    </div>
                    <p className="font-bold text-lg mb-1">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-primary text-2xl z-20">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Floating CTA Button */}
        <div className="fixed bottom-8 right-8 z-50 hidden lg:block">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-2xl shadow-orange-500/50 animate-bounce-slow"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Ghost className="h-5 w-5 mr-2" />
            เลือกเรื่องเลย!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StorySelection;
