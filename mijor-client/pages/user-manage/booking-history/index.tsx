import { useEffect, useState } from "react";
import { fetchBookingHistory } from "@/services/historyService";
import { BookingHistoryItem } from "@/types/bookingHistory";
import { useMediaQuery } from "react-responsive"
import { Activity } from "lucide-react"
import Pagination from "@/components/ui/pagination";
import { formatTime, getBookingStatus } from "@/utils/formatTime"
import formatDate from "@/utils/formatDate"
import { mapBookingStatus } from "@/utils/booking/mapBookingStatus";
import BookingDetailModal from "@/components/common/bookingDetailModal";
import BookingCard from "@/components/common/bookingCard";
import type { BookingCardProps } from "@/components/common/bookingCard";
import MenuSidebar from "@/components/common/menuSidebar";
import LoadingPage from "@/components/loading/LoadingPage";
import router from "next/router";
import Button from "@/components/ui/Button";

function mapHistoryToCard(item: BookingHistoryItem, isMobile: boolean): BookingCardProps {

  const validSeats = (item.seats || []).filter(Boolean)
  const time = formatTime(item.start_time)
  const date = formatDate(item.start_time)
  
  // ใช้ helper function ใหม่สำหรับคำนวณสถานะ
  const uiStatus = getBookingStatus(item.start_time, item.status);

  return {
    title: item.title || "",
    picture: item.poster_url || "",

    cinema: "Major Cineplex",
    hall: "Hall 1",

    date: date,
    time: time,

    bookingNo: item.booking_id.slice(0, 8).toUpperCase(),
    bookedDate: item.created_at,

    tickets: validSeats.length,
    selectedSeat: validSeats.length ? validSeats.join(", ") : "-",

    paymentMethod: "Credit card",

    status: mapBookingStatus(uiStatus),

    variant: isMobile ? "mobile" : "desktop",
  };
}

export default function BookingHistoryPage() {
  const [data, setData] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const [firstLoad, setFirstLoad] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryItem | null>(null)

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

const loadHistory = async () => {
    if (firstLoad) setLoading(true)
      else setPageLoading(true)

      const res = await fetchBookingHistory(
        pagination.page,
        pagination.limit
      )

    setData(res.data)
    setPagination(res.pagination)

    setLoading(false)
    setPageLoading(false)
    setFirstLoad(false)
  }

  useEffect(() => {
    loadHistory()
  }, [pagination.page])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <div className="md:px-16 py-8 md:py-12">
        <div className="w-full lg:max-w-[1300px] lg:mx-auto lg:flex lg:gap-12 lg:items-start">
          <MenuSidebar />

          {/* ===== Content ===== */}
          <div className="flex-1">
            <div className="flex flex-col gap-12">
            <h1 className="px-4 text-headline-2 md:text-headline-3 font-semibold">
              Booking history
            </h1>
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
              ) : pageLoading ? (
                <div className="flex flex-col gap-6">
                  <div className="relative h-[180px] w-fit bg-brand-gray-100/30 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                      <Activity 
                        className="text-brand-gray-400 animate-slide-left-to-right" 
                        size={32}
                      />
                    </div>
                  </div>
                  <div className="relative h-[180px] w-fit bg-brand-gray-100/30 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                      <Activity 
                        className="text-brand-gray-400 animate-slide-left-to-right animation-delay-200" 
                        size={32}
                      />
                    </div>
                  </div>
                  <div className="relative h-[180px] w-fit bg-brand-gray-100/30 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                      <Activity 
                        className="text-brand-gray-400 animate-slide-left-to-right animation-delay-400" 
                        size={32}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                data.map((item) => {
                  const card = mapHistoryToCard(item, isMobile)
                  return <BookingCard key={item.booking_id} {...card} 
                  variant={isMobile ? "mobile" : "desktop"} 
                  onClick={() => setSelectedBooking(item)} />
                })
              )}
            </div>
          </div>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => {
                setPagination((prev) => ({ ...prev, page }))

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }}
            />
          </div>
        )}
      </div>
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onCancelled={() => {
            setSelectedBooking(null)
            loadHistory()
          }}
        />
      )}
    </div>
  );
}
