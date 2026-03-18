/* ===== Component: PaymentStep ===== */
// Responsibility: Render the full payment UI with Credit Card and QR Code options

import { useState } from "react";
import { useRouter } from "next/router";

import Step from "@/components/ui/Step";
import Tabs from "@/components/ui/Tab";
import SummaryBox from "@/components/common/summaryBox";
import Alert from "@/components/ui/Alert";
import { PaymentConfirmationModal } from "@/components/payment/PaymentConfirmationModal";
import { ExpiredBookingModal } from "@/components/payment/ExpiredBookingModal";

import StripeProvider from "@/components/payment/StripeProvider";
import QRCodeForm from "@/pages/payment/QRCodeForm";
import StripeCreditCardForm from "@/pages/payment/StripeCreditCardForm";

import formatDate from "@/utils/formatDate";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { ShowtimeInfo, PaymentParams } from "@/types/booking";

import { useUserCoupons } from "@/hooks/payments/useUserCoupons";
import { useCouponValidation } from "@/hooks/payments/useCouponValidation";
import { usePaymentIntent } from "@/hooks/payments/usePaymentIntent";
import { useSessionExpiration } from "@/hooks/payments/useSessionExpiration";

interface PaymentStepProps {
  movieInfo: ShowtimeInfo | null;
  selectedSeatLabels: string[];
  selectedSeatIds: string[];
  showtimeId: string;
  totalPrice: number;
  remainingTime: number;
  onPaymentSuccess: (params: PaymentParams) => void;
  className?: string;
  onExpired?: () => void;
}

export default function PaymentStep({
  movieInfo,
  selectedSeatLabels,
  selectedSeatIds,
  showtimeId,
  totalPrice,
  remainingTime,
  onPaymentSuccess,
  className = "",
  onExpired,
}: PaymentStepProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("CreditCard");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [useStripe, setUseStripe] = useState<boolean>(true);
  const [stripeAction, setStripeAction] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Use extracted hooks
  const { userCoupons } = useUserCoupons();
  const {
    selectedCouponId,
    setSelectedCouponId,
    finalPrice,
    alertConfig,
    setAlertConfig,
  } = useCouponValidation(totalPrice, userCoupons);
  const { clientSecret, isCreatingIntent, createPaymentIntent, isFree } = usePaymentIntent();
  const { isExpiredModalOpen, setIsExpiredModalOpen } = useSessionExpiration(
    remainingTime,
    paymentSuccess
  );

  /* ================= Payment Actions ================= */
  const handleConfirmPayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      if (activeTab === "CreditCard") {
        if (isFree) {
          setPaymentSuccess(true);
          const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);
          const params: PaymentParams = {
            selectedCouponId: selectedCoupon?.coupons?.id || selectedCouponId,
            finalPrice,
            paymentMethod: "CreditCard",
            cardOwner: "Free Booking",
            cardnumber: "No Charge",
          };
          
          onPaymentSuccess(params);
          setIsConfirmModalOpen(false);
          setAlertConfig({
            type: "success",
            title: "Booking Successful!",
            message: "Your free booking has been confirmed.",
          });
          setIsProcessingPayment(false);
          return;
        }
        if (useStripe && stripeAction) {
          await stripeAction();
          return;
        }
      } else if (activeTab === "QRCode") {
        const seatExpiresAt = new Date(Date.now() + remainingTime * 1000).toISOString();
        const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);
        const actualCouponId = selectedCoupon?.coupons?.id || "";

        const params = {
          title: movieInfo?.title || "",
          picture: movieInfo?.posterUrl || "",
          date: movieInfo?.date || "",
          genre: JSON.stringify(movieInfo?.genres || []),
          language: movieInfo?.languages?.join(", ") || "",
          time: movieInfo?.time || "",
          hall: movieInfo?.hall || "",
          cinema: movieInfo?.cinema || "",
          selectedSeats: JSON.stringify(selectedSeatLabels),
          seatIds: JSON.stringify(selectedSeatIds),
          showtimeId: showtimeId,
          totalPrice: totalPrice.toString(),
          selectedCouponId: actualCouponId,
          finalPrice: finalPrice.toString(),
          paymentMethod: "QRCode",
          seatExpiresAt,
        };

        const searchParams = new URLSearchParams(params).toString();
        router.push(`/qr-payment?${searchParams}`);
        setIsConfirmModalOpen(false);
        setIsProcessingPayment(false);
        return;
      }

      setPaymentSuccess(true);
      const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);
      const params: PaymentParams = {
        selectedCouponId: selectedCoupon?.coupons?.id || selectedCouponId,
        finalPrice,
        paymentMethod: activeTab,
      };

      if (activeTab === "CreditCard") {
        params.cardOwner = "Stripe User";
        params.cardnumber = "Stripe Payment";
      }

      onPaymentSuccess(params);
      setIsConfirmModalOpen(false);
      setAlertConfig({
        type: "success",
        title: "Payment Successful!",
        message: "Your payment has been processed successfully.",
      });
    } catch (error) {
      setAlertConfig({
        type: "error",
        title: "Payment Failed",
        message: "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <main className={`flex flex-col ${className}`}>
      <header className="flex justify-center px-4 py-4 bg-brand-gray-0 md:px-30">
        <Step
          steps={[{ label: "Select showtime" }, { label: "Select seat" }, { label: "Payment" }]}
          currentStep={3}
        />
      </header>

      <div className="flex flex-col justify-center gap-6 w-full h-full px-4 py-10 md:flex-row md:gap-28 md:px-30 md:py-20">
        <section className="flex flex-col gap-10 w-full h-full max-w-7xl">
          <Tabs
            viewType="default"
            tabs={[{ id: "CreditCard", label: "Credit Card" }, { id: "QRCode", label: "QR Code" }]}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setIsFormValid(tab === "QRCode");
            }}
          />

          <article className="flex flex-col gap-4">
            {activeTab === "CreditCard" && (
              <StripeProvider clientSecret={clientSecret}>
                <StripeCreditCardForm
                  setHandleStripePayment={setStripeAction}
                  onPaymentSuccess={() => {
                    const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);
                    const actualCouponId = selectedCoupon?.coupons?.id || "";
                    onPaymentSuccess({
                      selectedCouponId: actualCouponId,
                      finalPrice,
                      paymentMethod: "CreditCard",
                    });
                  }}
                  clientSecret={clientSecret}
                  onFormValidChange={setIsFormValid}
                  selectedCouponId={selectedCouponId}
                  finalPrice={finalPrice}
                  isFree={isFree}
                />
              </StripeProvider>
            )}
            {activeTab === "QRCode" && <QRCodeForm />}
          </article>
        </section>

        <aside className="w-full md:w-auto">
          <SummaryBox
            title={movieInfo?.title || ""}
            picture={movieInfo?.posterUrl || ""}
            date={formatDate(movieInfo?.date || "")}
            genre={movieInfo?.genres || []}
            language={movieInfo?.languages?.join(", ") || ""}
            time={movieInfo?.time || ""}
            hall={movieInfo?.hall || ""}
            cinema={movieInfo?.cinema || ""}
            selectedSeats={selectedSeatLabels}
            totalPrice={totalPrice}
            finalPrice={finalPrice}
            userCoupons={userCoupons}
            selectedCouponId={selectedCouponId}
            onCouponChange={(id) => setSelectedCouponId(id)}
            remainingTime={remainingTime > 0 ? formatRemainingTime(remainingTime) : ""}
            isNextDisabled={!isFormValid || isProcessingPayment || isCreatingIntent}
            onNext={async () => {
              if (activeTab === "CreditCard") {
                const secret = await createPaymentIntent(
                  finalPrice,
                  totalPrice,
                  selectedCouponId,
                  userCoupons,
                  movieInfo
                );
                if (!secret) return;
              }
              setIsConfirmModalOpen(true);
            }}
            paymentMethod={activeTab}
            isProcessing={isProcessingPayment || isCreatingIntent}
            paymentSuccess={paymentSuccess}
          />
        </aside>
      </div>

      <PaymentConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      {alertConfig && (
        <div className="fixed z-50 flex items-center justify-center transform transition-all duration-500 ease-out md:right-10 md:bottom-10 md:w-110">
          <Alert
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={() => setAlertConfig(null)}
          />
        </div>
      )}

      <ExpiredBookingModal
        isOpen={isExpiredModalOpen}
        onPrimaryAction={() => {
          setIsExpiredModalOpen(false);
          onExpired?.();
        }}
      />
    </main>
  );
}
