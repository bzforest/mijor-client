import { Check } from 'lucide-react';

type MenuSegmentedProps = {
    label: string;
    checked: boolean;
    onClick: () => void;
};

export default function MenuSegmented({
    onClick,
    checked,
    label,
}: MenuSegmentedProps) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-row items-center gap-[8px] px-[16px] py-[8px] border-gray-100 h-fit
             cursor-pointer 
             ${checked 
                ? 'bg-brand-gray-200 rounded-[4px]' 
                : 'bg-brand-gray-100'}
            `}
            type='button'
        >
            {checked && <Check strokeWidth={1} />}
            {label}
        </button>
    );
}
