/**
 * ===== Page: Payment Success =====
 * Responsibility: Display booking confirmation and provide digital receipt functionality.
 * This is a route-level component rendered after a successful payment transaction.
 */

import { useRouter } from "next/router";
import Button from "@/components/ui/Button";
import { CheckCircle, Calendar, Clock, MapPin, Share2, Copy, Facebook, Twitter, MessageCircle, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * PaymentSuccess Component
 * Displays the final booking state to the user.
 * It extracts booking data from URL query parameters passed from the Payment page.
 */
export default function PaymentSuccess() {
    const router = useRouter();
    const { query, isReady } = router;

    // --- Data Extraction Logic ---
    // Extracting basic info from query. Why: This page is intentionally decoupled from
    // the global state to allow sharing or reloading the success state directly via URL.
    const title = query.title as string || "";
    const date = query.date as string || "";
    const time = query.time as string || "";
    const cinema = query.cinema as string || "";
    const hall = query.hall as string || "";
    const finalPrice = query.finalPrice as string || "0";
    const paymentMethod = query.paymentMethod as string || "";

    /**
     * Parse selected seats from query.
     * Logic: Handles both single string (JSON) and array formats for robustness.
     * Required because URL params can be fragile depending on how they are serialized.
     */
    let seats: string[] = [];
    try {
        const selectedSeatsRaw = query.selectedSeats;
        if (typeof selectedSeatsRaw === "string") {
            seats = JSON.parse(selectedSeatsRaw);
        } else if (Array.isArray(selectedSeatsRaw)) {
            seats = selectedSeatsRaw as string[];
        }
    } catch (e) {
        console.error("Failed to parse seats:", e);
    }

    if (!isReady) return null;

    console.log(query);

    return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="flex flex-col gap-12">

                {/* --- Section: Booking Status Header --- 
                    Purpose: Immediate visual feedback of successful operation.
                */}
                <div className="flex flex-col items-center gap-6">
                    <CheckCircle size={80} strokeWidth={2} className="text-brand-green" />
                    <h1 className="text-headline-2 font-bold text-white">
                        Booking success
                    </h1>
                </div>

                {/* --- Section: Compact Booking Summary --- 
                    Purpose: Display core showtime details in a unified card.
                */}
                <div className="w-full max-w-md bg-brand-gray-100 rounded-xl p-6 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <MapPin size={18} className="text-brand-blue-100" />
                            <span className="text-body-2">{cinema}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <Calendar size={18} className="text-brand-blue-100" />
                            <span className="text-body-2">{date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <Clock size={18} className="text-brand-blue-100" />
                            <span className="text-body-2">{time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <MapPin size={18} className="text-brand-blue-100" />
                            <span className="text-body-2">{hall}</span>
                        </div>
                    </div>

                    <div className="border-t border-brand-gray-0 mt-6 pt-6 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray-400">Selected Seat</span>
                            <span className="text-white font-semibold">{seats.join(", ")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray-400">Payment method</span>
                            <span className="text-white font-semibold uppercase">
                                {paymentMethod === "CreditCard" ? "Credit card" : "QR Code"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray-400">Total</span>
                            <span className="text-white font-bold text-lg">THB {finalPrice}</span>
                        </div>
                    </div>
                </div>

                {/* --- Section: Primary Actions & Social Sharing --- 
                    Logic: Includes main navigation and a popover for social shares.
                */}
                <div className="flex flex-col items-center space-y-6 w-full">
                    <div className="flex gap-4 w-full justify-center">
                        <Button
                            variant="secondary"
                            className="border-brand-gray-100/20"
                            onClick={() => router.push("/")}
                        >
                            Back to home
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {/* Navigate to booking history or details page */ }}
                        >
                            Booking detail
                        </Button>
                    </div>

                    {/* Social Share Popover Configuration */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm underline underline-offset-4 decoration-white/30">
                                <Share2 size={16} />
                                Share this booking
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-[#1E293B] border-brand-gray-100/20 w-fit p-4 rounded-xl shadow-3xl">
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-xs text-brand-gray-400 uppercase font-semibold tracking-wider">Share Booking</p>
                                <div className="flex gap-4 p-2">
                                    <ShareIcon label="LINE" bg="bg-[#00B900]"><MessageCircle size={20} fill="white" /></ShareIcon>
                                    <ShareIcon label="Messenger" bg="bg-[#00B2FF]"><Send size={20} fill="white" /></ShareIcon>
                                    <ShareIcon label="Facebook" bg="bg-[#1877F2]"><Facebook size={20} fill="white" /></ShareIcon>
                                    <ShareIcon label="Twitter" bg="bg-[#000000]"><Twitter size={20} fill="white" /></ShareIcon>
                                    <ShareIcon label="Copy link" bg="bg-brand-gray-200"><Copy size={20} /></ShareIcon>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

            </div>
        </div>
    );
}

/**
 * Internal Helper: ShareIcon
 * Responsibility: Individual social icon wrapper with consistent sizing and labels.
 */
function ShareIcon({ children, label, bg }: { children: React.ReactNode, label: string, bg: string }) {
    return (
        <button className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95">
            <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center text-white shadow-md`}>
                {children}
            </div>
            <span className="text-[10px] text-brand-gray-400 font-medium">{label}</span>
        </button>
    );
}

