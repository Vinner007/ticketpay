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
      <div className="flex items-center justify-center w-full px-2 sm:px-4">
        <div className="flex items-center justify-between w-full max-w-md sm:max-w-lg">
          {steps.map((step, index) => {
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
                      mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-center whitespace-nowrap
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

                {index < steps.length - 1 && (
                  <div className="w-8 sm:w-12 md:w-16 h-0.5 mx-1.5 sm:mx-2 -mt-6 flex-shrink-0">
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
