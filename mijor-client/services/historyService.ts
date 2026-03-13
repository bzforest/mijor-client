import axios from "axios"
import { BookingHistoryItem } from "@/types/bookingHistory"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export async function fetchBookingHistory(): Promise<BookingHistoryItem[]> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")

  const res = await axios.get(`${API_URL}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return res.data.data || []
}