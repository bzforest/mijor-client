// icon
import { Notebook, UserRound, RotateCcw, TicketPercent } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuSidebar = [
  {
    icon: Notebook,
    label: "Booking history",
    href: "/user-manage/booking-history",
  },
  {
    icon: TicketPercent,
    label: "My coupons",
    href: "/user-manage/my-coupons", // ✅ แก้ตรงนี้
  },
  {
    icon: UserRound,
    label: "Profile",
    href: "/user-manage/profile",
  },
  {
    icon: RotateCcw,
    label: "Reset password",
    href: "/user-manage/reset-password",
    iconClassName: "scale-x-[-1] rotate-[135deg]",
  },
];

function MenuSidebar() {
    const pathname = usePathname();

    return (
        <>
          {/* ================= Desktop Sidebar ================= */}
          <div
            className="
              hidden md:flex
              flex-col
              gap-[8px]
              px-[16px] pt-[16px] pb-[24px]
              w-[285px]
              bg-brand-gray-0
              rounded-[8px] shadow-[4px_4px_30px_0px_rgba(0,0,0,0.5)]
            "
          >
            {menuSidebar.map((item) => {
              const Icon = item.icon;
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
                    transition
                    ${
                      isActive
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
      
          {/* ================= Mobile Horizontal Menu ================= */}
          <div
            className="
        md:hidden
        flex
        gap-4
        overflow-x-auto
        pb-4
        px-4
            "
          >
            {menuSidebar.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
      
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                  flex items-center justify-center
                  gap-2
                  px-8 py-5
                  rounded-xl
                  whitespace-nowrap
                  transition-all duration-200
                    ${
                      isActive
                        ? "bg-brand-gray-100"
                        : "bg-brand-gray-0 hover:bg-brand-gray-200"
                    }
                  `}
                >
                  <Icon
                    strokeWidth={2}
                    size={24}
                    className={item.iconClassName}
                  />
                  <span className="text-base font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </>
      );
}

export default MenuSidebar;