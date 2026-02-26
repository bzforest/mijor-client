"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/common/navbar";
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

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [cityList, setCityList] = useState<string[]>([]);

  // ================= Fetch Cities =================
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/cities`);
        setCityList(Array.isArray(data.data) ? data.data : []);
      } catch {
        setCityList([]);
      }
    };
    fetchCities();
  }, []);

  // ================= Fetch Movie + Showtimes =================
  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [movieRes, showtimeRes, genreRes] = await Promise.all([
          axios.get(`${API_URL}/movies/${id}`),
          axios.get(`http://localhost:4000/showtimes/00650cd8-ec92-451d-87cf-dbd3aeddd67f`),
          axios.get(`${API_URL}/moviegenres/${id}`),
        ]);

        const movieData = movieRes.data.data;

        const genres: string[] = Array.isArray(genreRes.data.data)
          ? genreRes.data.data.map((g: any) => g.name)
          : [];

        setMovie({
          ...movieData,
          genre: genres,
        });

       // ================= GROUP SHOWTIMES (จากโค้ด 1) =================

        const rawShowtimes = showtimeRes.data.data || [];

        const cinemaMap: Record<string, Showtime> = {};

        for (let i = 0; i < rawShowtimes.length; i++) {
          const item = rawShowtimes[i];

          const cinemaId = item.cinema.cinema_id;
          const hallName = item.hall.hall_name;

          if (!cinemaMap[cinemaId]) {
            cinemaMap[cinemaId] = {
              cinema_id: cinemaId,
              cinema_name: item.cinema.cinema_name,
              city: item.cinema.city,
              halls: [],
            };
          }

          const cinema = cinemaMap[cinemaId];

          let hall = cinema.halls.find(
            (h) => h.hall_name === hallName
          );

          if (!hall) {
            hall = {
              hall_name: hallName,
              schedules: [],
            };
            cinema.halls.push(hall);
          }

          hall.schedules.push({
            id: item.showtime_id,
            time: item.show_time,
          });
        }

        setShowtimes(Object.values(cinemaMap));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id]);

  if (!router.isReady || loading) {
    return (
      <div className="min-h-screen bg-brand-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-brand-gray-900 text-white flex items-center justify-center">
        {error || "Movie not found"}
      </div>
    );
  }

  // ================= Filter =================
  const filteredShowtimes = showtimes.filter((cinema) => {
    const matchCity =
      selectedCity === "All" || cinema.city === selectedCity;

    const matchSearch = cinema.cinema_name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchCity && matchSearch;
  });

  return (
    <div className="min-h-screen bg-brand-gray-900 text-white pt-[80px]">
      <Navbar isLoggedIn={false} />

      <div className="px-6 md:px-[80px] space-y-10">

        {/* ================= Movie Info ================= */}
        <div className="flex gap-10">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-[250px] rounded-lg"
          />

          <div className="space-y-4 max-w-[700px]">
            <h1 className="text-3xl font-bold">{movie.title}</h1>

            <div className="flex gap-3 flex-wrap text-sm text-gray-400">
              {movie.genre.map((g, i) => (
                <span key={i}>{g}</span>
              ))}
            </div>

            <p className="text-gray-300">{movie.synopsis}</p>

            <p className="text-sm text-gray-400">
              Language: {movie.language}
            </p>
          </div>
        </div>

        {/* ================= Filter Section ================= */}
        <div className="flex gap-6 items-center flex-wrap">

          <InputField
            placeholder="Search cinema..."
            value={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
          />

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-brand-gray-800 px-4 py-2 rounded"
          >
            <option value="All">All Cities</option>
            {cityList.map((city, i) => (
              <option key={i} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* ================= Showtimes ================= */}
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
    </div>
  );
}