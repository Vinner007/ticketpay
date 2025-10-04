import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Calendar as CalendarIcon,
  Mail,
  Printer,
  Share2,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Booking } from "@/types/booking";

interface ConfirmationSuccessProps {
  booking: Booking;
}

const dateLabels: Record<string, string> = {
  "2025-10-28": "28 ตุลาคม 2568 (วันอังคาร)",
  "2025-10-29": "29 ตุลาคม 2568 (วันพุธ)",
  "2025-10-30": "30 ตุลาคม 2568 (วันพฤหัสบดี)",
  "2025-10-31": "31 ตุลาคม 2568 (วันศุกร์)",
};

export const ConfirmationSuccess = ({ booking }: ConfirmationSuccessProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ["#FF6B1A", "#8B00FF", "#FFB800"];

    const frame = () => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return;

      const particleCount = 3;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.style.position = "fixed";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.top = "-10px";
        particle.style.width = "10px";
        particle.style.height = "10px";
        particle.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = "50%";
        particle.style.pointerEvents = "none";
        particle.style.zIndex = "9999";
        particle.style.animation = `fall ${2 + Math.random() * 2}s linear`;

        document.body.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 4000);
      }

      requestAnimationFrame(frame);
    };

    // Add keyframe animation
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    frame();

    return () => {
      style.remove();
    };
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Success Animation */}
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle className="w-32 h-32 text-success animate-bounce-slow" />
            <div className="absolute inset-0 animate-ping opacity-20">
              <CheckCircle className="w-32 h-32 text-success" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-spooky text-success">
          🎉 จองสำเร็จแล้ว!
        </h1>
        <p className="text-2xl text-muted-foreground">
          เตรียมตัวสนุกกับงาน Halloween กันเถอะ!
        </p>
      </div>

      {/* Confirmation Card */}
      <div className="bg-card rounded-xl p-8 border-2 border-success glow-gold max-w-2xl mx-auto">
        {/* QR Code */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-6 rounded-lg">
            <div className="w-48 h-48 bg-muted flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🎃</div>
                <p className="text-sm text-muted-foreground">QR Code</p>
                <p className="text-xs font-mono">{booking.qrCodeData}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            สแกน QR Code นี้เพื่อเข้างาน
          </p>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-2">
              หมายเลขการจอง
            </div>
            <div className="text-3xl font-bold text-primary font-mono">
              {booking.bookingId}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted p-6 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground mb-1">วันที่งาน</div>
              <div className="font-semibold">{dateLabels[booking.eventDate]}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">เวลา</div>
              <div className="font-semibold">10:00 - 17:00 น.</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">สถานที่</div>
              <div className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                ตึก 4 ชั้น 1 และ 2 มหาวิทยาลัยศรีปทุม
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                ชื่อหัวหน้ากลุ่ม
              </div>
              <div className="font-semibold">
                {booking.leader.firstName} {booking.leader.lastName}
                {booking.leader.nickname && ` (${booking.leader.nickname})`}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">จำนวนคน</div>
              <div className="font-semibold">{booking.groupSize} คน</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                ยอดชำระทั้งหมด
              </div>
              <div className="font-semibold text-accent text-xl">
                {booking.totalPrice.toLocaleString()} บาท
              </div>
            </div>
          </div>
        </div>

        {/* Member List */}
        <details className="mt-6">
          <summary className="cursor-pointer font-semibold text-lg mb-4 hover:text-primary transition-colors">
            รายชื่อสมาชิกทั้งหมด ({booking.groupSize} คน)
          </summary>
          <div className="space-y-2 ml-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="w-4 h-4" />
              <span>
                {booking.leader.firstName} {booking.leader.lastName}
                {booking.leader.nickname && ` (${booking.leader.nickname})`} - หัวหน้ากลุ่ม
              </span>
            </div>
            {booking.members.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span>
                  {member.firstName} {member.lastName}
                  {member.nickname && ` (${member.nickname})`}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Important Reminders */}
      <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-primary mb-4">
          📌 สิ่งสำคัญที่ต้องจำ
        </h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="text-primary">📱</span>
            <span>นำ QR Code มาในวันงาน (หน้าจอหรือพิมพ์มา)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">⏰</span>
            <span>กรุณามาก่อนเวลา 30 นาที เพื่อลงทะเบียน</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">🎭</span>
            <span>แต่งชุดธีม Halloween มาด้วย (ถ้าต้องการลุ้นรางวัล)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary">❌</span>
            <span className="text-destructive font-semibold">
              มาสายไม่คืนเงิน • ยกเลิกไม่ได้
            </span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        <Button
          variant="outline"
          className="border-2 border-secondary text-secondary hover:bg-secondary/10"
        >
          <Download className="w-4 h-4 mr-2" />
          ดาวน์โหลดตั๋ว
        </Button>
        <Button
          variant="outline"
          className="border-2 border-secondary text-secondary hover:bg-secondary/10"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          เพิ่มในปฏิทิน
        </Button>
        <Button
          variant="outline"
          className="border-2 border-border hover:bg-muted"
        >
          <Mail className="w-4 h-4 mr-2" />
          ส่งอีเมลอีกครั้ง
        </Button>
        <Button
          variant="outline"
          className="border-2 border-border hover:bg-muted"
        >
          <Printer className="w-4 h-4 mr-2" />
          พิมพ์ตั๋ว
        </Button>
        <Button className="md:col-span-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange">
          <Share2 className="w-4 h-4 mr-2" />
          แชร์ให้เพื่อน
        </Button>
      </div>

      {/* Email Notice */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-muted p-6 rounded-lg">
          <p className="text-lg mb-2">
            ✉️ เราได้ส่งอีเมลยืนยันไปที่{" "}
            <span className="font-bold text-primary">{booking.leader.email}</span>{" "}
            แล้ว
          </p>
          <p className="text-sm text-muted-foreground">
            ตรวจสอบทั้ง Inbox และ Spam folder
          </p>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Button
          onClick={() => navigate("/")}
          size="lg"
          className="px-12 py-6 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple"
        >
          กลับหน้าหลัก
        </Button>
      </div>
    </div>
  );
};
