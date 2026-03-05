"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Button from "../ui/Button";

interface CardCouponHorizontalProps {
  id?: string;
  couponImage: string;
  title: string;
  validDate: string;
  onSelect?: () => void;
}

export default function CardCouponHorizontal({
  id,
  couponImage,
  title,
  validDate,
  onSelect,
}: CardCouponHorizontalProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);
    if (onSelect) onSelect();
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex cursor-pointer overflow-hidden
        transition-all duration-200
        bg-brand-gray-0/80

        /* Desktop */
        md:w-[464px] md:h-[174px] md:rounded-[8px]

        /* Mobile */
        w-[311px] h-[96px] rounded-[4px]

        ${
          selected
            ? "bg-brand-gray-200 border-brand-gray-400"
            : "bg-brand-gray-900 border-white/20"
        }
      `}
    >
      {/* Left Image */}
      <div className="relative shrink-0 
        md:w-[174px] md:h-full
        w-[96px] h-full"
      >
        <Image
          src={couponImage}
          alt="coupon"
          fill
          className="object-cover"
        />
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-between p-3 md:p-4 flex-1">
        <div>
          <h3 className="text-white font-semibold text-left
            md:text-base text-xs leading-snug"
          >
            {title}
          </h3>

          <p className="text-gray-300 text-left
            md:text-sm text-[10px] mt-1 md:mt-2"
          >
            Valid until {validDate}
          </p>
        </div>

        <Button
          variant="text"
          className="cursor-pointer"
          onClick={() => router.push(`/coupons/${id}`)}
        >
          View details
        </Button>
      </div>
    </div>
  );
}