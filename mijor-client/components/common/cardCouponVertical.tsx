"use client";

/* ===== Imports ===== */
import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "@/context/AuthContext";
import router from "next/router";
import { saveCoupon } from "@/services/couponService";

/* ===== Type Definitions ===== */
type CardCouponVerticalProps = {
  imageSrc: string;
  title: string;
  validUntil: string;
  className?: string;
  onClick?: () => void;
  coupon_id?: string;
  userCoupons?: string[];
  onCouponSaved?: () => Promise<void>;
};

/* ===== Component ===== */
export default function CardCouponVertical({
  imageSrc,
  title,
  validUntil,
  className = "",
  onClick,
  coupon_id,
  userCoupons,
  onCouponSaved,
}: CardCouponVerticalProps) {
  /* ===== State ===== */
  const [isCollected, setIsCollected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  /* ===== Derived State ===== */
  const hasCoupon = userCoupons?.includes(coupon_id || "");

  /* ===== Event Handlers ===== */
  const handleClick = async () => {
    if (!user) {
      setIsOpen(true);
      return;
    }

    try {
      const result = await saveCoupon(coupon_id || '');
      
      if (result.success) {
        setIsCollected(true);
        // Refresh parent component's user coupons list
        if (onCouponSaved) {
          await onCouponSaved();
        }
      } else {
        console.error('Save coupon failed:', result.message);
        // TODO: Implement proper error handling UI
        setIsCollected(true);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      // TODO: Implement proper error handling UI
      setIsCollected(true);
    }
  };

  const handleClose = () => {
    setIsCollected(false);
    setIsOpen(false);
  };

  /* ===== Render ===== */
  return (
    <article
      className={`
        flex flex-col justify-between
        overflow-hidden
        transition-all duration-200

        /* Mobile */
        w-[161px] min-h-[337px] rounded-[6px]

        /* Desktop */
        md:w-[285px] md:min-h-[477px] md:rounded-[8px]

        bg-brand-gray-800
        ${className}
      `}
    >
      {/* ===== Coupon Image ===== */}
      <img
        src={imageSrc}
        alt={title}
        className="w-[161px] h-[161px] md:w-[285px] md:h-[285px] rounded-[6px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
        onClick={onClick}
      />

      <div className="p-[24px] pt-[16px]">
        {/* ===== Content Section ===== */}
        <div className="mt-[12px] md:mt-[16px]">
          <h3
            className="
            font-bold text-white
            text-xs md:text-base
            leading-snug
            hover:underline
            cursor-pointer
          "
            onClick={onClick}
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

        {/* ===== Action Section ===== */}
        <div className="mt-[12px] md:mt-[14px]">
          {isCollected || hasCoupon ? (
            <Button
              variant="secondary"
              onClick={onClick}
              className="w-full text-xs md:text-size-body-1"
            >
              View details
            </Button>
          ) : (
            <Button
              onClick={handleClick}
              className="w-full text-xs md:text-size-body-1"
            >
              Get coupon
            </Button>
          )}
        </div>
      </div>
      
      {/* ===== Login Modal ===== */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create an account to continue"
        primaryActionButton="Sign up"
        secondaryActionButton="Log in"
        onPrimaryAction={() => router.push("/register")}
        onSecondaryAction={() => router.push("/login")}
      >
        Please log in to get this coupon.
      </Modal>
    </article>
  );
}
