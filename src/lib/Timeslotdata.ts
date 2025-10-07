// ตารางเวลาแยกตามวัน สำหรับ 2 เรื่อง

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  groupNumber: number;
  round: number;
  isBreak?: boolean;
  breakType?: string;
  available: boolean;
}

// วันที่ 29 ตุลาคม 2568 (36 รอบ)
export const timeSlotsDay29: TimeSlot[] = [
  // รอบ 1 (10:00-11:00)
  { id: "29-1", startTime: "10:00", endTime: "10:10", groupNumber: 1, round: 1, available: true },
  { id: "29-2", startTime: "10:10", endTime: "10:20", groupNumber: 2, round: 1, available: true },
  { id: "29-3", startTime: "10:20", endTime: "10:30", groupNumber: 3, round: 1, available: true },
  { id: "29-4", startTime: "10:30", endTime: "10:40", groupNumber: 4, round: 1, available: true },
  { id: "29-5", startTime: "10:40", endTime: "10:50", groupNumber: 5, round: 1, available: true },
  { id: "29-6", startTime: "10:50", endTime: "11:00", groupNumber: 6, round: 1, available: true },
  
  // รอบ 2 (11:00-12:00)
  { id: "29-7", startTime: "11:00", endTime: "11:10", groupNumber: 1, round: 2, available: true },
  { id: "29-8", startTime: "11:10", endTime: "11:20", groupNumber: 2, round: 2, available: true },
  { id: "29-9", startTime: "11:20", endTime: "11:30", groupNumber: 3, round: 2, available: true },
  { id: "29-10", startTime: "11:30", endTime: "11:40", groupNumber: 4, round: 2, available: true },
  { id: "29-11", startTime: "11:40", endTime: "11:50", groupNumber: 5, round: 2, available: true },
  { id: "29-12", startTime: "11:50", endTime: "12:00", groupNumber: 6, round: 2, available: true },
  
  // พักเบรก (12:00-12:30)
  { id: "29-break1", startTime: "12:00", endTime: "12:30", groupNumber: 0, round: 0, isBreak: true, breakType: "มื้อเที่ยง", available: false },
  
  // รอบ 3 (12:30-13:30)
  { id: "29-13", startTime: "12:30", endTime: "12:40", groupNumber: 1, round: 3, available: true },
  { id: "29-14", startTime: "12:40", endTime: "12:50", groupNumber: 2, round: 3, available: true },
  { id: "29-15", startTime: "12:50", endTime: "13:00", groupNumber: 3, round: 3, available: true },
  { id: "29-16", startTime: "13:00", endTime: "13:10", groupNumber: 4, round: 3, available: true },
  { id: "29-17", startTime: "13:10", endTime: "13:20", groupNumber: 5, round: 3, available: true },
  { id: "29-18", startTime: "13:20", endTime: "13:30", groupNumber: 6, round: 3, available: true },
  
  // รอบ 4 (13:30-14:30)
  { id: "29-19", startTime: "13:30", endTime: "13:40", groupNumber: 1, round: 4, available: true },
  { id: "29-20", startTime: "13:40", endTime: "13:50", groupNumber: 2, round: 4, available: true },
  { id: "29-21", startTime: "13:50", endTime: "14:00", groupNumber: 3, round: 4, available: true },
  { id: "29-22", startTime: "14:00", endTime: "14:10", groupNumber: 4, round: 4, available: true },
  { id: "29-23", startTime: "14:10", endTime: "14:20", groupNumber: 5, round: 4, available: true },
  { id: "29-24", startTime: "14:20", endTime: "14:30", groupNumber: 6, round: 4, available: true },
  
  // พักเบรก (14:30-15:00)
  { id: "29-break2", startTime: "14:30", endTime: "15:00", groupNumber: 0, round: 0, isBreak: true, breakType: "พักเบรก", available: false },
  
  // รอบ 5 (15:00-16:00)
  { id: "29-25", startTime: "15:00", endTime: "15:10", groupNumber: 1, round: 5, available: true },
  { id: "29-26", startTime: "15:10", endTime: "15:20", groupNumber: 2, round: 5, available: true },
  { id: "29-27", startTime: "15:20", endTime: "15:30", groupNumber: 3, round: 5, available: true },
  { id: "29-28", startTime: "15:30", endTime: "15:40", groupNumber: 4, round: 5, available: true },
  { id: "29-29", startTime: "15:40", endTime: "15:50", groupNumber: 5, round: 5, available: true },
  { id: "29-30", startTime: "15:50", endTime: "16:00", groupNumber: 6, round: 5, available: true },
  
  // รอบ 6 (16:00-17:00)
  { id: "29-31", startTime: "16:00", endTime: "16:10", groupNumber: 1, round: 6, available: true },
  { id: "29-32", startTime: "16:10", endTime: "16:20", groupNumber: 2, round: 6, available: true },
  { id: "29-33", startTime: "16:20", endTime: "16:30", groupNumber: 3, round: 6, available: true },
  { id: "29-34", startTime: "16:30", endTime: "16:40", groupNumber: 4, round: 6, available: true },
  { id: "29-35", startTime: "16:40", endTime: "16:50", groupNumber: 5, round: 6, available: true },
  { id: "29-36", startTime: "16:50", endTime: "17:00", groupNumber: 6, round: 6, available: true },
];

// วันที่ 30 ตุลาคม 2568 (33 รอบ - มีพิธีเปิดงาน)
export const timeSlotsDay30: TimeSlot[] = [
  // รอบ 1 (10:00-11:00)
  { id: "30-1", startTime: "10:00", endTime: "10:10", groupNumber: 1, round: 1, available: true },
  { id: "30-2", startTime: "10:10", endTime: "10:20", groupNumber: 2, round: 1, available: true },
  { id: "30-3", startTime: "10:20", endTime: "10:30", groupNumber: 3, round: 1, available: true },
  { id: "30-4", startTime: "10:30", endTime: "10:40", groupNumber: 4, round: 1, available: true },
  { id: "30-5", startTime: "10:40", endTime: "10:50", groupNumber: 5, round: 1, available: true },
  { id: "30-6", startTime: "10:50", endTime: "11:00", groupNumber: 6, round: 1, available: true },
  
  // รอบ 2 (11:00-12:00)
  { id: "30-7", startTime: "11:00", endTime: "11:10", groupNumber: 1, round: 2, available: true },
  { id: "30-8", startTime: "11:10", endTime: "11:20", groupNumber: 2, round: 2, available: true },
  { id: "30-9", startTime: "11:20", endTime: "11:30", groupNumber: 3, round: 2, available: true },
  { id: "30-10", startTime: "11:30", endTime: "11:40", groupNumber: 4, round: 2, available: true },
  { id: "30-11", startTime: "11:40", endTime: "11:50", groupNumber: 5, round: 2, available: true },
  { id: "30-12", startTime: "11:50", endTime: "12:00", groupNumber: 6, round: 2, available: true },
  
  // พักเบรก (12:00-12:30)
  { id: "30-break1", startTime: "12:00", endTime: "12:30", groupNumber: 0, round: 0, isBreak: true, breakType: "มื้อเที่ยง", available: false },
  
  // รอบ 3 (12:30-13:00)
  { id: "30-13", startTime: "12:30", endTime: "12:40", groupNumber: 1, round: 3, available: true },
  { id: "30-14", startTime: "12:40", endTime: "12:50", groupNumber: 2, round: 3, available: true },
  { id: "30-15", startTime: "12:50", endTime: "13:00", groupNumber: 3, round: 3, available: true },
  
  // พิธีเปิดงาน (13:00-13:30)
  { id: "30-ceremony", startTime: "13:00", endTime: "13:30", groupNumber: 0, round: 0, isBreak: true, breakType: "🎉 พิธีเปิดงาน (ท่านรองวิรัส)", available: false },
  
  // รอบ 3 ต่อ + รอบ 4 (13:30-14:30)
  { id: "30-16", startTime: "13:30", endTime: "13:40", groupNumber: 4, round: 3, available: true },
  { id: "30-17", startTime: "13:40", endTime: "13:50", groupNumber: 5, round: 3, available: true },
  { id: "30-18", startTime: "13:50", endTime: "14:00", groupNumber: 6, round: 3, available: true },
  { id: "30-19", startTime: "14:00", endTime: "14:10", groupNumber: 1, round: 4, available: true },
  { id: "30-20", startTime: "14:10", endTime: "14:20", groupNumber: 2, round: 4, available: true },
  { id: "30-21", startTime: "14:20", endTime: "14:30", groupNumber: 3, round: 4, available: true },
  
  // พักเบรก (14:30-15:00)
  { id: "30-break2", startTime: "14:30", endTime: "15:00", groupNumber: 0, round: 0, isBreak: true, breakType: "พักเบรก", available: false },
  
  // รอบ 4 ต่อ + รอบ 5 (15:00-16:30)
  { id: "30-22", startTime: "15:00", endTime: "15:10", groupNumber: 4, round: 4, available: true },
  { id: "30-23", startTime: "15:10", endTime: "15:20", groupNumber: 5, round: 4, available: true },
  { id: "30-24", startTime: "15:20", endTime: "15:30", groupNumber: 6, round: 4, available: true },
  { id: "30-25", startTime: "15:30", endTime: "15:40", groupNumber: 1, round: 5, available: true },
  { id: "30-26", startTime: "15:40", endTime: "15:50", groupNumber: 2, round: 5, available: true },
  { id: "30-27", startTime: "15:50", endTime: "16:00", groupNumber: 3, round: 5, available: true },
  { id: "30-28", startTime: "16:00", endTime: "16:10", groupNumber: 4, round: 5, available: true },
  { id: "30-29", startTime: "16:10", endTime: "16:20", groupNumber: 5, round: 5, available: true },
  { id: "30-30", startTime: "16:20", endTime: "16:30", groupNumber: 6, round: 5, available: true },
  
  // รอบ 6 (16:30-17:00)
  { id: "30-31", startTime: "16:30", endTime: "16:40", groupNumber: 1, round: 6, available: true },
  { id: "30-32", startTime: "16:40", endTime: "16:50", groupNumber: 2, round: 6, available: true },
  { id: "30-33", startTime: "16:50", endTime: "17:00", groupNumber: 3, round: 6, available: true },
];

// วันที่ 31 ตุลาคม 2568 (36 รอบ - เหมือนวันที่ 29)
export const timeSlotsDay31: TimeSlot[] = [
  // รอบ 1 (10:00-11:00)
  { id: "31-1", startTime: "10:00", endTime: "10:10", groupNumber: 1, round: 1, available: true },
  { id: "31-2", startTime: "10:10", endTime: "10:20", groupNumber: 2, round: 1, available: true },
  { id: "31-3", startTime: "10:20", endTime: "10:30", groupNumber: 3, round: 1, available: true },
  { id: "31-4", startTime: "10:30", endTime: "10:40", groupNumber: 4, round: 1, available: true },
  { id: "31-5", startTime: "10:40", endTime: "10:50", groupNumber: 5, round: 1, available: true },
  { id: "31-6", startTime: "10:50", endTime: "11:00", groupNumber: 6, round: 1, available: true },
  
  // รอบ 2 (11:00-12:00)
  { id: "31-7", startTime: "11:00", endTime: "11:10", groupNumber: 1, round: 2, available: true },
  { id: "31-8", startTime: "11:10", endTime: "11:20", groupNumber: 2, round: 2, available: true },
  { id: "31-9", startTime: "11:20", endTime: "11:30", groupNumber: 3, round: 2, available: true },
  { id: "31-10", startTime: "11:30", endTime: "11:40", groupNumber: 4, round: 2, available: true },
  { id: "31-11", startTime: "11:40", endTime: "11:50", groupNumber: 5, round: 2, available: true },
  { id: "31-12", startTime: "11:50", endTime: "12:00", groupNumber: 6, round: 2, available: true },
  
  // พักเบรก (12:00-12:30)
  { id: "31-break1", startTime: "12:00", endTime: "12:30", groupNumber: 0, round: 0, isBreak: true, breakType: "มื้อเที่ยง", available: false },
  
  // รอบ 3 (12:30-13:30)
  { id: "31-13", startTime: "12:30", endTime: "12:40", groupNumber: 1, round: 3, available: true },
  { id: "31-14", startTime: "12:40", endTime: "12:50", groupNumber: 2, round: 3, available: true },
  { id: "31-15", startTime: "12:50", endTime: "13:00", groupNumber: 3, round: 3, available: true },
  { id: "31-16", startTime: "13:00", endTime: "13:10", groupNumber: 4, round: 3, available: true },
  { id: "31-17", startTime: "13:10", endTime: "13:20", groupNumber: 5, round: 3, available: true },
  { id: "31-18", startTime: "13:20", endTime: "13:30", groupNumber: 6, round: 3, available: true },
  
  // รอบ 4 (13:30-14:30)
  { id: "31-19", startTime: "13:30", endTime: "13:40", groupNumber: 1, round: 4, available: true },
  { id: "31-20", startTime: "13:40", endTime: "13:50", groupNumber: 2, round: 4, available: true },
  { id: "31-21", startTime: "13:50", endTime: "14:00", groupNumber: 3, round: 4, available: true },
  { id: "31-22", startTime: "14:00", endTime: "14:10", groupNumber: 4, round: 4, available: true },
  { id: "31-23", startTime: "14:10", endTime: "14:20", groupNumber: 5, round: 4, available: true },
  { id: "31-24", startTime: "14:20", endTime: "14:30", groupNumber: 6, round: 4, available: true },
  
  // พักเบรก (14:30-15:00)
  { id: "31-break2", startTime: "14:30", endTime: "15:00", groupNumber: 0, round: 0, isBreak: true, breakType: "พักเบรก", available: false },
  
  // รอบ 5 (15:00-16:00)
  { id: "31-25", startTime: "15:00", endTime: "15:10", groupNumber: 1, round: 5, available: true },
  { id: "31-26", startTime: "15:10", endTime: "15:20", groupNumber: 2, round: 5, available: true },
  { id: "31-27", startTime: "15:20", endTime: "15:30", groupNumber: 3, round: 5, available: true },
  { id: "31-28", startTime: "15:30", endTime: "15:40", groupNumber: 4, round: 5, available: true },
  { id: "31-29", startTime: "15:40", endTime: "15:50", groupNumber: 5, round: 5, available: true },
  { id: "31-30", startTime: "15:50", endTime: "16:00", groupNumber: 6, round: 5, available: true },
  
  // รอบ 6 (16:00-17:00)
  { id: "31-31", startTime: "16:00", endTime: "16:10", groupNumber: 1, round: 6, available: true },
  { id: "31-32", startTime: "16:10", endTime: "16:20", groupNumber: 2, round: 6, available: true },
  { id: "31-33", startTime: "16:20", endTime: "16:30", groupNumber: 3, round: 6, available: true },
  { id: "31-34", startTime: "16:30", endTime: "16:40", groupNumber: 4, round: 6, available: true },
  { id: "31-35", startTime: "16:40", endTime: "16:50", groupNumber: 5, round: 6, available: true },
  { id: "31-36", startTime: "16:50", endTime: "17:00", groupNumber: 6, round: 6, available: true },
];

// Helper function เพื่อดึงตารางเวลาตามวัน
export const getTimeSlotsByDate = (dateValue: string): TimeSlot[] => {
  switch (dateValue) {
    case "2025-10-29":
      return timeSlotsDay29;
    case "2025-10-30":
      return timeSlotsDay30;
    case "2025-10-31":
      return timeSlotsDay31;
    default:
      return timeSlotsDay29;
  }
};

// Helper function เพื่อจัดกลุ่มตามรอบ
export const groupSlotsByRound = (slots: TimeSlot[]) => {
  const rounds: { [key: number]: TimeSlot[] } = {};
  const breaks: TimeSlot[] = [];
  
  slots.forEach(slot => {
    if (slot.isBreak) {
      breaks.push(slot);
    } else {
      if (!rounds[slot.round]) {
        rounds[slot.round] = [];
      }
      rounds[slot.round].push(slot);
    }
  });
  
  return { rounds, breaks };
};

export const storyData = {
  1: {
    id: 1,
    title: "โรงหนังต้องสาป",
    titleEn: "The Cursed Cinema",
    difficulty: 4,
    scariness: 4,
  },
  2: {
    id: 2,
    title: "บทเรียนสีเลือด",
    titleEn: "The Lesson Blood",
    difficulty: 3,
    scariness: 5,
  },
};
