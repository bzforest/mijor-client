import TimeSelection from "./showTimeSelection";
import Tag from "../ui/Tag";
import Button from "../ui/Button";

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

interface MovieShowtimeProps {
  title: string;
  posterUrl: string;
  tags: string[];
  halls: HallData[];
}

export default function MovieShowtimeCard({
  title,
  posterUrl,
  tags,
  halls,
}: MovieShowtimeProps) {
  return (
    <div className="flex flex-col mb-8 w-full bg-brand-gray-0 rounded-md overflow-hidden md:flex-row">
      {/* --- ฝั่งซ้าย: Movie Info --- */}
      <div className="flex flex-row p-6 w-full md:w-70 md:flex-col gap-6">
        <img
          src={posterUrl}
          alt={title}
          className="object-cover mb-4 w-full aspect-3/4 rounded-sm bg-brand-gray-200/30"
        />
        <div className="flex flex-col gap-2 w-full">
          <h2 className="mb-2 text-headline-4 font-bold text-white">{title}</h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Tag key={tag} label={tag} variant="genre" />
            ))}
          </div>

          <Button variant="text" className="w-fit">
            Movie detail
          </Button>
        </div>
      </div>

      {/* --- ฝั่งขวา: Show Time --- */}
      <div className="flex flex-col p-6 gap-8 flex-1 bg-brand-gray-0 border-t border-brand-gray-0">
        {halls.map((hall) => (
          <div key={hall.id} className="flex flex-col gap-4">
            <h3 className="text-body-1-bold text-white uppercase tracking-wide">
              {hall.name}
            </h3>

            <TimeSelection
              schedules={hall.schedules}
              onSelect={(id) =>
                console.log(`Selected session ${id} for ${title}`)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
