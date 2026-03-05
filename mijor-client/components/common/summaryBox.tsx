import Tag from "../ui/Tag";
import { MapPin, CalendarDays, Clock3, Store } from "lucide-react";
import Button from "../ui/Button";

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
  onNext?: () => void;
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
  onNext,
}: SummaryBoxProps) {
  return (
    <div className="md:sticky md:top-[80px] flex flex-col items-center gap-[24px] rounded-[8px] w-full md:w-[305px] px-[16px] pt-[16px] pb-[24px] h-fit bg-brand-gray-0 border border-brand-gray-100/50">
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
      <div className="flex flex-row gap-[16px]">
        <img
          src={picture || undefined}
          alt={title}
          className="w-[82px] h-[120px] rounded-[4px] object-cover"
        />

        <div className="flex flex-col gap-[12px] justify-center">
          <h1 className="text-headline-3 text-white leading-tight">{title}</h1>

          <div className="flex flex-row gap-[8px] flex-wrap">
            {genre.map((genre, index) => (
              <Tag key={index} label={genre} variant="genre" />
            ))}
            {language && <Tag label={language} variant="language" />}
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-row items-center gap-[12px]">
          <MapPin size={24} className="text-brand-gray-200" strokeWidth={2} />
          <span className="text-body-2 text-brand-gray-400">{cinema}</span>
        </div>

        <div className="flex flex-row items-center gap-[12px]">
          <CalendarDays
            size={24}
            className="text-brand-gray-200"
            strokeWidth={2}
          />
          <span className="text-body-2 text-brand-gray-400">{date}</span>
        </div>

        <div className="flex flex-row items-center gap-[12px]">
          <Clock3 size={24} className="text-brand-gray-200" strokeWidth={2} />
          <span className="text-body-2 text-brand-gray-400">{time}</span>
        </div>

        <div className="flex flex-row items-center gap-[12px]">
          <Store size={24} className="text-brand-gray-200" strokeWidth={2} />
          <span className="text-body-2 text-brand-gray-400">{hall}</span>
        </div>
      </div>

      {/* Booking info section */}
      {selectedSeats.length > 0 && (
        <div className="flex flex-col gap-[24px] pt-[24px] border-t border-brand-gray-100">
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-row justify-between items-center w-full">
              <span className="text-body-2 text-brand-gray-400">
                Selected Seat
              </span>
              <span className="text-body-2-bold text-white">
                {selectedSeats.join(", ")}
              </span>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <span className="text-body-2 text-brand-gray-400">Total</span>
              <span className="text-body-2-bold text-white uppercase">
                THB{totalPrice}
              </span>
            </div>
          </div>

          <Button onClick={onNext} className="w-full">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default SummaryBox;
