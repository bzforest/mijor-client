import React from "react";
import MovieCard from "@/components/common/movieCard";

export type Movie = {
  id: string;
  title: string;
  poster_url?: string;
  release_date?: string;
  rating?: string;
  genre: string[];
  language: string[];
  status: "now" | "soon";
  hasShowtimeToday?: boolean;
};

type MovieSectionProps = {
  activeTab: "now" | "soon";
  setActiveTab: (tab: "now" | "soon") => void;
  loadingMovies: boolean;
  movieError: string | null;
  filteredMovies: Movie[];
};

export default function MovieSection({
  activeTab,
  setActiveTab,
  loadingMovies,
  movieError,
  filteredMovies,
}: MovieSectionProps) {
  return (
    <section
  className="
    flex flex-col
    gap-[40px]
    px-1 py-16
    min-[375px]:px-6
    text-white
    md:px-[120px] md:py-[80px]
  "
>
  {/* ===== Movie Tabs ===== */}
  <div className="flex w-fit gap-8">

    <button
      onClick={() => setActiveTab("now")}
      className={`
        text-headline-3-bold
        cursor-pointer
        transition-colors
        ${
          activeTab === "now"
            ? "text-white border-b border-brand-gray-200"
            : "text-brand-gray-300 hover:text-white"
        }
      `}
    >
      Now Showing
    </button>

    <button
      onClick={() => setActiveTab("soon")}
      className={`
        text-headline-3-bold
        cursor-pointer
        transition-colors
        ${
          activeTab === "soon"
            ? "text-white border-b border-brand-gray-200"
            : "text-brand-gray-300 hover:text-white"
        }
      `}
    >
      Coming Soon
    </button>

  </div>

  {/* ================= Status ================= */}

  {/* Loading */}
  {loadingMovies && <p>Loading movies...</p>}

  {/* Error */}
  {movieError && (
    <p className="text-red-500">
      {movieError}
    </p>
  )}

  {/* ================= Movie Grid ================= */}
  {!loadingMovies && !movieError && (
    <div className="grid grid-cols-2 gap-[20px] md:flex md:flex-wrap md:justify-around md:gap-[20px]">

      {filteredMovies.length > 0 ? (
        <>

          {filteredMovies.map((movie) => (
            <React.Fragment key={movie.id}>
              <MovieCard movie={movie as any} variant="desktop" />
              <MovieCard movie={movie as any} variant="mobile" />
            </React.Fragment>
          ))}

          {/* ===== Layout placeholders (desktop alignment hack) ===== */}
          <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
          <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
          <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
          <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
          <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>

        </>
      ) : (
        <p>No movies available</p>
      )}

    </div>
  )}
</section>
  );
}
