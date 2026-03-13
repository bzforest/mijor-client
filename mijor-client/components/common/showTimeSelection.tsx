import Button from "@/components/ui/Button";

type Schedule = {
  id: string;
  time: string; // รูปแบบ "HH:mm" เช่น "11:30"
  isAvailable?: boolean; // ถ้ากำหนดไว้จะใช้แทน logic เวลา (สำหรับกรณีวันอื่นที่ไม่ใช่วันนี้)
};

type TimeSelectionProps = {
  schedules: Schedule[];
  onSelect: (schedule: Schedule) => void;
};

export default function TimeSelection({
  schedules,
  onSelect,
}: TimeSelectionProps) {
  const getButtonStatus = (schedule: Schedule) => {
    // ถ้า parent กำหนด isAvailable ไว้แล้ว ใช้ค่านั้นเลย (กรณีวันอื่นที่ไม่ใช่วันนี้)
    if (schedule.isAvailable === false) {
      return { variant: "secondary" as const, state: "disabled" as const };
    }
    if (schedule.isAvailable === true) {
      return { variant: "primary" as const, state: "hover" as const };
    }

    // Fallback: ใช้ logic เวลาเดิม (กรณีวันนี้ หรือไม่ได้กำหนด isAvailable)
    const now = new Date();
    // 1. แปลงเวลาปัจจุบันเป็นนาทีรวมของวัน
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // 2. แปลงเวลารอบหนังเป็นนาทีรวมของวัน
    const [hours, minutes] = schedule.time.split(":").map(Number);
    const movieTime = hours * 60 + minutes;

    // --- LOGIC สถานะ ---

    // เงื่อนไขที่ 1: ผ่านช่วงเวลามาแล้ว (เวลาปัจจุบัน > เวลารอบหนัง)
    if (currentTime > movieTime) {
      return { variant: "secondary" as const, state: "disabled" as const };
    }

    // เงื่อนไขที่ 2: อยู่ในช่วงเวลา (สมมติว่าหนังฉายอยู่ภายใน 120 นาทีหลังจากเริ่ม)
    const diff = currentTime - movieTime;

    if (diff >= -30 && diff <= 120) {
      return { variant: "primary" as const, state: "default" as const };
    }

    // เงื่อนไขที่ 3: ยังไม่ถึงช่วงเวลา (เวลาปัจจุบัน < เวลารอบหนัง)
    return { variant: "primary" as const, state: "hover" as const };
  };

  return (
    <div className="flex flex-wrap gap-6 bg-brand-gray-0 rounded-xl">
      {schedules.map((item) => {
        const { variant, state } = getButtonStatus(item);

        return (
          <Button
            key={item.id}
            variant={variant}
            state={state}
            onClick={() => state !== "disabled" && onSelect(item)}
            className="min-w-30 cursor-pointer"
          >
            {item.time}
          </Button>
        );
      })}
    </div>
  );
}
