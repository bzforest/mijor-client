/* ===== Service: paymentApi ===== */
// Responsibility: Centralize payment-related API calls

import axios from "axios";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  }
  return null;
};

interface QRPaymentRequest {
  amount: number;
  bookingId: string;
  totalPrice: number;
  selectedCouponId: string;
  seatExpiresAt: string;
}

interface QRPaymentResponse {
  isFree: any;
  success: boolean;
  qrData: any;
  paymentIntentId: string;
  error?: string;
  message?: string;
}

interface ConfirmQRRequest {
  showtimeId: string;
  seatIds: string[];
  selectedCouponId: string;
  paymentIntentId: string;
  forceSuccess?: boolean;
}

interface ConfirmQRResponse {
  success: boolean;
  bookingId: string;
  error?: string;
  message?: string;
}

/* ================= Create QR Payment ================= */
// Business rule: Generate QR code for PromptPay payment
export const createQRPayment = async (
  paymentData: QRPaymentRequest
): Promise<QRPaymentResponse> => {

  const token = getAuthToken();

  try {
    const response = await axios.post<QRPaymentResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-qr-payment`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ createQRPayment error response:", {
        status: error.response?.status,
        data: error.response?.data,
        requestBody: paymentData,
      });
    }
    throw error;
  }
};

/* ================= Confirm QR Payment ================= */
// Business rule: Confirm booking after successful QR payment
export const confirmQRPayment = async (
  confirmData: ConfirmQRRequest
): Promise<ConfirmQRResponse> => {

  const token = getAuthToken();

  try {
    const response = await axios.post<ConfirmQRResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/showtimeSeat/confirm-qr`,
      confirmData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("❌ Failed to confirm QR payment:", error);
    throw error;
  }
};
