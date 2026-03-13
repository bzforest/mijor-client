/* ===== Component: BookingDetailsSection ===== */
// Responsibility: Display booking details and payment deadline

interface BookingDetailsSectionProps {
  title: string;
  date: string;
  time: string;
  cinema: string;
  hall: string;
  selectedSeats: string[];
  finalPrice: string;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}

export const BookingDetailsSection = ({
  title,
  date,
  time,
  cinema,
  hall,
  selectedSeats,
  finalPrice,
  timeRemaining,
  formatTime,
}: BookingDetailsSectionProps) => {
  return (
    <section className="bg-brand-gray-100 rounded-xl p-8">
      <h2 className="text-xl font-bold text-white mb-6">
        Booking Details
      </h2>

      <div className="space-y-4">
        <div className="text-white">
          <p className="text-gray-400 text-sm">Movie</p>
          <p className="font-semibold">{title}</p>
        </div>

        <div className="text-white">
          <p className="text-gray-400 text-sm">Date & Time</p>
          <p className="font-semibold">
            {date} at {time}
          </p>
        </div>

        <div className="text-white">
          <p className="text-gray-400 text-sm">Cinema & Hall</p>
          <p className="font-semibold">
            {cinema} - {hall}
          </p>
        </div>

        <div className="text-white">
          <p className="text-gray-400 text-sm">Seats</p>
          <p className="font-semibold">{selectedSeats.join(", ")}</p>
        </div>

        <div className="border-t border-brand-gray-0 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-white">Total Amount</span>
            <span className="text-white font-bold text-lg">
              THB {finalPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg">
        <p className="text-yellow-500 text-sm text-center">
          ⚠️ Please complete payment within {formatTime(timeRemaining)}
        </p>
      </div>
    </section>
  );
};
