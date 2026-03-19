/**
 * ===== Page: Payment Success =====
 * Responsibility: Display booking confirmation and provide digital receipt functionality.
 * This is a route-level component rendered after a successful payment transaction.
 */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { CheckCircle, Calendar, Clock, MapPin, Share2, Copy, Facebook, Twitter, MessageCircle, Send, Check, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/booking/api";

/**
 * PaymentSuccess Component
 * Displays the final booking state to the user.
 * It extracts booking data from URL query parameters passed from the Payment page.
 */
export default function PaymentSuccess() {
    const router = useRouter();
    const { query, isReady } = router;

    // --- Data Extraction Logic ---
    const bookingId = query.bookingId as string || "";
    const showtimeId = query.showtimeId as string || "";
    const title = query.title as string || "";
    const date = query.date as string || "";
    const time = query.time as string || "";
    const cinema = query.cinema as string || "";
    const hall = query.hall as string || "";
    const finalPrice = query.finalPrice as string || "0";
    const paymentMethod = query.paymentMethod as string || "";

    // --- Share Link State ---
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    /**
     * Parse selected seats from query.
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

    /**
     * Eagerly generate the share link as soon as the page loads.
     * This way, when the user clicks a social button, the URL is already ready
     * and we can open it synchronously (avoiding popup blockers).
     */
    useEffect(() => {
        if (!bookingId || shareUrl) return;

        const generate = async () => {
            setIsGeneratingLink(true);
            try {
                const response = await api.post("/share", { bookingId });
                const shareToken = response.data.shareToken;
                const url = `${window.location.origin}/shared/${shareToken}`;
                setShareUrl(url);
            } catch (error) {
                console.error("Failed to generate share link:", error);
            } finally {
                setIsGeneratingLink(false);
            }
        };

        generate();
    }, [bookingId]);

    /**
     * Build the social share URL for a given platform.
     */
    const getSocialUrl = (platform: string, url: string): string => {
        const encodedUrl = encodeURIComponent(url);
        const shareText = `มาดูหนัง ${title} ด้วยกัน! 🎬`;
        const encodedText = encodeURIComponent(shareText);

        const socialUrls: Record<string, string> = {
            LINE: `https://line.me/R/msg/text/?${encodedText}%0A${encodedUrl}`,
            Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            Twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
            Messenger: `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=0&redirect_uri=${encodeURIComponent(window.location.href)}`,
        };

        return socialUrls[platform] || "";
    };

    /**
     * Handle share to social platforms — fully synchronous since shareUrl is pre-generated.
     */
    const handleShareToSocial = (platform: string) => {
        if (!shareUrl) return;
        const targetUrl = getSocialUrl(platform, shareUrl);
        if (targetUrl) {
            window.open(targetUrl, "_blank");
        }
    };

    /**
     * Handle Copy Link action
     */
    const handleCopyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    if (!isReady) return null;

    return (
        <div className="flex flex-col items-center justify-center p-20 bg-transparent">
            <div className="flex flex-col gap-12">

                {/* --- Section: Booking Status Header --- */}
                <div className="flex flex-col items-center gap-6">
                    <CheckCircle size={80} strokeWidth={2} className="text-brand-green" />
                    <h1 className="text-headline-2 font-bold text-foreground">
                        Booking success
                    </h1>
                </div>

                {/* --- Section: Compact Booking Summary --- */}
                <div className="w-full max-w-md bg-brand-gray-0 rounded-xl p-6 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <MapPin size={18} className="text-brand-gray-200" />
                            <span className="text-body-2 text-brand-gray-400">{cinema}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <Calendar size={18} className="text-brand-gray-200" />
                            <span className="text-body-2 text-brand-gray-400">{date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <Clock size={18} className="text-brand-gray-200" />
                            <span className="text-body-2 text-brand-gray-400">{time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-brand-gray-300">
                            <MapPin size={18} className="text-brand-gray-200" />
                            <span className="text-body-2 text-brand-gray-400">{hall}</span>
                        </div>
                    </div>

                    <div className="border-t border-brand-gray-0 mt-6 pt-6 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray-300">Selected Seat</span>
                            <span className="text-foreground font-semibold">{seats.join(", ")}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray-300">Payment method</span>
                            <span className="text-foreground font-semibold uppercase">
                                {paymentMethod === "CreditCard" ? "Credit card" : "QR Code"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-brand-gray-300">Total</span>
                            <span className="text-foreground font-bold text-lg">THB {finalPrice}</span>
                        </div>
                    </div>
                </div>

                {/* --- Section: Primary Actions & Social Sharing --- */}
                <div className="flex flex-col items-center space-y-6 w-full">
                    <div className="flex gap-4 w-full justify-center">
                        <Button
                            variant="secondary"
                            className="border-brand-gray-100/20 cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            Back
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => router.push("/user-manage/booking-history")}
                            className="cursor-pointer"
                        >
                            Booking detail
                        </Button>
                    </div>

                    {/* Social Share Popover Configuration */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors text-sm underline underline-offset-4 decoration-foreground/30 cursor-pointer">
                                {isGeneratingLink ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Share2 size={16} />
                                )}
                                Share this booking
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-brand-gray-0 border-brand-gray-100/20 w-fit p-4 rounded-xl shadow-3xl">
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-xs text-brand-gray-400 uppercase font-semibold tracking-wider">Share Booking</p>
                                <div className="flex gap-4 p-2">
                                    <ShareIcon
                                        label="LINE"
                                        bg="bg-[#00B900]"
                                        onClick={() => handleShareToSocial("LINE")}
                                    >
                                        <MessageCircle size={20} fill="white" />
                                    </ShareIcon>
                                    <ShareIcon
                                        label="Messenger"
                                        bg="bg-[#00B2FF]"
                                        onClick={() => handleShareToSocial("Messenger")}
                                    >
                                        <Send size={20} fill="white" />
                                    </ShareIcon>
                                    <ShareIcon
                                        label="Facebook"
                                        bg="bg-[#1877F2]"
                                        onClick={() => handleShareToSocial("Facebook")}
                                    >
                                        <Facebook size={20} fill="white" />
                                    </ShareIcon>
                                    <ShareIcon
                                        label="Twitter"
                                        bg="bg-[#000000]"
                                        onClick={() => handleShareToSocial("Twitter")}
                                    >
                                        <Twitter size={20} fill="white" />
                                    </ShareIcon>
                                    <ShareIcon
                                        label={isCopied ? "Copied!" : "Copy link"}
                                        bg="bg-brand-gray-200"
                                        onClick={handleCopyLink}
                                    >
                                        {isCopied ? <Check size={20} className="text-brand-green" /> : <Copy size={20} />}
                                    </ShareIcon>
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
function ShareIcon({ children, label, bg, onClick }: { children: React.ReactNode, label: string, bg: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
        >
            <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center text-white shadow-md`}>
                {children}
            </div>
            <span className="text-[10px] text-brand-gray-400 font-medium">{label}</span>
        </button>
    );
}
