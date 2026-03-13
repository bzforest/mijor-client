import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { api } from "@/lib/booking/api";
import { socket } from "@/lib/booking/socket";
import { useAuth } from "@/contexts/AuthContext";
import { SeatRow, ShowtimeInfo, PaymentParams } from "@/types/booking";
import { useMemo as useMemoReact } from "react";

export const useBooking = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showtimeId } = router.query;

  // ===== Friend Seat Data (from share link) =====
  // The share API returns seats.id, but the booking grid uses showtime_seats.id.
  // So we pass seat labels (e.g., "A3", "B5") instead, and resolve to showtime_seat IDs here.
  const friendSeatLabels = useMemoReact(() => {
    const raw = router.query.friendSeatLabels;
    if (!raw) return [] as string[];
    try {
      return JSON.parse(raw as string) as string[];
    } catch {
      return [] as string[];
    }
  }, [router.query.friendSeatLabels]);
  const friendName = (router.query.friendName as string) || null;
  const friendAvatar = (router.query.friendAvatar as string) || null;

  // ===== State Management =====
  const [next, setNext] = useState<boolean>(false);
  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [movieInfo, setMovieInfo] = useState<ShowtimeInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [expireTime, setExpireTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  // ===== Selectors & Derived State =====
  const selectedSeatLabels = useMemo(() => {
    /* ================= Label Extraction ================= */
    // Responsibility: Map seat IDs to their corresponding row let
    // ters and seat numbers
    const labels = selectedSeats.map((id) => {
      const row = seats.find((r) => r.seats.some((s) => s.id === id));
      const seat = row?.seats.find((s) => s.id === id);

      return {
        label: row && seat ? `${row.row_letter}${seat.seat_number}` : id,
        rowLetter: row?.row_letter || "",
        seatNumber: seat?.seat_number || 0,
      };
    });

    /* ================= Sorting ================= */
    // Responsibility: Sort labels alphabetically by row and numerically by seat number
    return labels
      .sort((a, b) => {
        if (a.rowLetter !== b.rowLetter) {
          return a.rowLetter.localeCompare(b.rowLetter);
        }
        return a.seatNumber - b.seatNumber;
      })
      .map((item) => item.label);
  }, [selectedSeats, seats]);

  // ===== Helper Functions =====
  const updateSeatStatus = (
    seatIds: string[],
    status: "available" | "selected" | "booked",
  ) => {
    setSeats((prev) =>
      prev.map((row) => ({
        ...row,
        seats: row.seats.map((seat) =>
          seatIds.includes(seat.id) ? { ...seat, status } : seat,
        ),
      })),
    );
  };

  // ===== Side Effects =====

  /* ================= Initial Data Fetching ================= */
  useEffect(() => {
    if (!showtimeId) return;

    const fetchData = async () => {
      try {
        const [infoRes, seatRes] = await Promise.all([
          api.get(`/showtime/${showtimeId}/info`),
          api.get(`/showtime/${showtimeId}/seats`),
        ]);

        setMovieInfo(infoRes.data);
        setSeats(seatRes.data);
      } catch (error) {
        console.error("Failed to fetch booking data:", error);
      }
    };

    fetchData();
  }, [showtimeId]);

  /* ================= Reselection Timer ================= */
  useEffect(() => {
    if (!expireTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.floor((expireTime.getTime() - now) / 1000);

      if (diff <= 0) {
        clearInterval(interval);
        setRemainingTime(0);
      } else {
        setRemainingTime(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireTime]);

  /* ================= Socket Lifecycle ================= */
  useEffect(() => {
    if (!showtimeId) return;

    socket.emit("joinShowtime", showtimeId);

    return () => {
      socket.off();
    };
  }, [showtimeId]);

  /* ================= Realtime Seat Updates ================= */
  useEffect(() => {
    const handleSeatSelected = ({ seatIds }: { seatIds: string[] }) => {
      updateSeatStatus(seatIds, "selected");
    };

    const handleSeatBooked = ({ seatIds }: { seatIds: string[] }) => {
      updateSeatStatus(seatIds, "booked");
    };

    const handleSeatExpired = ({ seatIds }: { seatIds: string[] }) => {
      updateSeatStatus(seatIds, "available");
    };

    socket.on("seatSelected", handleSeatSelected);
    socket.on("seatBooked", handleSeatBooked);
    socket.on("seatExpired", handleSeatExpired);

    return () => {
      socket.off("seatSelected", handleSeatSelected);
      socket.off("seatBooked", handleSeatBooked);
      socket.off("seatExpired", handleSeatExpired);
    };
  }, []);

  /* ================= Persistence Restoration ================= */
  useEffect(() => {
    if (!showtimeId || !user) return;

    const restoreSelection = async () => {
      try {
        const res = await api.get(`/showtimeSeat/${showtimeId}/my-seats`);

        const seatIds = res.data.seatIds;
        const expiresAt = res.data.expires_at;

        if (!seatIds || seatIds.length === 0) return;
        if (new Date(expiresAt).getTime() < Date.now()) return;

        setSelectedSeats(seatIds);
        setExpireTime(new Date(expiresAt));
        setNext(true);
      } catch (error) {
        console.log("No previous selection", error);
      }
    };

    restoreSelection();
  }, [showtimeId, user]);

  // ===== Event Handlers =====

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const handleExpired = () => {
    updateSeatStatus(selectedSeats, "available");
    setSelectedSeats([]);
    setNext(false);
    setExpireTime(null);
    setRemainingTime(0);
};

  const handleSelect = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await api.post("/showtimeSeat/select", {
        showtimeId,
        seatIds: selectedSeats,
      });

      const expire = res.data.data[0].expires_at;
      setExpireTime(new Date(expire));
      setNext(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        const seatRes = await api.get(`/showtime/${showtimeId}/seats`);
        setSeats(seatRes.data);
        setSelectedSeats([]);
        alert("Sorry, this seat has already been selected by someone else");
        return;
      }
      alert("Database connection failed");
    }
  };

  const handleConfirm = async (params: PaymentParams) => {
    if (!selectedSeats.length) return;
    
    // ป้องกันการส่ง request ซ้ำ (global check)
    const globalConfirming = localStorage.getItem('isConfirming') === 'true';
    if (globalConfirming) {
      console.log('🔒 Already confirming globally, ignoring duplicate request');
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      console.error('🔴 User not authenticated');
      alert('Please login to confirm booking');
      return;
    }

    localStorage.setItem('isConfirming', 'true');

    try {
      console.log('🔵 Confirming booking with params:', params);
      console.log('🔵 Selected seats:', selectedSeats);
      console.log('🔵 ShowtimeId:', showtimeId);
      console.log('🔵 User:', user);
      
      const bookingResult = await api.post("/showtimeSeat/confirm", {
        showtimeId,
        seatIds: selectedSeats,
        selectedCouponId: params.selectedCouponId,
      });

      const bookingId = bookingResult.data.bookingId;

      const nextQuery: any = {
        bookingId: bookingId,
        showtimeId: showtimeId as string,
        title: movieInfo?.title || "",
        picture: movieInfo?.posterUrl || "",
        date: movieInfo?.date || "",
        genre: JSON.stringify(movieInfo?.genres || []),
        language: movieInfo?.languages?.join(", ") || "",
        time: movieInfo?.time || "",
        hall: movieInfo?.hall || "",
        cinema: movieInfo?.cinema || "",
        selectedSeats: JSON.stringify(selectedSeatLabels),
        totalPrice: (selectedSeats.length * (movieInfo?.price || 0)).toString(),
        selectedCouponId: params.selectedCouponId,
        finalPrice: params.finalPrice.toString(),
        paymentMethod: params.paymentMethod,
      };

      if (params.paymentMethod === "CreditCard") {
        nextQuery.cardOwner = params.cardOwner;
        nextQuery.cardnumber = params.cardnumber;
      }

      const searchParams = new URLSearchParams(nextQuery).toString();
      router.push(`/payment-success?${searchParams}`);

      setSelectedSeats([]);
      setExpireTime(null);
      setRemainingTime(0);
    } catch (error) {
      console.error("Failed to confirm booking:", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      localStorage.removeItem('isConfirming');
      setIsConfirming(false);
    }
  };

  // ===== Resolve Friend Seat Labels to showtime_seat IDs =====
  // friendSeatLabels contains labels like ["A3", "B5"]
  // We need to find the corresponding showtime_seats.id in the loaded seat grid
  const friendSeatIds = useMemoReact(() => {
    if (friendSeatLabels.length === 0 || seats.length === 0)
      return [] as string[];

    const resolved: string[] = [];
    for (const label of friendSeatLabels) {
      for (const row of seats) {
        const matchingSeat = row.seats.find(
          (seat) => `${row.row_letter}${seat.seat_number}` === label,
        );
        if (matchingSeat) {
          resolved.push(matchingSeat.id);
          break;
        }
      }
    }
    return resolved;
  }, [friendSeatLabels, seats]);

  return {
    seats,
    movieInfo,
    selectedSeats,
    selectedSeatLabels,
    showtimeId: showtimeId as string,
    remainingTime,
    next,
    setNext,
    toggleSeat,
    handleSelect,
    handleConfirm,
    friendSeatIds,
    friendName,
    friendAvatar,
    handleExpired,
  };
};
