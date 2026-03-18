"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchFilterBar from "@/components/common/searchFilterBar/searchFilterBar";
import MovieShowtimeCard from "@/components/common/showTimeMovie";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/router";
import LoadingPage from "@/components/loading/LoadingPage";

// ===== Types =====
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

type MovieCardData = {
    id: string;
    title: string;
    posterUrl: string;
    genres: string[];
    language: string[];
    halls: HallData[];
    location: string;
    status: string;
    hearingAssistance: boolean;
    wheelchairAccess: boolean;
    date?: string;
};

// ===== Constants =====
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SearchResultPage() {
    const router = useRouter();

    /* ================= State Management ================= */
    const [movies, setMovies] = useState<MovieCardData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [currentFilters, setCurrentFilters] = useState<any>(null);

    // Filter Options
    const [languageOptions, setLanguageOptions] = useState<string[]>([]);
    const [genreOptions, setGenreOptions] = useState<string[]>([]);
    const [cityOptions, setCityOptions] = useState<string[]>([]);

    /* ================= Data Fetching & Transformation ================= */
    // Responsibility: Fetch search results and aggregate flat database rows into nested movie/hall schedules
    const fetchMovies = async (filters?: any, page: number = 1) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters?.title) params.append("title", filters.title);
            if (filters?.language) params.append("language", filters.language);
            if (filters?.genre) params.append("genre", filters.genre);
            if (filters?.city) params.append("city", filters.city);
            if (filters?.date) params.append("showtime.start_time", filters.date);
            if (filters?.hearingAssistance) params.append("hearingAssistance", "true");
            if (filters?.wheelchairAccess) params.append("wheelchairAccess", "true");
            params.append("page", String(page));

            const res = await axios.get(`${API_URL}/search/movies?${params.toString()}`);
            const json = res.data;

            if (json.pagination) {
                setTotalPages(json.pagination.totalPages || 1);
                setCurrentPage(json.pagination.currentPage || page);
            }

            // Sync the effective date from server back into filters
            if (json.date) {
                const synced = { ...(filters || {}), date: json.date };
                setCurrentFilters(synced);
            } else if (filters && filters.date) {
                // If the backend didn't return a date but frontend had one
                // this is a fallback, but normally happens if json.date is removed.
            } else if (json.date === undefined && (filters?.date === undefined || filters?.date === "")) {
                // Remove date from current filters if backend returns no date
                const { date, ...restFilters } = currentFilters || {};
                setCurrentFilters(restFilters);
            }

            if (json.data && json.data.length > 0) {
                setMovies(json.data);
            } else {
                setMovies([]);
                if (!json.pagination) setTotalPages(1);
            }
        } catch (error) {
            console.error("Search error:", error);
            setMovies([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFilterSearch = async () => {
        try {
            const res = await axios.get(`${API_URL}/search/filter`);
            const json = res.data;

            if (json.languages) setLanguageOptions(json.languages);
            if (json.genres) setGenreOptions(json.genres);
            if (json.cities) setCityOptions(json.cities);
        } catch (error) {
            console.error("Failed to fetch filter options:", error);
        }
    };

    /* ================= Suggestion Fetching ================= */
    // Responsibility: Debounce API calls while user is typing in the title input
    const fetchSuggestions = (value: string) => {
        if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);

        if (value.length < 1) {
            setTitleSuggestions([]);
            return;
        }

        suggestDebounceRef.current = setTimeout(async () => {
            try {
                const res = await axios.get(`${API_URL}/search/suggest`, { params: { title: value } });
                setTitleSuggestions(res.data.suggestions || []);
            } catch {
                setTitleSuggestions([]);
            }
        }, 300);
    };

    /* ================= Lifecycle & Sync ================= */
    // Responsibility: Initialize options and sync URL query parameters to local state on first load
    useEffect(() => {
        if (!router.isReady) return;

        fetchFilterSearch();

        const queryParams = router.query;
        const title = queryParams.title;
        const language = queryParams.language;
        const genre = queryParams.genre;
        const city = queryParams.city;
        const showtimeStartTime = queryParams["showtime.start_time"];
        const hearingAssistance = queryParams.hearingAssistance;
        const wheelchairAccess = queryParams.wheelchairAccess;

        const hasFilters = title || language || genre || city || showtimeStartTime || hearingAssistance || wheelchairAccess;

        if (hasFilters) {
            const filtersFromQuery = {
                title: (title as string) || "",
                language: (language as string) || "",
                genre: (genre as string) || "",
                city: (city as string) || "",
                date: (showtimeStartTime as string) || "",
                wheelchairAccess: wheelchairAccess === "true",
                hearingAssistance: hearingAssistance === "true",
            };
            setCurrentFilters(filtersFromQuery);
            fetchMovies(filtersFromQuery, 1);
        } else {
            // No default filters, just fetch all movies
            setCurrentFilters({});
            fetchMovies({}, 1);
        }
    }, [router.isReady]);

    /* ================= Event Handlers ================= */
    const handleSearch = async (filters: any) => {
        setCurrentFilters(filters);
        await fetchMovies(filters, 1);
    };

    const handleClear = () => {
        setCurrentFilters(null);
        fetchMovies(undefined, 1);
    };

    const handlePageChange = (page: number) => {
        fetchMovies(currentFilters, page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= Schedule Availability ================= */
    // คำนวณ isAvailable ของแต่ละ schedule โดยอิงจากวันที่ + เวลา (ใช้เวลาเครื่อง client)
    const getProcessedHalls = (halls: HallData[], movieDate?: string): HallData[] => {
        const effectiveDate = movieDate || currentFilters?.date;
        if (!effectiveDate) return halls; // ไม่มีวันที่ ใช้ logic เดิม

        const now = new Date();
        const todayStr = now.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }); // YYYY-MM-DD ตาม local timezone

        if (effectiveDate < todayStr) {
            // วันที่ผ่านไปแล้ว → ทุก schedule disabled
            return halls.map((hall) => ({
                ...hall,
                schedules: hall.schedules.map((s) => ({ ...s, isAvailable: false })),
            }));
        }

        if (effectiveDate > todayStr) {
            // วันที่ยังมาไม่ถึง → ทุก schedule available
            return halls.map((hall) => ({
                ...hall,
                schedules: hall.schedules.map((s) => ({ ...s, isAvailable: true })),
            }));
        }

        // วันนี้ → ไม่ set isAvailable ให้ TimeSelection ใช้ logic เวลาเดิม
        return halls;
    };

    /* ================= View Logic ================= */
    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="flex flex-col">

            {/* Search Filters */}
            <SearchFilterBar
                onSearch={handleSearch}
                onClear={handleClear}
                onTitleChange={fetchSuggestions}
                titleSuggestions={titleSuggestions}
                initialFilters={currentFilters ?? undefined}
                languageOptions={languageOptions}
                genreOptions={genreOptions}
                cityOptions={cityOptions}
            />

            {/* Main Content */}
            <main className="flex flex-col gap-[24px] pt-[24px] pb-[40px] md:gap-[40px] md:px-[120px] md:pt-[40px] md:pb-[120px]">
                {/* Loading State */}

                {/* Movie Results */}
                <div className="w-full">
                    {!isLoading && (
                        <section className="flex flex-col gap-[24px]">
                            {movies.length > 0 ? (
                                movies.map((movie) => (
                                    <MovieShowtimeCard
                                        key={`${movie.id}-${movie.location}-${movie.date ?? 'nodate'}`}
                                        title={movie.title}
                                        posterUrl={movie.posterUrl}
                                        genres={movie.genres}
                                        language={movie.language}
                                        halls={getProcessedHalls(movie.halls, movie.date)}
                                        location={movie.location}
                                        status={movie.status}
                                        isShow={true}
                                        hearingAssistance={movie.hearingAssistance}
                                        wheelchairAccess={movie.wheelchairAccess}
                                        date={
                                            movie.status === "Now Showing"
                                                ? movie.date
                                                    ? new Date(movie.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                    : currentFilters?.date
                                                        ? new Date(currentFilters.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                        : undefined
                                                : undefined
                                        }
                                        onSelectTime={(showtimeId) => router.push(`/booking/${showtimeId}`)}
                                        onClickMovieDetail={() => router.push(`/movies/${movie.id}`)}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col justify-center items-center py-20 text-brand-gray-300">
                                    <p className="text-headline-4">No results found</p>
                                    <p className="mt-2 text-body-2">
                                        Try adjusting your filters or search for a different movie.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}
                </div>

                {/* Pagination */}
                {!isLoading && movies.length > 0 && (
                    <nav aria-label="Pagination" className="flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </nav>
                )}
            </main>
        </div>
    );
}
