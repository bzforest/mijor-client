"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import * as React from "react"

import { SearchFilters, SearchFilterBarProps, INITIAL_FILTERS, selectClass, contentClass } from "./shared";
import { CustomDatePicker } from "./CustomDatePicker";

function SearchResultMobile({
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
        if (e.key === "Enter") handleSearch();
        if (e.key === "Escape") setShowSuggestions(false);
    };

    const handleClear = () => {
        filtersRef.current = INITIAL_FILTERS;
        setFilters(INITIAL_FILTERS);
        setShowSuggestions(false);
        onTitleChange?.("");
        onClear?.();
    };

    /* ================= View Logic ================= */
    const allLanguages = ["Any language", ...languageOptions];
    const allGenres = ["All genre", ...genreOptions];
    const allCities = ["All city", ...cityOptions];

    return (
        <search className="lg:hidden flex flex-col gap-[16px] p-[16px] w-full shadow-[4px_4px_30px_0_#00000080] bg-brand-gray-0">
            <div className="flex flex-col gap-[12px] w-full">
                {/* Movie Title */}
                <div ref={titleWrapperRef} className="relative w-full">
                    <input
                        type="text"
                        value={filters.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (filters.title.length >= 1 && titleSuggestions.length > 0) setShowSuggestions(true);
                        }}
                        placeholder="Search movie..."
                        className="w-full py-[12px] pl-[16px] pr-[12px] bg-brand-gray-100 dark:bg-brand-gray-100 text-white text-body-2 border border-brand-gray-200 rounded-[4px] focus:border-brand-gray-300 focus:outline-none"
                    />
                    {showSuggestions && titleSuggestions.length > 0 && (
                        <ul className="absolute top-[calc(100%+4px)] mt-1 left-0 z-50 w-full origin-top overflow-y-auto rounded-md border border-brand-gray-100 bg-brand-gray-0 text-white shadow-md py-1 px-1">
                            {titleSuggestions.map((suggestion, idx) => (
                                <li
                                    key={idx}
                                    onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(suggestion); }}
                                    className="px-2 py-2 text-white text-body-2 cursor-pointer hover:bg-brand-gray-100 hover:text-black hover:rounded-lg hover:bg-white"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                    <Select
                        value={filters.language === "" ? "all_languages" : filters.language}
                        onValueChange={(val) => updateFilter("language", val === "all_languages" ? "" : val)}
                    >
                        <SelectTrigger className={`${selectClass} ${filters.language === "" ? "text-brand-gray-300" : "text-white"}`}>
                            <SelectValue placeholder="Any language" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={4} avoidCollisions={false} className={contentClass}>
                            <SelectGroup>
                                {allLanguages.map((language, id) => (
                                    <SelectItem key={id} value={language === "Any language" ? "all_languages" : language}>
                                        {language}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.genre === "" ? "all_genres" : filters.genre}
                        onValueChange={(val) => updateFilter("genre", val === "all_genres" ? "" : val)}
                    >
                        <SelectTrigger className={`${selectClass} ${filters.genre === "" ? "text-brand-gray-300" : "text-white"}`}>
                            <SelectValue placeholder="All genre" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={4} avoidCollisions={false} className={contentClass}>
                            <SelectGroup>
                                {allGenres.map((genre, id) => (
                                    <SelectItem key={id} value={genre === "All genre" ? "all_genres" : genre}>
                                        {genre}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                    <Select
                        value={filters.city === "" ? "all_cities" : filters.city}
                        onValueChange={(val) => updateFilter("city", val === "all_cities" ? "" : val)}
                    >
                        <SelectTrigger className={`${selectClass} ${filters.city === "" ? "text-brand-gray-300" : "text-white"}`}>
                            <SelectValue placeholder="All city" />
                        </SelectTrigger>
                        <SelectContent position="popper" side="bottom" sideOffset={4} avoidCollisions={false} className={contentClass}>
                            <SelectGroup>
                                {allCities.map((city, id) => (
                                    <SelectItem key={id} value={city === "All city" ? "all_cities" : city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <CustomDatePicker
                        value={filters.date}
                        onChange={(val) => updateFilter("date", val)}
                        className={selectClass}
                    />
                </div>

                <div className="flex flex-row justify-center gap-[24px]">
                    {isShow && (
                        <div className="flex items-center justify-between gap-[24px]">
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
                </div>
            </div>

            <div className="flex flex-row justify-center gap-[24px]">
                <button
                    onClick={handleSearch}
                    className="w-[72px] px-[24px] py-[12px] bg-brand-blue-100 cursor-pointer rounded-[4px] hover:bg-brand-blue-100/50 active:bg-brand-blue-100 transition-all active:scale-[0.95]"
                >
                    <Search size={24} strokeWidth={1.5} className="mx-auto text-white" />
                </button>

                <Button
                    onClick={handleClear}
                    variant="text"
                    type="button"
                    children="Clear"
                    className="transition-all active:scale-[0.95]"
                />
            </div>
        </search>
    );
}

export default SearchResultMobile;
