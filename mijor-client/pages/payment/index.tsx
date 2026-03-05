/* ===== Page: Payment ===== */
/* Responsibility: Orchestrate the payment flow, calculate final price with coupons, and handle alerts */

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/router"
import Step from "@/components/ui/Step"
import Tabs from "@/components/ui/Tab"
import CreditCardForm from "./CreditCardForm"
import QRCodeForm from "./QRCodeForm"
import { fetchUserCoupons, UserCoupon } from "@/services/couponService"
import Summary from "@/components/common/summaryBox"
import Alert from "@/components/ui/Alert"
import Modal from "@/components/ui/Modal"

type MovieData = {
    title: string;
    picture: string;
    date: string;
    genre: string[];
    language: string;
    time: string;
    hall: string;
    cinema: string;
}

type AlertConfig = {
    type: "error" | "success";
    title: string;
    message: string;
}

export default function Payment() {
    const router = useRouter();
    const { query, isReady } = router;

    const [activeTab, setActiveTab] = useState("CreditCard")
    const [moviesData, setMoviesData] = useState<MovieData | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
    const [selectedCouponId, setSelectedCouponId] = useState<string>("");
    const [finalPrice, setFinalPrice] = useState<number>(totalPrice);
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);


    useEffect(() => {
        if (isReady) {
            setMoviesData({
                title: query.title as string || "",
                picture: query.picture as string || "",
                date: query.date as string || "",
                genre: query.genre ? JSON.parse(query.genre as string) : [],
                language: query.language as string || "",
                time: query.time as string || "",
                hall: query.hall as string || "",
                cinema: query.cinema as string || "",
            });
            setSelectedSeats(query.selectedSeats ? JSON.parse(query.selectedSeats as string) : []);
            setTotalPrice(Number(query.totalPrice) || 0);
        }
    }, [isReady, query]);

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

    useEffect(() => {
        /* ================= Coupon Validation ================= */
        // Evaluate the selected coupon and calculate the final price
        const selectedCoupon = userCoupons.find(c => c.id === selectedCouponId);

        // Reset to full price if no coupon is selected or found
        if (!selectedCoupon || !selectedCoupon.coupons) {
            setFinalPrice(totalPrice);
            return;
        }

        const { discount_type, discount_value, min_purchase, valid_until, is_active } = selectedCoupon.coupons;

        // --- Expiration Check ---
        if (new Date(valid_until) < new Date()) {
            setAlertConfig({
                type: "error",
                title: "Coupon Expired",
                message: "This coupon is no longer valid. Please check for other available offers."
            });
            setSelectedCouponId("");
            setFinalPrice(totalPrice);
            return;
        }

        // --- Inactive Check ---
        const isActive = is_active as any;
        if (isActive === false) {
            setAlertConfig({
                type: "error",
                title: "Coupon Inactive",
                message: "This coupon is currently not available for use."
            });
            setSelectedCouponId("");
            setFinalPrice(totalPrice);
            return;
        }

        // --- Minimum Purchase Check ---
        if (totalPrice < min_purchase) {
            setAlertConfig({
                type: "error",
                title: "Minimum Purchase Required",
                message: `The minimum purchase for this coupon is ${min_purchase} baht.`
            });
            setSelectedCouponId("");
            return;
        }

        // --- Discount Calculation ---
        let discount = 0;
        if (discount_type === 'percentage') {
            discount = (totalPrice * discount_value) / 100;
        } else {
            discount = discount_value;
        }

        // Update the final price, ensuring it doesn't drop below 0
        setFinalPrice(Math.max(0, totalPrice - discount));

    }, [selectedCouponId, totalPrice, userCoupons]);

    useEffect(() => {
        /* ================= Auto-Dismiss Alert ================= */
        if (!alertConfig) return;
        const timer = setTimeout(() => {
            setAlertConfig(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [alertConfig]);

    const handleCreditCardChange = useCallback((details: any) => {
        setCardDetails(details);
        setIsFormValid(details.isValid);
    }, []);

    if (!isReady || !moviesData) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }

    return (
        <main className="flex flex-col">
            <header className="flex justify-center py-[16px] px-[120px] bg-brand-gray-0">
                <Step
                    steps={[{ label: "Select showtime" }, { label: "Select seat" }, { label: "Payment" }]}
                    currentStep={3}
                />
            </header>
            <div className="flex flex-row justify-center gap-28 w-full h-full px-30 py-20 bg-brand-gray-100/30">

                {/* ================= Payment Section ================= */}
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
                        {activeTab === "CreditCard" && <CreditCardForm onchange={handleCreditCardChange} />}
                        {activeTab === "QRCode" && <QRCodeForm />}
                    </article>
                </section>

                {/* ================= Summary Section ================= */}
                <section>
                    <Summary
                        title={moviesData.title}
                        picture={moviesData.picture}
                        date={moviesData.date}
                        genre={moviesData.genre}
                        language={moviesData.language}
                        time={moviesData.time}
                        hall={moviesData.hall}
                        cinema={moviesData.cinema}
                        selectedSeats={selectedSeats}
                        totalPrice={totalPrice}
                        finalPrice={finalPrice}
                        userCoupons={userCoupons}
                        selectedCouponId={selectedCouponId}
                        onCouponChange={(id) => setSelectedCouponId(id)}
                        isNextDisabled={!isFormValid}
                        onNext={() => setIsConfirmModalOpen(true)}
                        paymentMethod={activeTab}
                    />
                </section>
            </div>

            <PaymentConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    const nextQuery: any = {
                        ...router.query,
                        selectedCouponId,
                        finalPrice: finalPrice.toString(),
                        paymentMethod: activeTab,
                    };

                    if (activeTab === "CreditCard" && cardDetails) {
                        nextQuery.cardOwner = cardDetails.cardOwner;
                        nextQuery.cardnumber = cardDetails.cardnumber;
                    }

                    const searchParams = new URLSearchParams(nextQuery).toString();
                    window.location.href = `/payment-success?${searchParams}`;

                    setIsConfirmModalOpen(false);
                }}
            />
            {
                alertConfig && (
                    <div className="fixed flex items-center justify-center z-50 transform transition-all duration-500 ease-out md:right-10 md:bottom-10 md:w-110">
                        <Alert
                            type={alertConfig.type}
                            title={alertConfig.title}
                            message={alertConfig.message}
                            onClose={() => setAlertConfig(null)}
                        />
                    </div>
                )
            }
        </main>
    )
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
            <p className="text-body-2 text-brand-gray-400">
                Confirm booking and payment?
            </p>
        </Modal>
    );
}

