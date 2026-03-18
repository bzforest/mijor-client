export function formatTime(timeInput: string | undefined | null): string {
  if (!timeInput) return "";

  try {
    // If backend sent local 12-hour format (e.g. "1:00:00 AM" which is Thailand +7)
    // Reverse it back to UTC so it matches the database (e.g., 18:00)
    const ampmMatch = timeInput.match(
      /(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)/i,
    );
    if (ampmMatch) {
      let h = parseInt(ampmMatch[1]);
      const m = ampmMatch[2];
      const isPM = ampmMatch[3].toUpperCase() === "PM";

      if (isPM && h !== 12) h += 12;
      if (!isPM && h === 12) h = 0;

      let utc_h = h - 7;
      if (utc_h < 0) utc_h += 24;

      return `${utc_h.toString().padStart(2, "0")}:${m}`;
    }

    // If input is like "2026-03-01 18:00:00+00", let's extract the time part directly
    // This avoids any browser timezone parsing inconsistencies entirely.
    const isoMatch = timeInput.match(
      /\d{4}-\d{2}-\d{2} (\d{1,2}):(\d{2})(:\d{2})?/,
    );
    if (isoMatch) {
      return `${isoMatch[1].padStart(2, "0")}:${isoMatch[2]}`;
    }

    // For simple "HH:mm" strings
    const simpleMatch = timeInput.match(/^(\d{1,2}):(\d{2})(:\d{2})?$/);
    if (simpleMatch) {
      return `${simpleMatch[1].padStart(2, "0")}:${simpleMatch[2]}`;
    }

    // Standard date parsing as fallback
    const date = new Date(timeInput);

    if (isNaN(date.getTime())) return timeInput;

    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  } catch {
    console.error("Error formatting time:", timeInput);
    return timeInput;
  }
}

// Helper function สำหรับแปลง UTC เป็น Bangkok time
export function convertUTCtoBangkok(utcDateString: string): Date {
  // สมมติว่า server ส่งเวลามาเป็น Bangkok time อยู่แล้ว
  // ไม่ต้องแปลง timezone ให้ใช้เวลาตามที่ส่งมา直接
  return new Date(utcDateString);
}

// คำนวณสถานะ booking ตามเวลา Bangkok
export function getBookingStatus(startTime: string, currentStatus: string): string {
  // ถ้าไม่ใช่ confirmed ให้คืนค่าสถานะเดิม (refunded, cancelled)
  if (currentStatus !== "confirmed") return currentStatus;
  
  const bangkokTime = convertUTCtoBangkok(startTime);
  
  // ใช้วิธีสุดท้ายที่ง่ายและถูกต้อง: บวก offset ของ Bangkok (7 ชั่วโมง) ตรงๆ
  const nowUTC = new Date();
  const nowBangkok = new Date(nowUTC.getTime() + (7 * 60 * 60 * 1000));
  
  const timeDiff = bangkokTime.getTime() - nowBangkok.getTime();
  
  // หลังหนังฉาย 30 นาที หรือมากกว่า = completed
  if (timeDiff <= -30 * 60 * 1000) {
    return "completed";
  }
  
  // ก่อนหนังฉาย 30 นาที หรือน้อยกว่า = confirmed (จะถูก map เป็น "paid" ใน UI)
  return "confirmed";
}

// ตรวจสอบว่าสามารถ cancel ได้หรือไม่
export function canCancelBooking(startTime: string, currentStatus: string): boolean {
  if (currentStatus !== "confirmed") return false;
  
  const bangkokTime = convertUTCtoBangkok(startTime);
  
  // ใช้วิธีเดียวกันกับ getBookingStatus
  const nowUTC = new Date();
  const nowBangkok = new Date(nowUTC.getTime() + (7 * 60 * 60 * 1000));
  
  const timeDiff = bangkokTime.getTime() - nowBangkok.getTime();
  
  // สามารถ cancel ได้ก่อนหนังฉาย 30 นาที
  return timeDiff > 30 * 60 * 1000;
}
