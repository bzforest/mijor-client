/* ===== Component: PaymentStep ===== */
/* Responsibility: Render the full payment UI with Credit Card and QR Code options */

import { useState, useEffect, useRef } from "react";
import router, { useRouter } from "next/router";
import Step from "@/components/ui/Step";
import Tabs from "@/components/ui/Tab";
import QRCodeForm from "@/pages/payment/QRCodeForm";
import StripeCreditCardForm from "@/pages/payment/StripeCreditCardForm";
import StripeProvider from "@/components/payment/StripeProvider";
import { fetchUserCoupons, UserCoupon } from "@/services/couponService";
import SummaryBox from "@/components/common/summaryBox";
import Alert from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { formatTime } from "@/utils/formatTime";
import formatDate from "@/utils/formatDate";
import { ShowtimeInfo, PaymentParams } from "@/types/booking";
import axios from "axios";

type AlertConfig = {
  type: "error" | "success";
  title: string;
  message: string;
};

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
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number>(totalPrice);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState<boolean>(false);
  const [useStripe, setUseStripe] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripeAction, setStripeAction] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isCreatingIntent, setIsCreatingIntent] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  /* ===== Data Fetching ===== */
  // Responsibility: Load user coupons for discount selection
  useEffect(() => {
    const loadUserCoupons = async () => {
      try {
        const coupons = await fetchUserCoupons();
        setUserCoupons(coupons);
      } catch (error) {
        console.error("Failed to fetch user coupons:", error);
      }
    };
    loadUserCoupons();
  }, []);

  /* ===== Price Synchronization ===== */
  // Responsibility: Reset finalPrice when no coupon is selected
  useEffect(() => {
    if (!selectedCouponId) {
      setFinalPrice(totalPrice);
    }
  }, [totalPrice, selectedCouponId]);

  /* ===== Coupon Validation & Calculation ===== */
  // Responsibility: Validate coupon and calculate discount
  useEffect(() => {
    const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);

    if (!selectedCoupon || !selectedCoupon.coupons) {
      setFinalPrice(totalPrice);
      return;
    }

    const {
      discount_type,
      discount_value,
      min_purchase,
      valid_until,
      is_active,
    } = selectedCoupon.coupons;

    // Check expiration
    if (new Date(valid_until) < new Date()) {
      setAlertConfig({
        type: "error",
        title: "Coupon Expired",
        message:
          "This coupon is no longer valid. Please check for other available offers.",
      });
      setSelectedCouponId("");
      setFinalPrice(totalPrice);
      return;
    }

    // Check active status
    if (is_active === false) {
      setAlertConfig({
        type: "error",
        title: "Coupon Inactive",
        message: "This coupon is currently not available for use.",
      });
      setSelectedCouponId("");
      setFinalPrice(totalPrice);
      return;
    }

    // Check minimum purchase
    if (totalPrice < min_purchase) {
      setAlertConfig({
        type: "error",
        title: "Minimum Purchase Required",
        message: `The minimum purchase for this coupon is ${min_purchase} baht.`,
      });
      setSelectedCouponId("");
      setFinalPrice(totalPrice);
      return;
    }

    // Calculate discount
    // ✅ แก้เป็น
    let discount = 0;
    switch (discount_type) {
      case "discount_percentage":
        discount = (totalPrice * discount_value) / 100;
        break;
      case "discount_amount":
        discount = discount_value;
        break;
      case "fixed_price":
        setFinalPrice(Math.max(0, discount_value));
        return;
      case "free_ticket":
      case "free_item":
        setFinalPrice(0);
        return;
      case "buy_one_get_one":
        discount = totalPrice / 2;
        break;
      case "cashback":
      case "upgrade":
        discount = 0;
        break;
      default:
        discount = 0;
    }

    setFinalPrice(Math.max(0, totalPrice - discount));
  }, [selectedCouponId, totalPrice, userCoupons]);

  /* ===== Alert Management ===== */
  // Responsibility: Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (!alertConfig) return;
    const timer = setTimeout(() => setAlertConfig(null), 5000);
    return () => clearTimeout(timer);
  }, [alertConfig]);

  /* ===== Payment Intent Creation ===== */
  // Responsibility: Create Stripe payment intent on demand (called when user clicks Next)
  const createPaymentIntent = async (): Promise<string | null> => {
    // Reuse existing clientSecret if already created
    if (clientSecret) return clientSecret;

    setIsCreatingIntent(true);
    try {
      console.log("🔵 Creating payment intent with data:", {
        amount: finalPrice,
        bookingId: movieInfo?.title || "booking",
        totalPrice,
        selectedCouponId,
      });

      const roundedAmount = Math.round(finalPrice * 100) / 100;

      // selectedCouponId ใน state = profile_coupons.id
      // แต่ server ต้องการ coupons.id → resolve ก่อนส่ง
      const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);
      const actualCouponId = selectedCoupon?.coupons?.id || "";

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-payment-intent`,
        {
          amount: roundedAmount,
          bookingId: movieInfo?.title || "booking",
          totalPrice: Math.round(totalPrice * 100) / 100,
          selectedCouponId: actualCouponId,
        },
      );

      if (response.status !== 200) {
        // อ่าน body ก่อนเพื่อดู error จาก server จริงๆ
        const errorData = response.data;
        const serverMessage =
          errorData?.message || errorData?.error || `HTTP ${response.status}`;
        console.error("❌ Payment API error:", {
          status: response.status,
          body: errorData,
        });
        setAlertConfig({
          type: "error",
          title: "Payment Error",
          message: serverMessage,
        });
        return null;
      }

      const data = response.data;
      console.log("🔵 Payment intent response:", data);

      if (data.success && data.clientSecret) {
        setClientSecret(data.clientSecret);
        console.log("✅ Payment intent created successfully");
        return data.clientSecret;
      } else {
        if (data.debug) {
          setAlertConfig({
            type: "error",
            title: "Price Validation Failed",
            message: `Server price: ${data.debug.serverPrice}, Client price: ${data.debug.clientPrice}, Difference: ${data.debug.difference}`,
          });
        } else {
          setAlertConfig({
            type: "error",
            title: "Payment Error",
            message:
              data.message || "Failed to initialize payment. Please try again.",
          });
        }
        return null;
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setAlertConfig({
        type: "error",
        title: "Payment Error",
        message: "Failed to initialize payment. Please try again.",
      });
      return null;
    } finally {
      setIsCreatingIntent(false);
    }
  };

  /* ===== Payment Processing ===== */
  // Responsibility: Handle payment confirmation for both Credit Card and QR Code
  const handleConfirmPayment = async () => {
    if (isProcessingPayment) {
      console.log("🔒 Already processing, ignoring duplicate request");
      return;
    }

    setIsProcessingPayment(true);

    try {
      if (activeTab === "CreditCard") {
        if (useStripe && stripeAction) {
          await stripeAction();
        }
      } else if (activeTab === "QRCode") {
        // คำนวณ expiresAt จาก remainingTime เพื่อส่งให้หน้า QR ใช้ timer เดียวกัน
        const seatExpiresAt = new Date(
          Date.now() + remainingTime * 1000,
        ).toISOString();

        const selectedCoupon = userCoupons.find(
          (c) => c.id === selectedCouponId,
        );
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

      console.log("🔵 [PaymentStep] Selected coupon:", {
        selectedCouponId,
        foundCoupon: selectedCoupon,
        couponId: selectedCoupon?.coupons?.id,
      });

      const params: PaymentParams = {
        selectedCouponId: selectedCoupon?.coupons?.id || selectedCouponId,
        finalPrice,
        paymentMethod: activeTab,
      };

      if (activeTab === "CreditCard") {
        params.cardOwner = "Stripe User";
        params.cardnumber = "Stripe Payment";
      }

      console.log("🔵 Calling onPaymentSuccess with params:", params);
      onPaymentSuccess(params);
      setIsConfirmModalOpen(false);

      setAlertConfig({
        type: "success",
        title: "Payment Successful!",
        message: "Your payment has been processed successfully.",
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setAlertConfig({
        type: "error",
        title: "Payment Failed",
        message:
          "There was an error processing your payment. Please try again.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle booking expiration

    const hasStartedTimer = useRef(false);

    // ✅ track ว่าเคย start timer แล้ว
    useEffect(() => {
        if (remainingTime > 0) {
            hasStartedTimer.current = true;
        }
    }, [remainingTime]);

    // ✅ trigger modal เมื่อหมดเวลา
    useEffect(() => {
        if (remainingTime === 0 && hasStartedTimer.current && !paymentSuccess) {
            setIsExpiredModalOpen(true);
        }
    }, [remainingTime, paymentSuccess]);

  return (
    <main className={`flex flex-col ${className}`}>
      {/* ===== Progress Header ===== */}
      <header className="flex justify-center p-4 md:py-4 md:px-30 bg-brand-gray-0">
        <Step
          steps={[
            { label: "Select showtime" },
            { label: "Select seat" },
            { label: "Payment" },
          ]}
          currentStep={3}
        />
      </header>

      <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-28 w-full h-full px-4 md:px-30 py-10 md:py-20 bg-[#101525] md:bg-brand-gray-100/30">
        {/* ===== Payment Forms Section ===== */}
        <section className="flex flex-col gap-10 w-full max-w-7xl h-full">
          <Tabs
            viewType="default"
            tabs={[
              { id: "CreditCard", label: "Credit Card" },
              { id: "QRCode", label: "QR Code" },
            ]}
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
                    const selectedCoupon = userCoupons.find(
                      (c) => c.id === selectedCouponId,
                    );
                    const actualCouponId = selectedCoupon?.coupons?.id || "";
                    onPaymentSuccess({
                      selectedCouponId: actualCouponId, // ✅ coupons.id
                      finalPrice,
                      paymentMethod: "CreditCard",
                    });
                  }}
                  clientSecret={clientSecret}
                  onFormValidChange={setIsFormValid}
                  selectedCouponId={selectedCouponId}
                  finalPrice={finalPrice}
                />
              </StripeProvider>
            )}
            {activeTab === "QRCode" && <QRCodeForm />}
          </article>
        </section>

        {/* ===== Summary Sidebar ===== */}
        <section className="w-full md:w-auto">
          <SummaryBox
            title={movieInfo?.title || ""}
            picture={movieInfo?.posterUrl || ""}
            date={formatDate(movieInfo?.date || "")}
            genre={movieInfo?.genres || []}
            language={movieInfo?.languages?.join(", ") || ""}
            time={formatTime(movieInfo?.time || "")}
            hall={movieInfo?.hall || ""}
            cinema={movieInfo?.cinema || ""}
            selectedSeats={selectedSeatLabels}
            totalPrice={totalPrice}
            finalPrice={finalPrice}
            userCoupons={userCoupons}
            selectedCouponId={selectedCouponId}
            onCouponChange={(id) => setSelectedCouponId(id)}
            remainingTime={
              remainingTime > 0 ? formatRemainingTime(remainingTime) : ""
            }
            isNextDisabled={
              !isFormValid || isProcessingPayment || isCreatingIntent
            }
            onNext={async () => {
              if (activeTab === "CreditCard") {
                // Create PaymentIntent lazily on Next click
                const secret = await createPaymentIntent();
                if (!secret) return; // abort if creation failed
              }
              setIsConfirmModalOpen(true);
            }}
            paymentMethod={activeTab}
            isProcessing={isProcessingPayment || isCreatingIntent}
            paymentSuccess={paymentSuccess}
          />
        </section>
      </div>

      {/* ===== Confirmation Modal ===== */}
      <PaymentConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmPayment}
      />

      {/* ===== Alert Toast ===== */}
      {alertConfig && (
        <div className="fixed flex items-center justify-center z-50 transform transition-all duration-500 ease-out md:right-10 md:bottom-10 md:w-110">
          <Alert
            type={alertConfig.type}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={() => setAlertConfig(null)}
          />
        </div>
      )}

      {/* ===== Expired Booking Modal ===== */}
      <ExpiredBookingModal
        isOpen={isExpiredModalOpen}
        onClose={() => setIsExpiredModalOpen(false)}
        onPrimaryAction={() => {
          setIsExpiredModalOpen(false);
          onExpired?.();
        }}
      />
    </main>
  );
}

/* ===== Component: PaymentConfirmationModal ===== */
// Responsibility: Display confirmation modal before payment processing

function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm booking"
      primaryActionButton="Confirm"
      secondaryActionButton="Cancel"
      onPrimaryAction={onConfirm}
      onSecondaryAction={onClose}
      className="max-w-100"
    >
      <p className="text-body-2 text-brand-gray-400">
        Confirm booking and payment?
      </p>
    </Modal>
  );
}

function ExpiredBookingModal({
  isOpen,
  onClose,
  onPrimaryAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPrimaryAction: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking expired"
      primaryActionButton="OK"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={() => router.back()}
      className="max-w-100"
    >
      <p className="text-body-2 text-brand-gray-400">
        You did not complete the checkout process in time, please start again
      </p>
    </Modal>
  );
}
