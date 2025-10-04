import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Tag, X } from "lucide-react";

interface BookingSidebarProps {
  selectedDate: string;
  groupSize: number;
  ticketPrice: number;
  appliedPromo?: {
    code: string;
    discount: number;
  };
  onApplyPromo: (code: string) => boolean; // ✅ เปลี่ยนแล้ว
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
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      return;
    }

    // ✅ เรียกใช้ function จาก parent และรับ boolean กลับมา
    const success = onApplyPromo(code);
    
    if (success) {
      setPromoCode("");
      setShowPromoInput(false);
    }
  };

  return (
    <div className="sticky top-6">
      <div className="bg-card rounded-xl p-6 border-2 border-primary glow-orange">
        <h3 className="text-2xl font-spooky text-primary mb-6">สรุปการจอง</h3>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-muted-foreground">วันที่</div>
              <div className="font-semibold">{dateLabels[selectedDate]}</div>
              <div className="text-sm text-muted-foreground">
                18:00 - 23:00 น.
              </div>
            </div>
          </div>

          {groupSize > 0 && (
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">จำนวนคน</div>
                <div className="font-semibold">{groupSize} คน</div>
              </div>
            </div>
          )}
        </div>

        {groupSize > 0 && (
          <>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ราคาต่อคน</span>
                <span className="font-semibold">{ticketPrice} บาท</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">จำนวน</span>
                <span className="font-semibold">× {groupSize}</span>
              </div>

              <div className="flex justify-between items-center text-lg">
                <span>ยอดรวม</span>
                <span className="font-bold">
                  {subtotal.toLocaleString()} บาท
                </span>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="border-t border-border mt-4 pt-4">
              {!appliedPromo ? (
                <>
                  {!showPromoInput ? (
                    <button
                      onClick={() => setShowPromoInput(true)}
                      className="flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors w-full text-left min-h-[40px]"
                    >
                      <Tag className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">🎁 มีโค้ดส่วนลด?</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={promoCode}
                          onChange={(e) =>
                            setPromoCode(e.target.value.toUpperCase())
                          }
                          placeholder="ใส่โค้ดที่นี่"
                          className="flex-1 border-2 border-input focus:border-secondary min-h-[48px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyPromo();
                            }
                            if (e.key === "Escape") {
                              setShowPromoInput(false);
                              setPromoCode("");
                            }
                          }}
                          maxLength={20}
                        />
                        <Button
                          onClick={handleApplyPromo}
                          disabled={!promoCode.trim()}
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-purple min-h-[48px] px-6"
                        >
                          ใช้
                        </Button>
                      </div>
                      <button
                        onClick={() => {
                          setShowPromoInput(false);
                          setPromoCode("");
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-success/10 border border-success rounded-lg p-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="font-medium text-success">
                        ✓ ใช้โค้ด {appliedPromo.code}
                      </span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                      title="ลบโค้ดส่วนลด"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-success">
                    <span className="text-sm">ส่วนลด</span>
                    <span className="font-bold">
                      -{appliedPromo.discount.toLocaleString()} บาท
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">ยอดชำระทั้งหมด</span>
                <span className="text-3xl font-bold text-accent">
                  {total.toLocaleString()} <span className="text-lg">บาท</span>
                </span>
              </div>

              <Button
                onClick={onProceed}
                disabled={!canProceed}
                className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] touch-manipulation"
              >
                {!canProceed && groupSize === 0
                  ? "เลือกจำนวนคนก่อน"
                  : "ดำเนินการต่อ →"}
              </Button>
            </div>
          </>
        )}

        {groupSize === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">
              เลือกจำนวนคนเพื่อดูสรุปการจอง
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
