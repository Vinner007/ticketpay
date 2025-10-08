# 🎃 สรุปการแปลงโค้ดไปใช้ Supabase

## ✅ สิ่งที่ทำเสร็จแล้ว

### 1. ไฟล์ SQL และ Migration
- ✅ **SQL_COMMANDS.sql** - คำสั่ง SQL ทั้งหมดในไฟล์เดียว (พร้อมคำอธิบาย)
- ✅ **supabase/migrations/20251008_seed_data.sql** - ข้อมูล seed สำหรับ promo codes
- ✅ **SUPABASE_SETUP.md** - คู่มือการติดตั้งและใช้งานแบบละเอียด

### 2. Helper Functions
- ✅ **src/lib/supabaseHelpers.ts** - Functions ทั้งหมดสำหรับเชื่อมต่อ Supabase
  - Booking functions (create, get, update, delete, check-in, search, stats)
  - Promo code functions (validate, apply, increment usage)
  - Activity log functions (create, get logs)
  - Utility functions (generate IDs, codes, QR data)

### 3. Components ที่แปลงแล้ว
- ✅ **src/pages/NewBooking.tsx** - ใช้ Supabase แทน localStorage
  - ✅ เชื่อมต่อ Supabase สำหรับสร้างการจอง
  - ✅ ตรวจสอบและใช้โค้ดส่วนลดจาก Supabase
  - ✅ เพิ่มการใช้ promo code usage counter

- ✅ **src/pages/admin/BookingsNew.tsx** - Admin bookings ที่ใช้ Supabase
  - ✅ แสดงรายการจองจาก Supabase
  - ✅ กรอง, ค้นหา, เรียงลำดับข้อมูล
  - ✅ เช็คอิน, แก้ไข, ลบการจอง
  - ✅ Activity logging
  - ✅ สถิติแบบ real-time

---

## 📊 โครงสร้างฐานข้อมูล

### Tables (5 ตาราง)
1. **bookings** - ข้อมูลการจองทั้งหมด
2. **promo_codes** - โค้ดส่วนลดและการใช้งาน
3. **user_roles** - บทบาทของผู้ดูแลระบบ
4. **admin_profiles** - ข้อมูลโปรไฟล์ admin
5. **activity_logs** - บันทึกการกระทำทั้งหมด

### Enum Types (7 types)
- story_theme, payment_method, payment_status
- check_in_status, booking_source, promo_type, app_role

### Functions (4 functions)
- `has_role()` - เช็คบทบาทของ user
- `is_admin()` - เช็คว่าเป็น admin หรือไม่
- `increment_promo_usage()` - เพิ่มจำนวนการใช้โค้ด
- `update_updated_at_column()` - อัพเดท timestamp

### Security (RLS)
- ✅ Row Level Security เปิดใช้งานทุกตาราง
- ✅ Policies สำหรับ public (ดูและสร้างการจอง)
- ✅ Policies สำหรับ authenticated admins
- ✅ Policies สำหรับ super_admin เท่านั้น

---

## 🚀 วิธีใช้งาน

### ขั้นตอนที่ 1: รัน SQL
```bash
# คัดลอกเนื้อหาจากไฟล์นี้:
SQL_COMMANDS.sql

# ไปวางใน Supabase Dashboard → SQL Editor → รัน
```

### ขั้นตอนที่ 2: อัพเดท Config
```typescript
// แก้ไข src/integrations/supabase/client.ts
const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_ANON_KEY";
```

### ขั้นตอนที่ 3: แทนที่ไฟล์
```bash
# แทนที่ Bookings.tsx เดิมด้วยเวอร์ชันใหม่
mv src/pages/admin/Bookings.tsx src/pages/admin/Bookings.old.tsx
mv src/pages/admin/BookingsNew.tsx src/pages/admin/Bookings.tsx
```

### ขั้นตอนที่ 4: ทดสอบ
```bash
npm run dev
# เปิด http://localhost:5173
# ทดสอบการจองและตรวจสอบใน Supabase
```

---

## 📝 ไฟล์ที่ต้องอัพเดทเพิ่มเติม (Optional)

ถ้าต้องการแปลงส่วนอื่นๆ ให้ใช้ Supabase แทน localStorage:

### PromoCodes.tsx
```typescript
// แทนที่
import { PROMO_CODES } from "@/types/booking";

// ด้วย
import { getPromoCodes } from "@/lib/supabaseHelpers";

// และในcomponent
useEffect(() => {
  const loadPromos = async () => {
    const promos = await getPromoCodes();
    setPromoCodes(promos);
  };
  loadPromos();
}, []);
```

### CheckIn.tsx
```typescript
// ใช้
import { getBookings, checkInBooking } from "@/lib/supabaseHelpers";

// แทนที่
const loadBookings = async () => {
  const bookings = await getBookings({
    eventDate: selectedDate,
    checkInStatus: "not-checked-in",
  });
  setBookings(bookings);
};

// Check in
await checkInBooking(booking.id, adminEmail);
```

### Reports.tsx
```typescript
// ใช้
import { getBookingStats } from "@/lib/supabaseHelpers";

// โหลดสถิติ
const stats = await getBookingStats();
```

---

## 🎯 ความแตกต่างหลัก

| Feature | Before (localStorage) | After (Supabase) |
|---------|----------------------|------------------|
| ข้อมูล | เก็บใน browser | เก็บใน cloud database |
| ความปลอดภัย | ไม่มี | Row Level Security |
| Real-time | ไม่รองรับ | รองรับ (ถ้าเปิดใช้) |
| แชร์ข้อมูล | ไม่ได้ | แชร์ข้ามอุปกรณ์ |
| Backup | ไม่มี | มี automatic backup |
| Scalability | จำกัด | Unlimited |

---

## 📋 Checklist การทำงาน

### Setup
- [ ] สร้าง Supabase project
- [ ] รัน SQL_COMMANDS.sql ใน SQL Editor
- [ ] คัดลอก Project URL และ Anon Key
- [ ] อัพเดท client.ts

### Testing
- [ ] ทดสอบการจองใหม่
- [ ] ทดสอบการใช้โค้ดส่วนลด
- [ ] ทดสอบ Admin dashboard
- [ ] ทดสอบการเช็คอิน
- [ ] ตรวจสอบข้อมูลใน Supabase

### Deployment
- [ ] อัพเดท environment variables
- [ ] Build และ deploy
- [ ] ทดสอบ production

---

## 🔍 ตัวอย่างการใช้งาน

### สร้างการจองใหม่
```typescript
import { createBooking, generateBookingId } from "@/lib/supabaseHelpers";

const booking = await createBooking({
  booking_id: generateBookingId(),
  confirmation_code: generateConfirmationCode(),
  story_theme: "cursed-cinema",
  event_date: "2025-10-29",
  time_slot: "รอบเช้า",
  time_slot_time: "10:00 - 12:00 น.",
  group_size: 5,
  ticket_price: 80,
  subtotal: 400,
  total_price: 350,
  leader_first_name: "สมชาย",
  leader_last_name: "ใจดี",
  // ... ข้อมูลอื่นๆ
});
```

### ค้นหาการจอง
```typescript
import { searchBookings } from "@/lib/supabaseHelpers";

// ค้นหาด้วย ID, ชื่อ, email, เบอร์โทร
const results = await searchBookings("john");
```

### ดึงสถิติ
```typescript
import { getBookingStats } from "@/lib/supabaseHelpers";

const stats = await getBookingStats();
console.log(stats);
// {
//   todayBookings: 15,
//   totalRevenue: 45000,
//   pendingPayments: 3,
//   checkInRate: "75.5"
// }
```

### ตรวจสอบโค้ดส่วนลด
```typescript
import { validatePromoCode, incrementPromoUsage } from "@/lib/supabaseHelpers";

const result = await validatePromoCode("HALLOWEEN10", 500);
if ("discount" in result) {
  console.log(`ส่วนลด: ${result.discount} บาท`);
  await incrementPromoUsage(result.code);
} else {
  console.error(result.error);
}
```

---

## 🆘 การแก้ปัญหา

### ปัญหา: "relation does not exist"
**วิธีแก้:** ให้แน่ใจว่ารัน SQL_COMMANDS.sql ทั้งหมดแล้ว

### ปัญหา: "Invalid API key"
**วิธีแก้:** ตรวจสอบ SUPABASE_URL และ SUPABASE_PUBLISHABLE_KEY ใน client.ts

### ปัญหา: RLS Policy Error
**วิธีแก้:** ตรวจสอบว่า RLS policies ถูกสร้างถูกต้อง หรือปิด RLS ชั่วคราว

### ปัญหา: CORS Error
**วิธีแก้:** ตรวจสอบ Project URL และแน่ใจว่าใช้ https://

---

## 📚 เอกสารเพิ่มเติม

- **SUPABASE_SETUP.md** - คู่มือการติดตั้งแบบละเอียด
- **SQL_COMMANDS.sql** - คำสั่ง SQL พร้อมคำอธิบาย
- **src/lib/supabaseHelpers.ts** - API reference

---

## 🎉 สรุป

โปรเจกต์ของคุณพร้อมใช้งาน Supabase แล้ว!

คุณมี:
- ✅ Database schema ที่สมบูรณ์
- ✅ Helper functions ที่ใช้งานง่าย
- ✅ Security policies ที่เหมาะสม
- ✅ Components ที่ใช้ Supabase แล้ว
- ✅ เอกสารครบถ้วน

**ขั้นตอนถัดไป:** รัน SQL, อัพเดท config, และเริ่มใช้งาน! 🚀

---

**Created for Ghoul Gate Halloween Event 2025** 🎃👻
