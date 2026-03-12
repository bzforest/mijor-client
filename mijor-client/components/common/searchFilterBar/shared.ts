"use client";

import * as React from "react";

// ===== Types =====
export type SearchFilters = {
  title: string;
  language: string;
  genre: string;
  city: string;
  date: string;
  wheelchairAccess: boolean;
  hearingAssistance: boolean;
};

export type SearchFilterBarProps = {
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
export const INITIAL_FILTERS: SearchFilters = {
  title: "",
  language: "",
  genre: "",
  city: "",
  date: "",
  wheelchairAccess: false,
  hearingAssistance: false,
};

// ===== Helper Functions สำหรับแปลงวันที่ =====
export function formatDisplayDate(date: Date | undefined) {
  if (!date || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function toDateString(date: Date | undefined) {
  if (!date || isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateString(dateStr: string | undefined) {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

// ===== Common Styles =====
export const selectClass =
  "flex-1 w-full xl:w-[177px] max-w-[177px] py-[12px] pl-[16px] pr-[12px] bg-brand-gray-100 placeholder:text-brand-gray-300 data-[placeholder]:text-brand-gray-300 text-body-2 cursor-pointer border border-brand-gray-200 rounded-[4px] focus:border-brand-gray-300 focus:outline-none transition-all active:scale-[0.98]";

export const contentClass =
  "bg-brand-gray-0 border-brand-gray-100 text-white shadow-2xl overflow-hidden";
