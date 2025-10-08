import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Calendar, MapPin, Clock, Info, X } from "lucide-react";
import { Leader, Member, Booking } from "@/types/booking";
import { toast } from "sonner";
import {
  validatePromoCode,
  incrementPromoUsage,
  createBooking,
  generateBookingId,
  generateConfirmationCode,
  generateQRCodeData,
} from "@/lib/supabaseHelpers";

const TICKET_PRICE = 80;
const PAYMENT_TIME_LIMIT = 15 * 60;

const dateLabels: Record<string, string> = {
  "2025-10-29": "29 ตุลาคม 2568 (วันพุธ)",
  "2025-10-30": "30 ตุลาคม 2568 (วันพฤหัสบดี)",
  "2025-10-31": "31 ตุลาคม 2568 (วันศุกร์)",
};

const timeSlots = [
  {
    id: "morning",
    label: "รอบเช้า",
    time: "10:00 - 12:00 น.",
    rounds: "รอบที่ 1-2",
    description: "เริ่มลงทะเบียน 09:30 น.",
  },
  {
    id: "afternoon",
    label: "รอบเที่ยง",
    time: "12:30 - 14:30 น.",
    rounds: "รอบที่ 3-4",
    description: "หลังพักเบรก 30 นาที",
  },
  {
    id: "evening",
    label: "รอบเย็น",
    time: "15:00 - 17:00 น.",
    rounds: "รอบที่ 5-6",
    description: "รอบสุดท้ายของวัน",
  },
];

const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedStory = searchParams.get("story") as "cursed-cinema" | "lesson-blood" || "cursed-cinema";
  const selectedDate = searchParams.get("date") || "2025-10-29";

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [groupSize, setGroupSize] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  }>();
  const [leader, setLeader] = useState<Leader>({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    phone: "",
    age: 0,
    lineId: "",
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "promptpay" | "bank-transfer">("promptpay");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(PAYMENT_TIME_LIMIT);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [promoInput, setPromoInput] = useState("");

  const [errors, setErrors] = useState<{
    leader?: { [key: string]: string };
    members?: { [key: number]: { [key: string]: string } };
  }>({});

  const subtotal = useMemo(() => {
    return groupSize * TICKET_PRICE;
  }, [groupSize]);

  const total = useMemo(() => {
    return subtotal - (appliedPromo?.discount || 0);
  }, [subtotal, appliedPromo]);

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

  useEffect(() => {
    if (currentStep > 1 && currentStep < 6) {
      const draftData = {
        selectedDate,
        selectedTimeSlot,
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
    selectedTimeSlot,
    currentStep,
    groupSize,
    leader,
    members,
    appliedPromo,
    paymentMethod,
  ]);

  useEffect(() => {
    if (groupSize > 0) {
      const requiredMembers = groupSize - 1;
      const newMembers = Array.from({ length: requiredMembers }, (_, i) => ({
        id: i + 1,
        firstName: members[i]?.firstName || "",
        lastName: members[i]?.lastName || "",
        nickname: members[i]?.nickname || "",
        age: members[i]?.age || 0,
      }));
      setMembers(newMembers);
    }
  }, [groupSize]);

  useEffect(() => {
    if (currentStep === 5 && timeRemaining > 0) {
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

  useEffect(() => {
    if (currentStep === 5) {
      setTimeRemaining(PAYMENT_TIME_LIMIT);
    }
  }, [currentStep]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && currentStep > 1 && currentStep < 6) {
        setCurrentStep((prev) => prev - 1);
      }

      if (e.ctrlKey && e.key === "Enter" && currentStep < 5) {
        if (currentStep === 1) {
          setCurrentStep(2);
        } else if (currentStep === 2 && selectedTimeSlot) {
          setCurrentStep(3);
        } else if (currentStep === 3 && canProceedFromStep3) {
          handleGroupSizeNext();
        } else if (currentStep === 4 && canProceedFromStep4) {
          handleMemberFormNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentStep, selectedTimeSlot]);

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
      setSelectedTimeSlot(data.selectedTimeSlot);
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

  const handleApplyPromo = useCallback(
    async (code: string) => {
      try {
        const result = await validatePromoCode(code, subtotal);
        if ("error" in result) {
          toast.error(result.error);
          return false;
        }

        setAppliedPromo({ code: result.code, discount: result.discount });
        setPromoInput("");
        toast.success(`✅ ใช้โค้ด ${result.code} สำเร็จ! ลด ${result.discount} บาท`);
        return true;
      } catch (error) {
        console.error("Error applying promo code:", error);
        toast.error("เกิดข้อผิดพลาดในการใช้โค้ด");
        return false;
      }
    },
    [subtotal]
  );

  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(undefined);
    toast.info("ลบโค้ดส่วนลดแล้ว");
  }, []);

  const validateLeader = useCallback(() => {
    const newErrors: any = {};

    if (!leader.firstName?.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อ";
    }

    if (!leader.lastName?.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
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

      if (!member.firstName?.trim()) {
        errors.firstName = "กรุณากรอกชื่อ";
        isValid = false;
      }

      if (!member.lastName?.trim()) {
        errors.lastName = "กรุณากรอกนามสกุล";
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
    if (!leader.firstName || !leader.lastName || !leader.email || !leader.phone || !leader.age) {
      return false;
    }

    const validMembers = members.filter((m) => m.firstName && m.lastName && m.age > 0);
    return validMembers.length === members.length;
  }, [leader, members]);

  const handleGroupSizeNext = useCallback(() => {
    if (groupSize >= 5 && groupSize <= 7) {
      setCurrentStep(4);
    }
  }, [groupSize]);

  const handleMemberFormNext = useCallback(() => {
    const leaderValid = validateLeader();
    const membersValid = validateMembers();

    if (leaderValid && membersValid) {
      setCurrentStep(5);
    } else {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
    }
  }, [validateLeader, validateMembers]);

  const handlePaymentComplete = useCallback(async () => {
    setIsProcessing(true);

    try {
      const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
      const bookingId = generateBookingId();
      const confirmationCode = generateConfirmationCode();
      const qrCodeData = generateQRCodeData(bookingId);

      // Create booking in Supabase
      const bookingData = {
        booking_id: bookingId,
        confirmation_code: confirmationCode,
        story_theme: selectedStory as "cursed-cinema" | "lesson-blood",
        event_date: selectedDate,
        time_slot: selectedSlot?.label || "",
        time_slot_time: selectedSlot?.time || "",
        group_size: groupSize,
        ticket_price: TICKET_PRICE,
        subtotal,
        promo_code: appliedPromo?.code || null,
        promo_discount: appliedPromo?.discount || 0,
        total_price: total,
        leader_first_name: leader.firstName,
        leader_last_name: leader.lastName,
        leader_nickname: leader.nickname || null,
        leader_email: leader.email,
        leader_phone: leader.phone,
        leader_age: leader.age,
        leader_line_id: leader.lineId || null,
        members: members as any,
        payment_method: paymentMethod,
        payment_status: "completed" as const,
        qr_code_data: qrCodeData,
        check_in_status: "not-checked-in" as const,
        source: "website" as const,
      };

      const createdBooking = await createBooking(bookingData);

      // Increment promo code usage if promo was applied
      if (appliedPromo?.code) {
        await incrementPromoUsage(appliedPromo.code);
      }

      // Clear draft
      localStorage.removeItem("booking_draft");

      // Convert to display format
      const newBooking: Booking = {
        bookingId: createdBooking.booking_id,
        confirmationCode: createdBooking.confirmation_code,
        storyTheme: createdBooking.story_theme,
        eventDate: createdBooking.event_date,
        timeSlot: createdBooking.time_slot,
        timeSlotTime: createdBooking.time_slot_time,
        groupSize: createdBooking.group_size,
        ticketPrice: createdBooking.ticket_price,
        subtotal: createdBooking.subtotal,
        promoCode: appliedPromo,
        totalPrice: createdBooking.total_price,
        leader,
        members,
        paymentMethod: createdBooking.payment_method,
        paymentStatus: createdBooking.payment_status,
        qrCodeData: createdBooking.qr_code_data || undefined,
        bookingDate: createdBooking.booking_date || createdBooking.created_at || new Date().toISOString(),
        checkInStatus: createdBooking.check_in_status || undefined,
        checkInTime: createdBooking.check_in_time || undefined,
        checkInBy: createdBooking.check_in_by || undefined,
        source: createdBooking.source || "website",
        createdAt: createdBooking.created_at || new Date().toISOString(),
      };

      setBooking(newBooking);
      setCurrentStep(6);
      toast.success("🎉 จองสำเร็จ! เตรียมตัวสนุกกับงาน Halloween กันเถอะ!");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedStory,
    selectedDate,
    selectedTimeSlot,
    groupSize,
    subtotal,
    total,
    appliedPromo,
    leader,
    members,
    paymentMethod,
  ]);

  const canProceedFromStep3 = useMemo(
    () => groupSize >= 5 && groupSize <= 7,
    [groupSize]
  );
  const canProceedFromStep4 = useMemo(
    () => validateMemberForm(),
    [validateMemberForm]
  );

  return (
    <div className="relative min-h-screen py-12 sm:py-16 md:py-20">
      <AnimatedBats />
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
        {showDraftBanner && currentStep === 1 && (
          <Card className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/10 border-primary">
            <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
              <div>
                <p className="font-semibold text-primary text-sm sm:text-base">
                  พบแบบร่างที่บันทึกไว้
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  ต้องการกลับมาทำรายการต่อหรือไม่?
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleRestoreDraft}
                  size="sm"
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                >
                  โหลดแบบร่าง
                </Button>
                <Button
                  onClick={handleClearDraft}
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  เริ่มใหม่
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentStep < 6 && (
          <>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <Button
                onClick={handleDateChange}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px] sm:min-h-[48px]"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                กลับหน้าหลัก
              </Button>
              
              <Button
                onClick={() => setShowRulesDialog(true)}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10 min-h-[44px] sm:min-h-[48px]"
              >
                <Info className="mr-2 w-4 h-4" />
                กติกา
              </Button>
            </div>

            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-primary text-glow-orange font-spooky leading-tight px-2">
                จองตั๋วของคุณ
              </h1>
            </div>

            <BookingProgress currentStep={currentStep} totalSteps={5} />
          </>
        )}

        {currentStep === 6 && booking ? (
          <ConfirmationSuccess booking={booking} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-6 md:p-8 bg-card border-2 border-border shadow-card">
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-spooky text-primary">
                        เลือกวันที่
                      </h2>
                    </div>

                    <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 sm:p-6 md:p-8 text-center">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-spooky text-primary mb-3 sm:mb-4 leading-tight px-2">
                        {dateLabels[selectedDate]}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-muted-foreground mb-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>10:00 - 17:00 น.</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-muted-foreground">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>ตึก 4 ชั้น 1 และ 2 มหาวิทยาลัยศรีปทุม</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        onClick={() => navigate("/")}
                        variant="outline"
                        className="flex-1 border-2 border-secondary text-secondary hover:bg-secondary/10 min-h-[48px] text-base"
                      >
                        เปลี่ยนวันที่
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px] text-base sm:text-lg"
                      >
                        ยืนยันและเลือกรอบเวลา →
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Time Slot Selection */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" />
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-spooky text-primary">
                        เลือกรอบเวลา
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedTimeSlot(slot.id)}
                          className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all text-left ${
                            selectedTimeSlot === slot.id
                              ? "border-primary bg-primary/10 glow-orange"
                              : "border-border hover:border-primary/50 bg-card"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl font-bold text-primary mb-1">
                                {slot.label}
                              </h3>
                              <p className="text-sm sm:text-base text-foreground font-semibold mb-1">
                                {slot.time}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {slot.rounds} • {slot.description}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedTimeSlot === slot.id
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {selectedTimeSlot === slot.id && (
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="bg-secondary/10 border border-secondary rounded-lg p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        ⚠️ <strong>สำคัญ:</strong> กรุณามาก่อนเวลา 30 นาที เพื่อลงทะเบียนและเข้าคิว • มาสายไม่คืนเงินและไม่สามารถเปลี่ยนรอบได้
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Group Size */}
                {currentStep === 3 && (
                  <GroupSizeSelector
                    selectedSize={groupSize}
                    onSelect={setGroupSize}
                    ticketPrice={TICKET_PRICE}
                  />
                )}

                {/* Step 4: Member Information */}
                {currentStep === 4 && (
                  <>
                    <MemberForm
                      groupSize={groupSize}
                      leader={leader}
                      members={members}
                      onLeaderChange={setLeader}
                      onMembersChange={setMembers}
                      errors={errors}
                    />

                    {/* Promo Code Section for Mobile */}
                    <div className="mt-6 sm:mt-8 lg:hidden border-t border-border pt-6 sm:pt-8">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                        <span>💰</span> สรุปยอดรวม
                      </h3>
                      
                      <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-4">
                        <div className="flex justify-between text-sm sm:text-base mb-2">
                          <span className="text-muted-foreground">ยอดรวม</span>
                          <span className="font-semibold">{subtotal.toLocaleString()} บาท</span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-success text-sm sm:text-base">
                            <span>ส่วนลด ({appliedPromo.code})</span>
                            <span className="font-semibold">-{appliedPromo.discount.toLocaleString()} บาท</span>
                          </div>
                        )}
                      </div>

                      {appliedPromo ? (
                        <div className="flex items-center justify-between bg-success/10 border border-success rounded-lg p-3 sm:p-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm">✓</span>
                            </div>
                            <div>
                              <p className="font-semibold text-success text-sm sm:text-base">{appliedPromo.code}</p>
                              <p className="text-xs sm:text-sm text-muted-foreground">ลด {appliedPromo.discount} บาท</p>
                            </div>
                          </div>
                          <Button
                            onClick={handleRemovePromo}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[40px]"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor="mobile-promo" className="text-sm sm:text-base">
                            รหัสส่วนลด (ถ้ามี)
                          </Label>
                          <div className="flex gap-2 mt-2">
                            <Input
                              id="mobile-promo"
                              value={promoInput}
                              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                              placeholder="กรอกโค้ดส่วนลด"
                              className="flex-1 border-2 border-input focus:border-primary min-h-[44px] sm:min-h-[48px] text-sm sm:text-base"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && promoInput.trim()) {
                                  handleApplyPromo(promoInput.trim());
                                }
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (promoInput.trim()) {
                                  handleApplyPromo(promoInput.trim());
                                }
                              }}
                              disabled={!promoInput.trim()}
                              variant="outline"
                              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px] sm:min-h-[48px] px-4 sm:px-6"
                            >
                              ใช้โค้ด
                            </Button>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                            💡 ลองโค้ด: HALLOWEEN10, EARLYBIRD, SCARY20
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Step 5: Payment */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                        ⏰ กรุณาชำระเงินภายใน
                      </p>
                      <div
                        className={`text-2xl sm:text-3xl font-bold ${
                          timeRemaining < 300
                            ? "text-destructive animate-pulse"
                            : "text-primary"
                        }`}
                      >
                        {formatTime(timeRemaining)} นาที
                      </div>
                      {timeRemaining < 300 && (
                        <p className="text-xs sm:text-sm text-destructive mt-1">
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

                {/* Navigation Buttons */}
                {currentStep < 5 && currentStep > 1 && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <Button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      variant="outline"
                      className="w-full py-5 sm:py-6 text-base sm:text-lg border-2 border-border min-h-[48px]"
                    >
                      ← ย้อนกลับ
                    </Button>
                    {currentStep === 2 && (
                      <Button
                        onClick={() => setCurrentStep(3)}
                        disabled={!selectedTimeSlot}
                        className="w-full py-5 sm:py-6 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px]"
                      >
                        ถัดไป →
                      </Button>
                    )}
                    {currentStep === 3 && (
                      <Button
                        onClick={handleGroupSizeNext}
                        disabled={!canProceedFromStep3}
                        className="w-full py-5 sm:py-6 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px]"
                      >
                        ถัดไป →
                      </Button>
                    )}
                    {currentStep === 4 && (
                      <Button
                        onClick={handleMemberFormNext}
                        disabled={!canProceedFromStep4}
                        className="w-full py-5 sm:py-6 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange min-h-[48px]"
                      >
                        ไปหน้าชำระเงิน →
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            {currentStep < 5 && (
              <div className="lg:col-span-1 hidden lg:block">
                <BookingSidebar
                  selectedDate={selectedDate}
                  selectedTimeSlot={timeSlots.find(s => s.id === selectedTimeSlot)?.label}
                  groupSize={groupSize}
                  ticketPrice={TICKET_PRICE}
                  appliedPromo={appliedPromo}
                  onApplyPromo={handleApplyPromo}
                  onRemovePromo={handleRemovePromo}
                  onProceed={() => {
                    if (currentStep === 1) setCurrentStep(2);
                    else if (currentStep === 2 && selectedTimeSlot) setCurrentStep(3);
                    else if (currentStep === 3 && canProceedFromStep3) handleGroupSizeNext();
                    else if (currentStep === 4 && canProceedFromStep4) handleMemberFormNext();
                  }}
                  canProceed={
                    currentStep === 1 ||
                    (currentStep === 2 && !!selectedTimeSlot) ||
                    (currentStep === 3 && canProceedFromStep3) ||
                    (currentStep === 4 && canProceedFromStep4)
                  }
                />
              </div>
            )}

            {/* Payment Summary for Step 5 */}
            {currentStep === 5 && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <Card className="p-4 sm:p-6 bg-card border-2 border-primary glow-orange">
                    <h3 className="text-xl sm:text-2xl font-spooky text-primary mb-4 sm:mb-6">
                      สรุปคำสั่งซื้อ
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-muted p-3 sm:p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-muted-foreground">วันที่:</span>
                          <span className="font-semibold text-right">
                            {dateLabels[selectedDate].split("(")[0]}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-muted-foreground">รอบเวลา:</span>
                          <span className="font-semibold text-right">
                            {timeSlots.find(s => s.id === selectedTimeSlot)?.label}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-muted-foreground">จำนวนคน:</span>
                          <span className="font-semibold">{groupSize} คน</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                          <span className="text-muted-foreground">หัวหน้ากลุ่ม:</span>
                          <span className="font-semibold text-right">
                            {leader.firstName} {leader.lastName}
                            {leader.nickname && ` (${leader.nickname})`}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-sm sm:text-base">
                          <span>ยอดรวม</span>
                          <span className="font-semibold">
                            {subtotal.toLocaleString()} บาท
                          </span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-success text-sm sm:text-base">
                            <span>ส่วนลด ({appliedPromo.code})</span>
                            <span className="font-semibold">
                              -{appliedPromo.discount.toLocaleString()} บาท
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl sm:text-2xl font-bold pt-2 border-t border-border">
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

      {/* Rules Dialog */}
      <AlertDialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl sm:text-2xl text-primary">
              📌 กติกาสำคัญ
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4 text-sm sm:text-base">
            <div className="space-y-2">
              <p className="font-semibold">วันจัดงาน:</p>
              <p>29 – 31 ตุลาคม 2568</p>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold">สถานที่:</p>
              <p>ตึก 4 ชั้น 1 และ 2 มหาวิทยาลัยศรีปทุม</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-destructive">กติกาสำคัญ:</p>
              <ul className="list-decimal list-inside space-y-2 pl-2">
                <li>กรุณามาถึงก่อนเวลา 30 นาที เพื่อลงทะเบียนและเลือกรอบในการเล่น</li>
                <li>แสดง QR code/บัตร ที่จุดลงทะเบียน</li>
                <li>บัตรที่ซื้อมีผลเฉพาะวันที่เลือกไว้เท่านั้น</li>
                <li className="text-destructive font-semibold">หากไม่มาตามวันที่เลือก ทางทีมงานจะถือว่าสละสิทธิ์และไม่มีการคืนเงิน</li>
                <li>ผู้เข้าร่วมทุกท่านที่ <strong>แต่งหน้าแต่งกายธีมผี/แฟนซีฮาโลวีน</strong> สามารถเข้าร่วมรับรางวัลได้</li>
              </ul>
            </div>

            <div className="space-y-2 bg-primary/10 p-3 rounded-lg">
              <p className="font-semibold text-primary">🎉 โปรโมชั่นพิเศษ:</p>
              <p><strong>20 ทีม มา 7 จ่าย 6</strong> (ฟรี 1 คน)</p>
              <p className="text-sm">ใช้โค้ด: <code className="bg-background px-2 py-1 rounded">GROUP7FOR6</code></p>
            </div>

            <div className="space-y-2 bg-secondary/10 p-3 rounded-lg">
              <p className="font-semibold">🎭 พิเศษ!</p>
              <p>แต่งตัว + แต่งหน้า Theme ฮาโลวีน = รับ Gift Voucher</p>
            </div>

            <div className="space-y-2">
              <p className="font-semibold">เวลาดำเนินงาน:</p>
              <p>• เริ่มลงทะเบียน 09:30 น.</p>
              <p>• เริ่มเล่น 10:00 - 17:00 น.</p>
              <p>• รอบละ 10 นาที</p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowRulesDialog(false)}>
              เข้าใจแล้ว
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">ยกเลิกการจอง?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              ข้อมูลที่กรอกจะถูกบันทึกเป็นแบบร่าง คุณสามารถกลับมาทำรายการต่อได้
              หรือต้องการยกเลิกและเริ่มใหม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">ทำรายการต่อ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="w-full sm:w-auto">
              ยืนยันยกเลิก
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NewBooking;
