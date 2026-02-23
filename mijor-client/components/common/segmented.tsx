import MenuSegmented from './menuSegmented';

type SegmentedOption = {
    label: string;
};

type SegmentedProps = {
    options: SegmentedOption[];
    checked: boolean;
    onClick: () => void;
};

export default function Segmented({
    options,
    checked,
    onClick,
}: SegmentedProps) {
    return (
        <div className="flex flex-row p-[4px] bg-brand-gray-100 rounded-[4px] w-fit">
            {options.map((option, index) => (
                <MenuSegmented
                    key={index}
                    label={option.label}
                    checked={index === 0 ? !checked : checked}
                    onClick={onClick}
                />
            ))}
        </div>
    );
}
