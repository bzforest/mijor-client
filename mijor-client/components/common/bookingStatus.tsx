import { bookingStatusConfig } from "@/utils/booking/bookingStatusConfig"

type Props = {
  status: "pay" | "paid" | "completed" | "cancelled"
}

function BookingStatus({ status }: Props) {
  const config = bookingStatusConfig[status]

  return (
    <div
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        ${config.className}
      `}
    >
      {config.label}
    </div>
  )
}

export default BookingStatus;