/* ===== Hook: usePaymentIntent ===== */
// Responsibility: Manage Stripe payment intent creation and state

import { useState } from "react";
import axios from "axios";
import { ShowtimeInfo } from "@/types/booking";
import { UserCoupon } from "@/services/couponService";

export const usePaymentIntent = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isCreatingIntent, setIsCreatingIntent] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);

  /* ================= Create Payment Intent ================= */
  // Business rule: Create or reuse existing payment intent
  const createPaymentIntent = async (
    finalPrice: number,
    totalPrice: number,
    selectedCouponId: string,
    userCoupons: UserCoupon[],
    movieInfo: ShowtimeInfo | null
  ): Promise<string | null> => {
    if (clientSecret) return clientSecret;

    setIsCreatingIntent(true);
    try {
      const roundedAmount = Math.round(finalPrice * 100) / 100;
      const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);
      const actualCouponId = selectedCoupon?.coupons?.id || "";

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-payment-intent`,
        {
          amount: roundedAmount,
          bookingId: movieInfo?.title || "booking",
          totalPrice: Math.round(totalPrice * 100) / 100,
          selectedCouponId: actualCouponId,
        }
      );

      const data = response.data;

      if (data.success && data.clientSecret) {
        setClientSecret(data.clientSecret);
        if (data.isFree) setIsFree(true);
        return data.clientSecret;
      } else {
        throw new Error(data.message || "Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      throw new Error("Failed to initialize payment. Please try again.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  return {
    clientSecret,
    isCreatingIntent,
    isFree,
    createPaymentIntent,
  };
};
