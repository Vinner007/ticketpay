export const SpiderWeb = ({ position = "top-left" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 scale-x-[-1]",
    "bottom-left": "bottom-0 left-0 scale-y-[-1]",
    "bottom-right": "bottom-0 right-0 scale-[-1]",
  };

  return (
    <div className={`absolute ${positionClasses[position]} w-32 h-32 opacity-20 pointer-events-none`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 0L50 50M0 20L50 50M0 40L50 50M20 0L50 50M40 0L50 50"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-muted-foreground"
        />
        <circle cx="50" cy="50" r="5" fill="currentColor" className="text-muted-foreground" />
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-muted-foreground" />
        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-muted-foreground" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-muted-foreground" />
      </svg>
    </div>
  );
};
