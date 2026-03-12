/* ===== Hook: useQRPayment ===== */
// Responsibility: Manage QR code generation and payment state

import { useState, useEffect, useRef } from "react";
import { createQRPayment } from "@/services/paymentApi";
import axios from "axios";

interface QRPaymentData {
  amount: number;
  bookingId: string;
  totalPrice: number;
  selectedCouponId: string;
  seatExpiresAt: string;
}

export const useQRPayment = (
  paymentData: QRPaymentData,
  isReady: boolean
) => {
  const [qrData, setQrData] = useState<any>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFree, setIsFree] = useState(false);
  const [error, setError] = useState<string>("");
  const hasGeneratedRef = useRef(false);

  /* ================= Generate QR Code ================= */
  // Business rule: Generate QR code only once when router is ready
  useEffect(() => {
    if (!isReady) return;
    if (hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;

    const generateQR = async () => {
      try {
        setIsLoading(true);
        setError("");

        console.log("🔵 Creating QR payment with data:", paymentData);

        const data = await createQRPayment(paymentData);
        console.log("📡 API Response data:", data);

        if (data.success) {
          console.log("🔵 QR Payment Created:", data);
          setQrData(data.qrData);
          setPaymentIntentId(data.paymentIntentId);
          if (data.isFree) setIsFree(true);
        } else {
          throw new Error(
            data.error || data.message || "Failed to create QR payment",
          );
        }

        setIsLoading(false);
      } catch (error) {
        console.error("❌ Failed to generate QR code:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate QR code";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    generateQR();
  }, [isReady, paymentData]);
  
  return {
    qrData,
    paymentIntentId,
    isLoading,
    error,
    isFree,
  };
};
