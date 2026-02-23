type TabItem = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
};

export default function  Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-8 border-b border-brand-gray-100/20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative pb-4 text-[24px] font-bold transition-all
              ${isActive ? "text-white" : "text-brand-gray-300 hover:text-brand-gray-400"}
            `}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-gray-200 rounded-lg" />
            )}
          </button>
        );
      })}
    </div>
  );
}
