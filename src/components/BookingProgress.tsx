import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "เลือกวันที่" },
  { number: 2, label: "จำนวนคน" },
  { number: 3, label: "ข้อมูลสมาชิก" },
  { number: 4, label: "ชำระเงิน" },
];

export const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-success border-success text-success-foreground"
                  : currentStep === step.number
                  ? "bg-primary border-primary text-primary-foreground glow-orange animate-pulse-glow"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-6 h-6" />
              ) : (
                <span className="text-lg font-bold">{step.number}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-1 mx-2 transition-all duration-300 ${
                currentStep > step.number ? "bg-success" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
