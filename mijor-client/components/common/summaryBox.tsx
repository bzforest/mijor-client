import { MapPin, CalendarDays, Clock3, Store } from "lucide-react";
import formatMyDate from "@/utils/formatDate";

import Tag from "../ui/Tag";
import Button from "../ui/Button";

// ===== Types =====
type SummaryBoxProps = {
  title: string;
  picture: string;
  date: string;
  genre: string[];
  language: string;
  remainingTime?: string;
  cinema?: string;
  time?: string;
  hall?: string;
  selectedSeats?: string[];
  totalPrice?: number;
  onClick?: () => void;
};

function SummaryBox({
  title,
  picture,
  date,
  genre,
  language,
  remainingTime,
  cinema,
  time,
  hall,
  selectedSeats = [],
  totalPrice = 0,
  onClick,
}: SummaryBoxProps) {
  /* ================= Order Summary View ================= */
  // Responsibility: Display selected movie, showtime details, and total pricing before checkout.
  return (
    <aside className="flex flex-col px-[16px] pt-[16px] pb-[24px] gap-[24px] w-[305px] h-fit bg-brand-gray-0 rounded-[8px]">
      
      {/* Time remaining */}
      {remainingTime && (
        <div className="flex flex-row items-center gap-[8px]">
          <span className="text-body-2 text-brand-gray-300">
            Time remaining:
          </span>
          <span className="text-body-2-bold text-brand-blue-100">
            {remainingTime}
          </span>
        </div>
      )}

      {/* Movie info row */}
      <section className="flex flex-row gap-[16px]">
        <img
          src={picture}
          alt={title}
          className="object-cover w-[82px] h-[120px] rounded-[4px]"
        />

        <div className="flex flex-col justify-center gap-[12px]">
          <h1 className="text-headline-3 text-white">{title}</h1>

          <div className="flex flex-row flex-wrap gap-[8px]">
            {genre.map((g, index) => (
              <Tag key={index} label={g} variant="genre" />
            ))}
            {language && <Tag label={language} variant="language" />}
          </div>
        </div>
      </section>

      {/* Details section */}
      <ul className="flex flex-col gap-[12px]">
        <li className="flex flex-row items-center gap-[12px]">
          <MapPin size={24} strokeWidth={3} className="text-brand-gray-200" />
          <span className="text-body-2 text-brand-gray-400">{cinema}</span>
        </li>

        <li className="flex flex-row items-center gap-[12px]">
          <CalendarDays
            size={24}
            strokeWidth={3}
            className="text-brand-gray-200"
          />
          <span className="text-body-2 text-brand-gray-400">
            {formatMyDate(date || "")}
          </span>
        </li>

        <li className="flex flex-row items-center gap-[12px]">
          <Clock3 size={24} strokeWidth={3} className="text-brand-gray-200" />
          <span className="text-body-2 text-brand-gray-400">{time}</span>
        </li>

        <li className="flex flex-row items-center gap-[12px]">
          <Store size={24} strokeWidth={3} className="text-brand-gray-200" />
          <span className="text-body-2 text-brand-gray-400">{hall}</span>
        </li>
      </ul>

      {/* Selected Seats & Total Section */}
      {selectedSeats.length > 0 && (
        <footer className="flex flex-col px-[16px] pt-[16px] pb-[24px] gap-[20px] border-t border-brand-gray-100">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-body-2 text-brand-gray-400">
                Selected Seat
              </span>
              <span className="text-body-1-bold text-white">
                {selectedSeats.join(", ")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-body-2 text-brand-gray-400">Total</span>
              <span className="text-body-1-bold text-white">
                THB{totalPrice}
              </span>
            </div>
          </div>

          <Button onClick={onClick} className="w-full">
            Next
          </Button>
        </footer>
      )}
    </aside>
  );
}

export default SummaryBox;