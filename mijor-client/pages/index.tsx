"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";

import { fetchCoupons, Coupon } from "@/services/couponApi";
import { fetchUserCoupons } from "@/services/couponService";
import { useCinemas } from "@/hooks/useCinemas";
import { useAuth } from "@/contexts/AuthContext";

import MovieCard from "@/components/common/movieCard";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import CityCard from "@/components/common/cityCard";
import Segmented from "@/components/common/segmented";
import SearchSection from "@/components/landing/SearchSection";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Footer from "@/components/common/footer";

import { formatDate } from "@/utils/dateUtils";

/* ================= API ================= */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ================= TYPES ================= */
type Movie = {
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
  const [userCouponIds, setUserCouponIds] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  /* ================= CINEMA ================= */
  const { cinemas, isNearestFirst, toggleSort, loading, errorAlert } =
    useCinemas();

  const groupedCinemas = cinemas.reduce((acc, cinema) => {
    const cityName = cinema.cities?.name || "Other";
    if (!acc[cityName]) acc[cityName] = [];
    acc[cityName].push(cinema);
    return acc;
  }, {} as Record<string, typeof cinemas>);

  const sortedCities = Object.keys(groupedCinemas).sort();

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
            let genres: string[] = [];

            try {
              const { data: genreRes } = await axios.get(
                `${API_URL}/moviegenres/${movie.id}`
              );
              if (Array.isArray(genreRes.data)) {
                genres = genreRes.data.map((g: any) => g.name);
              }
            } catch {
              console.log("Cannot load genres:", movie.id);
            }

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
        const userCoupons = await fetchUserCoupons();
        const ids = userCoupons.map((uc: any) => uc.coupon_id);
        setUserCouponIds(ids);
      } else {
        setUserCouponIds([]);
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
  const getUniqueBrandCoupons = (
    allCoupons: Coupon[],
    limit: number = 4
  ) => {
    const result: Coupon[] = [];
    const seenBrands = new Set<string>();

    for (const coupon of allCoupons) {
      if (!seenBrands.has(coupon.brand) && result.length < limit) {
        seenBrands.add(coupon.brand);
        result.push(coupon);
      }
    }

    return result;
  };

  const refreshUserCoupons = async () => {
    if (!user) return;

    try {
      const userCoupons = await fetchUserCoupons();
      const ids = userCoupons.map((uc: any) => uc.coupon_id);
      setUserCouponIds(ids);
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to refresh user coupons:", error);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div>
      <SearchSection />

      {/* MOVIES */}
      <section className="bg-brand-gray-900 text-white px-6 lg:px-20 py-16">
        <div className="flex gap-8 mb-10">
          <button onClick={() => setActiveTab("now")}>
            Now Showing
          </button>
          <button onClick={() => setActiveTab("soon")}>
            Coming Soon
          </button>
        </div>

        {loadingMovies && <p>Loading movies...</p>}
        {movieError && <p className="text-red-500">{movieError}</p>}

        {!loadingMovies && !movieError && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie as any}
                  variant="desktop"
                />
              ))
            ) : (
              <p>No movies available</p>
            )}
          </div>
        )}
      </section>

      {/* COUPONS */}
      <section className="px-6 py-12">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Special Coupons
          </h2>
          <Button
            variant="text"
            onClick={() => router.push("/coupons")}
          >
            View all
          </Button>
        </div>

        <div className="flex flex-wrap gap-5">
          {getUniqueBrandCoupons(coupons).map((coupon) => (
            <CardCouponVertical
              key={coupon.id}
              coupon_id={coupon.id.toString()}
              userCoupons={userCouponIds}
              onCouponSaved={refreshUserCoupons}
              imageSrc={coupon.image_url}
              title={coupon.title}
              validUntil={formatDate(coupon.valid_until)}
              onClick={() =>
                router.push(`/coupons/${coupon.id}`)
              }
            />
          ))}
        </div>
      </section>

      {/* CINEMAS */}
      <div className="bg-brand-gray-0 text-white py-10 px-6">
        <h2 className="text-3xl font-bold mb-6">
          All cinemas
        </h2>

        <Segmented
          options={[
            { label: "Browse by City" },
            { label: "Nearest Locations First" },
          ]}
          checked={isNearestFirst}
          onClick={toggleSort}
        />

        <div className="mt-8">
          {loading ? (
            <p>Loading cinemas...</p>
          ) : isNearestFirst ? (
            cinemas.map((cinema: any) => (
              <CityCard
                key={cinema.id}
                id={cinema.id}
                cinema={cinema.name}
                length={cinema.length}
                address={cinema.location}
              />
            ))
          ) : (
            sortedCities.map((city) => (
              <div key={city}>
                <h3 className="mt-6 mb-4">{city}</h3>
                {groupedCinemas[city].map((cinema: any) => (
                  <CityCard
                    key={cinema.id}
                    id={cinema.id}
                    cinema={cinema.name}
                    length={cinema.length}
                    address={cinema.location}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {showAlert && (
        <Alert
          type="success"
          title="Coupon Claimed!"
          message="You can find it in My Coupons"
          onClose={() => setShowAlert(false)}
        />
      )}

      {errorAlert && (
        <Alert
          type="error"
          title={errorAlert.title}
          message={errorAlert.message}
        />
      )}

      <Footer />
    </div>
  );
}

export default LandingPage;