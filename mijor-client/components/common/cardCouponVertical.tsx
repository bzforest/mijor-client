"use client";

/* ===== Imports ===== */
import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "@/contexts/AuthContext";
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
  userCoupons?: {
    coupon_id: string
    is_used: boolean
  }[]
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
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoTitle, setInfoTitle] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const { user , navigateToLogin } = useAuth();

  /* ===== Derived State ===== */
  const collectedCoupon = userCoupons?.find(
  (c) => c.coupon_id === coupon_id
);

const isUsed = collectedCoupon?.is_used;
const hasCoupon = !!collectedCoupon;

  /* ===== Event Handlers ===== */
const handleClick = async () => {
    if (!user) {
      setIsOpen(true);
      return;
    }

    if (isUsed) {
      setInfoTitle("Coupon used");
      setInfoMessage("This coupon has already been used");
      setInfoModalOpen(true);
      return;
    }

    try {
      const result = await saveCoupon(coupon_id || "");

      if (result.success) {
        setIsCollected(true);

        if (onCouponSaved) {
          await onCouponSaved();
        }
        setInfoTitle("Success");
        setInfoMessage("Coupon collected successfully");
        setInfoModalOpen(true);
        return;
      }

      if (result.message === "Coupon already saved") {
      setIsCollected(true);

      setInfoTitle("Already collected");
      setInfoMessage("You already have this coupon");
      setInfoModalOpen(true);
      return;
    }

      setInfoTitle("Error");
      setInfoMessage(result.message);
      setInfoModalOpen(true);

    } catch (error) {
      setInfoTitle("Error");
      setInfoMessage("Something went wrong");
      setInfoModalOpen(true);
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
          {isUsed ? (
            <Button variant="secondary" disabled className="w-full">
              Used
            </Button>
          ) : hasCoupon || isCollected ? (
            <Button
              variant="secondary"
              onClick={onClick}
              className="w-full"
            >
              View details
            </Button>
          ) : (
            <Button onClick={handleClick} className="w-full">
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
        onSecondaryAction={navigateToLogin}
      >
        Please log in to get this coupon.
      </Modal>

      {/* Already Coupons */}
      <Modal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title={infoTitle}
        primaryActionButton="OK"
        onPrimaryAction={() => setInfoModalOpen(false)}
        className="max-w-md"
      >
        {infoMessage}
      </Modal>
    </article>
  );
}
