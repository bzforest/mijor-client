import { useState } from "react";
import router from "next/router";
import Step from "@/components/ui/Step";
import SummaryBox from "@/components/common/summaryBox";
import SeatIcon from "@/components/common/seatIcon";
import Tag from "@/components/ui/Tag";
import Navbar from "@/components/common/navbar";

// ===== Constants & Mock Data =====
const moviesDataMock = {
  id: "3",
  title: "Interstellar",
  picture:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9oW0XQlu1lo1G_49M-YwGzKR6rUg-CtflZj07HfbT8d2GwKWg",
  date: "26/06/2024",
  rating: "4.9",
  genre: ["Sci-Fi", "Drama"],
  language: ["EN"],
  time: "20:15",
  cinema: "SF Cinema City",
  hall: "Hall 2",
  basePrice: 150,
};

const seatMockData = {
  rows: [
    {
      row: "E",
      seats: [
        { seat_number: 1, status: "available" },
        { seat_number: 2, status: "available" },
        { seat_number: 3, status: "unavailable" },
        { seat_number: 4, status: "available" },
        { seat_number: 5, status: "available" },
        { seat_number: 6, status: "available" },
        { seat_number: 7, status: "available" },
        { seat_number: 8, status: "available" },
        { seat_number: 9, status: "available" },
        { seat_number: 10, status: "available" },
      ],
    },
    {
      row: "D",
      seats: [
        { seat_number: 1, status: "available" },
        { seat_number: 2, status: "available" },
        { seat_number: 3, status: "available" },
        { seat_number: 4, status: "available" },
        { seat_number: 5, status: "available" },
        { seat_number: 6, status: "available" },
        { seat_number: 7, status: "available" },
        { seat_number: 8, status: "available" },
        { seat_number: 9, status: "available" },
        { seat_number: 10, status: "available" },
      ],
    },
    {
      row: "C",
      seats: [
        { seat_number: 1, status: "available" },
        { seat_number: 2, status: "available" },
        { seat_number: 3, status: "pending" },
        { seat_number: 4, status: "pending" },
        { seat_number: 5, status: "available" },
        { seat_number: 6, status: "unavailable" },
        { seat_number: 7, status: "unavailable" },
        { seat_number: 8, status: "available" },
        { seat_number: 9, status: "available" },
        { seat_number: 10, status: "available" },
      ],
    },
    {
      row: "B",
      seats: [
        { seat_number: 1, status: "unavailable" },
        { seat_number: 2, status: "unavailable" },
        { seat_number: 3, status: "unavailable" },
        { seat_number: 4, status: "available" },
        { seat_number: 5, status: "available" },
        { seat_number: 6, status: "available" },
        { seat_number: 7, status: "unavailable" },
        { seat_number: 8, status: "unavailable" },
        { seat_number: 9, status: "available" },
        { seat_number: 10, status: "unavailable" },
      ],
    },
    {
      row: "A",
      seats: [
        { seat_number: 1, status: "available" },
        { seat_number: 2, status: "available" },
        { seat_number: 3, status: "unavailable" },
        { seat_number: 4, status: "unavailable" },
        { seat_number: 5, status: "available" },
        { seat_number: 6, status: "available" },
        { seat_number: 7, status: "unavailable" },
        { seat_number: 8, status: "unavailable" },
        { seat_number: 9, status: "pending" },
        { seat_number: 10, status: "available" },
      ],
    },
  ],
};

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
  const getSeatVariant = (status: string, seatId: string) => {
    if (selectedSeats.includes(seatId)) return "selected";
    if (status === "available") return "available";
    if (status === "unavailable") return "booked";
    if (status === "pending") return "reserved";
    return "available";
  };

  // Responsibility: Calculate total price dynamically based on the number of selected seats and base price.
  const totalPrice = selectedSeats.length * moviesDataMock.basePrice;

  /* ================= View Logic ================= */
  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="flex justify-center py-[16px] px-[120px] bg-brand-gray-0">
        <Step
          steps={[{ label: "1" }, { label: "2" }, { label: "3" }]}
          currentStep={2}
        />
      </header>

      {/* Body */}
      <section className="flex flex-row h-full py-[80px] px-[120px] gap-[102px] bg-[#101525]">
        
        {/* Screen & Seating Area */}
        <article className="hidden flex-col gap-[60px] w-[793px] md:flex">
          
          {/* Screen */}
          <div className="flex flex-col text-center w-full bg-gradient-to-r from-[#2C344E] to-[#516199] rounded-tl-[80px] rounded-tr-[80px]">
            <span className="text-brand-gray-400 text-body-1-bold">screen</span>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col gap-[16px]">
            {seatMockData.rows.map((row) => (
              <div key={row.row} className="flex flex-col">
                <div className="flex justify-between">
                  
                  {/* Left Block (Seats 1-5) */}
                  <div className="flex items-center gap-[24px]">
                    <span className="w-[24px] text-brand-gray-300 text-body-1-bold">
                      {row.row}
                    </span>
                    {row.seats.slice(0, 5).map((seat) => {
                      const fullSeatId = `${row.row}${seat.seat_number}`;
                      return (
                        <SeatIcon
                          key={seat.seat_number}
                          variant={getSeatVariant(seat.status, fullSeatId)}
                          onClick={
                            seat.status === "available"
                              ? () => toggleSeat(fullSeatId)
                              : undefined
                          }
                        />
                      );
                    })}
                  </div>

                  {/* Right Block (Seats 6-10) */}
                  <div className="flex items-center gap-[24px]">
                    {row.seats.slice(5).map((seat) => {
                      const fullSeatId = `${row.row}${seat.seat_number}`;
                      return (
                        <SeatIcon
                          key={seat.seat_number}
                          variant={getSeatVariant(seat.status, fullSeatId)}
                          onClick={
                            seat.status === "available"
                              ? () => toggleSeat(fullSeatId)
                              : undefined
                          }
                        />
                      );
                    })}
                    <span className="text-right w-[24px] text-brand-gray-300 text-body-1-bold">
                      {row.row}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <footer className="flex flex-row py-[16px] gap-[40px] border-t border-brand-gray-100">
            <Tag label={moviesDataMock.hall} variant="language" />

            <div className="flex flex-row gap-[16px]">
              <SeatIcon variant="available" />
              <div className="flex flex-col justify-between text-body-2">
                <span>Available Seat</span>
                <span>THB {moviesDataMock.basePrice}</span>
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
            title={moviesDataMock.title}
            picture={moviesDataMock.picture}
            date={moviesDataMock.date}
            genre={moviesDataMock.genre}
            language={moviesDataMock.language.join(", ")}
            time={moviesDataMock.time}
            hall={moviesDataMock.hall}
            cinema={moviesDataMock.cinema}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onNext={() => {
              const query = new URLSearchParams({
                title: moviesDataMock.title,
                picture: moviesDataMock.picture,
                date: moviesDataMock.date,
                genre: JSON.stringify(moviesDataMock.genre),
                language: moviesDataMock.language.join(", "),
                time: moviesDataMock.time,
                hall: moviesDataMock.hall,
                cinema: moviesDataMock.cinema,
                selectedSeats: JSON.stringify(selectedSeats),
                totalPrice: totalPrice.toString(),
              }).toString();
              router.push(`/payment?${query}`);
            }}
          />
        </aside>
      </section>
    </main>
  );
}

export default Booking;