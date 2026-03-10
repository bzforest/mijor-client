import Step from "@/components/ui/Step";
import SummaryBox from "@/components/common/summaryBox";
import SeatIcon from "@/components/common/seatIcon";
import Tag from "@/components/ui/Tag";
import formatDate from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { Seat, SeatRow, ShowtimeInfo, PaymentParams } from "@/types/booking";
import PaymentStep from "@/components/booking/PaymentStep";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopProps {
  seats: SeatRow[];
  movieInfo: ShowtimeInfo | null;
  selectedSeats: string[];
  selectedSeatLabels: string[];
  remainingTime: number;
  next: boolean;
  toggleSeat: (seatId: string) => void;
  handleSelect: () => Promise<void>;
  handleConfirm: (params: PaymentParams) => Promise<void>;
  friendSeatIds: string[];
  friendName: string | null;
  friendAvatar: string | null;
  showtimeId: string;
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
  friendSeatIds,
  friendName,
  friendAvatar,
  showtimeId,
}: DesktopProps) {
  const { user } = useAuth();

  const hasUserBookedSeats = user ? seats.some(row => row.seats.some(seat => seat.selected_by === user.id)) : false;
  const isFriendSeatOwnedByUser = user && friendSeatIds.length > 0
    ? seats.some(row => row.seats.some(seat => friendSeatIds.includes(seat.id) && seat.selected_by === user.id))
    : false;

  const getSeatVariant = (seat: Seat) => {
    // If it's the current user's booked seat, we consider it "friend" variant so SeatIcon can handle the avatar display logic
    if (user && seat.selected_by === user.id) return "friend";
    if (friendSeatIds.includes(seat.id)) return "friend";
    if (selectedSeats.includes(seat.id)) return "selected";
    if (seat.status === "available") return "available";
    if (seat.status === "booked") return "booked";
    if (seat.status === "selected") return "reserved";
    return "available";
  };

  return !next ? (
    <main className="hidden md:flex flex-col">
      {/* ===== Header Section ===== */}
      <header className="flex justify-center bg-brand-gray-0 px-[120px] py-[16px]">
        <Step
          steps={[{ label: "Select showtime" }, { label: "Select seat" }, { label: "Payment" }]}
          currentStep={2}
        />
      </header>

      {/* ===== Booking Body ===== */}
      <section className="flex flex-row justify-center h-full gap-[102px] bg-[#101525] px-[120px] py-[80px]">
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
                    {row.seats.slice(0, 5).map((seat) => {
                      const isCurrentUserSeat = user && seat.selected_by === user.id;
                      return (
                        <SeatIcon
                          key={seat.id}
                          variant={getSeatVariant(seat)}
                          profileImageUrl={
                            isCurrentUserSeat
                              ? ((user as any)?.avatar || (user as any)?.avatarUrl || (user as any)?.picture || seat?.booked_by_avatar || null)
                              : friendSeatIds.includes(seat.id)
                                ? friendAvatar
                                : undefined
                          }
                          friendName={
                            isCurrentUserSeat
                              ? user?.name
                              : friendSeatIds.includes(seat.id)
                                ? friendName
                                : undefined
                          }
                          isCurrentUser={!!isCurrentUserSeat}
                          onClick={
                            seat.status === "available"
                              ? () => toggleSeat(seat.id)
                              : undefined
                          }
                        />
                      )
                    })}
                  </div>

                  {/* Right Block (Seats 6-10) */}
                  <div className="flex items-center gap-[24px]">
                    {row.seats.slice(5).map((seat) => {
                      const isCurrentUserSeat = user && seat.selected_by === user.id;
                      return (
                        <SeatIcon
                          key={seat.id}
                          variant={getSeatVariant(seat)}
                          profileImageUrl={
                            isCurrentUserSeat
                              ? ((user as any)?.avatar || (user as any)?.avatarUrl || (user as any)?.picture || seat?.booked_by_avatar || null)
                              : friendSeatIds.includes(seat.id)
                                ? friendAvatar
                                : undefined
                          }
                          friendName={
                            isCurrentUserSeat
                              ? user?.name
                              : friendSeatIds.includes(seat.id)
                                ? friendName
                                : undefined
                          }
                          isCurrentUser={!!isCurrentUserSeat}
                          onClick={
                            seat.status === "available"
                              ? () => toggleSeat(seat.id)
                              : undefined
                          }
                        />
                      )
                    })}
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
                <span className="whitespace-nowrap">Available Seat</span>
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

            {/* Current User's Seat */}
            {hasUserBookedSeats && (
              <div className="flex flex-row items-center gap-[16px] text-body-2">
                <SeatIcon
                  variant="friend"
                  isCurrentUser={true}
                  profileImageUrl={(user as any)?.avatar || (user as any)?.avatarUrl || (user as any)?.picture || null}
                />
                <span>Your Seat</span>
              </div>
            )}

            {/* Friend Seat — only show when viewing via share link and it's not the user's own seat */}
            {friendSeatIds.length > 0 && !isFriendSeatOwnedByUser && (
              <div className="flex flex-row items-center gap-[16px] text-body-2">
                <SeatIcon variant="friend" profileImageUrl={friendAvatar} />
                <span>Friend&apos;s Seat{friendName ? ` (${friendName})` : ""}</span>
              </div>
            )}
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
    <PaymentStep
      movieInfo={movieInfo}
      selectedSeatLabels={selectedSeatLabels}
      selectedSeatIds={selectedSeats}
      showtimeId={showtimeId}
      totalPrice={selectedSeats.length * (movieInfo?.price || 0)}
      remainingTime={remainingTime}
      onPaymentSuccess={handleConfirm}
      className="hidden md:flex"
    />
  );
}

export default Desktop;
