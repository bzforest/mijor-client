import ShowTimeSelection from "@/components/common/showTimeSelection";
import DateSelection from "@/components/common/dateSelection";
import CinemaShowTime from "@/components/common/showTimeCinema";
import MovieShowtimeCard from "@/components/common/showTimeMovie";

// Mock Data 
const cinemas = [
  {
    id: "c1",
    nameCinema: "Minor Cineplex Arkham",
    halls: [
      {
        id: "h1",
        name: "Hall 1",
        schedules: [
          { id: "1", time: "11:30" },
          { id: "2", time: "14:30" },
          { id: "3", time: "16:30" },
          { id: "4", time: "20:30" },
        ],
      },
      {
        id: "h2",
        name: "Hall 3",
        schedules: [
          { id: "5", time: "09:00" },
          { id: "6", time: "12:00" },
          { id: "7", time: "15:00" },
        ],
      },
      {
        id: "h3",
        name: "Hall 6",
        schedules: [
          { id: "8", time: "13:30" },
          { id: "9", time: "18:00" },
        ],
      },
    ],
  },
  {
    id: "c2",
    nameCinema: "Minor Cineplex Metropolis",
    halls: [
      {
        id: "h4",
        name: "Hall 2",
        schedules: [
          { id: "10", time: "10:30" },
          { id: "11", time: "13:30" },
        ],
      },
      {
        id: "h5",
        name: "Hall 4",
        schedules: [
          { id: "12", time: "11:00" },
          { id: "13", time: "14:00" },
          { id: "14", time: "17:00" },
        ],
      },
      {
        id: "h6",
        name: "IMAX Hall",
        schedules: [
          { id: "15", time: "19:00" },
          { id: "16", time: "22:00" },
        ],
      },
    ],
  },
  {
    id: "c3",
    nameCinema: "Minor Cineplex Gotham",
    halls: [
      {
        id: "h7",
        name: "Hall 1",
        schedules: [
          { id: "17", time: "12:45" },
          { id: "18", time: "15:45" },
        ],
      },
      {
        id: "h8",
        name: "Hall 5",
        schedules: [
          { id: "19", time: "10:00" },
          { id: "20", time: "13:00" },
          { id: "21", time: "16:00" },
        ],
      },
      {
        id: "h9",
        name: "Gold Class",
        schedules: [{ id: "22", time: "20:00" }],
      },
    ],
  },
];

export default function Component() {
  return (
    <div>
      {/* first section */}

      {/* foy section */}

      {/* champ section */}
      <ShowTimeSelection
        schedules={[
          { id: "1", time: "10:30" },
          { id: "2", time: "13:00" },
          { id: "3", time: "15:30" },
          { id: "4", time: "18:00" },
          { id: "6", time: "22:00" },
        ]}
        onSelect={(schedule) => console.log("Selected:", schedule)}
      />
      <DateSelection />
      {cinemas.map((cinema) => (
        <CinemaShowTime
          key={cinema.id}
          nameCinema={cinema.nameCinema}
          halls={cinema.halls}
        />
      ))}

      <MovieShowtimeCard
        title="The Dark Knight"
        posterUrl="/path-to-your-poster.jpg"
        tags={["Action", "Crime", "TH"]}
        halls={cinemas[0].halls}
      />
    </div>
  );
}
