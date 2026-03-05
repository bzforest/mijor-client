import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { api } from "@/lib/booking/api";
import { socket } from "@/lib/booking/socket";
import { useAuth } from "@/contexts/AuthContext";
import { SeatRow, ShowtimeInfo } from "@/types/booking";

export const useBooking = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showtimeId } = router.query;

  // ===== State Management =====
  const [next, setNext] = useState<boolean>(false);
  const [seats, setSeats] = useState<SeatRow[]>([]);
  const [movieInfo, setMovieInfo] = useState<ShowtimeInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [expireTime, setExpireTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // ===== Selectors & Derived State =====
  const selectedSeatLabels = useMemo(() => {
    /* ================= Label Extraction ================= */
    // Responsibility: Map seat IDs to their corresponding row letters and seat numbers
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
        setExpireTime(null);
        setSelectedSeats([]);
        setNext(false);
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
    socket.on("seatSelected", ({ seatIds }) => {
      updateSeatStatus(seatIds, "selected");
    });

    socket.on("seatBooked", ({ seatIds }) => {
      updateSeatStatus(seatIds, "booked");
    });

    socket.on("seatExpired", ({ seatIds }) => {
      updateSeatStatus(seatIds, "available");
    });

    return () => {
      socket.off("seatSelected");
      socket.off("seatBooked");
      socket.off("seatExpired");
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

  const handleConfirm = async () => {
    if (!selectedSeats.length) return;

    try {
      await api.post("/showtimeSeat/confirm", {
        showtimeId,
        seatIds: selectedSeats,
      });

      setSelectedSeats([]);
      setExpireTime(null);
      setRemainingTime(0);
      alert("Booking confirmed successfully");
    } catch (error) {
      console.error("Failed to confirm booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  return {
    seats,
    movieInfo,
    selectedSeats,
    selectedSeatLabels,
    remainingTime,
    next,
    setNext,
    toggleSeat,
    handleSelect,
    handleConfirm,
  };
};
