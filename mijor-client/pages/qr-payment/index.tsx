/* ===== Page: QR Payment ===== */
// Responsibility: Orchestrate QR payment flow with extracted components and hooks

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { BookingDetailsSection } from "@/components/payment/BookingDetailsSection";
import { QRCodeSection } from "@/components/payment/QRCodeSection";
import { usePaymentStatus } from "@/hooks/payments/usePaymentStatus";
import { useCountdownTimer } from "@/hooks/payments/useCountdownTimer";
import { useQRPayment } from "@/hooks/payments/useQRPayment";
import { confirmQRPayment } from "@/services/paymentApi";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { ExpiredBookingModal } from "@/components/payment/ExpiredBookingModal";

export default function QRPayment() {
  const router = useRouter();
  const { query, isReady } = router;
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);

  // Extract booking data from query parameters
  const title = (query.title as string) || "";
  const picture = (query.picture as string) || "";
  const date = (query.date as string) || "";
  const time = (query.time as string) || "";
  const hall = (query.hall as string) || "";
  const cinema = (query.cinema as string) || "";
  const seatExpiresAt = (query.seatExpiresAt as string) || "";
  const totalPrice = (query.totalPrice as string) || "0";
  const finalPrice = (query.finalPrice as string) || "0";
  const selectedSeats = JSON.parse((query.selectedSeats as string) || "[]");
  const bookingId = (query.bookingId as string) || "";
  const selectedCouponId = (query.selectedCouponId as string) || "";
  const seatIds = JSON.parse((query.seatIds as string) || "[]");
  const showtimeId = (query.showtimeId as string) || "";

  // QR Payment data for hook
  const paymentData = {
    amount: isReady ? parseFloat(finalPrice) : 0,
    bookingId: isReady ? (bookingId || "QR-" + Date.now()) : "",
    totalPrice: isReady ? parseFloat(totalPrice) : 0,
    selectedCouponId: isReady ? selectedCouponId : "",
    seatExpiresAt: isReady ? seatExpiresAt : "",
  };

  // Use extracted hooks
  const { qrData, paymentIntentId, isLoading, error, isFree } = useQRPayment(
    paymentData,
    isReady
  );
  
  const { timeRemaining, hasStartedTimer } = useCountdownTimer(
    seatExpiresAt,
    "" // Will be updated after paymentIntentId is set
  );

  const {
    status: paymentStatus,
    isLoading: statusLoading,
    error: statusError,
  } = usePaymentStatus(isFree ? "" : paymentIntentId);

  /* ===== Payment Status Handler ===== */
  // Responsibility: Handle payment status changes and redirects
  useEffect(() => {
    if (paymentStatus === "succeeded") {
      const confirmBooking = async () => {
        try {
          const response = await confirmQRPayment({
            showtimeId,
            seatIds,
            selectedCouponId,
            paymentIntentId,
          });
          setTimeout(() => {
            router.push(
              `/payment-success?${new URLSearchParams({
                ...(query as any),
                bookingId: response.bookingId,
              }).toString()}`,
            );
          }, 2000);
        } catch (error) {
          console.error("❌ Failed to confirm booking:", error);
          setTimeout(() => {
            router.push(
              `/payment-success?${new URLSearchParams(query as any).toString()}`,
            );
          }, 2000);
        }
      };
      confirmBooking();
    }
  }, [paymentStatus, showtimeId, seatIds, selectedCouponId, paymentIntentId, query, router]);

  useEffect(() => {
    if (!isFree || !paymentIntentId) return;
    
    confirmQRPayment({
      showtimeId,
      seatIds,
      selectedCouponId,
      paymentIntentId,
      forceSuccess: true,
    }).then((response) => {
      router.push(`/payment-success?${new URLSearchParams({
        ...(query as any),
        bookingId: response.bookingId,
      }).toString()}`);
    }).catch((error) => {
      console.error("❌ Failed to confirm free booking:", error);
    });
  }, [isFree, paymentIntentId]);

  // Business rule: Show expiration modal when timer reaches zero
  useEffect(() => {
    if (timeRemaining === 0 && hasStartedTimer && paymentStatus !== "succeeded") {
      setIsExpiredModalOpen(true);
    }
  }, [timeRemaining, hasStartedTimer, paymentStatus]);

  if (!isReady) return null;

  return (
    <main className="min-h-screen bg-[#101525]">
      <div className="container mx-auto px-4 py-8">
        {/* ===== Main Content ===== */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ===== QR Code Section ===== */}
            <QRCodeSection
              qrData={qrData}
              paymentIntentId={paymentIntentId}
              isLoading={isLoading}
              error={error}
              paymentStatus={paymentStatus}
              timeRemaining={timeRemaining}
              formatTime={formatRemainingTime}
              showtimeId={showtimeId}
              seatIds={seatIds}
              selectedCouponId={selectedCouponId}
              query={query}
            />

            {/* ===== Booking Details Section ===== */}
            <BookingDetailsSection
              title={title}
              date={date}
              time={time}
              cinema={cinema}
              hall={hall}
              selectedSeats={selectedSeats}
              finalPrice={finalPrice}
              timeRemaining={timeRemaining}
              formatTime={formatRemainingTime}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pt-8">
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          Back
        </Button>
      </div>
      <ExpiredBookingModal
        isOpen={isExpiredModalOpen}
        onPrimaryAction={() => router.back()}
      />
    </main>
  );
}
