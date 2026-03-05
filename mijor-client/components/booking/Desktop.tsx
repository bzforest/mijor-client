import Step from "@/components/ui/Step";
import SummaryBox from "@/components/common/summaryBox";
import SeatIcon from "@/components/common/seatIcon";
import Tag from "@/components/ui/Tag";
import formatDate from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { Seat, SeatRow, ShowtimeInfo } from "@/types/booking";

interface DesktopProps {
  seats: SeatRow[];
  movieInfo: ShowtimeInfo | null;
  selectedSeats: string[];
  selectedSeatLabels: string[];
  remainingTime: number;
  next: boolean;
  toggleSeat: (seatId: string) => void;
  handleSelect: () => Promise<void>;
  handleConfirm: () => Promise<void>;
}

function Desktop({
  seats,
  movieInfo,
  selectedSeats,
  selectedSeatLabels,
  remainingTime,
  next,
  toggleSeat,
  handleSelect,
  handleConfirm,
}: DesktopProps) {
  const getSeatVariant = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) return "selected";
    if (seat.status === "available") return "available";
    if (seat.status === "booked") return "booked";
    if (seat.status === "selected") return "reserved";
    return "available";
  };

  return !next ? (
    <main className="hidden flex-col md:flex">
      {/* ===== Header Section ===== */}
      <header className="flex justify-center bg-brand-gray-0 px-[120px] py-[16px]">
        <Step
          steps={[{ label: "1" }, { label: "2" }, { label: "3" }]}
          currentStep={2}
        />
      </header>

      {/* ===== Booking Body ===== */}
      <section className="flex flex-row h-full gap-[102px] bg-[#101525] px-[120px] py-[80px]">
        {/* ================= Screen & Seating Area ================= */}
        <article className="hidden w-[793px] flex-col gap-[60px] md:flex">
          {/* ----- Screen Representation ----- */}
          <div className="flex w-full flex-col rounded-tl-[80px] rounded-tr-[80px] bg-gradient-to-r from-[#2C344E] to-[#516199] text-center">
            <span className="text-body-1-bold text-brand-gray-400">screen</span>
          </div>

          {/* ----- Seat Grid ----- */}
          <div className="flex flex-col gap-[16px]">
            {seats.map((row, index) => (
              <div key={row.id || index} className="flex flex-col">
                <div className="flex justify-between">
                  {/* Left Block (Seats 1-5) */}
                  <div className="flex items-center gap-[24px]">
                    <span className="w-[24px] text-body-1-bold text-brand-gray-300">
                      {row.row_letter}
                    </span>
                    {row.seats.slice(0, 5).map((seat) => (
                      <SeatIcon
                        key={seat.id}
                        variant={getSeatVariant(seat)}
                        onClick={
                          seat.status === "available"
                            ? () => toggleSeat(seat.id)
                            : undefined
                        }
                      />
                    ))}
                  </div>

                  {/* Right Block (Seats 6-10) */}
                  <div className="flex items-center gap-[24px]">
                    {row.seats.slice(5).map((seat) => (
                      <SeatIcon
                        key={seat.id}
                        variant={getSeatVariant(seat)}
                        onClick={
                          seat.status === "available"
                            ? () => toggleSeat(seat.id)
                            : undefined
                        }
                      />
                    ))}
                    <span className="w-[24px] text-right text-body-1-bold text-brand-gray-300">
                      {row.row_letter}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ----- Selection Legend ----- */}
          <footer className="flex flex-row gap-[40px] border-t border-brand-gray-100 py-[16px]">
            <Tag label={movieInfo?.hall || ""} variant="language" />

            {/* Available */}
            <div className="flex flex-row gap-[16px]">
              <SeatIcon variant="available" />
              <div className="flex flex-col justify-between text-body-2">
                <span>Available Seat</span>
                <span>THB {movieInfo?.price}</span>
              </div>
            </div>

            {/* Booked */}
            <div className="flex flex-row items-center gap-[16px] text-body-2">
              <SeatIcon variant="booked" />
              <span>Booked Seat</span>
            </div>

            {/* Reserved / Selected by others */}
            <div className="flex flex-row items-center gap-[16px] text-body-2">
              <SeatIcon variant="reserved" />
              <span>Reserved Seat</span>
            </div>
          </footer>
        </article>

        {/* ================= Summary Sidebar ================= */}
        <aside>
          <SummaryBox
            title={movieInfo?.title || ""}
            picture={movieInfo?.posterUrl || ""}
            date={formatDate(movieInfo?.date || "")}
            genre={movieInfo?.genres || []}
            language={movieInfo?.languages?.join(", ") || ""}
            time={formatTime(movieInfo?.time || "")}
            hall={movieInfo?.hall || ""}
            cinema={movieInfo?.cinema || ""}
            selectedSeats={selectedSeatLabels}
            totalPrice={selectedSeats.length * (movieInfo?.price || 0)}
            remainingTime={
              remainingTime > 0 ? formatRemainingTime(remainingTime) : ""
            }
            onNext={handleSelect}
          />
        </aside>
      </section>
    </main>
  ) : (
    /* ===== Confirmation Step ===== */
    <div className="hidden h-screen items-center justify-center md:flex">
      <SummaryBox
        title={movieInfo?.title || ""}
        picture={movieInfo?.posterUrl || ""}
        date={formatDate(movieInfo?.date || "")}
        genre={movieInfo?.genres || []}
        language={movieInfo?.languages?.join(", ") || ""}
        time={formatTime(movieInfo?.time || "")}
        hall={movieInfo?.hall || ""}
        cinema={movieInfo?.cinema || ""}
        selectedSeats={selectedSeatLabels}
        totalPrice={selectedSeats.length * (movieInfo?.price || 0)}
        remainingTime={
          remainingTime > 0 ? formatRemainingTime(remainingTime) : ""
        }
        onNext={handleConfirm}
      />
    </div>
  );
}

export default Desktop;
