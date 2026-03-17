import { useState } from "react";
import { useRouter } from "next/router";
import BookingCard from "@/components/common/bookingCard";
import Button from "@/components/ui/Button";
import { mapBookingStatus } from "@/utils/booking/mapBookingStatus";
import SummaryPriceBlock from "@/components/common/summaryPriceBloack";
import { cancelBooking } from "@/services/bookingService";
import Radio from "@/components/ui/Radio";

interface Props {
  booking: any;
  onClose: () => void;
  onCancelled: () => void;
}

export default function BookingDetailModal({
  booking,
  onClose,
  onCancelled,
}: Props) {
  const [mode, setMode] = useState<"detail" | "reason">("detail");
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const cancelReasons = [
    "I had changed my mind",
    "I found an alternative",
    "The booking was created by accident",
    "Other reasons",
  ];

  if (!booking) return null;

  const dateObj = new Date(booking.start_time);

  const showtimeDate = new Date(booking.start_time);
  const diffMs = showtimeDate.getTime() - Date.now();
  const diffMinutes = diffMs / 1000 / 60;
  const canCancelByPolicy = diffMinutes > 30;

  const canCancel = booking.status === "confirmed" && canCancelByPolicy;

  const handleConfirmCancel = async () => {
    try {
      setLoading(true)
      await cancelBooking(booking.booking_id, reason || "")

      router.push(`/booking/cancel-success?bookingId=${booking.booking_id}`);
    } catch (e) {
      console.error("Cancel failed", e);
      alert("Cancel failed");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose()}
      />

      {/* modal card */}
      <div
        className="
          relative
          bg-[#111827]
          w-[768px]
          rounded-xl
          shadow-2xl
          p-6
          z-10
        "
      >
        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-headline-4 text-center w-full">
            Booking Detail
          </h2>

          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* content */}
        {mode === "detail" && (
          <div className="flex flex-col gap-6 items-center w-full">
            <BookingCard
              title={booking.title || ""}
              picture={booking.poster_url || ""}
              cinema="Major Cineplex"
              hall="Hall 1"
              date={booking.start_time}
              time={dateObj.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              bookingNo={(booking.booking_id || "").slice(0, 8).toUpperCase()}
              bookedDate={booking.created_at}
              tickets={booking.seats?.length || 0}
              selectedSeat={booking.seats?.join(", ") || "-"}
              paymentMethod={booking.payment_method || "Credit card"}
              status={mapBookingStatus(booking.status)}
              variant="desktop"
            />

            <div className="flex flex-row justify-between w-[691px]">
              <div className="w-1/2">
                <SummaryPriceBlock
                  tickets={booking.seats?.length || 0}
                  subtotal={booking.subtotal}
                  discount={booking.discount}
                  total={booking.total_price}
                />
              </div>

              <div className="w-1/2 flex flex-col justify-end items-end">
                <Button
                  variant="secondary"
                  state={canCancel ? "default" : "disabled"}
                  onClick={() => {
                    if (!canCancel) return
                    setMode("reason")
                  }}
                >
                  Cancel booking
                </Button>

                {!canCancelByPolicy && (
                  <p className="text-red-400 text-sm mt-2">
                    Cannot cancel within 30 minutes before showtime
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {mode === "reason" && (
          <div className="flex gap-6">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-white text-body-1">
                Reason for cancellation
              </h3>

              <div className="flex flex-col text-body-2 text-gray-400 gap-4">
                {cancelReasons.map((r) => (
                  <Radio
                    key={r}
                    name="cancel-reason"
                    label={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                ))}
              </div>

              <div className="flex justify-between mt-6 w-full">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMode("detail");
                    setReason(null);
                  }}
                >
                  Back
                </Button>
              </div>
            </div>

            {/* RIGHT summary */}
            <div className="w-[300px] flex flex-col justify-between">
              <SummaryPriceBlock
                tickets={booking.seats?.length || 0}
                subtotal={booking.subtotal}
                discount={booking.discount}
                total={booking.total_price}
              />

              <div className="self-end">
                <Button
                  variant="primary"
                  state={reason || loading ? "default" : "disabled"}
                  onClick={handleConfirmCancel}
                >
                  {loading ? "Cancelling..." : "Confirm cancel"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
