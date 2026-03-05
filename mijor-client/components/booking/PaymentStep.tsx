/* ===== Component: PaymentStep ===== */
/* Responsibility: Render the full payment UI inline inside the booking flow */

import { useState, useEffect, useCallback } from "react";
import Step from "@/components/ui/Step";
import Tabs from "@/components/ui/Tab";
import CreditCardForm from "@/pages/payment/CreditCardForm";
import QRCodeForm from "@/pages/payment/QRCodeForm";
import { fetchUserCoupons, UserCoupon } from "@/services/couponService";
import SummaryBox from "@/components/common/summaryBox";
import Alert from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import { formatRemainingTime } from "@/utils/formatRemainingTime";
import { formatTime } from "@/utils/formatTime";
import formatDate from "@/utils/formatDate";
import { ShowtimeInfo, PaymentParams } from "@/types/booking";

type AlertConfig = {
    type: "error" | "success";
    title: string;
    message: string;
};

interface PaymentStepProps {
    movieInfo: ShowtimeInfo | null;
    selectedSeatLabels: string[];
    totalPrice: number;
    remainingTime: number;
    onPaymentSuccess: (params: PaymentParams) => void;
    className?: string;
}

export default function PaymentStep({
    movieInfo,
    selectedSeatLabels,
    totalPrice,
    remainingTime,
    onPaymentSuccess,
    className = "",
}: PaymentStepProps) {
    const [activeTab, setActiveTab] = useState("CreditCard");
    const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
    const [selectedCouponId, setSelectedCouponId] = useState<string>("");
    const [finalPrice, setFinalPrice] = useState<number>(totalPrice);
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    /* ================= Load Coupons ================= */
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

    /* ================= Sync finalPrice with totalPrice if no coupon ================= */
    useEffect(() => {
        if (!selectedCouponId) {
            setFinalPrice(totalPrice);
        }
    }, [totalPrice, selectedCouponId]);

    /* ================= Coupon Validation & Calculation ================= */
    useEffect(() => {
        const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);

        if (!selectedCoupon || !selectedCoupon.coupons) {
            setFinalPrice(totalPrice);
            return;
        }

        const { discount_type, discount_value, min_purchase, valid_until, is_active } =
            selectedCoupon.coupons;

        if (new Date(valid_until) < new Date()) {
            setAlertConfig({
                type: "error",
                title: "Coupon Expired",
                message: "This coupon is no longer valid. Please check for other available offers.",
            });
            setSelectedCouponId("");
            setFinalPrice(totalPrice);
            return;
        }

        const isActive = is_active as any;
        if (isActive === false) {
            setAlertConfig({
                type: "error",
                title: "Coupon Inactive",
                message: "This coupon is currently not available for use.",
            });
            setSelectedCouponId("");
            setFinalPrice(totalPrice);
            return;
        }

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

        let discount = 0;
        if (discount_type === "percentage") {
            discount = (totalPrice * discount_value) / 100;
        } else {
            discount = discount_value;
        }

        setFinalPrice(Math.max(0, totalPrice - discount));
    }, [selectedCouponId, totalPrice, userCoupons]);

    /* ================= Auto-Dismiss Alert ================= */
    useEffect(() => {
        if (!alertConfig) return;
        const timer = setTimeout(() => setAlertConfig(null), 5000);
        return () => clearTimeout(timer);
    }, [alertConfig]);

    const handleCreditCardChange = useCallback((details: any) => {
        setCardDetails(details);
        setIsFormValid(details.isValid);
    }, []);

    const handleConfirmPayment = () => {
        const params: PaymentParams = {
            selectedCouponId,
            finalPrice,
            paymentMethod: activeTab,
        };

        if (activeTab === "CreditCard" && cardDetails) {
            params.cardOwner = cardDetails.cardOwner;
            params.cardnumber = cardDetails.cardnumber;
        }

        onPaymentSuccess(params);
        setIsConfirmModalOpen(false);
    };

    return (
        <main className={`flex flex-col ${className}`}>
            {/* ===== Header ===== */}
            <header className="flex justify-center p-4 md:py-4 md:px-30 bg-brand-gray-0">
                <Step
                    steps={[{ label: "Select showtime" }, { label: "Select seat" }, { label: "Payment" }]}
                    currentStep={3}
                />
            </header>

            <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-28 w-full h-full px-4 md:px-30 py-10 md:py-20 bg-[#101525] md:bg-brand-gray-100/30">
                {/* ================= Payment Forms ================= */}
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
                            <CreditCardForm onchange={handleCreditCardChange} />
                        )}
                        {activeTab === "QRCode" && <QRCodeForm />}
                    </article>
                </section>

                {/* ================= Summary Sidebar ================= */}
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
                        remainingTime={remainingTime > 0 ? formatRemainingTime(remainingTime) : ""}
                        isNextDisabled={!isFormValid}
                        onNext={() => setIsConfirmModalOpen(true)}
                        paymentMethod={activeTab}
                    />
                </section>
            </div>


            {/* ================= Confirmation Modal ================= */}
            <PaymentConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmPayment}
            />

            {/* ================= Alert Toast ================= */}
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
        </main>
    );
}

/* ================= Component: PaymentConfirmationModal ================= */
type PaymentConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

function PaymentConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
}: PaymentConfirmationModalProps) {
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
            <p className="text-body-2 text-brand-gray-400">Confirm booking and payment?</p>
        </Modal>
    );
}
