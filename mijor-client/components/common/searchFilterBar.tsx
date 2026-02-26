"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";

type SearchFilters = {
    title: string;
    language: string;
    genre: string;
    city: string;
    releaseDate: string;
    wheelchairAccess: boolean;
    hearingAssistance: boolean;
};

type SearchFilterBarProps = {
    onSearch: (filters: SearchFilters) => void;
    onClear?: () => void;
    onTitleChange?: (value: string) => void;
    titleSuggestions?: string[];
    initialFilters?: Partial<SearchFilters>;
    languageOptions?: string[];
    genreOptions?: string[];
    cityOptions?: string[];
    isShow?: boolean;
};

// ===== Constants =====
const INITIAL_FILTERS: SearchFilters = {
    title: "",
    language: "",
    genre: "",
    city: "",
    releaseDate: "",
    wheelchairAccess: false,
    hearingAssistance: false,
};

export default function SearchFilterBar({
    onSearch,
    onClear,
    onTitleChange,
    titleSuggestions = [],
    initialFilters,
    languageOptions = [],
    genreOptions = [],
    cityOptions = [],
    isShow = true,
}: SearchFilterBarProps) {
    /* ================= State Management ================= */
    // Responsibility: Manage local filter inputs and sync with ref to ensure `onSearch` closure always accesses the latest values.
    const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
    const filtersRef = useRef<SearchFilters>(INITIAL_FILTERS);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const titleWrapperRef = useRef<HTMLDivElement>(null);

    const updateFilter = (key: keyof SearchFilters, value: string | boolean) => {
        setFilters((prev) => {
            const next = { ...prev, [key]: value };
            filtersRef.current = next;
            return next;
        });
    };

    /* ================= Outside Click — close dropdown ================= */
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (titleWrapperRef.current && !titleWrapperRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleMouseDown);
        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, []);

    /* ================= Sync initialFilters (once) ================= */
    // Responsibility: Pre-populate inputs when navigating from landing page with query params.
    // Uses a ref flag so it only runs once — prevents overwriting user edits on re-renders.
    const initializedRef = useRef(false);
    useEffect(() => {
        if (initialFilters && !initializedRef.current) {
            const merged = { ...INITIAL_FILTERS, ...initialFilters };
            setFilters(merged);
            filtersRef.current = merged;
            initializedRef.current = true;
        }
    }, [initialFilters]);

    /* ================= Actions ================= */
    const handleSearch = () => {
        setShowSuggestions(false);
        onSearch(filtersRef.current);
    };

    const handleTitleChange = (value: string) => {
        updateFilter("title", value);
        onTitleChange?.(value);
        setShowSuggestions(value.length >= 1);
    };

    const handleSuggestionClick = (suggestion: string) => {
        updateFilter("title", suggestion);
        filtersRef.current = { ...filtersRef.current, title: suggestion };
        setShowSuggestions(false);
        onTitleChange?.("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
        if (e.key === "Escape") {
            setShowSuggestions(false);
        }
    };

    const handleClear = () => {
        filtersRef.current = INITIAL_FILTERS;
        setFilters(INITIAL_FILTERS);
        setShowSuggestions(false);
        onTitleChange?.("");
        onClear?.();
    };

    /* ================= View Logic ================= */
    const selectClass = "w-full py-[12px] pl-[16px] pr-[12px] bg-brand-gray-100 text-white text-body-2 cursor-pointer border border-brand-gray-200 rounded-[4px] focus:border-brand-gray-300 focus:outline-none";

    const allLanguages = ["Any language", ...languageOptions];
    const allGenres = ["All genre", ...genreOptions];
    const allCities = ["All city", ...cityOptions];

    const containerDynamicClass = isShow
        ? "gap-[16px] md:px-[120px] md:py-[40px]"
        : "h-[264px] gap-[24px] rounded-[4px] md:h-[128px] md:p-[40px]";

    return (
        <search>
            <section
                className={`w-auto p-[16px] bg-brand-gray-0 shadow-[4px_4px_30px_0_#00000080] ${containerDynamicClass}`}
            >
                {/* --- Filter Row: flex-col for mobile, grid for desktop --- */}
                <div className="flex flex-col items-center justify-start gap-3 md:grid md:grid-cols-6 md:gap-x-3 md:gap-y-6">

                    {/* Movie Title with Autocomplete */}
                    <div ref={titleWrapperRef} className="relative w-full md:col-span-1">
                        <input
                            type="text"
                            value={filters.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => {
                                if (filters.title.length >= 1 && titleSuggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            placeholder="Search movie..."
                            className="w-full py-[12px] pl-[16px] pr-[12px] bg-brand-gray-100 text-white text-body-2 border border-brand-gray-200 rounded-[4px] focus:border-brand-gray-300 focus:outline-none"
                        />

                        {/* Suggestion Dropdown */}
                        {showSuggestions && titleSuggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-[2px] bg-brand-gray-0 border border-brand-gray-100 rounded-[4px] shadow-[0_8px_24px_0_#00000060] overflow-hidden">
                                {titleSuggestions.map((suggestion, idx) => (
                                    <li
                                        key={idx}
                                        onMouseDown={(e) => {
                                            // prevent blur before click registers
                                            e.preventDefault();
                                            handleSuggestionClick(suggestion);
                                        }}
                                        className="px-[16px] py-[10px] text-white text-body-2 cursor-pointer hover:bg-brand-gray-100 transition-colors"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex flex-row justify-between w-full gap-[12px] md:contents">
                        {/* Language */}
                        <div className="relative w-full md:col-span-1">
                            <select
                                value={filters.language}
                                onChange={(e) => updateFilter("language", e.target.value)}
                                className={selectClass}
                            >
                                {allLanguages.map((language, id) => (
                                    <option key={id} value={language === "Any language" ? "" : language}>
                                        {language}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Genre */}
                        <div className="relative w-full md:col-span-1">
                            <select
                                value={filters.genre}
                                onChange={(e) => updateFilter("genre", e.target.value)}
                                className={selectClass}
                            >
                                {allGenres.map((genre, id) => (
                                    <option key={id} value={genre === "All genre" ? "" : genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-row justify-between w-full gap-[12px] md:contents">
                        {/* City */}
                        <div className="w-full md:col-span-1">
                            <div className="relative">
                                <select
                                    value={filters.city}
                                    onChange={(e) => updateFilter("city", e.target.value)}
                                    className={`${selectClass} w-full`}
                                >
                                    {allCities.map((city, id) => (
                                        <option key={id} value={city === "All city" ? "" : city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="w-full md:col-span-1">
                            <input
                                type="date"
                                value={filters.releaseDate}
                                onChange={(e) => updateFilter("releaseDate", e.target.value)}
                                className={`${selectClass} [color-scheme:dark]`}
                                placeholder="All date"
                            />
                        </div>
                    </div>

                    {/* --- Checkbox Row --- */}
                    {isShow && (
                        <div className="flex items-center justify-between gap-[24px] md:col-span-5 md:justify-start">
                            <div className="flex items-center gap-6">
                                <Checkbox
                                    label="Wheelchair access"
                                    checked={filters.wheelchairAccess}
                                    onChange={(e) => updateFilter("wheelchairAccess", e.target.checked)}
                                />
                                <Checkbox
                                    label="Hearing assistance"
                                    checked={filters.hearingAssistance}
                                    onChange={(e) => updateFilter("hearingAssistance", e.target.checked)}
                                />
                            </div>
                        </div>
                    )}

                    {/* --- Action Buttons --- */}
                    <div className="flex items-center gap-[24px] md:contents">
                        <button
                            onClick={handleSearch}
                            className="w-full md:w-[72px] px-[24px] py-[12px] bg-brand-blue-100 cursor-pointer rounded-[4px] hover:bg-brand-blue-100/50 active:bg-brand-blue-100 md:col-span-1 md:col-start-6 md:row-start-1 md:w-auto"
                        >
                            <Search size={24} strokeWidth={1.5} className="mx-auto text-white" />
                        </button>

                        {isShow && (
                            <button
                                onClick={handleClear}
                                className="w-full text-white text-body-1-bold underline decoration-brand-gray-400 hover:text-white/50 hover:decoration-white/50 md:col-span-1 md:col-start-6 md:row-start-2 md:text-right"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </search>
    );
}