import { Check } from "lucide-react";

type MenuSegmentedProps = {
  label: string;
  checked: boolean;
  onClick: () => void;
};

export default function MenuSegmented({
  label,
  checked,
  onClick,
}: MenuSegmentedProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-row items-center
        gap-[8px]
        w-full h-fit
        px-[16px] py-[8px]
        text-body-1-bold whitespace-nowrap
        text-brand-gray-400
        border-gray-100
        cursor-pointer
        ${
          checked
            ? "bg-brand-gray-200 rounded-[4px]"
            : "bg-brand-gray-100"
        }
      `}
    >
      {checked && <Check strokeWidth={1} />}
      {label}
    </button>
  );
}