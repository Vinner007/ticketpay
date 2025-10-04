import { useEffect, useState } from "react";
import { Ghost } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const targetDate = new Date("2025-10-28T18:00:00+07:00");
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="relative bg-card rounded-lg p-6 border-2 border-primary glow-orange animate-pulse-glow">
      <div className="absolute -top-3 -right-3 animate-float-random">
        <Ghost className="w-6 h-6 text-primary" />
      </div>
      <div className="text-5xl font-bold text-primary text-glow-orange mb-2">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
      <TimeUnit value={timeLeft.days} label="วัน" />
      <TimeUnit value={timeLeft.hours} label="ชั่วโมง" />
      <TimeUnit value={timeLeft.minutes} label="นาที" />
      <TimeUnit value={timeLeft.seconds} label="วินาที" />
    </div>
  );
};
