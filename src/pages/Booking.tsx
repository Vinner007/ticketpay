import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpiderWeb } from "@/components/SpiderWeb";
import { AnimatedBats } from "@/components/AnimatedBats";
import { Calendar, Users, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get("date") || "";
  
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [groupSize, setGroupSize] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const dateLabels: Record<string, string> = {
    "2025-10-28": "28 ตุลาคม 2568 (วันอังคาร)",
    "2025-10-29": "29 ตุลาคม 2568 (วันพุธ)",
    "2025-10-30": "30 ตุลาคม 2568 (วันพฤหัสบดี)",
  };

  const calculateTotal = () => {
    return groupSize ? parseInt(groupSize) * 80 : 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !groupSize) {
      toast.error("กรุณาเลือกจำนวนคนในกลุ่ม");
      return;
    }
    if (currentStep === 2) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = () => {
    setCurrentStep(4);
    toast.success("การจองสำเร็จ! ตรวจสอบอีเมลของคุณเพื่อดูรายละเอียด");
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
              currentStep >= step
                ? "bg-primary border-primary text-primary-foreground glow-orange"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-24 h-1 mx-2 transition-all ${
                currentStep > step ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen py-20">
      <AnimatedBats />
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />

      <div className="container mx-auto px-4 max-w-4xl">
        {currentStep < 4 && (
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mb-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            กลับหน้าหลัก
          </Button>
        )}

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl mb-4 text-primary text-glow-orange">
            จองตั๋วของคุณ
          </h1>
          <p className="text-xl text-muted-foreground">
            {dateLabels[selectedDate]} | 18:00 - 23:00 น.
          </p>
        </div>

        {currentStep < 4 && <ProgressBar />}

        <Card className="p-8 bg-card border-2 border-border shadow-card">
          {/* Step 1: Group Size Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">เลือกจำนวนคนในกลุ่ม</h2>
              </div>

              <div className="space-y-4">
                <Label htmlFor="groupSize" className="text-lg">
                  จำนวนคน (5-7 คน)
                </Label>
                <Select value={groupSize} onValueChange={setGroupSize}>
                  <SelectTrigger className="w-full text-lg p-6 border-2 border-input focus:border-primary">
                    <SelectValue placeholder="เลือกจำนวนคน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 คน</SelectItem>
                    <SelectItem value="6">6 คน</SelectItem>
                    <SelectItem value="7">7 คน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {groupSize && (
                <div className="mt-8 p-6 bg-primary/10 border-2 border-primary rounded-lg">
                  <div className="flex justify-between items-center text-xl">
                    <span>ราคารวม:</span>
                    <span className="text-3xl font-bold text-accent">
                      {calculateTotal()} บาท
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    (80 บาท × {groupSize} คน)
                  </p>
                </div>
              )}

              <Button
                onClick={handleNextStep}
                className="w-full mt-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
              >
                ถัดไป
              </Button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">ข้อมูลผู้จอง</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-lg">
                    ชื่อ-นามสกุล *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="กรอกชื่อ-นามสกุล"
                    className="mt-2 p-6 text-lg border-2 border-input focus:border-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-lg">
                    อีเมล *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    className="mt-2 p-6 text-lg border-2 border-input focus:border-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-lg">
                    เบอร์โทรศัพท์ *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0XX-XXX-XXXX"
                    className="mt-2 p-6 text-lg border-2 border-input focus:border-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequests" className="text-lg">
                    ความต้องการพิเศษ (ถ้ามี)
                  </Label>
                  <Input
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder="แพ้อาหาร, วีลแชร์, ฯลฯ"
                    className="mt-2 p-6 text-lg border-2 border-input focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="w-full py-6 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">ยืนยันการจอง</h2>
              </div>

              <div className="space-y-6 bg-muted p-6 rounded-lg">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">วันที่:</span>
                  <span className="font-semibold">{dateLabels[selectedDate]}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">เวลา:</span>
                  <span className="font-semibold">18:00 - 23:00 น.</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">จำนวนคน:</span>
                  <span className="font-semibold">{groupSize} คน</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">ชื่อผู้จอง:</span>
                  <span className="font-semibold">{formData.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">อีเมล:</span>
                  <span className="font-semibold">{formData.email}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">เบอร์โทร:</span>
                  <span className="font-semibold">{formData.phone}</span>
                </div>
                {formData.specialRequests && (
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">ความต้องการพิเศษ:</span>
                    <span className="font-semibold">{formData.specialRequests}</span>
                  </div>
                )}
                <div className="flex justify-between py-4 text-2xl font-bold">
                  <span>ยอดชำระทั้งหมด:</span>
                  <span className="text-accent">{calculateTotal()} บาท</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className="w-full py-6 text-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  ย้อนกลับ
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
                >
                  ยืนยันและชำระเงิน
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="text-center space-y-6 py-12">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-24 h-24 text-success animate-bounce-slow" />
              </div>
              <h2 className="text-4xl font-bold text-success mb-4">
                การจองสำเร็จ! 🎃
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                ขอบคุณที่จองตั๋ว Halloween Night 2025
              </p>
              <div className="bg-muted p-6 rounded-lg max-w-md mx-auto">
                <p className="text-lg mb-2">
                  เราได้ส่งอีเมลยืนยันไปที่
                </p>
                <p className="font-bold text-xl text-primary">{formData.email}</p>
              </div>
              <p className="text-muted-foreground mt-6">
                กรุณาเช็คอีเมลของคุณเพื่อดูรายละเอียดการจองและ QR Code สำหรับเข้างาน
              </p>
              <Button
                onClick={() => navigate("/")}
                className="mt-8 px-12 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
              >
                กลับหน้าหลัก
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Booking;
