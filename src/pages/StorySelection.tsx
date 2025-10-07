import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpiderWeb } from "@/components/SpiderWeb";
import { AnimatedBats } from "@/components/AnimatedBats";
import { ArrowLeft, Star } from "lucide-react";
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
    description: "ในอดีต โรงภาพยนตร์แห่งนี้เคยโด่งดัง ก่อนเกิดโศกนาฏกรรมร้าย คืนหนึ่งชายปริศนาบุกเข้ามาจุดไฟเผาและยิงผู้ชมในโรงจนไม่มีใครรอด เสียงกรีดร้องและกลิ่นไหม้ยังคงหลงเหลืออยู่ เมื่อกลุ่มนักสำรวจตัดสินใจ \"เปิดรอบฉายอีกครั้ง\" เพื่อหาความจริง แต่รอบนี้...คนที่ต้องเข้าไป อาจเป็นคุณ!",
  },
  {
    id: "lesson-blood",
    title: "บทเรียนสีเลือด",
    titleEn: "The Lesson Blood",
    image: story2,
    difficulty: 3,
    scary: 5,
    description: "\"แพรวา\" นักศึกษาหญิงผู้หลงใหลการแพทย์ ถูกอาจารย์ของเธอ เลือกให้เป็นส่วนหนึ่งของบทเรียน \"การทดลองที่ไม่มีวันสำเร็จ\" คืนหนึ่งไฟในห้องแล็บดับลง เสียงกรีดร้องครั้งสุดท้ายของเธอดังก้องไม่จางหาย ตั้งแต่นั้นมา บทเรียนนั้นเหมือนถูกลืมและปิดไปอย่างลึกลับ ตอนนี้บทเรียนที่ถูกปิดตัวได้กลับมา เปิดสอนอีกครั้ง และกำลังรอนักศึกษาใหม่อย่างคุณ มาท้าทาย!",
  },
];

const StorySelection = () => {
  const navigate = useNavigate();

  const handleStorySelect = (storyId: string) => {
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
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับหน้าหลัก
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-spooky text-primary text-glow-orange mb-4">
            เลือกเรื่องที่จะเล่น
          </h1>
          <p className="text-lg text-muted-foreground">
            เลือกเรื่องที่คุณต้องการท้าทาย
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 glow-orange-hover cursor-pointer"
              onClick={() => handleStorySelect(story.id)}
            >
              {/* Image */}
              <div className="relative h-[300px] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-3xl font-spooky text-primary mb-1">
                    {story.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {story.titleEn}
                  </p>
                </div>

                {/* Ratings */}
                <div className="flex gap-6 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      ความยาก
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < story.difficulty
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      ความน่ากลัว
                    </p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < story.scary
                              ? "fill-secondary text-secondary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-6">
                  {story.description}
                </p>

                {/* Button */}
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => handleStorySelect(story.id)}
                >
                  เลือกเรื่องนี้
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="mt-12 p-6 bg-card/50 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-primary">
            ข้อมูลสำคัญ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p>• จำนวนรอบรวมทั้ง 2 เรื่อง: <span className="text-foreground font-semibold">72 รอบ</span></p>
              <p>• แยกเป็นเรื่องละ: <span className="text-foreground font-semibold">36 รอบ</span></p>
              <p>• จำนวนคนสูงสุดต่อรอบ: <span className="text-foreground font-semibold">7 คน</span></p>
            </div>
            <div>
              <p>• จำนวนรวมทั้ง 2 เรื่อง: <span className="text-foreground font-semibold">504 คน</span></p>
              <p>• แยกเป็นเรื่องละ: <span className="text-foreground font-semibold">252 คน</span></p>
              <p>• จำนวนทีมรวม: <span className="text-foreground font-semibold">72 ทีม</span></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StorySelection;
