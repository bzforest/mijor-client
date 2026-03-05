import { useBooking } from "@/hooks/useBooking";
import Desktop from "@/components/booking/Desktop";
import Mobile from "@/components/booking/Mobile";

function Booking() {
  const bookingData = useBooking();

  return (
    <>
      <Desktop {...bookingData} />
      <Mobile {...bookingData} />
    </>
  );
}

export default Booking;
