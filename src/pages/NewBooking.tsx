import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SpiderWeb } from "@/components/SpiderWeb";
import { AnimatedBats } from "@/components/AnimatedBats";
import { BookingProgress } from "@/components/BookingProgress";
import { BookingSidebar } from "@/components/BookingSidebar";
import { GroupSizeSelector } from "@/components/GroupSizeSelector";
import { MemberForm } from "@/components/MemberForm";
import { PaymentMethods } from "@/components/PaymentMethods";
import { ConfirmationSuccess } from "@/components/ConfirmationSuccess";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Leader, Member, Booking } from "@/types/booking";
import { toast } from "sonner";

const TICKET_PRICE = 80;
const PAYMENT_TIME_LIMIT = 15 * 60; // 15 minutes in seconds

const PROMO_CODES = [
  {
    code: "HALLOWEEN10",
    type: "percentage" as const,
    value: 10,
    minPurchase: 0,
    maxDiscount: 100,
    description: "ลด 10%",
  },
  {
    code: "EARLYBIRD",
    type: "fixed" as const,
    value: 50,
    minPurchase: 400,
    description: "ลดทันที 50 บาท",
  },
  {
    code: "SCARY20",
    type: "percentage" as const,
    value: 20,
    minPurchase: 560,
    maxDiscount: 150,
    description: "ลด 20%",
  },
  {
    code: "TREAT15",
    type: "percentage" as const,
    value: 15,
    minPurchase: 0,
    maxDiscount: 120,
    description: "ลด 15%",
  },
  {
    code: "FIRSTTIME",
    type: "fixed" as const,
    value: 30,
    minPurchase: 0,
    description: "ลด 30 บาท",
  },
];

const dateLabels: Record<string, string> = {
  "2025-10-28": "28 ตุลาคม 2568 (วันอังคาร)",
  "2025-10-29": "29 ตุลาคม 2568 (วันพุธ)",
  "2025-10-30": "30 ตุลาคม 2568 (วันพฤหัสบดี)",
};

const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedDate = searchParams.get("date") || "2025-10-28";

  const [currentStep, setCurrentStep] = useState(1);
  const [groupSize, setGroupSize] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  }>();
  const [leader, setLeader] = useState<Leader>({
    name: "",
    email: "",
    phone: "",
    age: 0,
    lineId: "",
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [paymentMethod, setPaymentMethod] = useState
    "credit-card" | "promptpay" | "bank-transfer"
  >("promptpay");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIME_LIMIT);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    leader?: { [key: string]: string };
    members?: { [key: number]: { [key: string]: string } };
  }>({});

  // Calculate subtotal and total with memoization
  const subtotal = useMemo(() => {
    return groupSize * TICKET_PRICE;
  }, [groupSize]);

  const total = useMemo(() => {
    return subtotal - (appliedPromo?.discount || 0);
  }, [subtotal, appliedPromo]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("booking_draft");
    if (draft) {
      try {
        const data = JSON.parse(draft);
        setShowDraftBanner(true);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (currentStep > 1 && currentStep < 5) {
      const draftData = {
        selectedDate,
        currentStep,
        groupSize,
        leader,
        members,
        appliedPromo,
        paymentMethod,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("booking_draft", JSON.stringify(draftData));
    }
  }, [
    selectedDate,
    currentStep,
    groupSize,
    leader,
    members,
    appliedPromo,
    paymentMethod,
  ]);

  // Generate members array based on group size
  useEffect(() => {
    if (groupSize > 0) {
      const requiredMembers = groupSize - 1;
      const newMembers = Array.from({ length: requiredMembers }, (_, i) => ({
        id: i + 1,
        name: members[i]?.name || "",
        age: members[i]?.age || 0,
        emergencyContact: members[i]?.emergencyContact || "",
      }));
      setMembers(newMembers);
    }
  }, [groupSize]);

  // Payment timer
  useEffect(() => {
    if (currentStep === 4 && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            toast.error("หมดเวลาชำระเงิน กรุณาทำรายการใหม่");
            setTimeout(() => navigate("/"), 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep, timeRemaining, navigate]);

  // Reset timer when entering payment step
  useEffect(() => {
    if (currentStep === 4) {
      setTimeRemaining(PAYMENT_TIME_LIMIT);
    }
  }, [currentStep]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && currentStep > 1 && currentStep < 5) {
        setCurrentStep((prev) => prev - 1);
      }

      if (e.ctrlKey && e.key === "Enter" && currentStep < 4) {
        if (currentStep === 1) {
          setCurrentStep(2);
        } else if (currentStep === 2 && canProceedFromStep1) {
          handleGroupSizeNext();
        } else if (currentStep === 3 && canProceedFromStep3) {
          handleMemberFormNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRestoreDraft = useCallback(() => {
    const draft = localStorage.getItem("booking_draft");
    if (draft) {
      const data = JSON.parse(draft);
      setCurrentStep(data.currentStep);
      setGroupSize(data.groupSize);
      setLeader(data.leader);
      setMembers(data.members);
      setAppliedPromo(data.appliedPromo);
      setPaymentMethod(data.paymentMethod);
      setShowDraftBanner(false);
      toast.success("โหลดแบบร่างสำเร็จ");
    }
  }, []);

  const handleClearDraft = useCallback(() => {
    localStorage.removeItem("booking_draft");
    setShowDraftBanner(false);
    toast.success("ลบแบบร่างแล้ว");
  }, []);

  const handleDateChange = useCallback(() => {
    if (currentStep > 1) {
      setShowCancelDialog(true);
    } else {
      navigate("/");
    }
  }, [currentStep, navigate]);

  const handleConfirmCancel = useCallback(() => {
    localStorage.removeItem("booking_draft");
    navigate("/");
  }, [navigate]);

  const validatePromoCode = useCallback(
    (code: string) => {
      const promo = PROMO_CODES.find(
        (p) => p.code.toUpperCase() === code.toUpperCase()
      );

      if (!promo) {
        return { error: "❌ รหัสไม่ถูกต้อง กรุณาลองใหม่" };
      }

      if (promo.minPurchase && subtotal < promo.minPurchase) {
        return {
          error: `❌ ใช้ได้กับยอดขั้นต่ำ ${promo.minPurchase} บาท`,
        };
      }

      let discount = 0;
      if (promo.type === "percentage") {
        discount = Math.floor((subtotal * promo.value) / 100);
        if (promo.maxDiscount) {
          discount = Math.min(discount, promo.maxDiscount);
        }
      } else {
        discount = promo.value;
      }

      return { discount, code: promo.code };
    },
    [subtotal]
  );

  const handleApplyPromo = useCallback(
    (code: string) => {
      const result = validatePromoCode(code);
      if ("error" in result) {
        toast.error(result.error);
        return false;
      }

      setAppliedPromo({ code: result.code, discount: result.discount });
      toast.success(`✅ ใช้โค้ด ${result.code} สำเร็จ! ลด ${result.discount} บาท`);
      return true;
    },
    [validatePromoCode]
  );

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(undefined);
    toast.info("ลบโค้ดส่วนลดแล้ว");
  }, []);

  const validateLeader = useCallback(() => {
    const newErrors: any = {};

    if (!leader.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อ-นามสกุล";
    }

    if (!leader.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leader.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง (example@email.com)";
    }

    if (!leader.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทร";
    } else if (!/^[0-9]{10}$/.test(leader.phone.replace(/-/g, ""))) {
      newErrors.phone = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
    }

    if (!leader.age || leader.age < 5 || leader.age > 100) {
      newErrors.age = "กรุณากรอกอายุที่ถูกต้อง (5-100 ปี)";
    }

    setErrors((prev) => ({ ...prev, leader: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [leader]);

  const validateMembers = useCallback(() => {
    const memberErrors: any = {};
    let isValid = true;

    members.forEach((member, index) => {
      const errors: any = {};

      if (!member.name.trim()) {
        errors.name = "กรุณากรอกชื่อ-นามสกุล";
        isValid = false;
      }

      if (!member.age || member.age < 5 || member.age > 100) {
        errors.age = "กรุณากรอกอายุที่ถูกต้อง (5-100 ปี)";
        isValid = false;
      }

      if (Object.keys(errors).length > 0) {
        memberErrors[index] = errors;
      }
    });

    setErrors((prev) => ({ ...prev, members: memberErrors }));
    return isValid;
  }, [members]);

  const validateMemberForm = useCallback(() => {
    if (!leader.name || !leader.email || !leader.phone || !leader.age) {
      return false;
    }

    const validMembers = members.filter((m) => m.name && m.age > 0);
    return validMembers.length === members.length;
  }, [leader, members]);

  const handleGroupSizeNext = useCallback(() => {
    if (groupSize >= 5 && groupSize <= 7) {
      setCurrentStep(3);
    }
  }, [groupSize]);

  const handleMemberFormNext = useCallback(() => {
    const leaderValid = validateLeader();
    const membersValid = validateMembers();

    if (leaderValid && membersValid) {
      setCurrentStep(4);
    } else {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
    }
  }, [validateLeader, validateMembers]);

  const handlePaymentComplete = useCallback(async () => {
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newBooking: Booking = {
        bookingId: `HW${Date.now().toString().slice(-6)}`,
        confirmationCode: Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase(),
        eventDate: selectedDate,
        groupSize,
        ticketPrice: TICKET_PRICE,
        subtotal,
        promoCode: appliedPromo,
        totalPrice: total,
        leader,
        members,
        paymentMethod,
        paymentStatus: "completed",
        qrCodeData: `HW${Date.now()}`,
        bookingDate: new Date().toISOString(),
      };

      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      existingBookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(existingBookings));

      localStorage.removeItem("booking_draft");

      setBooking(newBooking);
      setCurrentStep(5);
      toast.success("🎉 จองสำเร็จ! เตรียมตัวสนุกกับงาน Halloween กันเถอะ!");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedDate,
    groupSize,
    subtotal,
    total,
    appliedPromo,
    leader,
    members,
    paymentMethod,
  ]);

  const canProceedFromStep1 = useMemo(
    () => groupSize >= 5 && groupSize <= 7,
    [groupSize]
  );
  const canProceedFromStep3 = useMemo(
    () => validateMemberForm(),
    [validateMemberForm]
  );

  return (
    <div className="relative min-h-screen py-20">
      <AnimatedBats />
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />

      <div className="container mx-auto px-4 max-w-7xl">
        {showDraftBanner && currentStep === 1 && (
          <Card className="mb-6 p-4 bg-primary/10 border-primary">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold text-primary">
                  พบแบบร่างที่บันทึกไว้
                </p>
                <p className="text-sm text-muted-foreground">
                  ต้องการกลับมาทำรายการต่อหรือไม่?
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRestoreDraft}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  โหลดแบบร่าง
                </Button>
                <Button
                  onClick={handleClearDraft}
                  size="sm"
                  variant="outline"
                >
                  เริ่มใหม่
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentStep < 5 && (
          <>
            <Button
              onClick={handleDateChange}
              variant="outline"
              className="mb-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[48px]"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              กลับหน้าหลัก
            </Button>

            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl mb-4 text-primary text-glow-orange font-spooky">
                จองตั๋วของคุณ
              </h1>
            </div>

            <BookingProgress currentStep={currentStep} />
          </>
        )}

        {currentStep === 5 && booking ? (
          <ConfirmationSuccess booking={booking} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8 bg-card border-2 border-border shadow-card">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-8 h-8 text-primary" />
                      <h2 className="text-3xl font-spooky text-primary">
                        เลือกวันที่
                      </h2>
                    </div>

                    <div className="bg-primary/10 border-2 border-primary rounded-xl p-8 text-center">
                      <div className="text-4xl md:text-6xl font-spooky text-primary mb-4">
                        {dateLabels[selectedDate]}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground mb-2">
                        <Calendar className="w-5 h-5" />
                        <span>18:00 - 23:00 น.</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground">
                        <MapPin className="w-5 h-5" />
                        <span>Haunted Arena, กรุงเทพฯ</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => navigate("/")}
                        variant="outline"
                        className="flex-1 border-2 border-secondary text-secondary hover:bg-secondary/10 min-h-[48px]"
                      >
                        เปลี่ยนวันที่
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px] text-lg"
                      >
                        ยืนยันและเลือกจำนวนคน →
                      </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                      💡 เคล็ดลับ: กด Ctrl+Enter เพื่อไปขั้นตอนถัดไป
                    </p>
                  </div>
                )}

                {currentStep === 2 && (
                  <GroupSizeSelector
                    selectedSize={groupSize}
                    onSelect={setGroupSize}
                    ticketPrice={TICKET_PRICE}
                  />
                )}

                {currentStep === 3 && (
                  <MemberForm
                    groupSize={groupSize}
                    leader={leader}
                    members={members}
                    onLeaderChange={setLeader}
                    onMembersChange={setMembers}
                    errors={errors}
                  />
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">
                        ⏰ กรุณาชำระเงินภายใน
                      </p>
                      <div
                        className={`text-3xl font-bold ${
                          timeRemaining < 300
                            ? "text-destructive animate-pulse"
                            : "text-primary"
                        }`}
                      >
                        {formatTime(timeRemaining)} นาที
                      </div>
                      {timeRemaining < 300 && (
                        <p className="text-sm text-destructive mt-1">
                          ⚠️ เหลือเวลาน้อย!
                        </p>
                      )}
                    </div>

                    <PaymentMethods
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                      onPaymentComplete={handlePaymentComplete}
                      isProcessing={isProcessing}
                    />
                  </div>
                )}

                {currentStep < 4 && currentStep > 1 && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      variant="outline"
                      className="w-full py-6 text-lg border-2 border-border min-h-[48px]"
                    >
                      ← ย้อนกลับ
                    </Button>
                    {currentStep === 2 && (
                      <Button
                        onClick={handleGroupSizeNext}
                        disabled={!canProceedFromStep1}
                        className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px]"
                      >
                        ถัดไป →
                      </Button>
                    )}
                    {currentStep === 3 && (
                      <Button
                        onClick={handleMemberFormNext}
                        disabled={!canProceedFromStep3}
                        className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px]"
                      >
                        ไปหน้าชำระเงิน →
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {currentStep < 4 && (
              <div className="lg:col-span-1">
                <BookingSidebar
                  selectedDate={selectedDate}
                  groupSize={groupSize}
                  ticketPrice={TICKET_PRICE}
                  appliedPromo={appliedPromo}
                  onApplyPromo={handleApplyPromo}
                  onRemovePromo={handleRemovePromo}
                  onProceed={() => {
                    if (currentStep === 1) setCurrentStep(2);
                    else if (currentStep === 2 && canProceedFromStep1)
                      handleGroupSizeNext();
                    else if (currentStep === 3 && canProceedFromStep3)
                      handleMemberFormNext();
                  }}
                  canProceed={
                    currentStep === 1 ||
                    (currentStep === 2 && canProceedFromStep1) ||
                    (currentStep === 3 && canProceedFromStep3)
                  }
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <Card className="p-6 bg-card border-2 border-primary glow-orange">
                    <h3 className="text-2xl font-spooky text-primary mb-6">
                      สรุปคำสั่งซื้อ
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">วันที่:</span>
                          <span className="font-semibold">
                            {dateLabels[selectedDate].split("(")[0]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            จำนวนคน:
                          </span>
                          <span className="font-semibold">{groupSize} คน</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            หัวหน้ากลุ่ม:
                          </span>
                          <span className="font-semibold">{leader.name}</span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>ยอดรวม</span>
                          <span className="font-semibold">
                            {subtotal.toLocaleString()} บาท
                          </span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-success">
                            <span>ส่วนลด ({appliedPromo.code})</span>
                            <span className="font-semibold">
                              -{appliedPromo.discount.toLocaleString()} บาท
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-2xl font-bold pt-2 border-t border-border">
                          <span>ยอดชำระทั้งหมด</span>
                          <span className="text-accent">
                            {total.toLocaleString()} บาท
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยกเลิกการจอง?</AlertDialogTitle>
            <AlertDialogDescription>
              ข้อมูลที่กรอกจะถูกบันทึกเป็นแบบร่าง คุณสามารถกลับมาทำรายการต่อได้
              หรือต้องการยกเลิกและเริ่มใหม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ทำรายการต่อ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              ยืนยันยกเลิก
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewBooking;
