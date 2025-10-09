export const TICKET_PRICE = 80;
export const PAYMENT_TIME_LIMIT = 15 * 60;

export const MAX_CAPACITY_PER_DAY: Record<string, number> = {
  "2025-10-29": 252,
  "2025-10-30": 231,
  "2025-10-31": 252,
};

export const PROMO_CODES = [
  {
    code: "HALLOWEEN10",
    type: "percentage" as const,
    value: 10,
    minPurchase: 0,
    maxDiscount: 100,
    description: "ลด 10%",
  },
  {
    code: "EARLYBIRD",
    type: "fixed" as const,
    value: 50,
    minPurchase: 400,
    description: "ลดทันที 50 บาท",
  },
  {
    code: "SCARY20",
    type: "percentage" as const,
    value: 20,
    minPurchase: 560,
    maxDiscount: 150,
    description: "ลด 20%",
  },
  {
    code: "GROUP7FOR6",
    type: "fixed" as const,
    value: 80,
    minPurchase: 560,
    description: "โปรโมชั่น มา 7 จ่าย 6",
  },
];

export const dateLabels: Record<string, string> = {
  "2025-10-29": "29 ตุลาคม 2568 (วันพุธ)",
  "2025-10-30": "30 ตุลาคม 2568 (วันพฤหัสบดี)",
  "2025-10-31": "31 ตุลาคม 2568 (วันศุกร์)",
};

export const getTimeSlots = (date: string) => {
  return [
    {
      id: "morning",
      label: "รอบเช้า",
      time: "10:00 - 12:00 น.",
      rounds: "รอบที่ 1-2",
      description: "เริ่มลงทะเบียน 09:30 น.",
    },
    {
      id: "afternoon",
      label: "รอบเที่ยง",
      time: "12:30 - 14:30 น.",
      rounds: "รอบที่ 3-4",
      description: date === "2025-10-30" 
        ? "มีพิธีเปิดงาน 13:00-13:30" 
        : "หลังพักเบรก 30 นาที",
    },
    {
      id: "evening",
      label: "รอบเย็น",
      time: "15:00 - 17:00 น.",
      rounds: "รอบที่ 5-6",
      description: "รอบสุดท้ายของวัน",
    },
  ];
};
