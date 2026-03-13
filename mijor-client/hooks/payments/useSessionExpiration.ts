/* ===== Hook: useSessionExpiration ===== */
// Responsibility: Handle session expiration and modal state

import { useState, useEffect, useRef } from "react";

export const useSessionExpiration = (
  remainingTime: number,
  paymentSuccess: boolean
) => {
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState<boolean>(false);
  const hasStartedTimer = useRef(false);

  /* ================= Timer State Management ================= */
  // Business rule: Track when timer has started to handle expiration
  useEffect(() => {
    if (remainingTime > 0) {
      hasStartedTimer.current = true;
    }
  }, [remainingTime]);

  // Business rule: Show expiration modal when timer reaches zero
  useEffect(() => {
    if (remainingTime === 0 && hasStartedTimer.current && !paymentSuccess) {
      setIsExpiredModalOpen(true);
    }
  }, [remainingTime, paymentSuccess]);

  return {
    isExpiredModalOpen,
    setIsExpiredModalOpen,
  };
};
