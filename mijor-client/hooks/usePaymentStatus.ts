/* ===== Hook: usePaymentStatus ===== */
/* Responsibility: Poll payment status from server with demo mode fallback */

import { useState, useEffect, useCallback } from "react";

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
  const [isPolling, setIsPolling] = useState(false);

  /* ===== Status Check Function ===== */
  // Responsibility: Check payment status via API or demo mode
  const checkStatus = useCallback(async () => {
    if (!paymentIntentId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Checking payment status for:', paymentIntentId);
      
      // Demo mode simulation for test payments
      if (paymentIntentId.startsWith('pi_demo_')) {
        console.log('🔄 Demo payment detected, simulating status check');
        
        // Simulate random payment success (10% chance)
        const randomSuccess = Math.random() > 0.5;
        
        if (randomSuccess) {
          setStatus('succeeded');
        } else {
          setStatus('pending');
        }
        
        setIsLoading(false);
        return;
      }
      
      // Real API call for production payments
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/status/${paymentIntentId}`);
      
      if (!response.ok) {
        console.log('🔄 Status API not working, keeping demo mode');
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('📊 Payment status response:', data);
      
      if (data.success) {
        setStatus(data.status);
        
        // Stop polling when payment is complete
        if (data.status === 'succeeded' || data.status === 'canceled' || data.status === 'expired' || data.status === 'failed') {
          setIsPolling(false);
        }
      } else {
        throw new Error(data.error || 'Failed to check payment status');
      }
      
    } catch (error) {
      console.error('❌ Status check failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [paymentIntentId]);

  /* ===== Stop Polling Function ===== */
  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  /* ===== Auto-Polling Effect ===== */
  // Responsibility: Continuously poll status while payment is pending
  useEffect(() => {
    if (!paymentIntentId || status !== 'pending' || !isPolling) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [paymentIntentId, status, isPolling, checkStatus]);

  /* ===== Initialize Polling ===== */
  // Responsibility: Start polling when component mounts
  useEffect(() => {
    if (paymentIntentId && status === 'pending') {
      setIsPolling(true);
      checkStatus(); // Initial check
    }
  }, [paymentIntentId]);

  return {
    status,
    isLoading,
    error,
    checkStatus,
    stopPolling
  };
};
