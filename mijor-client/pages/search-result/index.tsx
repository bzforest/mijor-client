"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchFilterBar from "@/components/common/searchFilterBar/searchFilterBar";
import MovieShowtimeCard from "@/components/common/showTimeMovie";
import Pagination from "@/components/ui/pagination";
import { useRouter } from "next/router";

// ===== Types =====
type Schedule = {
    id: string;
    time: string;
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
};

// ===== Constants =====
const API_URL = process.env.CONNECTION_STRING || "http://localhost:4000";

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
            fetchMovies();
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

    /* ================= View Logic ================= */
    return (
        <div className="flex flex-col bg-brand-gray-100">

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
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-2 rounded-full border-brand-blue-100 border-t-transparent animate-spin" />
                    </div>
                )}

                {/* Movie Results */}
                <div className="w-full">
                    {!isLoading && (
                        <section className="flex flex-col gap-[24px]">
                            {movies.length > 0 ? (
                                movies.map((movie) => (
                                    <MovieShowtimeCard
                                        key={`${movie.id}-${movie.location}`}
                                        title={movie.title}
                                        posterUrl={movie.posterUrl}
                                        genres={movie.genres}
                                        language={movie.language}
                                        halls={movie.halls}
                                        location={movie.location}
                                        status={movie.status}
                                        isShow={true}
                                        hearingAssistance={movie.hearingAssistance}
                                        wheelchairAccess={movie.wheelchairAccess}
                                        onClick={() => router.push(`/landing`)}
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
