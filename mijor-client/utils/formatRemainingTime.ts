/* ===== Utility: formatRemainingTime ===== */
// Responsibility: Format time display for countdown timers

/* ================= Format Remaining Time ================= */
// Business rule: Convert seconds to MM:SS format with leading zeros
export const formatRemainingTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};