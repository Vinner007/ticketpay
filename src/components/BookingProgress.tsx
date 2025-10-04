import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "เลือกวันที่" },
  { id: 2, label: "จำนวนคน" },
  { id: 3, label: "ข้อมูลสมาชิก" },
  { id: 4, label: "ชำระเงิน" },
];

export const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <div className="relative">
        {/* Progress Line - Hidden on mobile */}
        <div className="absolute top-6 sm:top-8 left-0 right-0 h-0.5 bg-border hidden sm:block">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1"
              >
                {/* Circle */}
                <div
                  className={`
                    relative z-10 flex items-center justify-center
                    w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16
                    rounded-full border-2 sm:border-4
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-primary border-primary text-primary-foreground glow-orange scale-110"
                        : "bg-background border-border text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  ) : (
                    <span className="text-sm sm:text-base md:text-xl font-bold">
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 sm:mt-3 text-center px-1">
                  <span
                    className={`
                      text-xs sm:text-sm md:text-base font-medium
                      transition-colors duration-300
                      ${
                        isCurrent
                          ? "text-primary font-bold"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    `}
                  >
                    {/* แสดงเฉพาะบน tablet ขึ้นไป */}
                    <span className="hidden sm:inline">{step.label}</span>
                    {/* แสดงแบบย่อบนมือถือ */}
                    <span className="inline sm:hidden">
                      {step.id === 1 && "วันที่"}
                      {step.id === 2 && "จำนวน"}
                      {step.id === 3 && "ข้อมูล"}
                      {step.id === 4 && "ชำระเงิน"}
                    </span>
                  </span>
                </div>

                {/* Mobile Progress Line (between steps) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+20px)] sm:left-[calc(50%+24px)] md:left-[calc(50%+32px)] top-5 sm:top-6 md:top-8 w-[calc(100%-40px)] sm:w-[calc(100%-48px)] md:w-[calc(100%-64px)] h-0.5 sm:hidden">
                    <div className="h-full bg-border">
                      <div
                        className={`h-full bg-primary transition-all duration-500 ${
                          currentStep > step.id ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
