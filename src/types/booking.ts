export interface PromoCode {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
  minPurchase: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  nickname?: string;
  age: number;
}

export interface Leader {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone: string;
  age: number;
  lineId?: string;
}

export interface Booking {
  bookingId: string;
  confirmationCode: string;
  eventDate: string;
  timeSlot: string;
  timeSlotTime: string;
  groupSize: number;
  ticketPrice: number;
  subtotal: number;
  promoCode?: {
    code: string;
    discount: number;
  };
  totalPrice: number;
  leader: Leader;
  members: Member[];
  paymentMethod: "credit-card" | "promptpay" | "bank-transfer";
  paymentStatus: "pending" | "completed" | "failed";
  qrCodeData: string;
  bookingDate: string;
}

export const PROMO_CODES: PromoCode[] = [
  {
    code: "HALLOWEEN10",
    type: "percentage",
    value: 10,
    description: "ลด 10% สำหรับทุกการจอง",
    minPurchase: 0,
    maxDiscount: 100,
    validFrom: "2025-09-01",
    validUntil: "2025-10-30",
    usageLimit: 200,
    usedCount: 78,
    isActive: true,
  },
  {
    code: "EARLYBIRD",
    type: "fixed",
    value: 50,
    description: "ลดทันที 50 บาท",
    minPurchase: 400,
    validFrom: "2025-09-01",
    validUntil: "2025-10-15",
    usageLimit: 100,
    usedCount: 95,
    isActive: true,
  },
  {
    code: "SCARY20",
    type: "percentage",
    value: 20,
    description: "ลด 20% สำหรับกลุ่ม 7 คน",
    minPurchase: 560,
    maxDiscount: 150,
    validFrom: "2025-10-01",
    validUntil: "2025-10-30",
    usageLimit: 50,
    usedCount: 12,
    isActive: true,
  },
  {
    code: "TREAT15",
    type: "percentage",
    value: 15,
    description: "ลด 15% สำหรับทุกการจอง",
    minPurchase: 0,
    maxDiscount: 120,
    validFrom: "2025-09-01",
    validUntil: "2025-10-30",
    usageLimit: 150,
    usedCount: 45,
    isActive: true,
  },
  {
    code: "FIRSTTIME",
    type: "fixed",
    value: 30,
    description: "ลด 30 บาท สำหรับผู้จองครั้งแรก",
    minPurchase: 0,
    validFrom: "2025-09-01",
    validUntil: "2025-10-30",
    usageLimit: 500,
    usedCount: 234,
    isActive: true,
  },
];
