/* ===== Hook: useUserCoupons ===== */
// Responsibility: Load and manage user coupons

import { useState, useEffect } from "react";
import { fetchUserCoupons, UserCoupon } from "@/services/couponService";

export const useUserCoupons = () => {
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);

  /* ================= Load User Coupons ================= */
  // Business rule: Load available coupons on component mount
  useEffect(() => {
    const loadUserCoupons = async () => {
      try {
        const coupons = await fetchUserCoupons();
        setUserCoupons(coupons);
      } catch (error) {
        console.error("Failed to fetch user coupons:", error);
      }
    };
    loadUserCoupons();
  }, []);

  return {
    userCoupons,
  };
};
