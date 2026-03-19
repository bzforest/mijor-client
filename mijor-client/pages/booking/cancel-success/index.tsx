import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive"
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import formatDate from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import Button from "@/components/ui/Button";
import BookingCard from "@/components/common/bookingCard";
import LoadingPage from "@/components/loading/LoadingPage";
import { api } from "@/lib/booking/api";

export default function CancelSuccess() {
  const router = useRouter();
  const { bookingId } = router.query;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    if (!bookingId) return;

    const loadBooking = async () => {
      try {
        const res = await api.get(`/${bookingId}`);
        setBooking(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return <LoadingPage />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Booking not found
      </div>
    );
  }

  const date = formatDate(booking.start_time);
  const time = formatTime(booking.start_time);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10">
      <div className="flex flex-col gap-10 items-center">
        {/* Success Icon */}
        <div className="text-green-400">
          <CheckCircle size={64} />
        </div>

        <h1 className="text-white md:text-headline-2 text-headline-3 font-bold">
          Cancellation successful
        </h1>

        <p className="text-gray-400 text-body-2 text-center max-w-md">
          The cancellation is complete.
          <br />
          You will receive an email with a detail and refund within 48 hours.
        </p>

        <p className="text-body-1 text-center">
          {" "}
          Total refund THB {booking.total_price}
        </p>

        <BookingCard
          title={booking.title}
          picture={booking.poster_url}
          cinema="Major Cineplex"
          hall="Hall 1"
          date={date}
          time={time}
          bookingNo={(booking.booking_id || "").slice(0, 8).toUpperCase()}
          bookedDate={booking.created_at}
          tickets={booking.seats?.length || 0}
          selectedSeat={booking.seats?.join(", ") || "-"}
          paymentMethod={booking.payment_method}
          status={booking.status}
          variant={isMobile ? "mobile" : "desktop"} 
        />

        <Button variant="primary" className="cursor-pointer" onClick={() => router.back()}>
          Back to booking history
        </Button>
      </div>
    </div>
  );
}
