"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/common/navbar";
import DateSelection from "@/components/common/dateSelection";
import CinemaShowTime from "@/components/common/showTimeCinema";
import InputField from "@/components/ui/InputField";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Movie = {
  id: string;
  title: string;
  poster_url?: string;
  synopsis?: string;
  release_date?: string;
  genre: string[];
  language: string;
  rating?: number;
  duration_mins?: number;
  status?: string;
};

type Showtime = {
  cinema_id: string;
  cinema_name: string;
  city: string;
  halls: {
    hall_name: string;
    schedules: { id: string; time: string }[];
  }[];
};

export default function MovieDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("City");
  const [isOpen, setIsOpen] = useState(false);
  const [cityList, setCityList] = useState<string[]>([]);

  // ================= Fetch Cities =================
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data: result } = await axios.get(`${API_URL}/cities`);
        if (Array.isArray(result.data)) {
          setCityList(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setCityList(["Bangkok", "Chiang Mai", "Phuket", "Khon Kaen"]);
      }
    };
    fetchCities();
  }, []);

  // ================= Fetch Movie + Showtimes + Genres =================
  useEffect(() => {
    if (!router.isReady) return;
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieRes, showtimeRes, genreRes] = await Promise.all([
          axios.get(`${API_URL}/movies/${id}`),
          axios
            .get(`${API_URL}/showtimes/movie/${id}?date=${selectedDate}`)
            .catch(() => ({ data: { data: [] } })),
          axios
            .get(`${API_URL}/moviegenres/${id}`)
            .catch(() => ({ data: { data: [] } })),
        ]);

        const movieData = movieRes.data.data;

        const genres: string[] = Array.isArray(genreRes.data.data)
          ? genreRes.data.data.map((g: any) => g.name)
          : [];

        setMovie({
          ...movieData,
          genre: genres,
        });

        setShowtimes(showtimeRes.data.data || []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id, selectedDate]);

  if (!router.isReady || loading) {
    return (
      <div className="min-h-screen bg-brand-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-brand-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">
          {error || "Movie not found"}
        </h1>
        <button
          onClick={() => router.push("/landing")}
          className="px-6 py-2 bg-brand-primary rounded-md"
        >
          Back to landing
        </button>
      </div>
    );
  }

  const filteredShowtimes = showtimes.filter((cinema) => {
    const matchCity =
      selectedCity === "City" || cinema.city === selectedCity;
    const matchSearch = cinema.cinema_name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchCity && matchSearch;
  });

  return (
    <div className="min-h-screen bg-brand-gray-900 text-white pt-[80px]">
      <Navbar isLoggedIn={false} />

      {/* ================= Hero Section ================= */}
      <section className="px-4 md:px-[100px] py-10 md:py-16 flex justify-center">
        <div className="w-full max-w-[1200px]">

          {/* ===== Mobile ===== */}
          <div className="block md:hidden space-y-6">

            <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-xl">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{movie.title}</h1>

              <div className="flex flex-wrap gap-2">
                {movie.genre?.map((g, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-brand-gray-100 rounded-md text-xs"
                  >
                    {g}
                  </span>
                ))}

                {movie.language && (
                  <span className="px-3 py-1 bg-brand-gray-100 rounded-md text-xs">
                    {movie.language}
                  </span>
                )}
              </div>

              {movie.release_date && (
                <p className="text-brand-gray-400 text-sm">
                  Release date: {movie.release_date}
                </p>
              )}

              <button
                onClick={() =>
                  router.push(`/movies/${movie.id}/detail`)
                }
                className="w-full py-3 bg-brand-blue-100 rounded-md font-semibold"
              >
                Movie detail
              </button>

              <p className="text-brand-gray-300 leading-6 text-sm">
                {movie.synopsis || "No description available."}
              </p>
            </div>
          </div>

          {/* ===== Desktop ===== */}
          <div className="hidden md:flex gap-12 w-full h-[600px] bg-brand-gray-800/40 rounded-xl shadow-2xl border border-white/5 overflow-hidden">

            <div className="w-[420px] h-full flex-shrink-0 overflow-hidden">
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-6 w-full h-full pt-[60px] pr-[120px]">
              <h1 className="text-4xl font-bold">{movie.title}</h1>

              <div className="flex items-center gap-3 flex-wrap">
                {movie.genre?.map((g, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-brand-gray-100 rounded-md text-sm"
                  >
                    {g}
                  </span>
                ))}

                {movie.language && (
                  <span className="px-4 py-2 bg-brand-gray-100 rounded-md text-sm">
                    {movie.language}
                  </span>
                )}

                {movie.release_date && (
                  <>
                    <span className="text-brand-gray-400">|</span>
                    <span className="text-brand-gray-300 text-sm">
                      Release date: {movie.release_date}
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  router.push(`/movies/${movie.id}/detail`)
                }
                className="w-fit px-6 py-3 bg-brand-blue-100 rounded-md font-semibold hover:opacity-90 transition"
              >
                Movie detail
              </button>

              <p className="text-brand-gray-300 leading-7 line-clamp-6">
                {movie.synopsis || "No description available."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Date Selection */}
      <div className="px-6 md:px-[80px] py-10">
        <DateSelection
          selectedDate={selectedDate}
          onDateSelect={(newDate) => setSelectedDate(newDate)}
        />
      </div>

      {/* Search + City */}
      <div className="px-6 md:px-[80px] pb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full">
            <InputField
              label=""
              text={searchText}
              placeholder="Search cinema"
              textTrue=""
              textFalse=""
              correct={true}
              search
              onChange={setSearchText}
              onClear={() => setSearchText("")}
            />
          </div>
        </div>
      </div>

      {/* Showtimes */}
      <div className="space-y-6 pb-10">
        {filteredShowtimes.length > 0 ? (
          filteredShowtimes.map((cinema) => (
            <CinemaShowTime
              key={cinema.cinema_id}
              nameCinema={cinema.cinema_name}
              halls={cinema.halls.map((hall, index) => ({
                id: String(index),
                name: hall.hall_name,
                schedules: hall.schedules,
              }))}
            />
          ))
        ) : (
          <div className="text-center text-brand-gray-400 py-10">
            No showtimes found.
          </div>
        )}
      </div>
    </div>
  );
}