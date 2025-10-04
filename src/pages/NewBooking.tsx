import { useState } from "react";
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
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Leader, Member, Booking } from "@/types/booking";

const TICKET_PRICE = 80;

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
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "", age: 0, emergencyContact: "" },
    { id: 2, name: "", age: 0, emergencyContact: "" },
    { id: 3, name: "", age: 0, emergencyContact: "" },
    { id: 4, name: "", age: 0, emergencyContact: "" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<
    "credit-card" | "promptpay" | "bank-transfer"
  >("promptpay");
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleDateChange = () => {
    navigate("/");
  };

  const handleGroupSizeNext = () => {
    if (groupSize >= 5 && groupSize <= 7) {
      // Adjust members array to match group size
      const requiredMembers = groupSize - 1; // -1 for leader
      if (members.length < requiredMembers) {
        const newMembers = [...members];
        for (let i = members.length; i < requiredMembers; i++) {
          newMembers.push({
            id: Date.now() + i,
            name: "",
            age: 0,
            emergencyContact: "",
          });
        }
        setMembers(newMembers);
      } else if (members.length > requiredMembers) {
        setMembers(members.slice(0, requiredMembers));
      }
      setCurrentStep(3);
    }
  };

  const validateMemberForm = () => {
    if (!leader.name || !leader.email || !leader.phone || !leader.age) {
      return false;
    }

    const requiredMembers = groupSize - 1;
    const validMembers = members
      .slice(0, requiredMembers)
      .filter((m) => m.name && m.age > 0);

    return validMembers.length === requiredMembers;
  };

  const handleMemberFormNext = () => {
    if (validateMemberForm()) {
      setCurrentStep(4);
    }
  };

  const handlePaymentComplete = () => {
    // Create booking object
    const subtotal = groupSize * TICKET_PRICE;
    const discount = appliedPromo?.discount || 0;
    const total = subtotal - discount;

    const newBooking: Booking = {
      bookingId: `HW${Date.now().toString().slice(-6)}`,
      confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      eventDate: selectedDate,
      groupSize,
      ticketPrice: TICKET_PRICE,
      subtotal,
      promoCode: appliedPromo,
      totalPrice: total,
      leader,
      members: members.slice(0, groupSize - 1),
      paymentMethod,
      paymentStatus: "completed",
      qrCodeData: `HW${Date.now()}`,
    };

    setBooking(newBooking);
    setCurrentStep(5);
  };

  const canProceedFromStep1 = groupSize >= 5 && groupSize <= 7;
  const canProceedFromStep3 = validateMemberForm();

  return (
    <div className="relative min-h-screen py-20">
      <AnimatedBats />
      <SpiderWeb position="top-left" />
      <SpiderWeb position="top-right" />

      <div className="container mx-auto px-4 max-w-7xl">
        {currentStep < 5 && (
          <>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="mb-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-8 bg-card border-2 border-border shadow-card">
                {/* Step 1: Date Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="w-8 h-8 text-primary" />
                      <h2 className="text-3xl font-spooky text-primary">
                        เลือกวันที่
                      </h2>
                    </div>

                    <div className="bg-primary/10 border-2 border-primary rounded-xl p-8 text-center">
                      <div className="text-6xl font-spooky text-primary mb-4">
                        {dateLabels[selectedDate]}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground mb-2">
                        <Calendar className="w-5 h-5" />
                        <span>18:00 - 23:00 น.</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xl text-muted-foreground">
                        <MapPin className="w-5 h-5" />
                        <span>Haunted Arena, กรุงเทพฯ</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleDateChange}
                      variant="outline"
                      className="w-full border-2 border-secondary text-secondary hover:bg-secondary/10"
                    >
                      เปลี่ยนวันที่
                    </Button>
                  </div>
                )}

                {/* Step 2: Group Size */}
                {currentStep === 2 && (
                  <GroupSizeSelector
                    selectedSize={groupSize}
                    onSelect={setGroupSize}
                    ticketPrice={TICKET_PRICE}
                  />
                )}

                {/* Step 3: Member Information */}
                {currentStep === 3 && (
                  <MemberForm
                    groupSize={groupSize}
                    leader={leader}
                    members={members}
                    onLeaderChange={setLeader}
                    onMembersChange={setMembers}
                  />
                )}

                {/* Step 4: Payment */}
                {currentStep === 4 && (
                  <PaymentMethods
                    selectedMethod={paymentMethod}
                    onMethodChange={setPaymentMethod}
                    onPaymentComplete={handlePaymentComplete}
                  />
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && currentStep > 1 && (
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      variant="outline"
                      className="w-full py-6 text-lg border-2 border-border"
                    >
                      ย้อนกลับ
                    </Button>
                    {currentStep === 2 && (
                      <Button
                        onClick={handleGroupSizeNext}
                        disabled={!canProceedFromStep1}
                        className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
                      >
                        ถัดไป
                      </Button>
                    )}
                    {currentStep === 3 && (
                      <Button
                        onClick={handleMemberFormNext}
                        disabled={!canProceedFromStep3}
                        className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
                      >
                        ไปหน้าชำระเงิน
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            {currentStep < 4 && (
              <div className="lg:col-span-1">
                <BookingSidebar
                  selectedDate={selectedDate}
                  groupSize={groupSize}
                  ticketPrice={TICKET_PRICE}
                  appliedPromo={appliedPromo}
                  onApplyPromo={(code, discount) =>
                    setAppliedPromo({ code, discount })
                  }
                  onRemovePromo={() => setAppliedPromo(undefined)}
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

            {/* Payment Summary for Step 4 */}
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
                          <span className="text-muted-foreground">จำนวนคน:</span>
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
                            {groupSize * TICKET_PRICE} บาท
                          </span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-success">
                            <span>ส่วนลด ({appliedPromo.code})</span>
                            <span className="font-semibold">
                              -{appliedPromo.discount} บาท
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-2xl font-bold pt-2 border-t border-border">
                          <span>ยอดชำระทั้งหมด</span>
                          <span className="text-accent">
                            {groupSize * TICKET_PRICE -
                              (appliedPromo?.discount || 0)}{" "}
                            บาท
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
    </div>
  );
};

export default NewBooking;
