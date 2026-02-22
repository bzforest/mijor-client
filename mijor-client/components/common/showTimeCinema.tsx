import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TimeSelection from "./showTimeSelection";

type Schedule = {
  id: string;
  time: string;
  isAvailable?: boolean;
};

type HallData = {
  id: string;
  name: string;
  schedules: Schedule[];
};

type CinemaShowTimeProps = {
  nameCinema: string;
  halls: HallData[];
};

export default function CinemaShowTime({ nameCinema, halls }: CinemaShowTimeProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full bg-brand-gray-0 rounded-lg overflow-hidden mb-6">
      {/* --- Cinema Header --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 bg-brand-gray-0 border-b border-brand-gray-100"
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
              {nameCinema}
            </h2>
          </div>

          <div className="flex gap-2 ml-2">
            <span className="px-3 py-1 text-body-2 bg-brand-gray-100 text-brand-gray-300 rounded-sm leading-5">
              Hearing assistance
            </span>
            <span className="px-3 py-1 text-body-2 bg-brand-gray-100 text-brand-gray-300 rounded-sm leading-5">
              Wheelchair access
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-brand-gray-400 transition-transform duration-300 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </div>

      {/* --- Hall List --- */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "opacity-100 p-10" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <div className="flex flex-col gap-6 border-t border-brand-gray-0">
          {halls &&
            halls.map((hall) => (
              <div id="barname" key={hall.id} className="flex flex-col gap-4">
                {/* Hall Title */}
                <h3 className="text-body-1-bold text-white leading-8">
                  {hall.name}
                </h3>

                {/* TimeSelection Component ที่ทำไว้ */}
                <TimeSelection
                  schedules={hall.schedules}
                  onSelect={(id) => console.log(`Selected session: ${id}`)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
