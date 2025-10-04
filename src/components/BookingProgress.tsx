import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { id: 1, label: "วันที่" },
  { id: 2, label: "รอบเวลา" },
  { id: 3, label: "จำนวนคน" },
  { id: 4, label: "ข้อมูลสมาชิก" },
  { id: 5, label: "ชำระเงิน" },
];

export const BookingProgress = ({ currentStep, totalSteps = 5 }: BookingProgressProps) => {
  // ใช้ steps ตามจำนวนที่กำหนด
  const displaySteps = steps.slice(0, totalSteps);

  return (
    <div className="mb-8 sm:mb-10 md:mb-12 w-full">
      <div className="flex items-center justify-center w-full px-2 sm:px-4">
        <div className="flex items-center justify-between w-full max-w-2xl">
          {displaySteps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex items-center justify-center
                      w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                      rounded-full border-2 md:border-3
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
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span className="text-base sm:text-lg md:text-xl font-bold">
                        {step.id}
                      </span>
                    )}
                  </div>

                  <span
                    className={`
                      mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-center
                      transition-colors duration-300 max-w-[60px] sm:max-w-none
                      ${
                        isCurrent
                          ? "text-primary font-bold"
                          : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                      }
                    `}
                  >
                    {/* แสดงแบบย่อบนมือถือ */}
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="inline sm:hidden">
                      {step.id === 1 && "วันที่"}
                      {step.id === 2 && "รอบ"}
                      {step.id === 3 && "จำนวน"}
                      {step.id === 4 && "ข้อมูล"}
                      {step.id === 5 && "ชำระ"}
                    </span>
                  </span>
                </div>

                {index < displaySteps.length - 1 && (
                  <div className="w-6 sm:w-10 md:w-14 h-0.5 mx-1 sm:mx-1.5 -mt-6 flex-shrink-0">
                    <div className="h-full bg-border rounded-full overflow-hidden">
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
