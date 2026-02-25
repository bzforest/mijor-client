// icon
import { Notebook, UserRound, RotateCcw, TicketPercent } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuSidebar = [
    {
        icon: Notebook,
        label: "Booking history",
        href: "/component",
    },
    {
        icon: TicketPercent,
        label: "My coupons",
        href: "/coupons",
    },
    {
        icon: UserRound,
        label: "Profile",
        href: "/profile",
    },
    {
        icon: RotateCcw,
        label: "Reset password",
        href: "/reset-password",
        iconClassName: "scale-x-[-1] rotate-[135deg]",
    },
];

function MenuSidebar() {
    const pathname = usePathname();

    return (
        <div
            className="
                flex flex-col
                gap-[8px]
                px-[16px] pt-[16px] pb-[24px]
                w-[285px]
                bg-brand-gray-0
                rounded-[8px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.5)]
            "
        >
            {menuSidebar.map((item) => {
                const Icon = item.icon;

                /* ================= Active Route Check ================= */
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            flex items-center
                            gap-[12px]
                            p-[16px]
                            rounded-[4px]
                            ${isActive
                                ? "bg-brand-gray-100"
                                : "hover:bg-brand-gray-200"
                            }
                        `}
                    >
                        <Icon
                            strokeWidth={0.5}
                            className={item.iconClassName}
                        />

                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}

export default MenuSidebar;