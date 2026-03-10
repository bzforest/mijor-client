/**
 * ===== Page: Shared Booking =====
 * Responsibility: Receive a share link token, fetch friend's booking data,
 * and redirect to the booking realtime page with friend seat info.
 *
 * Uses getServerSideProps to fetch data server-side so that
 * Open Graph meta tags (og:image, og:title, etc.) are available
 * when social platforms (Facebook, LINE, Twitter) crawl this URL.
 */

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Head from "next/head";
import { GetServerSideProps } from "next";
import LoadingPage from "@/components/loading/LoadingPage";
import axios from "axios";

/**
 * FriendSeat type from the share API response
 */
interface FriendSeat {
    seatId: string;
    rowLetter: string;
    seatNumber: string;
}

/**
 * ShareData type from GET /booking/share/:shareToken response
 */
interface ShareData {
    showtimeId: string;
    showtime: {
        movieTitle: string;
        posterUrl: string;
        date: string;
        time: string;
        cinema: string;
        hall: string;
    };
    sharedBy: {
        name: string;
        avatarUrl: string | null;
    };
    friendSeats: FriendSeat[];
}

interface SharedBookingProps {
    shareData: ShareData | null;
    error: string | null;
}

/**
 * getServerSideProps — fetch share data on the server
 * so Open Graph meta tags are rendered in the initial HTML response.
 * Social crawlers (Facebook, LINE, Twitter) read these tags to build link previews.
 */
export const getServerSideProps: GetServerSideProps<SharedBookingProps> = async (context) => {
    const { token } = context.params as { token: string };
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    try {
        const response = await axios.get<ShareData>(`${API_URL}/booking/share/${token}`);

        return {
            props: {
                shareData: response.data,
                error: null,
            },
        };
    } catch (error) {
        console.error("Failed to fetch share data:", error);

        let errorMessage = "Something went wrong";
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            errorMessage = "Link share is not valid or expired";
        }

        return {
            props: {
                shareData: null,
                error: errorMessage,
            },
        };
    }
};

export default function SharedBooking({ shareData, error }: SharedBookingProps) {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // --- Redirect to booking page with friend seat data ---
    useEffect(() => {
        if (!shareData || isRedirecting) return;
        setIsRedirecting(true);

        const friendSeatLabels = shareData.friendSeats.map(
            (seat) => `${seat.rowLetter}${seat.seatNumber}`
        );
        const queryParams = new URLSearchParams({
            friendSeatLabels: JSON.stringify(friendSeatLabels),
            friendName: shareData.sharedBy.name || "",
            friendAvatar: shareData.sharedBy.avatarUrl || "",
        }).toString();

        router.replace(`/booking/${shareData.showtimeId}?${queryParams}`);
    }, [shareData]);

    // --- Open Graph Meta Tags for Social Share Preview ---
    const ogTitle = shareData
        ? `${shareData.sharedBy.name} invites you to watch ${shareData.showtime.movieTitle}!`
        : "Shared Booking - Mijor Cinema";
    const ogDescription = shareData
        ? `📍 ${shareData.showtime.cinema} | 📅 ${shareData.showtime.date} | ⏰ ${shareData.showtime.time} | 🎬 ${shareData.showtime.hall}`
        : "View your friend's booking and book seats nearby!";
    const ogImage = shareData?.showtime.posterUrl || "";

    // --- Error State ---
    if (error) {
        return (
            <>
                <Head>
                    <title>Share Link Error - Mijor Cinema</title>
                </Head>
                <div className="flex flex-col items-center justify-center min-h-screen gap-6">
                    <AlertCircle size={64} className="text-red-400" />
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-white text-body-1-bold">
                            Failed to open share link
                        </p>
                        <p className="text-brand-gray-400 text-body-2-regular text-center max-w-md">
                            {error}
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => router.push("/")}
                    >
                        Back to home
                    </Button>
                </div>
            </>
        );
    }

    // --- Loading / Redirecting State (with OG tags for crawlers) ---
    return (
        <>
            <Head>
                <title>{ogTitle}</title>
                <meta property="og:title" content={ogTitle} />
                <meta property="og:description" content={ogDescription} />
                {ogImage && <meta property="og:image" content={ogImage} />}
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={ogTitle} />
                <meta name="twitter:description" content={ogDescription} />
                {ogImage && <meta name="twitter:image" content={ogImage} />}
            </Head>
            <LoadingPage />
        </>
    );
}
