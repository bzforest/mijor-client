/* ===== Hook: useCountdownTimer ===== */
// Responsibility: Manage countdown timer from seat expiration timestamp

import { useState, useEffect, useRef } from "react";

export const useCountdownTimer = (
  seatExpiresAt: string,
  paymentStatus: string
) => {
  // Calculate initial timeRemaining from seatExpiresAt timestamp
  // Fallback to 900 seconds (15 minutes) if not provided
  const getSecondsRemaining = () => {
    if (!seatExpiresAt) return 900;
    const diff = Math.floor(
      (new Date(seatExpiresAt).getTime() - Date.now()) / 1000,
    );
    return Math.max(0, diff);
  };

  const [timeRemaining, setTimeRemaining] = useState(() =>
    getSecondsRemaining(),
  );
  const hasStartedTimer = useRef(false);

  /* ===== Timer Countdown ===== */
  // Responsibility: Countdown from seatExpiresAt (real timestamp) to sync with seat lock
  useEffect(() => {
    if (paymentStatus === "expired" || paymentStatus === "succeeded") return;

    const tick = () => {
      const remaining = getSecondsRemaining();
      setTimeRemaining(remaining);
    };

    // Update immediately to match real time
    tick();

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [seatExpiresAt, paymentStatus]); // re-run if seatExpiresAt changes (router ready)

  /* ===== Timer State Management ===== */
  // Business rule: Track when timer has started to handle expiration
  useEffect(() => {
    if (timeRemaining > 0) {
      hasStartedTimer.current = true;
    }
  }, [timeRemaining]);

  return {
    timeRemaining,
    hasStartedTimer,
  };
};
