"use client";

import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DateSelection from "@/components/common/dateSelection";
import CinemaShowTime from "@/components/common/showTimeCinema";
import InputField from "@/components/ui/InputField";
import { ChevronDown } from "lucide-react";


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
  trailer_youtube?: string | null;
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

  const [searchText, setSearchText] = useState("");
  const [selectedCity, setSelectedCity] = useState("City");
  const [cityList, setCityList] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ================= Fetch Cities =================
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/cities`);
        if (Array.isArray(data.data)) {
          setCityList(data.data);
        }
      } catch {
        setCityList(["Bangkok", "Chiang Mai", "Phuket"]);
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

        const [movieRes, showtimeRes] = await Promise.all([
          axios.get(`${API_URL}/movies/${id}`),
          axios.get(
            `${API_URL}/showtimes/movie/${id}?date=${selectedDate}`
          ),
        ]);

        const genres = Array.isArray(movieRes.data.data.genre) ? movieRes.data.data.genre : [];

        setMovie({
          ...movieRes.data.data,
          genre: genres,
        });

        setShowtimes(showtimeRes.data.data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, id, selectedDate]);

  // ================= Close Dropdown =================
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading || !router.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center  text-white">
        Loading...
      </div>
    );
  }

  if (!movie) return null;

  const filteredShowtimes = showtimes.filter((cinema) => {
    const matchCity =
      selectedCity === "City" || cinema.city === selectedCity;

    const matchSearch = cinema.cinema_name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchCity && matchSearch;
  });

  return (
    <div className="min-h-screen text-white ">
      {/* ================= HERO ================= */}
      <section className="px-4 md:px-[100px] py-10 flex justify-center">
        <div className="w-full max-w-[1600px]">
          <div
            className="
              flex flex-col md:flex-row
              gap-8 md:gap-12
              bg-transparent
              backdrop-blur-[24px]
              rounded-2xl
              border border-white/5
              overflow-hidden
            "
          >
            {/* Poster */}
            <div
              className="
                w-full md:w-[420px]
                h-[450px] md:h-[600px]
                flex-shrink-0
                overflow-hidden
              "
            >
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-6 p-6 md:pt-[60px] md:pr-[120px] w-full">
              <h1 className="text-2xl md:text-4xl font-bold">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3">
                {movie.genre.map((g, i) => (
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
                  <p className="mt-2 text-sm text-gray-400">
                    Release date:{" "}
                    {new Date(movie.release_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {movie.trailer_youtube && (
                <button
                  onClick={() => setIsTrailerModalOpen(true)}
                  className="px-6 py-3 w-fit font-semibold bg-brand-blue-100 rounded-md"
                >
                  View Trailer
                </button>
              )}

              {/* 🔥 SYNOPSIS ตัดข้อความอัตโนมัติ */}
              <p
                className="text-gray-300 leading-7"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 5, // จำนวนบรรทัด
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {movie.synopsis}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRAILER MODAL ================= */}
      {isTrailerModalOpen && movie.trailer_youtube && (
        <div className="flex fixed inset-0 z-50 items-center justify-center p-4">
          {/* 1. Backdrop */}
          <div
            className="absolute inset-0 bg-brand-gray-0 backdrop-blur-sm"
            onClick={() => setIsTrailerModalOpen(false)}
          />

          {/* 2. Modal Card */}
          <div className="relative p-6 w-full max-w-7xl bg-brand-gray-100 rounded-[8px] border border-brand-gray-200 shadow-2xl">
            {/* Close Button Icon */}
            <button
              onClick={() => setIsTrailerModalOpen(false)}
              className="absolute top-4 right-4 text-brand-gray-400 hover:text-white transition-colors"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Video Container */}
            <div className="overflow-hidden mt-2 w-full h-[400px] rounded-xl md:h-[700px]">
              <iframe
                src={movie.trailer_youtube}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Movie Trailer"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* ส่วนล่างเหมือนเดิม (Date / Filter / Showtimes) */}
      {/* ================= DATE BAR ================= */}
      <div className="w-full bg-brand-gray-0 pt-6 pb-4">
        <div className="px-6 md:px-[80px]">
          <DateSelection
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
          />
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="px-6 md:px-[80px] py-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:flex-1">
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

        <div ref={dropdownRef} className="relative w-full md:w-[240px]">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="
              h-[55px]
              bg-brand-gray-100
              border-2 border-brand-gray-200
              rounded-[6px]
              px-4
              flex items-center justify-between
              text-sm text-white
              cursor-pointer
            "
          >
            <span>{selectedCity}</span>
            <ChevronDown
              size={18}
              className={`${isOpen ? "rotate-180" : ""} transition`}
            />
          </div>

          {isOpen && (
            <div className="absolute mt-2 w-full bg-brand-gray-0 border border-[#565F7E] rounded-[6px] overflow-hidden z-50">
              <div
                onClick={() => {
                  setSelectedCity("City");
                  setIsOpen(false);
                }}
                className="px-4 py-3 hover:bg-[#2A3154] cursor-pointer"
              >
                All Cities
              </div>

              {cityList.map((city, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-[#2A3154] cursor-pointer"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= SHOWTIMES ================= */}
      <div className="space-y-6 pb-16 px-6 md:px-[80px]">
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
              onSelectTime={(showtimeId) => router.push(`/booking/${showtimeId}`)}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-10">
            No showtimes found.
          </div>
        )}
      </div>
    </div>
  );
}