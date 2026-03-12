/* ===== Hook: useCouponValidation ===== */
// Responsibility: Handle coupon validation and price calculation

import { useState, useEffect } from "react";
import { UserCoupon } from "@/services/couponService";

type AlertConfig = {
  type: "error" | "success";
  title: string;
  message: string;
};

export const useCouponValidation = (
  totalPrice: number,
  userCoupons: UserCoupon[]
) => {
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number>(totalPrice);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  /* ================= Price Calculation & Coupon Validation ================= */
  // Business rule: Reset price when no coupon selected
  useEffect(() => {
    if (!selectedCouponId) {
      setFinalPrice(totalPrice);
    }
  }, [totalPrice, selectedCouponId]);

  // Business rule: Validate and apply coupon discount
  useEffect(() => {
    const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);

    if (!selectedCoupon || !selectedCoupon.coupons) {
      setFinalPrice(totalPrice);
      return;
    }

    const {
      discount_type,
      discount_value,
      min_purchase,
      valid_until,
      is_active,
    } = selectedCoupon.coupons;

    // Business rule: Check coupon expiration
    if (new Date(valid_until) < new Date()) {
      setAlertConfig({
        type: "error",
        title: "Coupon Expired",
        message: "This coupon is no longer valid. Please check for other available offers.",
      });
      setSelectedCouponId("");
      setFinalPrice(totalPrice);
      return;
    }

    // Business rule: Check coupon activation status
    if (is_active === false) {
      setAlertConfig({
        type: "error",
        title: "Coupon Inactive",
        message: "This coupon is currently not available for use.",
      });
      setSelectedCouponId("");
      setFinalPrice(totalPrice);
      return;
    }

    // Business rule: Check minimum purchase requirement
    if (totalPrice < min_purchase) {
      setAlertConfig({
        type: "error",
        title: "Minimum Purchase Required",
        message: `The minimum purchase for this coupon is ${min_purchase} baht.`,
      });
      setSelectedCouponId("");
      setFinalPrice(totalPrice);
      return;
    }

    // Business rule: Calculate discount based on type
    let discount = 0;
    switch (discount_type) {
      case "discount_percentage":
        discount = (totalPrice * discount_value) / 100;
        break;
      case "discount_amount":
        discount = discount_value;
        break;
      case "fixed_price":
        setFinalPrice(Math.max(0, discount_value));
        return;
      case "free_ticket":
      case "free_item":
        setFinalPrice(0);
        return;
      case "buy_one_get_one":
        discount = totalPrice / 2;
        break;
      default:
        discount = 0;
    }

    setFinalPrice(Math.max(0, totalPrice - discount));
  }, [selectedCouponId, totalPrice, userCoupons]);

  // Business rule: Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (!alertConfig) return;
    const timer = setTimeout(() => setAlertConfig(null), 5000);
    return () => clearTimeout(timer);
  }, [alertConfig]);

  return {
    selectedCouponId,
    setSelectedCouponId,
    finalPrice,
    alertConfig,
    setAlertConfig,
  };
};
