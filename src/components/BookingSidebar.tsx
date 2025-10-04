import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Tag, X } from "lucide-react";
import { PROMO_CODES, PromoCode } from "@/types/booking";
import { toast } from "sonner";

interface BookingSidebarProps {
  selectedDate: string;
  groupSize: number;
  ticketPrice: number;
  appliedPromo?: {
    code: string;
    discount: number;
  };
  onApplyPromo: (code: string, discount: number) => void;
  onRemovePromo: () => void;
  onProceed: () => void;
  canProceed: boolean;
}

const dateLabels: Record<string, string> = {
  "2025-10-28": "28 ตุลาคม 2568",
  "2025-10-29": "29 ตุลาคม 2568",
  "2025-10-30": "30 ตุลาคม 2568",
};

export const BookingSidebar = ({
  selectedDate,
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
    const code = promoCode.toUpperCase();
    const promo = PROMO_CODES.find((p) => p.code === code && p.isActive);

    if (!promo) {
      toast.error("❌ รหัสไม่ถูกต้อง กรุณาลองใหม่");
      return;
    }

    const now = new Date();
    const validFrom = new Date(promo.validFrom);
    const validUntil = new Date(promo.validUntil);

    if (now < validFrom || now > validUntil) {
      toast.error("❌ รหัสนี้หมดอายุแล้ว");
      return;
    }

    if (promo.usedCount >= promo.usageLimit) {
      toast.error("❌ รหัสนี้ถูกใช้ครบจำนวนแล้ว");
      return;
    }

    if (subtotal < promo.minPurchase) {
      toast.error(`❌ ใช้ได้กับยอดขั้นต่ำ ${promo.minPurchase} บาท`);
      return;
    }

    let calculatedDiscount = 0;
    if (promo.type === "percentage") {
      calculatedDiscount = Math.floor((subtotal * promo.value) / 100);
      if (promo.maxDiscount) {
        calculatedDiscount = Math.min(calculatedDiscount, promo.maxDiscount);
      }
    } else {
      calculatedDiscount = promo.value;
    }

    onApplyPromo(code, calculatedDiscount);
    toast.success(`✓ ใช้โค้ด ${code} สำเร็จ!`);
    setPromoCode("");
    setShowPromoInput(false);
  };

  return (
    <div className="sticky top-6">
      <div className="bg-card rounded-xl p-6 border-2 border-primary glow-orange">
        <h3 className="text-2xl font-spooky text-primary mb-6">สรุปการจอง</h3>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1" />
            <div>
              <div className="text-sm text-muted-foreground">วันที่</div>
              <div className="font-semibold">{dateLabels[selectedDate]}</div>
              <div className="text-sm text-muted-foreground">10:00 - 17:00 น.</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary mt-1" />
            <div>
              <div className="text-sm text-muted-foreground">จำนวนคน</div>
              <div className="font-semibold">{groupSize} คน</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ราคาต่อคน</span>
            <span className="font-semibold">{ticketPrice} บาท</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">จำนวน</span>
            <span className="font-semibold">× {groupSize}</span>
          </div>

          <div className="flex justify-between text-lg">
            <span>ยอดรวม</span>
            <span className="font-bold">{subtotal} บาท</span>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="border-t border-border mt-4 pt-4">
          {!appliedPromo ? (
            <>
              {!showPromoInput ? (
                <button
                  onClick={() => setShowPromoInput(true)}
                  className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors"
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
                      className="flex-1 border-2 border-input focus:border-secondary"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                    <Button
                      onClick={handleApplyPromo}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple"
                    >
                      ใช้โค้ด
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ตัวอักษรพิมพ์เล็กหรือใหญ่ก็ได้
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-success/10 border border-success rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-success" />
                  <span className="font-medium text-success">
                    ✓ ใช้โค้ด {appliedPromo.code}
                  </span>
                </div>
                <button
                  onClick={onRemovePromo}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between mt-2 text-success">
                <span>ส่วนลด</span>
                <span className="font-bold">-{appliedPromo.discount} บาท</span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border mt-4 pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">ยอดชำระทั้งหมด</span>
            <span className="text-3xl font-bold text-accent">{total} บาท</span>
          </div>

          <Button
            onClick={onProceed}
            disabled={!canProceed}
            className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
          >
            ดำเนินการต่อ
          </Button>
        </div>
      </div>
    </div>
  );
};
