export type BookingUIStatus =
  | "pay"
  | "paid"
  | "completed"
  | "cancelled"
  | "refunded"

export const bookingStatusConfig: Record<
  BookingUIStatus,
  {
    label: string
    className: string
  }
> = {
  pay: {
    label: "Waiting for payment",
    className: "bg-yellow-500 text-black",
  },
  paid: {
    label: "Paid",
    className: "bg-green-500 text-white",
  },
  completed: {
    label: "Completed",
    className: "border border-brand-gray-300 text-brand-gray-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "border border-red-500 text-red-400",
  },
  refunded: {
    label: "Refunded",
    className: "border border-blue-400 text-blue-400",
  },
}