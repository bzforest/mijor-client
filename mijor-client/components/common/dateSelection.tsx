import { useState, useMemo } from "react";
import Tabs from "@/components/ui/Tab";
import { ChevronRight, ChevronLeft } from "lucide-react";

type DateTabItem = {
  id: string;
  label: string;
  subLabel: string;
};

type DateSelectionProps = {
  value?: string;
  onChange?: (date: string) => void;
  selectedDate?: string; 
  onDateSelect?: (date: string) => void;
};

// 💡 2. รับค่า Props (ที่อาจจะมีหรือไม่มีก็ได้)
export default function DateSelection({ value, onChange }: DateSelectionProps{ selectedDate, onDateSelect }: DateSelectionProps) {
  const dateTabs = useMemo((): DateTabItem[] => {
    const days: DateTabItem[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    for (let i = 0; i < 28; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push({
        id: date.toISOString().split("T")[0],
        label: i === 0 ? "Today" : dayNames[date.getDay()],
        subLabel: `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`,
      });
    }
    return days;
  }, []);

  const [startIndex, setStartIndex] = useState(0);
  const visibleTabs = 6;

  // 💡 3. เอา State เดิมของพี่เขากลับมา! (เพื่อเอาไว้สำรอง กรณีเพื่อนไม่ได้ส่ง Props มาให้)
  const [internalDate, setInternalDate] = useState<string>(dateTabs[0].id);

  // 💡 4. ท่าไม้ตาย: ตัวแปรตัดสินใจ (ถ้าไฟล์แม่ส่ง selectedDate มาให้ใช้อันนั้น แต่ถ้าไม่ส่ง ให้ใช้อันสำรอง)
  const activeTabDate = selectedDate !== undefined ? selectedDate : internalDate;

  // 💡 5. ฟังก์ชันจัดการตอนลูกค้ากดเปลี่ยนวัน
  const handleTabChange = (id: string) => {
    setInternalDate(id); // อัปเดตตัวสำรองไว้ก่อนเสมอ
    
    if (onDateSelect) {
      onDateSelect(id); // ถ้าไฟล์แม่ส่งฟังก์ชันมา ให้ฟ้องไฟล์แม่ด้วย!
    }
  };

  const handleNext = () => {
    if (startIndex + visibleTabs < dateTabs.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const [internalActiveDate, setInternalActiveDate] = useState<string>(dateTabs[0].id);
  const activeDate = value !== undefined ? value : internalActiveDate;

  const handleTabChange = (id: string) => {
    setInternalActiveDate(id);
    if (onChange) onChange(id);
  };

  return (
    <>
      <div className="relative flex items-center group w-full">
        {/* ปุ่มลูกศรซ้าย */}
        <div className="absolute left-2 z-10 hidden md:block">
          {startIndex > 0 && (
            <button onClick={handlePrev} className="p-2 transition-all">
              <ChevronLeft size={24} className="text-brand-gray-400" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto no-scrollbar md:overflow-x-auto w-full px-4 md:px-12">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "none"
                  : `translateX(-${startIndex * (100 / visibleTabs)}%)`,
            }}
          >
            {/* 💡 6. โยนตัวแปร "ตัดสินใจแล้ว" ลงไปใน Tabs */}
            <Tabs
              tabs={dateTabs}
              activeTab={activeDate}
              onChange={handleTabChange}
              viewType="date"
            />
          </div>
        </div>

        {/* ปุ่มลูกศรขวา */}
        <div className="absolute right-2 z-10 hidden md:block">
          {startIndex + visibleTabs < dateTabs.length && (
            <button onClick={handleNext} className="p-2 transition-all">
              <ChevronRight size={24} className="text-brand-gray-400" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}