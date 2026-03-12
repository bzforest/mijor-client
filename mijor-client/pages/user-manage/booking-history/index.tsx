import { useEffect, useState } from "react";
import { fetchBookingHistory } from "@/services/historyService";
import { BookingHistoryItem } from "@/types/bookingHistory";
import { bookingStatusConfig } from "@/utils/booking/bookingStatusConfig";
import Pagination from "@/components/ui/pagination";
import { mapBookingStatus } from "@/utils/booking/mapBookingStatus";
import BookingCard from "@/components/common/bookingCard";
import type { BookingCardProps } from "@/components/common/bookingCard";
import MenuSidebar from "@/components/common/menuSidebar";
import LoadingPage from "@/components/loading/LoadingPage";
import router from "next/router";
import Button from "@/components/ui/Button";

function mapHistoryToCard(item: BookingHistoryItem): BookingCardProps {
  const dateObj = new Date(item.start_time);

  return {
    title: item.title || "",
    picture: item.poster_url || "",

    cinema: "Major Cineplex",
    hall: "Hall 1",

    date: item.start_time,
    time: dateObj.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    }),

    bookingNo: item.booking_id.slice(0, 8).toUpperCase(),
    bookedDate: item.created_at,

    tickets: item.seats?.length || 0,
    selectedSeat: item.seats?.join(", ") || "-",

    paymentMethod: "Credit card",

    status: mapBookingStatus(item.status),

    variant: "desktop",
  };
}

export default function BookingHistoryPage() {
  const [data, setData] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchBookingHistory()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="px-4 md:px-16 py-8 md:py-12">
        <div className="w-full lg:max-w-[1300px] lg:mx-auto lg:flex lg:gap-12 lg:items-start">
          <MenuSidebar />

          <div className="flex flex-col">
            <h1 className="text-headline-2 md:text-headline-3 font-semibold mb-8 md:mb-10">
              Booking history
            </h1>

            <div className="flex flex-col gap-12">
              {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <h2 className="text-headline-3 text-white pb-2">
                    No bookings yet
                  </h2>

                  <p className="text-body-2 text-brand-gray-300 pb-6">
                    You haven't booked any tickets. Start exploring movies now.
                  </p>

                  <Button variant="text" onClick={() => router.push("/")}>
                    Back to home
                  </Button>
                </div>
              ) : (
                currentData.map((item) => {
                  const card = mapHistoryToCard(item);

                  return <BookingCard key={item.booking_id} {...card} />;
                })
              )}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
