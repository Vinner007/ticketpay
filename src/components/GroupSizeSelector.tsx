import { Users } from "lucide-react";

interface GroupSizeSelectorProps {
  selectedSize: number;
  onSelect: (size: number) => void;
  ticketPrice: number;
}

export const GroupSizeSelector = ({
  selectedSize,
  onSelect,
  ticketPrice,
}: GroupSizeSelectorProps) => {
  const sizes = [5, 6, 7];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-spooky text-primary">
          จำนวนสมาชิกในกลุ่ม (5-7 คน)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sizes.map((size) => {
          const total = size * ticketPrice;
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => onSelect(size)}
              className={`group relative p-8 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-primary bg-primary/10 glow-orange scale-105"
                  : "border-border bg-card hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground glow-orange"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/20"
                    }`}
                  >
                    <Users className="w-10 h-10" />
                  </div>
                </div>

                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {size} คน
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {size} × {ticketPrice} บาท
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    = {total} บาท
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-success-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
