/* ===== Page: QR Payment ===== */
/* Responsibility: Generate QR code and track payment status in real-time */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { CheckCircle, AlertCircle } from "lucide-react";
import QRCodeDisplay from "@/components/payment/QRCodeDisplay";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import axios from "axios";

export default function QRPayment() {
  const router = useRouter();
  const { query, isReady } = router;

  // Extract booking data from query parameters
  const title = (query.title as string) || "";
  const picture = (query.picture as string) || "";
  const date = (query.date as string) || "";
  const time = (query.time as string) || "";
  const hall = (query.hall as string) || "";
  const cinema = (query.cinema as string) || "";
  const seatExpiresAt = (query.seatExpiresAt as string) || "";
  const finalPrice = (query.finalPrice as string) || "0";
  const selectedSeats = JSON.parse((query.selectedSeats as string) || "[]");
  const bookingId = (query.bookingId as string) || "";
  const selectedCouponId = (query.selectedCouponId as string) || "";

  // QR Code state management
  const [qrData, setQrData] = useState<any>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // คำนวณ initial timeRemaining จาก seatExpiresAt ที่ส่งมาจากหน้า booking
  // ถ้าไม่มี fallback เป็น 900 วินาที (15 นาที)
  const getSecondsRemaining = () => {
    if (!seatExpiresAt) return 900;
    const diff = Math.floor(
      (new Date(seatExpiresAt).getTime() - Date.now()) / 1000,
    );
    return Math.max(0, diff);
  };

  const [timeRemaining, setTimeRemaining] = useState(() =>
    getSecondsRemaining(),
  );

  // Payment status tracking
  const {
    status: paymentStatus,
    isLoading: statusLoading,
    error: statusError,
  } = usePaymentStatus(paymentIntentId);

  // Generate QR Code
  useEffect(() => {
    if (!isReady) return;

    const generateQR = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("🔵 Creating QR payment with data:", {
          amount: parseFloat(finalPrice),
          bookingId: "QR-" + Date.now(),
          totalPrice: parseFloat(finalPrice),
          selectedCouponId: selectedCouponId,
        });

        // Call server API to create QR payment
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-qr-payment`,
          {
            amount: parseFloat(finalPrice),
            bookingId: bookingId,
            totalPrice: parseFloat(finalPrice),
            selectedCouponId: selectedCouponId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("📡 API Response status:", response.status);

        if (response.status !== 200) {
          const errorText = response.data;
          console.error("❌ API Error Response:", errorText);
          throw new Error(
            `Failed to create QR payment: ${response.status} ${errorText}`,
          );
        }

        const data = response.data;
        console.log("📊 API Response data:", data);

        if (data.success) {
          console.log("🔵 QR Payment Created:", data);

          // Set QR data for new component
          setQrData(data.qrData);
          setPaymentIntentId(data.paymentIntentId);

          // Set expiration time from backend
          if (data.expiresIn) {
            setTimeRemaining(data.expiresIn);
          }
        } else {
          console.error("❌ Payment creation failed:", data);
          throw new Error(
            data.error || data.message || "Failed to create QR payment",
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("❌ Failed to generate QR code:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate QR code";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    generateQR();
  }, [isReady, finalPrice, query.selectedCouponId]);

  /* ===== Timer Component ===== */
  // Responsibility: Display countdown timer with proper formatting
  const TimerDisplay = () => {
    return (
      <span
        className={`font-mono ${
          paymentStatus === "expired"
            ? "text-red-500"
            : paymentStatus === "succeeded"
              ? "text-green-500"
              : "text-yellow-500"
        }`}
      >
        {paymentStatus === "succeeded" ? "Paid!" : formatTime(timeRemaining)} (
        {timeRemaining}s)
      </span>
    );
  };

  /* ===== Timer Countdown ===== */
  // Responsibility: นับถอยหลังจาก seatExpiresAt (timestamp จริง) เพื่อ sync กับ seat lock
  useEffect(() => {
    if (paymentStatus === "expired" || paymentStatus === "succeeded") return;

    const tick = () => {
      const remaining = getSecondsRemaining();
      setTimeRemaining(remaining);
    };

    // อัปเดตทันทีเพื่อให้ตรงกับเวลาจริง
    tick();

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [seatExpiresAt, paymentStatus]); // re-run ถ้า seatExpiresAt เปลี่ยน (router ready)

  /* ===== Payment Status Handler ===== */
  // Responsibility: Handle payment status changes and redirects
  useEffect(() => {
    if (paymentStatus === "succeeded") {
      console.log("✅ Payment successful! Redirecting...");
      setTimeout(() => {
        router.push(
          `/payment-success?${new URLSearchParams(query as any).toString()}`,
        );
      }, 2000);
    } else if (
      paymentStatus === "canceled" ||
      paymentStatus === "expired" ||
      paymentStatus === "failed"
    ) {
      console.log("❌ Payment not successful:", paymentStatus);
    }
  }, [paymentStatus, query, router]);

  /* ===== Utility Functions ===== */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBack = () => {
    router.back();
  };

  if (!isReady) return null;

  return (
    <main className="min-h-screen bg-[#101525]">
      <div className="container mx-auto px-4 py-8">
        {/* ===== Header ===== */}
        {/* <header className="flex items-center justify-between mb-8">
                    <Button
                        variant="secondary"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </Button>
                    <div className="flex items-center gap-2 text-white">
                        <Clock size={20} className={
                            paymentStatus === "expired" ? "text-red-500" : 
                            paymentStatus === "succeeded" ? "text-green-500" : 
                            "text-yellow-500"
                        } />
                        <TimerDisplay />
                        {statusLoading && <RefreshCw size={16} className="animate-spin text-blue-500" />}
                    </div>
                </header> */}

        {/* ===== Main Content ===== */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* ===== QR Code Section ===== */}
            <section className="bg-brand-gray-100 rounded-xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                Scan QR Code to Pay
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : paymentStatus === "expired" ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <AlertCircle size={48} className="text-red-500 mb-4" />
                  <p className="text-red-500 text-center">QR Code expired</p>
                  <Button
                    variant="primary"
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Generate New QR Code
                  </Button>
                </div>
              ) : paymentStatus === "succeeded" ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <p className="text-green-500 text-center">
                    Payment Successful!
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Redirecting...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <AlertCircle size={48} className="text-red-500 mb-4" />
                  <p className="text-red-500 text-center mb-2">
                    QR Code Generation Failed
                  </p>
                  <p className="text-gray-400 text-sm text-center mb-4 max-w-xs">
                    {error}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => window.location.reload()}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleBack}
                      className="mt-2"
                    >
                      Go Back
                    </Button>
                  </div>
                </div>
              ) : (
                <QRCodeDisplay
                  qrData={qrData}
                  isLoading={statusLoading}
                  size={256}
                  timeRemaining={timeRemaining}
                  formatTime={formatTime}
                />
              )}
            </section>

            {/* ===== Booking Details Section ===== */}
            <section className="bg-brand-gray-100 rounded-xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Booking Details
              </h2>

              <div className="space-y-4">
                <div className="text-white">
                  <p className="text-gray-400 text-sm">Movie</p>
                  <p className="font-semibold">{title}</p>
                </div>

                <div className="text-white">
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="font-semibold">
                    {date} at {time}
                  </p>
                </div>

                <div className="text-white">
                  <p className="text-gray-400 text-sm">Cinema & Hall</p>
                  <p className="font-semibold">
                    {cinema} - {hall}
                  </p>
                </div>

                <div className="text-white">
                  <p className="text-gray-400 text-sm">Seats</p>
                  <p className="font-semibold">{selectedSeats.join(", ")}</p>
                </div>

                <div className="border-t border-brand-gray-0 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">Total Amount</span>
                    <span className="text-white font-bold text-lg">
                      THB {finalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg">
                <p className="text-yellow-500 text-sm text-center">
                  ⚠️ Please complete payment within 5 minutes
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pt-8">
        <Button
          variant="secondary"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          Back
        </Button>
      </div>
    </main>
  );
}
