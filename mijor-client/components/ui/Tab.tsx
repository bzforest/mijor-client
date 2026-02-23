type TabItem = {
  id: string;
  label: string;
  subLabel?: string;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  viewType?: "default" | "date";
};

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  viewType = "default",
}: TabsProps) {
  return (
    <div
      className={`flex w-full flex-nowrap ${viewType === "default" ? "gap-8" : "gap-2 md:gap-0"}`}
    >
      {tabs &&
        tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          const dateModeStyles = isActive
            ? "bg-brand-gray-100/50 rounded-sm" // พื้นหลังสำหรับโหมด Date
            : "hover:bg-brand-gray-100/10 rounded-sm";

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
              relative flex flex-col items-center justify-center transition-all duration-200
              shrink-0 whitespace-nowrap
              ${viewType === "date" 
                ? "min-w-[100px] md:w-[16.666%] py-3 px-4" 
                : "min-w-fit pb-4 px-4"
              }
              ${viewType === "date" ? dateModeStyles : ""}
              ${isActive ? "text-white" : "text-brand-gray-300 hover:text-brand-gray-400"}
            `}
            >
              {/* ข้อความหลัก */}
              <span className="text-heading-3 font-bold leading-tight">
                {tab.label}
              </span>
              {/* ข้อความรอง มีหรือไม่มีก็ได้ */}
              {tab.subLabel && (
                <span
                  className={`text-body-2 ${isActive ? "text-brand-gray-400" : "text-brand-gray-500"}`}
                >
                  {tab.subLabel}
                </span>
              )}
              {/* เส้นขีดด้านล่าง แสดงเฉพาะโหมด default */}
              {viewType === "default" && isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] border-b border-brand-gray-200 rounded-lg" />
              )}
            </button>
          );
        })}
    </div>
  );
}
