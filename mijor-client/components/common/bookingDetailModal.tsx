import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import BookingCard from "@/components/common/bookingCard";
import Button from "@/components/ui/Button";
import { mapBookingStatus } from "@/utils/booking/mapBookingStatus";
import SummaryPriceBlock from "@/components/common/summaryPriceBloack";
import { cancelBooking } from "@/services/bookingService";
import Radio from "@/components/ui/Radio";
import formatMyDate from "@/utils/formatDate";
import { formatTime, getBookingStatus, canCancelBooking } from "@/utils/formatTime";
import { Share2, Copy, Facebook, Twitter, MessageCircle, Send, Check, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { api } from "@/lib/booking/api";

interface Props {
  booking: any;
  onClose: () => void;
  onCancelled: () => void;
}

export default function BookingDetailModal({
  booking,
  onClose,
  onCancelled,
}: Props) {
  const [mode, setMode] = useState<"detail" | "reason">("detail");
  const [isMobile, setIsMobile] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  // --- Share Link State ---
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Eagerly generate the share link
  useEffect(() => {
    // Do not generate share link for refunded or cancelled bookings
    if (booking?.status === "refunded" || booking?.status === "cancelled") return;

    if (!booking?.booking_id || shareUrl) return;

    const generate = async () => {
      setIsGeneratingLink(true);
      try {
        const response = await api.post("/share", { bookingId: booking.booking_id });
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
  }, [booking?.booking_id, shareUrl]);

  /**
   * Build the social share URL for a given platform.
   */
  const getSocialUrl = (platform: string, url: string): string => {
    const encodedUrl = encodeURIComponent(url);
    const shareText = `มาดูหนัง ${booking.title} ด้วยกัน! 🎬`;
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
   * Handle share to social platforms
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

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cancelReasons = [
    "I had changed my mind",
    "I found an alternative",
    "The booking was created by accident",
    "Other reasons",
  ];

  if (!booking) return null;

  const date = formatMyDate(booking.start_time);
  const time = formatTime(booking.start_time);
  
  // ใช้ helper function ใหม่สำหรับตรวจสอบสถานะและการ cancel
  const canCancel = canCancelBooking(booking.start_time, booking.status);
  const uiStatus = getBookingStatus(booking.start_time, booking.status);

  const handleConfirmCancel = async () => {
    try {
      setLoading(true)
      await cancelBooking(booking.booking_id, reason || "")

      router.push(`/booking/cancel-success?bookingId=${booking.booking_id}`);
    } catch (e) {
      console.error("Cancel failed", e);
      alert("Cancel failed");
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose()}
      />

      {/* modal card */}
      <div
        className="
          relative
          w-full max-w-[768px] 
          bg-brand-gray-0
          rounded-xl
          shadow-2xl
          p-4 md:p-6
          z-10
          max-h-[80vh] md:max-h-[90vh] overflow-y-auto
        "
      >
        {/* header */}
        <div className="flex justify-between items-center mb-4 md:mb-4">
          <h2 className="text-white text-headline-4 md:text-headline-4 text-center w-full">
            Booking Detail
          </h2>

          <div className="flex items-center gap-4">
            {/* Share Feature - Only show if not refunded or cancelled */}
            {!(
              booking?.status === "refunded" || booking?.status === "cancelled"
            ) && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {isGeneratingLink ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Share2 size={20} />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="bg-brand-gray-0 border-brand-gray-100/20 w-fit p-4 rounded-xl shadow-3xl z-60">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xs text-brand-gray-400 uppercase font-semibold tracking-wider">
                      Share Booking
                    </p>
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
                        {isCopied ? (
                          <Check size={20} className="text-brand-green" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </ShareIcon>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <button
              onClick={() => onClose()}
              className="text-gray-400 hover:text-white text-xl pb-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* content */}
        {mode === "detail" && (
          <div className="flex flex-col gap-4 md:gap-6 justify-center items-center w-full">
            <BookingCard
              title={booking.title || ""}
              picture={booking.poster_url || ""}
              cinema="Major Cineplex"
              hall="Hall 1"
              date={date}
              time={time}
              bookingNo={(booking.booking_id || "").slice(0, 8).toUpperCase()}
              bookedDate={booking.created_at}
              tickets={booking.seats?.length || 0}
              selectedSeat={booking.seats?.join(", ") || "-"}
              paymentMethod={booking.payment_method || "Credit card"}
              status={mapBookingStatus(uiStatus)}
              variant={isMobile ? "mobile" : "desktop"}
            />

            <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-6">
              <div className="w-full md:w-1/2">
                <SummaryPriceBlock
                  tickets={booking.seats?.length || 0}
                  subtotal={booking.subtotal}
                  discount={booking.discount}
                  total={booking.total_price}
                />
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-end items-end">
                <Button
                  variant="secondary"
                  state={canCancel ? "default" : "disabled"}
                  onClick={() => {
                    if (!canCancel) return
                    setMode("reason")
                  }}
                  className="w-full md:w-auto cursor-pointer"
                >
                  Cancel booking
                </Button>

                {!canCancel && (
                  <p className="text-red-400 text-xs md:text-sm mt-2 text-center md:text-right w-full">
                    Cannot cancel within 30 minutes before showtime
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {mode === "reason" && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* LEFT */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-white text-body-1">
                Reason for cancellation
              </h3>

              <div className="flex flex-col text-body-2 text-gray-400 gap-4">
                {cancelReasons.map((r) => (
                  <Radio
                    key={r}
                    name="cancel-reason"
                    label={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                ))}
              </div>

              <div className="hidden md:flex flex-col md:flex-row justify-between mt-6 w-full gap-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMode("detail");
                    setReason(null);
                  }}
                  className="w-full md:w-auto cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>

            {/* RIGHT summary */}
            <div className="w-full md:w-[300px] flex flex-col justify-between">
              <SummaryPriceBlock
                tickets={booking.seats?.length || 0}
                subtotal={booking.subtotal}
                discount={booking.discount}
                total={booking.total_price}
              />

              <div className="self-end w-full md:w-auto">
                <Button
                  variant="primary"
                  state={reason || loading ? "default" : "disabled"}
                  onClick={handleConfirmCancel}
                  className="w-full md:w-auto cursor-pointer"
                >
                  {loading ? "Cancelling..." : "Confirm cancel"}
                </Button>
              </div>
              <div className="md:hidden flex flex-col justify-between mt-6 w-full gap-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMode("detail");
                    setReason(null);
                  }}
                  className="w-full md:w-auto cursor-pointer"
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Internal Helper: ShareIcon
 */
function ShareIcon({
  children,
  label,
  bg,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  bg: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 transition-transform hover:scale-110 active:scale-95"
    >
      <div
        className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center text-white shadow-md`}
      >
        {children}
      </div>
      <span className="text-[10px] text-brand-gray-400 font-medium">{label}</span>
    </button>
  );
}
