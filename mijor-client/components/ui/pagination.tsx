import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const paginationRange = useMemo(() => {
    const siblingCount = 1; // แสดงหน้าซ้ายขวาของหน้าปัจจุบัน

    // ถ้าหน้าทั้งหมดน้อยกว่าที่กำหนด ให้แสดงเลขทุกหน้า
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    // ยุบเป็น ... เฉพาะฝั่งขวา
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // ยุบเป็น ... เฉพาะฝั่งซ้าย
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [1, "...", ...rightRange];
    }

    // ยุบเป็น ... ทั้งสองฝั่ง
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }

    return [];
  }, [currentPage, totalPages]);

  // ส่วนของ UI Render
  return (
    <div className="flex items-center gap-2">
      {/* ปุ่มไปทางซ้าย */}
      <button
        onClick={() => {
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
            setTimeout(() => {window.scrollTo({ top: 0, behavior: 'smooth' });}, 0);
          }
        }}
        disabled={currentPage === 1}
        className="p-3 text-brand-gray-300 hover:text-white disabled:opacity-20 transition-colors"
      >
        <ChevronLeft />
      </button>

      {/* ปุ่มเลขหน้า */}
      <div className="flex gap-2">
        {paginationRange.map((pageNumber, index) => {
          // ถ้าเป็นเครื่องหมาย ... ให้ Render เป็นข้อความเฉยๆ
          if (pageNumber === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="w-[40px] h-[40px] flex items-center justify-center text-brand-gray-300"
              >
                ...
              </span>
            );
          }

          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(Number(pageNumber))}
              className={`
                w-[40px] h-[40px] flex items-center justify-center rounded-[4px] font-bold transition-all
                ${
                  isActive
                    ? "bg-brand-gray-100 text-white shadow-lg"
                    : "bg-brand-gray-0 text-brand-gray-300 hover:bg-brand-gray-100/10 hover:text-white"
                }
              `}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* ปุ่มไปทางขวา */}
      <button
        onClick={() => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            setTimeout(() => {window.scrollTo({ top: 0, behavior: 'smooth' });}, 0);
          }
        }}
        disabled={currentPage === totalPages}
        className="p-3 text-brand-gray-300 hover:text-white disabled:opacity-20 transition-colors"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
