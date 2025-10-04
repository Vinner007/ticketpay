import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Building2 } from "lucide-react";

type PaymentMethod = "credit-card" | "promptpay" | "bank-transfer";

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  onPaymentComplete: () => void;
}

export const PaymentMethods = ({
  selectedMethod,
  onMethodChange,
  onPaymentComplete,
}: PaymentMethodsProps) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft <= 5 * 60;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  const methods = [
    {
      id: "credit-card" as PaymentMethod,
      icon: CreditCard,
      label: "บัตรเครดิต/เดบิต",
      description: "ชำระผ่านบัตรเครดิต หรือ บัตรเดบิต",
    },
    {
      id: "promptpay" as PaymentMethod,
      icon: Smartphone,
      label: "PromptPay QR Code",
      description: "สแกน QR Code เพื่อชำระเงิน",
    },
    {
      id: "bank-transfer" as PaymentMethod,
      icon: Building2,
      label: "โอนเงินผ่านธนาคาร",
      description: "โอนเงินผ่านธนาคารและแนบสลิป",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div
        className={`text-center p-4 rounded-lg border-2 ${
          isLowTime
            ? "border-destructive bg-destructive/10"
            : "border-primary bg-primary/10"
        }`}
      >
        <div
          className={`text-2xl font-bold ${
            isLowTime ? "text-destructive" : "text-primary"
          }`}
        >
          กรุณาชำระเงินภายใน: {String(minutes).padStart(2, "0")}:
          {String(seconds).padStart(2, "0")} นาที
        </div>
        {isLowTime && (
          <p className="text-sm text-destructive mt-2">⚠️ เวลาใกล้หมดแล้ว!</p>
        )}
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label className="text-lg font-semibold">เลือกวิธีการชำระเงิน</Label>
        <div className="grid grid-cols-1 gap-3">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;

            return (
              <button
                key={method.id}
                onClick={() => onMethodChange(method.id)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 glow-orange"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold">{method.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {method.description}
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-card rounded-xl p-6 border-2 border-border">
        {selectedMethod === "credit-card" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">หมายเลขบัตร</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                className="mt-2 border-2 border-input focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">วันหมดอายุ</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-2 border-2 border-input focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={3}
                  className="mt-2 border-2 border-input focus:border-primary"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="card-name">ชื่อผู้ถือบัตร</Label>
              <Input
                id="card-name"
                placeholder="SOMCHAI JAIDEE"
                className="mt-2 border-2 border-input focus:border-primary"
              />
            </div>
          </div>
        )}

        {selectedMethod === "promptpay" && (
          <div className="text-center space-y-4">
            <div className="bg-white p-6 rounded-lg inline-block">
              <div className="w-48 h-48 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">QR Code</p>
                  <p className="text-xs text-muted-foreground">
                    (Demo สำหรับทดสอบ)
                  </p>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              กรุณาสแกนและชำระภายในเวลาที่กำหนด
            </p>
            <p className="text-sm text-muted-foreground">
              💡 Demo: ระบบจะยืนยันการชำระเงินอัตโนมัติหลังกดปุ่ม
            </p>
          </div>
        )}

        {selectedMethod === "bank-transfer" && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">ธนาคาร:</span>
                  <span>ธนาคารกรุงเทพ</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">ชื่อบัญชี:</span>
                  <span>Halloween Night Co., Ltd.</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">เลขที่บัญชี:</span>
                  <span className="font-mono">123-4-56789-0</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">รหัสอ้างอิง:</span>
                  <span className="font-mono text-primary">HW{Date.now()}</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="slip-upload">แนบสลิปการโอนเงิน</Label>
              <Input
                id="slip-upload"
                type="file"
                accept="image/*"
                className="mt-2 border-2 border-input focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>ชำระเงินอย่างปลอดภัยด้วย SSL Encryption</span>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 glow-orange"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            กำลังดำเนินการ...
          </>
        ) : (
          "ยืนยันการชำระเงิน 🎃"
        )}
      </Button>
    </div>
  );
};
