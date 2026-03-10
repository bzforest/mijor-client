# 🤖 Roadmap: Minor Cineplex AI Chatbot (Level 2)
**Start Date:** 2 March 2026 | **Target Merge Date:** 12 March 2026

## 🟩 Phase 1: สร้างร่างและหน้าตา (UI & Basic API)
**📅 Day 1-2 (จันทร์ 2 - อังคาร 3 มี.ค.)**
- [x] **UI:** สร้าง Component `ChatBox` (หน้าต่างแชท, ช่อง Input, ปุ่ม Send)
- [x] **UI:** ทำ Loading State หรือ Typing Indicator (จุดไข่ปลาขยับๆ เวลารอบอทคิด)
- [x] **Backend:** สมัครและตั้งค่าตัวแปร `API_KEY` (OpenAI / Gemini) ในไฟล์ `.env`
- [x] **Backend:** สร้าง API Route (`POST /api/chat`) เพื่อรับข้อความจาก Frontend
- [x] **Integration:** ทดสอบให้หน้าเว็บยิง API ไปหา AI และรับคำตอบทั่วไปกลับมาโชว์ได้ (Ping-Pong Test)

## 🟨 Phase 2: สมองและเชื่อม Database (Function Calling) *บอสใหญ่*
**📅 Day 3-5 (พุธ 4 - ศุกร์ 6 มี.ค.)**
- [x] **Backend:** กำหนด Schema ของ Function Calling ให้ AI รู้จัก (เช่น ฟังก์ชัน `get_movie_showtimes`)
- [x] **Database:** เขียน SQL/Logic ดึงข้อมูลจากตาราง `showtimes`, `movies`, `cinemas` ตามคำค้นหา
- [x] **Integration:** เขียนโค้ดดักจับว่า ถ้า AI ขอเรียกใช้ Function ให้เราเอาผลลัพธ์จาก DB ส่งกลับไปให้มันประมวลผล
- [x] **Testing:** ทดสอบถามรอบฉายหนังจริง (เช่น "วันนี้มีสัปเหร่อ 2 ฉายที่ลาดพร้าวกี่โมง?") และเช็กความถูกต้อง

*🎉 --- พักเบรก เสาร์-อาทิตย์ (7-8 มี.ค.) --- 🎉*

## 🟧 Phase 3: ขัดเกลาความฉลาดและดักบั๊ก (Prompt & Error Handling)
**📅 Day 6-7 (จันทร์ 9 - อังคาร 10 มี.ค.)**
- [x] **Prompt Engineering:** เขียน `System Prompt` สวมบทบาทให้ AI เป็นพนักงาน Minor Cineplex ที่สุภาพและเชี่ยวชาญ
- [x] **Guardrails:** เขียนดักทาง AI ไม่ให้ตอบคำถามนอกเรื่อง (เช่น ถามสูตรอาหาร หรือเรื่องการเมือง ให้ปฏิเสธอย่างสุภาพ)
- [x] **Error Handling:** จัดการกรณี API ล่ม, เน็ตหลุด, หรือค้นหาหนังไม่เจอ ให้ UI แสดงข้อความ Error ที่สวยงามและไม่แครช

## 🟥 Phase 4: ประกอบร่างและเตรียม Merge (Finalize)
**📅 Day 8-9 (พุธ 11 - พฤหัส 12 มี.ค.)**
- [x] **Integration Test:** นำ `ChatBox` Component ไปแปะไว้ที่มุมขวาล่างของหน้า Landing Page
- [x] **Refactoring:** จัดระเบียบโค้ด, ตรวจสอบ TypeScript Types ให้เป๊ะ, และลบคอมเมนต์ที่ไม่จำเป็น
- [x] **Documentation:** อัปเดตไฟล์ README หรือเตรียมอธิบายให้เพื่อนในทีมฟังว่าบอททำงานยังไง
- [ ] **Merge:** สร้าง Pull Request (PR) และ Merge เข้าสู่ `dev` branch สำเร็จ! 🚀

---

## 🌟 เควสเสริม (Level 3 - Optional ถ้าเวลาเหลือ)
- [ ] **Smart Link:** ปรับให้ AI คืนค่าผลลัพธ์มาพร้อมกับ "ลิงก์" หรือ "ปุ่ม" ที่แนบ `showtime_id` เพื่อพากระโดดไปหน้า Seat Booking ได้ทันที