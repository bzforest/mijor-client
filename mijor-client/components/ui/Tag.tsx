interface TagProps {
    label: string;
    variant: "genre" | "language";
}

function Tag({ label, variant }: TagProps) {
    return (
        <div
            className="
                flex
                items-center
                justify-center
                w-auto
                px-[12px] py-[6px]
                bg-brand-gray-100
                rounded-[4px]
                
            "
        >
            <span
                className={`
                    text-body-2-bold
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