interface TagProps {
    label: string;
    variant: "genre" | "language";
    textType?: string;
}

function Tag({ label, variant, textType = "body-2-bold" }: TagProps) {
    return (
        <div
            className="
                flex
                items-center
                justify-center
                w-auto
                h-full
                px-[12px] py-[6px]
                bg-brand-gray-100
                rounded-[4px]
            "
        >
            <span
                className={`
                    text-${textType}
                    ${
                        variant === "genre"
                            ? "text-brand-gray-300"
                            : "text-brand-gray-400"
                    }
                `}
            >
                {label}
            </span>
        </div>
    );
}


export default Tag;