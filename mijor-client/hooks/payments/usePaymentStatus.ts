/* ===== Hook: usePaymentStatus ===== */
/* Responsibility: Poll payment status from server with demo mode fallback */

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

interface PaymentStatusReturn {
  status: 'pending' | 'processing' | 'succeeded' | 'canceled' | 'expired' | 'failed';
  isLoading: boolean;
  error: string | null;
  checkStatus: () => Promise<void>;
  stopPolling: () => void;
}

export const usePaymentStatus = (paymentIntentId: string): PaymentStatusReturn => {
  const [status, setStatus] = useState<PaymentStatusReturn['status']>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isPollingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

    /* ===== Stop Polling Function ===== */
  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /* ===== Status Check Function ===== */
  // Responsibility: Check payment status via API or demo mode
  const checkStatus = useCallback(async () => {
    if (!paymentIntentId) return;
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Polling payment status for:', paymentIntentId);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/status/${paymentIntentId}`
      );
      const data = response.data;
      console.log('📊 Payment status response:', data.status);

      if (data.success) {
        setStatus(data.status);
        if (['succeeded', 'canceled', 'failed'].includes(data.status)) {
          console.log('🛑 Stopping polling:', data.status);
          stopPolling();
        }
      }
    } catch (err) {
      console.error('❌ Status check failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [paymentIntentId, stopPolling]);

  /* ===== Auto-Polling Effect ===== */
  // Responsibility: Continuously poll status while payment is pending
  useEffect(() => {
    if (!paymentIntentId) return;

    console.log('🚀 Starting polling for:', paymentIntentId);
    isPollingRef.current = true;
    
    checkStatus(); // เช็คทันทีรอบแรก

    intervalRef.current = setInterval(() => {
      if (!isPollingRef.current) return;
      checkStatus();
    }, 3000);

    return () => stopPolling();
  }, [paymentIntentId]); // eslint-disable-line

  return { status, isLoading, error, checkStatus, stopPolling };
};
