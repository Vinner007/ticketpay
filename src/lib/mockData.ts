import { Booking, PromoCode } from "@/types/booking";
import { ActivityLog } from "@/types/admin";

const thaiFirstNames = [
  "สมชาย", "สมหญิง", "วิชัย", "สุภาพ", "ประยุทธ", "นิภา", "วิไล", "สมศักดิ์",
  "ธนพล", "กันตนา", "ปวีณา", "อรรถพล", "ชนิดา", "ธนวัฒน์", "อรุณี", "พงศกร",
  "ธัญญา", "ศิริพร", "ปราณี", "วรรณา", "สุรศักดิ์", "อัจฉรา", "กฤษฎา", "นันทิดา",
  "ชัยวัฒน์", "พรรณี", "ธีรพงษ์", "มาลัย", "สุรชัย", "อมรรัตน์", "ณัฐพล", "ศศิธร",
];

const thaiLastNames = [
  "ใจดี", "สวยงาม", "รักสนุก", "มีสุข", "เจริญสุข", "ทองดี", "สุขสันต์", "วัฒนกุล",
  "บุญมา", "ชัยชนะ", "สุขใจ", "รุ่งเรือง", "เกิดสุข", "ประเสริฐ", "มั่งคั่ง", "เจริญรัตน์",
  "พูนสุข", "สิริมงคล", "อุทัยวัฒน์", "ศรีสุข", "โชคดี", "สุขสวัสดิ์", "รักษ์บุญ", "มีทรัพย์",
  "ดีมั่น", "สว่างจิต", "พิทักษ์", "สกุลทอง", "ไพศาล", "วรรณกุล", "ชัยภูมิ", "มงคลรัตน์",
];

const emailDomains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com", "company.co.th"];

const phoneStartDigits = ["06", "08", "09"];

const cancellationReasons = [
  "เปลี่ยนใจไม่มาแล้ว",
  "ตั้งท้องไม่สะดวก",
  "เพื่อนยกเลิก",
  "วันและเวลาไม่ตรงกับกำหนดการ",
  "จองซ้ำ",
  "ชำระเงินไม่ทัน",
  "สุขภาพไม่สมบูรณ์",
  "เหตุฉุกเฉิน",
];

const adminNotes = [
  "ลูกค้าขอเปลี่ยนวันจากเดิม",
  "มีข้อจำกัดด้านสุขภาพ ต้องดูแลเป็นพิเศษ",
  "VIP ลูกค้าประจำ",
  "ขอเปลี่ยนเวลามาช้ากว่าเวลาที่กำหนด 30 นาที",
  "กลุ่มองค์กรบริษัท",
  "มีการร้องเรียนครั้งก่อน",
  "ติดต่อสื่อสารยาก",
];

function generateRandomName() {
  const firstName = thaiFirstNames[Math.floor(Math.random() * thaiFirstNames.length)];
  const lastName = thaiLastNames[Math.floor(Math.random() * thaiLastNames.length)];
  return { firstName, lastName };
}

function generateEmail(firstName: string, lastName: string) {
  const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const num = Math.floor(Math.random() * 999);
  return `${firstName.toLowerCase()}${lastName.toLowerCase()}${num}@${domain}`;
}

function generatePhone() {
  const start = phoneStartDigits[Math.floor(Math.random() * phoneStartDigits.length)];
  const rest = Math.floor(10000000 + Math.random() * 90000000);
  return `${start}${rest}`;
}

function generateBookingDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  // Set time between 10:00 and 20:00
  date.setHours(10 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0);
  return date.toISOString();
}

function getRandomPromoCode(): { code: string; discount: number } | undefined {
  if (Math.random() > 0.4) return undefined; // 60% no promo

  const promos = [
    { code: "HALLOWEEN10", discount: 10, weight: 30 },
    { code: "SCARY20", discount: 20, weight: 15 },
    { code: "EARLYBIRD", discount: 50, weight: 25 },
    { code: "TREAT15", discount: 15, weight: 20 },
    { code: "FIRSTTIME", discount: 30, weight: 10 },
  ];

  const totalWeight = promos.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const promo of promos) {
    random -= promo.weight;
    if (random <= 0) {
      return { code: promo.code, discount: promo.discount };
    }
  }

  return promos[0];
}

export function generateMockBookings(count: number = 200): Booking[] {
  const bookings: Booking[] = [];
  const dates = ["2025-10-28", "2025-10-29", "2025-10-30"];
  const timeSlots = ["รอบเช้า", "รอบเที่ยง", "รอบเย็น"];
  const timeSlotTimes = ["10:00 - 12:00 น.", "12:30 - 14:30 น.", "15:00 - 17:00 น."];
  const paymentMethods: Array<"credit-card" | "promptpay" | "bank-transfer"> = ["promptpay", "credit-card", "bank-transfer"];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.random() < 0.5 ? Math.floor(Math.random() * 7) : Math.floor(Math.random() * 30);
    const bookingDate = generateBookingDate(daysAgo);
    
    // Determine payment status (85% paid, 10% pending, 5% cancelled)
    let paymentStatus: "completed" | "pending" | "failed";
    const statusRand = Math.random();
    if (statusRand < 0.85) {
      paymentStatus = "completed";
    } else if (statusRand < 0.95) {
      paymentStatus = "pending";
    } else {
      paymentStatus = "failed";
    }

    // Group size: 30% 5 people, 45% 6 people, 25% 7 people
    let groupSize: number;
    const sizeRand = Math.random();
    if (sizeRand < 0.3) {
      groupSize = 5;
    } else if (sizeRand < 0.75) {
      groupSize = 6;
    } else {
      groupSize = 7;
    }

    // Payment method distribution
    let paymentMethod: typeof paymentMethods[number];
    const methodRand = Math.random();
    if (methodRand < 0.45) {
      paymentMethod = "promptpay";
    } else if (methodRand < 0.80) {
      paymentMethod = "credit-card";
    } else {
      paymentMethod = "bank-transfer";
    }

    const eventDate = dates[Math.floor(Math.random() * dates.length)];
    const timeSlotIndex = Math.floor(Math.random() * timeSlots.length);
    const leaderName = generateRandomName();
    
    const subtotal = groupSize * 80;
    const promoCode = getRandomPromoCode();
    const totalPrice = subtotal - (promoCode?.discount || 0);

    // Generate members
    const members = Array.from({ length: groupSize - 1 }, (_, idx) => {
      const memberName = generateRandomName();
      return {
        id: idx + 1,
        firstName: memberName.firstName,
        lastName: memberName.lastName,
        nickname: Math.random() > 0.5 ? memberName.firstName.substring(0, 3) : undefined,
        age: 18 + Math.floor(Math.random() * 28),
      };
    });

    // Check-in status (only for Oct 28 and paid bookings)
    const isCheckedIn = eventDate === "2025-10-28" && paymentStatus === "completed" && Math.random() < 0.25;

    const booking: Booking = {
      bookingId: `HW${String(25000 + i).padStart(5, "0")}`,
      confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      eventDate,
      timeSlot: timeSlots[timeSlotIndex],
      timeSlotTime: timeSlotTimes[timeSlotIndex],
      groupSize,
      ticketPrice: 80,
      subtotal,
      promoCode,
      totalPrice,
      leader: {
        firstName: leaderName.firstName,
        lastName: leaderName.lastName,
        nickname: Math.random() > 0.5 ? leaderName.firstName.substring(0, 3) : undefined,
        email: generateEmail(leaderName.firstName, leaderName.lastName),
        phone: generatePhone(),
        age: 20 + Math.floor(Math.random() * 26),
        lineId: Math.random() > 0.3 ? `${leaderName.firstName.toLowerCase()}${Math.floor(Math.random() * 999)}` : undefined,
      },
      members,
      paymentMethod,
      paymentStatus,
      qrCodeData: `HW${Date.now()}-${i}`,
      bookingDate,
    };

    bookings.push(booking);
  }

  // Sort by booking date (most recent first)
  bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());

  return bookings;
}

export function generateActivityLogs(count: number = 50): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const actions = [
    "create_booking",
    "edit_booking",
    "delete_booking",
    "check_in",
    "create_promo",
    "edit_promo",
    "delete_promo",
    "update_settings",
    "send_message",
    "create_admin",
    "edit_admin",
  ];

  const admins = [
    { email: "admin@ghoulgate.com", name: "Super Admin" },
    { email: "staff@ghoulgate.com", name: "Staff User" },
  ];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0);

    const admin = admins[Math.floor(Math.random() * admins.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    logs.push({
      id: `log-${i}`,
      timestamp: date.toISOString(),
      adminEmail: admin.email,
      adminName: admin.name,
      action,
      target: action.includes("booking") ? "booking" : action.includes("promo") ? "promo" : action.includes("admin") ? "user" : "settings",
      targetId: `${action.includes("booking") ? "HW" : ""}${Math.floor(Math.random() * 99999)}`,
      details: {
        field: "status",
        oldValue: "pending",
        newValue: "completed",
      },
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    });
  }

  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return logs;
}

export function initializeMockData() {
  // Check if data already exists
  if (!localStorage.getItem("admin_bookings")) {
    const bookings = generateMockBookings(200);
    localStorage.setItem("admin_bookings", JSON.stringify(bookings));
    console.log("✅ Generated 200 mock bookings");
  }

  if (!localStorage.getItem("admin_activity_logs")) {
    const logs = generateActivityLogs(50);
    localStorage.setItem("admin_activity_logs", JSON.stringify(logs));
    console.log("✅ Generated 50 activity logs");
  }

  // Initialize promo codes usage data
  if (!localStorage.getItem("admin_promo_usage")) {
    const promoUsage = {
      HALLOWEEN10: 78,
      EARLYBIRD: 95,
      SCARY20: 12,
      TREAT15: 45,
      FIRSTTIME: 28,
    };
    localStorage.setItem("admin_promo_usage", JSON.stringify(promoUsage));
    console.log("✅ Initialized promo codes usage");
  }
}
