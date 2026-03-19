import { api } from "@/lib/booking/api";

export const cancelBooking = async (
  bookingId: string,
  reason?: string
) => {
  const res = await api.post(`/${bookingId}/cancel`, {
    reason,
  });

  return res.data;
};