"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type CardCouponVerticalProps = {
  imageSrc: string;
  title: string;
  validUntil: string;
  className?: string;
};

export default function CardCouponVertical({
  imageSrc,
  title,
  validUntil,
  className = "",
}: CardCouponVerticalProps) {
  const [isCollected, setIsCollected] = useState(false);

  const handleClick = () => {
    setIsCollected(true);
  };

  return (
    <div
      className={`
        flex flex-col justify-between
        overflow-hidden
        transition-all duration-200

        /* Mobile */
        w-[161px] min-h-[337px] rounded-[6px] p-[12px]

        /* Desktop */
        md:w-[285px] md:min-h-[477px] md:rounded-[8px] md:p-[16px]

        bg-brand-gray-800
        ${className}
      `}
    >
      {/* Image */}
      <img
        src={imageSrc}
        alt="coupon"
        className="w-full h-auto rounded-[6px] object-cover"
      />

      {/* Content */}
      <div className="mt-[12px] md:mt-[16px]">
        <h3
          className="
            text-white font-semibold
            text-xs md:text-base
            leading-snug
          "
        >
          {title}
        </h3>

        <p
          className="
            text-brand-gray-400
            text-[10px] md:text-sm
            mt-1 md:mt-2
          "
        >
          Valid until {validUntil}
        </p>
      </div>

      {/* Button */}
      <div className="mt-[12px] md:mt-[14px]">
        <Button
          variant={isCollected ? "secondary" : "primary"}
          onClick={handleClick}
          className="w-full text-xs md:text-size-body-1"
        >
          {isCollected ? "View details" : "Get coupon"}
        </Button>
      </div>
    </div>
  );
}