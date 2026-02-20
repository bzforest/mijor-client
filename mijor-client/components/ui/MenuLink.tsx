interface MenuLinkProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    variant?: "default" | "selected";
}

function MenuLink({
    icon,
    label,
    onClick,
    variant = "default",
}: MenuLinkProps) {
    const style =
        variant === "default"
            ? "bg-brand-gray-0 hover:bg-brand-gray-100 cursor-pointer active:bg-brand-gray-0"
            : "bg-brand-gray-100";

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={variant === "selected"}
            className={`
                flex items-center gap-[12px]
                p-[16px]
                rounded-[4px]
                ${style}
            `}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

export default MenuLink;
