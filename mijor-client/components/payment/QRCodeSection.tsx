/* ===== Component: QRCodeSection ===== */
// Responsibility: Display QR code and handle payment status states

import { CheckCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "@/lib/booking/api";

import Button from "@/components/ui/Button";
import QRCodeDisplay from "@/components/payment/QRCodeDisplay";

interface QRCodeSectionProps {
  qrData: any;
  paymentIntentId: string;
  isLoading: boolean;
  error: string;
  paymentStatus: string;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  showtimeId: string;
  seatIds: string[];
  selectedCouponId: string;
  query: any;
}

export const QRCodeSection = ({
  qrData,
  paymentIntentId,
  isLoading,
  error,
  paymentStatus,
  timeRemaining,
  formatTime,
  showtimeId,
  seatIds,
  selectedCouponId,
  query,
}: QRCodeSectionProps) => {
  const router = useRouter();

  const handleDevSimulation = async () => {
    try {
      console.log("🧪 Force simulating success locally...");
      // Call confirm-qr directly without Stripe
      const response = await api.post(
        "/showtimeSeat/confirm-qr",
        {
          showtimeId,
          seatIds,
          selectedCouponId,
          paymentIntentId: "dev_force_success",
          forceSuccess: true,
        },
      );
      console.log("🧪 confirm-qr response:", response.data);
      if (response.data.success) {
        router.push(
          `/payment-success?${new URLSearchParams({
            ...(query as any),
            bookingId: response.data.bookingId,
          }).toString()}`,
        );
      }
    } catch (err) {
      console.error("🧪 Simulation failed:", err);
    }
  };

  return (
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
              onClick={() => router.back()}
              className="mt-2"
            >
              Go Back
            </Button>
          </div>
        </div>
      ) : (
        <>
          <QRCodeDisplay
            qrData={qrData}
            isLoading={false}
            size={256}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
          />
          {/* DEV ONLY — Remove before production deployment */}
          {process.env.NODE_ENV !== "production" && paymentIntentId && (
            <button
              onClick={handleDevSimulation}
              className="mt-4 w-full py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg"
            >
              🧪 [DEV] Simulate Payment Success
            </button>
          )}
        </>
      )}
    </section>
  );
};
