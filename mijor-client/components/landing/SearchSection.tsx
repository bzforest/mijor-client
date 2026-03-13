"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import SearchFilterBar from "@/components/common/searchFilterBar/searchFilterBar";
import Banner from "@/assets/landing/banner.jpg";

// ===== Constants =====
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function SearchSection() {
    const router = useRouter();

    /* ================= State Management ================= */
    const [languageOptions, setLanguageOptions] = useState<string[]>([]);
    const [genreOptions, setGenreOptions] = useState<string[]>([]);
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const suggestDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ================= Data Fetching ================= */
    // Responsibility: Fetch search filter options to populate dropdowns on initial load.
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const res = await axios.get(`${API_URL}/search/filter`);
                const json = res?.data || {};

                if (json.languages) setLanguageOptions(json.languages);
                if (json.genres) setGenreOptions(json.genres);
                if (json.cities) setCityOptions(json.cities);
            } catch (error) {
                console.error("Failed to fetch filter options:", error);
                setLanguageOptions([]);
                setGenreOptions([]);
                setCityOptions([]);
            }
        };
        fetchFilterOptions();
    }, []);

    /* ================= Suggestion Fetching ================= */
    const fetchSuggestions = (value: string) => {
        if (suggestDebounceRef.current) clearTimeout(suggestDebounceRef.current);

        if (value.length < 1) {
            setTitleSuggestions([]);
            return;
        }

        suggestDebounceRef.current = setTimeout(async () => {
            try {
                const res = await axios.get(`${API_URL}/search/suggest`, { params: { title: value } });
                setTitleSuggestions(res?.data?.suggestions || []);
            } catch {
                setTitleSuggestions([]);
            }
        }, 300);
    };

    /* ================= Event Handlers ================= */
    // Responsibility: Construct query parameters from selected filters and navigate to the search results page.
    const handleSearch = (filters: any) => {
        const query: Record<string, string> = {};

        if (filters.title) query.title = filters.title;
        if (filters.language) query.language = filters.language;
        if (filters.genre) query.genre = filters.genre;
        if (filters.city) query.city = filters.city;
        if (filters.date) {
            query["showtime.start_time"] = filters.date;
        }

        router.push({
            pathname: "/search-result",
            query,
        });
    };

    return (
        <div className="relative w-full h-[400px] lg:h-[500px]">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-[265px] lg:h-[400px]" >
                <img
                    src={Banner.src}
                    alt="banner"
                    className="absolute inset-0 w-full h-[265px] lg:h-[400px] opacity-60"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/0" />

                {/* Blur Layer (optional) */}
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {/* Search Filters */}
                <div className="absolute z-50 w-[344px] left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2
                    lg:w-[calc(100%-48px)] xl:w-[1200px] lg:left-1/2 lg:-translate-x-1/2 lg:bottom-0 lg:translate-y-1/2 ">
                    <SearchFilterBar
                        onSearch={handleSearch}
                        onTitleChange={fetchSuggestions}
                        titleSuggestions={titleSuggestions}
                        languageOptions={languageOptions}
                        genreOptions={genreOptions}
                        cityOptions={cityOptions}
                        isShow={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchSection;