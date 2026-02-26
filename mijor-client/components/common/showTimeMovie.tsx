import TimeSelection from "./showTimeSelection";
import Tag from "../ui/Tag";
import Button from "../ui/Button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Schedule {
  id: string;
  time: string;
  isAvailable?: boolean;
}

interface HallData {
  id: string;
  name: string;
  schedules: Schedule[];
}

type MovieStatus = "Now Showing" | "Coming Soon" | "Out of Theater" | string;

interface MovieShowtimeProps {
  title: string;
  posterUrl: string;
  genres: string[];
  language: string[];
  halls: HallData[];
  location?: string;
  status?: MovieStatus;
  hearingAssistance?: boolean;
  wheelchairAccess?: boolean;
  isShow?: boolean;
  onClick: () => void;
  onClickMovieDetail?: () => void;
}

export default function MovieShowtimeCard({
  title,
  posterUrl,
  genres,
  language,
  halls,
  location,
  status,
  isShow = false,
  hearingAssistance = false,
  wheelchairAccess = false,
  onClick,
  onClickMovieDetail,
}: MovieShowtimeProps) {
  const [isOpen, setIsOpen] = useState(true);

  /* ================= Status-based Right Panel ================= */
  const renderShowtimePanel = () => {
    if (status === "Coming Soon") {
      return (
        <div className="flex items-start justify-start flex-1 p-6">
          <span className="px-5 py-2 rounded-full bg-brand-blue-100/20 text-brand-blue-100 text-body-1-bold tracking-wide border border-brand-blue-100/40">
            Coming Soon
          </span>
        </div>
      );
    }

    if (status === "Out of Theater") {
      return (
        <div className="flex items-start justify-start flex-1 p-6">
          <span className="px-5 py-2 rounded-full bg-brand-gray-200/30 text-brand-gray-300 text-body-1-bold tracking-wide border border-brand-gray-200/40">
            Out of Theater
          </span>
        </div>
      );
    }

    // Default: Now Showing (or no status) — แสดง halls + schedules เหมือนเดิม
    return (
      <div className="flex flex-col p-6 gap-8 flex-1 bg-brand-gray-0 border-t border-brand-gray-0">
        {halls.map((hall) => (
          <div key={hall.id} className="flex flex-col gap-4">
            <h3 className="text-body-1-bold text-white uppercase tracking-wide">
              {hall.name}
            </h3>
            <TimeSelection
              schedules={hall.schedules}
              onSelect={onClick}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-brand-gray-0 rounded-lg overflow-hidden">
      {/* --- Cinema Header --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-4 bg-brand-gray-0 border-b border-brand-gray-100 hidden ${isShow ? "md:flex" : "md:hidden"}`}
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 bg-brand-gray-100 rounded-full p-2">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C7.58172 2 4 5.58172 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58172 16.4183 2 12 2ZM12 13.5C10.067 13.5 8.5 11.933 8.5 10C8.5 8.067 10.067 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.933 13.933 13.5 12 13.5Z"
                  fill="#4E7BEE"
                />
              </svg>
            </div>
            <h2 className="text-headline-3 font-bold text-white">
              {location}
            </h2>
          </div>

          <div className="flex gap-2 ml-2">
            {hearingAssistance && (
              <span className="px-3 py-1 text-body-2 bg-brand-gray-100 text-brand-gray-300 rounded-sm leading-5">
                Hearing assistance
              </span>
            )}

            {wheelchairAccess && (
              <span className="px-3 py-1 text-body-2 bg-brand-gray-100 text-brand-gray-300 rounded-sm leading-5">
                Wheelchair access
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-brand-gray-400 transition-transform duration-300 ${isOpen ? "" : "-rotate-90"
            }`}
        />
      </div>
      {isOpen && (
        <div className="flex flex-col mb-8 w-full bg-brand-gray-0 rounded-md overflow-hidden md:flex-row">
          {/* --- ฝั่งซ้าย: Movie Info --- */}
          <div className="flex flex-row p-6 md:w-70 md:flex-col gap-6">
            <img
              src={posterUrl}
              alt={title}
              className="object-cover w-[96px] h-fit md:w-auto md:h-auto rounded-sm bg-brand-gray-200/30"
            />
            <div className="flex flex-col gap-2 w-full">
              <h2 className="mb-2 text-headline-4 font-bold text-white">{title}</h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {genres?.map((genre, index) => (
                  <Tag key={index} label={genre} variant="genre" />
                ))}
                {language?.map((languages, index) => (
                  <Tag key={index} label={languages} variant="language" />
                ))}
              </div>

              <Button variant="text" className="w-fit" onClick={onClickMovieDetail}>
                Movie detail
              </Button>
            </div>
          </div>

          {/* --- ฝั่งขวา: Show Time (แสดงตาม status) --- */}
          {renderShowtimePanel()}
        </div>
      )}
    </div>
  );
}
