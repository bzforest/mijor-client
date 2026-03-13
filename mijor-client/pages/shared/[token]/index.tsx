/**
 * ===== Page: Shared Booking =====
 * Path: /shared/[token]
 *
 * FIX: อ่าน token จาก router.query แทนการพึ่ง shareToken prop
 *      เพื่อหลีกเลี่ยง hydration timing issue
 */

import { useRouter } from "next/router";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Head from "next/head";
import { GetServerSideProps } from "next";
import LoadingPage from "@/components/loading/LoadingPage";
import axios from "axios";

interface ShareData {
  showtimeId: string;
  posterUrl: string;
  title: string;
  genres: string[];
  language: string;
  cinema: string;
  date: string;
  time: string;
  hall: string;
  ticketCount: number;
  seats: string[];
  synopsis: string;
  sharedBy: {
    name: string;
    avatarUrl: string | null;
  };
}

interface SharedBookingProps {
  shareData: ShareData | null;
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<SharedBookingProps> = async (context) => {
  const { token } = context.params as { token: string };
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    const response = await axios.get<ShareData>(`${API_URL}/booking/share/${token}`);
    return {
      props: { shareData: response.data, error: null },
    };
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      errorMessage = "Link share is not valid or expired";
    }
    return {
      props: { shareData: null, error: errorMessage },
    };
  }
};

export default function SharedBooking({ shareData, error }: SharedBookingProps) {
  const router = useRouter();

  // ✅ FIX: อ่าน token จาก router.query โดยตรง — ไม่พึ่ง prop ที่อาจ undefined ตอน hydrate
  const token = router.query.token as string | undefined;

  useEffect(() => {
    if (!shareData || !token) return;

    const params = new URLSearchParams({
      showtimeId:       shareData.showtimeId,
      friendSeatLabels: JSON.stringify(shareData.seats),
      friendName:       shareData.sharedBy.name || "",
      friendAvatar:     shareData.sharedBy.avatarUrl || "",
    });

    router.replace(`/booking-detail/${token}?${params.toString()}`);
  }, [shareData, token]);

  const ogTitle = shareData
    ? `${shareData.sharedBy.name} ชวนดู ${shareData.title}!`
    : "Shared Booking - Mijor Cinema";
  const ogDescription = shareData
    ? `📍 ${shareData.cinema} | 📅 ${shareData.date} | ⏰ ${shareData.time} | 🎬 ${shareData.hall}`
    : "ดู booking ของเพื่อนและจองที่นั่งใกล้ๆ กัน!";
  const ogImage = shareData?.posterUrl || "";

  if (error) {
    return (
      <>
        <Head><title>Share Link Error - Mijor Cinema</title></Head>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <AlertCircle size={64} className="text-red-400" />
          <div className="flex flex-col items-center gap-2">
            <p className="text-white text-body-1-bold">Unable to open share link</p>
            <p className="text-brand-gray-400 text-body-2-regular text-center max-w-md">{error}</p>
          </div>
          <Button variant="primary" onClick={() => router.push("/")}>Back to home</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{ogTitle}</title>
        <meta property="og:title"       content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Head>
      <LoadingPage />
    </>
  );
}