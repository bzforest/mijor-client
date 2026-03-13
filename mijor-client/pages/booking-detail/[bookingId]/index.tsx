import React, { useState } from "react";
import Tag from "@/components/ui/Tag";
import { MapPin, CalendarDays, Clock3, Store } from "lucide-react";
import formatMyDate from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import Button from "@/components/ui/Button";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "axios";

interface BookingDetailData {
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

interface BookingDetailProps {
  bookingData: BookingDetailData | null;
  error: string | null;
  showtimeId: string;
  friendSeatLabels: string[];
  friendName: string;
  friendAvatar: string;
}

export const getServerSideProps: GetServerSideProps<BookingDetailProps> = async (context) => {
  // bookingId in URL = shareToken hex string
  const { bookingId } = context.params as { bookingId: string };
  const {
    showtimeId       = "",
    friendSeatLabels = "[]",
    friendName       = "",
    friendAvatar     = "",
  } = context.query as Record<string, string>;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  let parsedFriendSeats: string[] = [];
  try {
    parsedFriendSeats = JSON.parse(decodeURIComponent(friendSeatLabels));
  } catch {
    parsedFriendSeats = [];
  }

  try {
    // ✅ bookingId คือ shareToken — ใช้กับ endpoint เดิมได้เลย
    const res = await axios.get<BookingDetailData>(
      `${API_URL}/booking/share/${bookingId}`,
    );

    return {
      props: {
        bookingData:      res.data,
        error:            null,
        showtimeId:       showtimeId || res.data.showtimeId,
        friendSeatLabels: parsedFriendSeats.length > 0 ? parsedFriendSeats : res.data.seats,
        friendName:       friendName || res.data.sharedBy.name || "",
        friendAvatar:     friendAvatar || res.data.sharedBy.avatarUrl || "",
      },
    };
  } catch (err) {
    return {
      props: {
        bookingData: null,
        error: "No booking information found or the link has expired.",
        showtimeId,
        friendSeatLabels: parsedFriendSeats,
        friendName,
        friendAvatar,
      },
    };
  }
};

function BookingDetail({
  bookingData,
  error,
  showtimeId,
  friendSeatLabels,
  friendName,
  friendAvatar,
}: BookingDetailProps) {
  const { push } = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const displaySynopsis =
    !isExpanded && (bookingData?.synopsis?.length ?? 0) > 300
      ? `${bookingData?.synopsis?.slice(0, 300)}...`
      : bookingData?.synopsis;

  const buildBookMoreUrl = () => {
    const params = new URLSearchParams({
      friendSeatLabels: JSON.stringify(friendSeatLabels),
      friendName,
      friendAvatar,
    });
    return `/booking/${showtimeId}?${params.toString()}`;
  };

  if (error || !bookingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-[16px]">
        <p className="text-body-1 text-brand-gray-400">{error ?? "Booking not found"}</p>
        <Button variant="primary" onClick={() => push("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:items-center lg:px-[120px] lg:py-[80px] lg:gap-[32px]">
      <div className="w-full px-[16px] pt-[40px] pb-[24px] lg:p-0">
        <h1 className="text-headline-2 text-white text-start">Booking Detail</h1>
      </div>

      <div className="w-full flex flex-col gap-[16px] lg:flex-row lg:gap-[24px]">
        <img
          src={bookingData.posterUrl}
          alt={bookingData.title}
          className="lg:rounded-[4px] max-w-[387px] max-h-[565px]"
        />

        <div className="flex flex-col gap-[48px] p-[16px] bg-brand-gray-0 lg:rounded-[8px] lg:max-w-[789px]">
          <div className="flex flex-col gap-[24px]">
            <h2 className="text-headline-2 text-white">{bookingData.title}</h2>

            <div className="flex gap-[8px] flex-wrap">
              {bookingData.genres.map((genre, index) => (
                <Tag key={index} label={genre} variant="genre" />
              ))}
              <Tag label={bookingData.language} variant="language" />
            </div>

            <div className="flex flex-col gap-[8px]">
              <div className="flex flex-row items-center gap-[12px]">
                <MapPin size={24} className="text-brand-gray-200" strokeWidth={2} />
                <span className="text-body-2 text-brand-gray-400">{bookingData.cinema}</span>
              </div>
              <div className="flex flex-row items-center gap-[12px]">
                <CalendarDays size={24} className="text-brand-gray-200" strokeWidth={2} />
                <span className="text-body-2 text-brand-gray-400">{formatMyDate(bookingData.date)}</span>
              </div>
              <div className="flex flex-row items-center gap-[12px]">
                <Clock3 size={24} className="text-brand-gray-200" strokeWidth={2} />
                <span className="text-body-2 text-brand-gray-400">{formatTime(bookingData.time)}</span>
              </div>
              <div className="flex flex-row items-center gap-[12px]">
                <Store size={24} className="text-brand-gray-200" strokeWidth={2} />
                <span className="text-body-2 text-brand-gray-400">{bookingData.hall}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[24px] h-[48px]">
            <Tag label={`${bookingData.ticketCount} Ticket`} variant="language" textType="body-1-bold" />
            <div className="flex flex-row items-center gap-[24px] h-[24px]">
              <span className="text-body--bold text-brand-gray-400">Selected Seat</span>
              <span className="text-body-1-bold text-white">{bookingData.seats.join(", ")}</span>
            </div>
          </div>

          <div className="flex flex-row items-center gap-[24px] h-[48px]">
            <Button variant="primary" onClick={() => push(buildBookMoreUrl())}>
              Book more seats
            </Button>
          </div>

          <div className="w-full h-[1px] bg-brand-gray-100" />

          <div className="flex flex-col gap-[16px] w-fit">
            <p
              className="text-body-2 text-brand-gray-400 whitespace-pre-line cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {displaySynopsis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetail;