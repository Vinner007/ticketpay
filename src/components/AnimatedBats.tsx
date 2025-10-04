import { useEffect, useState } from "react";

interface Bat {
  id: number;
  top: number;
  delay: number;
  duration: number;
}

export const AnimatedBats = () => {
  const [bats, setBats] = useState<Bat[]>([]);

  useEffect(() => {
    const newBats: Bat[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: Math.random() * 60 + 10,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setBats(newBats);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bats.map((bat) => (
        <div
          key={bat.id}
          className="absolute"
          style={{
            top: `${bat.top}%`,
            animation: `flyAcross ${bat.duration}s linear ${bat.delay}s infinite`,
          }}
        >
          <svg
            width="40"
            height="30"
            viewBox="0 0 40 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-30"
          >
            <path
              d="M20 15C20 15 15 5 10 5C5 5 2 10 2 15C2 20 5 22 8 20C8 20 12 15 15 15C15 15 12 20 12 25C12 30 15 30 20 28C25 30 28 30 28 25C28 20 25 15 25 15C28 15 32 20 32 20C35 22 38 20 38 15C38 10 35 5 30 5C25 5 20 15 20 15Z"
              fill="currentColor"
              className="text-muted-foreground"
            />
          </svg>
        </div>
      ))}
      <style>{`
        @keyframes flyAcross {
          from {
            left: -50px;
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-20px) scale(1.1);
          }
          50% {
            transform: translateY(10px) scale(0.9);
          }
          75% {
            transform: translateY(-15px) scale(1.05);
          }
          to {
            left: calc(100% + 50px);
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
