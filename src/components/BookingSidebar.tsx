import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Tag, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { dateLabels } from "@/config/constants";

interface BookingSidebarProps {
  selectedDate: string;
  selectedTimeSlot?: string;
  groupSize: number;
  ticketPrice: number;
  appliedPromo?: {
    code: string;
    discount: number;
  };
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onProceed: () => void;
  canProceed: boolean;
}

export const BookingSidebar = ({
  selectedDate,
  selectedTimeSlot,
  groupSize,
  ticketPrice,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onProceed,
  canProceed,
}: BookingSidebarProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);

  const subtotal = groupSize * ticketPrice;
  const discount = appliedPromo?.discount || 0;
  const total = subtotal - discount;

  const handleApplyPromo = () => {
    const code = promoCode.trim();
    if (!code) {
      toast.error("กรุณากรอกโค้ดส่วนลด");
      return;
    }

    const success = onApplyPromo(code);
    if (success) {
      setPromoCode("");
      setShowPromoInput(false);
    }
  };

  return (
    <div className="sticky top-6">
      <div className="bg-card rounded-xl p-4 sm:p-6 border-2 border-primary glow-orange">
        <h3 className="text-xl sm:text-2xl font-spooky text-primary mb-4 sm:mb-6">
          สรุปการจอง
        </h3>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm text-muted-foreground">วันที่</div>
              <div className="font-semibold text-sm sm:text-base truncate">
                {dateLabels[selectedDate]}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                10:00 - 17:00 น.
              </div>
            </div>
          </div>

          {selectedTimeSlot && (
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm text-muted-foreground">รอบเวลา</div>
                <div className="font-semibold text-sm sm:text-base truncate">
                  {selectedTimeSlot}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs sm:text-sm text-muted-foreground">จำนวนคน</div>
              <div className="font-semibold text-sm sm:text-base">
                {groupSize > 0 ? `${groupSize} คน` : "ยังไม่ได้เลือก"}
              </div>
            </div>
          </div>
        </div>

        {groupSize > 0 && (
          <>
            <div className="border-t border-border pt-3 sm:pt-4 space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">ราคาต่อคน</span>
                <span className="font-semibold">{ticketPrice} บาท</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">จำนวน</span>
                <span className="font-semibold">× {groupSize}</span>
              </div>

              <div className="flex justify-between text-base sm:text-lg">
                <span>ยอดรวม</span>
                <span className="font-bold">{subtotal.toLocaleString()} บาท</span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="border-t border-border mt-3 sm:mt-4 pt-3 sm:pt-4">
              {!appliedPromo ? (
                <>
                  {!showPromoInput ? (
                    <button
                      onClick={() => setShowPromoInput(true)}
                      className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors text-sm sm:text-base"
                    >
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">🎁 มีโค้ดส่วนลด?</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="ใส่โค้ดที่นี่"
                          className="flex-1 border-2 border-input focus:border-secondary text-sm sm:text-base"
                          onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                        />
                        <Button
                          onClick={handleApplyPromo}
                          size="sm"
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple whitespace-nowrap"
                        >
                          ใช้โค้ด
                        </Button>
                      </div>
                      <button
                        onClick={() => {
                          setShowPromoInput(false);
                          setPromoCode("");
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-success/10 border border-success rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="font-medium text-success text-sm sm:text-base truncate">
                        ✓ {appliedPromo.code}
                      </span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between mt-2 text-success text-sm sm:text-base">
                    <span>ส่วนลด</span>
                    <span className="font-bold">-{appliedPromo.discount.toLocaleString()} บาท</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border mt-3 sm:mt-4 pt-3 sm:pt-4">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <span className="text-lg sm:text-xl font-bold">ยอดชำระทั้งหมด</span>
                <span className="text-2xl sm:text-3xl font-bold text-accent">
                  {total.toLocaleString()} บาท
                </span>
              </div>

              <Button
                onClick={onProceed}
                disabled={!canProceed}
                className="w-full py-5 sm:py-6 text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ดำเนินการต่อ
              </Button>
            </div>
          </>
        )}

        {groupSize === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            กรุณาเลือกจำนวนคนก่อน
          </div>
        )}
      </div>
    </div>
  );
};
