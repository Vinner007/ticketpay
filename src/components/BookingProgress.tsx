import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, label: "วันที่" },
  { id: 2, label: "จำนวน" },
  { id: 3, label: "ข้อมูล" },
  { id: 4, label: "ชำระเงิน" },
];

export const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  return (
    <div className="mb-8 sm:mb-10 md:mb-12 w-full">
      <div className="flex items-center justify-center w-full px-4 sm:px-6">
        <div className="flex items-center justify-between w-full max-w-xl">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                {/* Step Circle and Label */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      flex items-center justify-center
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                      rounded-full border-2 sm:border-3 md:border-4
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
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <span className="text-lg sm:text-xl md:text-2xl font-bold">
                        {step.id}
                      </span>
                    )}
                  </div>

                  <span
                    className={`
                      mt-2 text-xs sm:text-sm md:text-base font-medium text-center whitespace-nowrap
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
                    {step.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="w-12 sm:w-16 md:w-20 h-0.5 mx-2 sm:mx-3 -mt-8 flex-shrink-0">
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
