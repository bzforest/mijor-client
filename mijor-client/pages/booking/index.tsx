import { useState } from "react";
import Step from "@/components/ui/Step";
import SummaryBox from "@/components/common/summaryBox";
import SeatIcon from "@/components/common/seatIcon";
import Tag from "@/components/ui/Tag";

// ===== Constants & Mock Data =====
const moviesDataMock = [
  {
    id: "3",
    title: "Interstellar",
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9oW0XQlu1lo1G_49M-YwGzKR6rUg-CtflZj07HfbT8d2GwKWg",
    date: "26/06/2024",
    rating: "4.9",
    genre: ["Sci-Fi", "Drama"],
    language: ["EN"],
    remainingTime: "02:10",
    time: "20:15",
    hall: "Hall 2",
    cinema: "SF Cinema City",
  },
];

const seatMockData = [
  {
    row: "E",
    seats: [
      { id: "1", status: "available" },
      { id: "2", status: "available" },
      { id: "3", status: "unavailable" },
      { id: "4", status: "available" },
      { id: "5", status: "available" },
      { id: "6", status: "available" },
      { id: "7", status: "available" },
      { id: "8", status: "available" },
      { id: "9", status: "available" },
      { id: "10", status: "available" },
    ],
    price: 150,
  },
  {
    row: "D",
    seats: [
      { id: "1", status: "available" },
      { id: "2", status: "available" },
      { id: "3", status: "available" },
      { id: "4", status: "available" },
      { id: "5", status: "available" },
      { id: "6", status: "available" },
      { id: "7", status: "available" },
      { id: "8", status: "available" },
      { id: "9", status: "available" },
      { id: "10", status: "available" },
    ],
    price: 180,
  },
  {
    row: "C",
    seats: [
      { id: "1", status: "available" },
      { id: "2", status: "available" },
      { id: "3", status: "pending" },
      { id: "4", status: "pending" },
      { id: "5", status: "available" },
      { id: "6", status: "unavailable" },
      { id: "7", status: "unavailable" },
      { id: "8", status: "available" },
      { id: "9", status: "available" },
      { id: "10", status: "available" },
    ],
    price: 190,
  },
  {
    row: "B",
    seats: [
      { id: "1", status: "unavailable" },
      { id: "2", status: "unavailable" },
      { id: "3", status: "unavailable" },
      { id: "4", status: "available" },
      { id: "5", status: "available" },
      { id: "6", status: "available" },
      { id: "7", status: "unavailable" },
      { id: "8", status: "unavailable" },
      { id: "9", status: "available" },
      { id: "10", status: "unavailable" },
    ],
    price: 200,
  },
  {
    row: "A",
    seats: [
      { id: "1", status: "available" },
      { id: "2", status: "available" },
      { id: "3", status: "unavailable" },
      { id: "4", status: "unavailable" },
      { id: "5", status: "available" },
      { id: "6", status: "available" },
      { id: "7", status: "unavailable" },
      { id: "8", status: "unavailable" },
      { id: "9", status: "pending" },
      { id: "10", status: "available" },
    ],
    price: 220,
  },
];

function Booking() {
  /* ================= State Management ================= */
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  /* ================= Handlers ================= */
  // Responsibility: Toggle seat selection in local state when user clicks an available seat.
  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  /* ================= Derived State ================= */
  // Responsibility: Resolve visual variant for a seat based on its global status and local user selection.
  const getSeatVariant = (status: string, uniqueId: string) => {
    if (selectedSeats.includes(uniqueId)) return "selected";
    if (status === "available") return "available";
    if (status === "unavailable") return "booked";
    if (status === "pending") return "reserved";
    return "available";
  };

  // Responsibility: Calculate total price by matching selected seat IDs (e.g., 'E1') to row pricing in mock data.
  const totalPrice = selectedSeats.reduce((sum, fullSeatId) => {
    const rowLabel = fullSeatId.charAt(0);
    const rowData = seatMockData.find((r) => r.row === rowLabel);
    return sum + (rowData?.price || 0);
  }, 0);

  /* ================= View Logic ================= */
  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="flex justify-center px-[120px] py-[16px] bg-brand-gray-0">
        <Step
          steps={[{ label: "1" }, { label: "2" }, { label: "3" }]}
          currentStep={2}
        />
      </header>

      {/* Body */}
      <section className="flex flex-row h-full px-[120px] py-[80px] gap-[102px] bg-[#101525]">
        
        {/* Screen & Seating Area */}
        <article className="hidden flex-col gap-[60px] w-[793px] md:flex">
          
          {/* Screen */}
          <div className="flex flex-col w-full text-center bg-gradient-to-r from-[#2C344E] to-[#516199] rounded-tl-[80px] rounded-tr-[80px]">
            <span className="text-body-1-bold text-brand-gray-400">screen</span>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col gap-[16px]">
            {seatMockData.map((row) => (
              <div key={row.row} className="flex flex-col">
                <div className="flex justify-between">
                  
                  {/* Left Block (Seats 1-5) */}
                  <div className="flex items-center gap-[24px]">
                    <span className="w-[24px] text-brand-gray-300 text-body-1-bold">
                      {row.row}
                    </span>
                    {row.seats.slice(0, 5).map((seat) => {
                      const uniqueId = `${row.row}${seat.id}`;
                      return (
                        <SeatIcon
                          key={seat.id}
                          variant={getSeatVariant(seat.status, uniqueId)}
                          onClick={
                            seat.status === "available"
                              ? () => toggleSeat(uniqueId)
                              : undefined
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Right Block (Seats 6-10) */}
                  <div className="flex items-center gap-[24px]">
                    {row.seats.slice(5).map((seat) => {
                      const uniqueId = `${row.row}${seat.id}`;
                      return (
                        <SeatIcon
                          key={seat.id}
                          variant={getSeatVariant(seat.status, uniqueId)}
                          onClick={
                            seat.status === "available"
                              ? () => toggleSeat(uniqueId)
                              : undefined
                          }
                        />
                      );
                    })}
                    <span className="w-[24px] text-right text-brand-gray-300 text-body-1-bold">
                      {row.row}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <footer className="flex flex-row py-[16px] gap-[40px] border-t border-brand-gray-100">
            <Tag label="Hall 1" variant="language" />

            <div className="flex flex-row gap-[16px]">
              <SeatIcon variant="available" />
              <div className="flex flex-col justify-between text-body-2">
                <span>Available Seat</span>
                <span>THB 100</span>
              </div>
            </div>

            <div className="flex flex-row items-center gap-[16px] text-body-2">
              <SeatIcon variant="booked" />
              <span>Booked Seat</span>
            </div>

            <div className="flex flex-row items-center gap-[16px] text-body-2">
              <SeatIcon variant="reserved" />
              <span>Reserved Seat</span>
            </div>
          </footer>
        </article>

        {/* Summary Box */}
        <aside>
          <SummaryBox
            title={moviesDataMock[0].title}
            picture={moviesDataMock[0].picture}
            date={moviesDataMock[0].date}
            genre={moviesDataMock[0].genre}
            language={moviesDataMock[0].language.join(", ")}
            time={moviesDataMock[0].time}
            hall={moviesDataMock[0].hall}
            cinema={moviesDataMock[0].cinema}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
          />
        </aside>
      </section>
    </main>
  );
}

export default Booking;
