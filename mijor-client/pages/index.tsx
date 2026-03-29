"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import { fetchCoupons, Coupon } from "@/services/couponApi";
import { fetchUserCoupons } from "@/services/couponService";
import { useCinemas } from "@/hooks/useCinemas";
import { useAuth } from "@/contexts/AuthContext";

import SearchSection from "@/components/landing/SearchSection";
import MovieSection, { Movie } from "@/components/landing/MovieSection";
import CouponSection from "@/components/landing/CouponSection";
import CinemaSection from "@/components/landing/CinemaSection";
import MinigameFAB from "@/components/landing/MinigameFAB";
import Alert from "@/components/ui/Alert";
import CouponMinigameModal from "@/components/ui/CouponMinigameModal";

/* ================= API ================= */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function LandingPage() {
  /* ================= AUTH ================= */
  const { user } = useAuth();

  /* ================= MOVIE STATE ================= */
  const [movies, setMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<"now" | "soon">("now");
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [movieError, setMovieError] = useState<string | null>(null);

  /* ================= COUPON STATE ================= */
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<{ coupon_id: string; is_used: boolean }[]>([]);
  const [isMinigameOpen, setIsMinigameOpen] = useState(false);

  /* ================= CINEMA ================= */
  const { cinemas, isNearestFirst, toggleSort, loading, errorAlert } =
    useCinemas();

  /* ================= MINIGAME ================= */
  const [showAlert, setShowAlert] = useState(false);

  /* ================= FETCH MOVIES ================= */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);

        const [moviesRes, activeTodayRes] = await Promise.all([
          axios.get(`${API_URL}/movies`),
          axios
            .get(`${API_URL}/showtimes/active-today`)
            .catch(() => ({ data: { data: [] } })),
        ]);

        if (!Array.isArray(moviesRes.data.data)) {
          setMovies([]);
          return;
        }

        const activeMovieIds: string[] = activeTodayRes.data.data || [];

        const formattedMovies: Movie[] = await Promise.all(
          moviesRes.data.data.map(async (movie: any) => {
            let genres: string[] = Array.isArray(movie.genre) ? movie.genre : [];

            let formattedDate = "";
            if (movie.release_date) {
              const dateObj = new Date(movie.release_date);
              if (!isNaN(dateObj.getTime())) {
                const day = String(dateObj.getDate()).padStart(2, "0");
                const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                const year = dateObj.getFullYear();
                formattedDate = `${day}/${month}/${year}`;
              }
            }

            const dbStatus = movie.status || "";
            let formattedStatus: "now" | "soon" = "now";

            if (
              dbStatus.toLowerCase().includes("soon") ||
              dbStatus.toLowerCase().includes("coming")
            ) {
              formattedStatus = "soon";
            } else if (dbStatus.toLowerCase().includes("now")) {
              formattedStatus = "now";
            }

            const isPlayingToday = activeMovieIds.includes(movie.id);

            return {
              id: movie.id,
              title: movie.title || "Untitled",
              poster_url: movie.poster_url,
              release_date: formattedDate,
              rating: movie.rating || "N/A",
              genre: genres,
              language: Array.isArray(movie.language)
                ? movie.language
                : movie.language
                  ? [movie.language]
                  : [],
              status: formattedStatus,
              hasShowtimeToday: isPlayingToday,
            };
          })
        );

        setMovies(formattedMovies);
      } catch (err) {
        console.error("Movie fetch error:", err);
        setMovieError("Cannot load movies");
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchMovies();
  }, []);

  /* ================= FETCH COUPONS ================= */
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCoupons();
      setCoupons(data);

      if (user) {
        try {
          const data = await fetchUserCoupons();

          setUserCoupons(
            data.map((uc: any) => ({
              coupon_id: uc.coupon_id,
              is_used: uc.is_used,
            }))
          );
        } catch (error: any) {
          // 401 errors will be handled by the AuthContext interceptor
          if (error.response?.status !== 401) {
            console.error("Failed to fetch user coupons:", error);
            setUserCoupons([]);
          }
        }
      } else {
        setUserCoupons([]);
      }
    };

    loadData();
  }, [user]);

  /* ================= FILTER MOVIES ================= */
  const nowMovies = movies
    .filter((m) => m.status === "now" && m.hasShowtimeToday)
    .slice(0, 4);

  const soonMovies = movies
    .filter((m) => m.status === "soon")
    .slice(0, 4);

  const filteredMovies =
    activeTab === "now" ? nowMovies : soonMovies;

  /* ================= COUPON FILTER ================= */
  const refreshUserCoupons = async () => {
    if (!user) return;

    try {
      const data = await fetchUserCoupons();
      setUserCoupons(
        data.map((uc: any) => ({
          coupon_id: uc.coupon_id,
          is_used: uc.is_used,
        }))
      );
      setShowAlert(true);
    } catch (error: any) {
      // 401 errors will be handled by the AuthContext interceptor
      if (error.response?.status !== 401) {
        console.error("Failed to refresh user coupons:", error);
      }
    }
  };

    /* ================= Alert Timeout Coupon ================= */

    useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert]);


  /* ================= RENDER ================= */
  return (
    <div className="flex flex-col overflow-x-hidden">
      <SearchSection />

      <div className="flex flex-col items-center w-full max-w-[1440px] mx-auto">
        {/* MOVIES */}
        <MovieSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loadingMovies={loadingMovies}
          movieError={movieError}
          filteredMovies={filteredMovies}
        />

        {/* COUPONS */}
        <CouponSection
          coupons={coupons}
          userCoupons={userCoupons}
          refreshUserCoupons={refreshUserCoupons}
        />

        {/* CINEMAS */}
        <CinemaSection
          cinemas={cinemas}
          isNearestFirst={isNearestFirst}
          toggleSort={toggleSort}
          loading={loading}
        />
      </div>
      
      {showAlert && (
        <div className="fixed flex items-center justify-center z-50 w-full transform transition-all duration-500 ease-out md:right-10 md:bottom-10 md:w-[440px]">
        <Alert
          type="success"
          title="Coupon Claimed!"
          message="You can find it in My Coupons"
          onClose={() => setShowAlert(false)}
        />
        </div>
      )}

      {errorAlert && (
        <Alert
          type="error"
          title={errorAlert.title}
          message={errorAlert.message}
        />
      )}

      {/* FLOATING ACTION BUTTON FOR MINIGAMES */}
      <MinigameFAB onClick={() => setIsMinigameOpen(true)} />

      <CouponMinigameModal
        isOpen={isMinigameOpen}
        onClose={() => setIsMinigameOpen(false)}
      />

    </div>
  );
}

export default LandingPage;