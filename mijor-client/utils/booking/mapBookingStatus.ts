import { BookingUIStatus } from "./bookingStatusConfig"

export function mapBookingStatus(dbStatus: string): BookingUIStatus {
  switch (dbStatus) {
    case "pending":
      return "pay"
    case "confirmed":
      return "paid"
    case "completed":
      return "completed"
    case "cancelled":
      return "cancelled"
    case "refunded":
      return "refunded"
    default:
      return "pay"
  }
}