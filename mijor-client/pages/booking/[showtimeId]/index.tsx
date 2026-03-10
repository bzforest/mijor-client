import { useBooking } from "@/hooks/useBooking";
import Desktop from "@/components/booking/Desktop";
import Mobile from "@/components/booking/Mobile";
import LoadingPage from "@/components/loading/LoadingPage";

function Booking() {
  const bookingData = useBooking();

  if (!bookingData.movieInfo || bookingData.seats.length === 0) {
    return <LoadingPage />;
  }

  return (
    <>
      <Desktop {...bookingData} />
      <Mobile {...bookingData} />
    </>
  );
}

export default Booking;
