"use client";

import Image from "next/image";
import { useState } from "react";

interface CardCouponHorizontalProps {
  couponImage: string;
  title: string;
  validDate: string;
  onSelect?: () => void;
}

export default function CardCouponHorizontal({
  couponImage,
  title,
  validDate,
  onSelect,
}: CardCouponHorizontalProps) {
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
        border

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
          <h3 className="text-white font-semibold 
            md:text-base text-xs leading-snug"
          >
            {title}
          </h3>

          <p className="text-gray-300 
            md:text-sm text-[10px] mt-1 md:mt-2"
          >
            Valid until {validDate}
          </p>
        </div>

        <div className="flex items-center gap-2 text-white 
          md:text-sm text-[10px] font-medium"
        >
          <span className="underline">View details</span>
          <span>›</span>
        </div>
      </div>
    </div>
  );
}