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
        <div
            className="
        flex flex-col
        min-[375px]:flex-row
        p-1
        w-auto
        bg-brand-gray-100
        rounded-[4px]
    "
        >
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
