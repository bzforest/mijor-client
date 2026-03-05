function formatMyDate(dateInput: string | undefined | null): string {
  if (!dateInput) return "";

  // If it's already in a human-readable format like "1 Mar 2026", don't format it again
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (months.some((m) => dateInput.includes(m))) return dateInput;

  try {
    // Try parsing as ISO date first (e.g., "2026-03-01 18:00:00+00")
    const date = new Date(dateInput);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  } catch {}

  // Fallback for custom formats like DD/MM/YYYY
  const parts = dateInput.split("/");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const monthName = months[parseInt(m) - 1];
    if (monthName) return `${d} ${monthName} ${y}`;
  }

  return dateInput;
}

export default formatMyDate;
