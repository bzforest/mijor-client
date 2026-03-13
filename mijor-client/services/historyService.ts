import axios from "axios"
import { BookingHistoryItem } from "@/types/bookingHistory"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

type BookingHistoryResponse = {
  data: BookingHistoryItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function fetchBookingHistory(
  page: number = 1,
  limit: number = 5
): Promise<BookingHistoryResponse> {
  const token =
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")

  const res = await axios.get(`${API_URL}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
    },
  })

  return res.data
}