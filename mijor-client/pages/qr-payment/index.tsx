/* ===== Page: QR Payment ===== */
/* Responsibility: Generate QR code and track payment status in real-time */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import QRCodeDisplay from "@/components/payment/QRCodeDisplay";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

export default function QRPayment() {
    const router = useRouter();
    const { query, isReady } = router;

    // Extract booking data from query parameters
    const title = query.title as string || "";
    const picture = query.picture as string || "";
    const date = query.date as string || "";
    const time = query.time as string || "";
    const hall = query.hall as string || "";
    const cinema = query.cinema as string || "";
    const finalPrice = query.finalPrice as string || "0";
    const selectedSeats = JSON.parse((query.selectedSeats as string) || "[]");

    // QR Code state management
    const [qrData, setQrData] = useState<any>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes

    // Payment status tracking
    const { status: paymentStatus, isLoading: statusLoading, error: statusError } = usePaymentStatus(paymentIntentId);

    // Generate QR Code
    useEffect(() => {
        if (!isReady) return;

        const generateQR = async () => {
            try {
                setIsLoading(true);
                setError("");
                
                console.log('🔵 Creating QR payment with data:', {
                    amount: parseFloat(finalPrice),
                    bookingId: "QR-" + Date.now(),
                    totalPrice: parseFloat(finalPrice),
                    selectedCouponId: query.selectedCouponId,
                });
                
                // Call server API to create QR payment
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-qr-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: parseFloat(finalPrice),
                        bookingId: "QR-" + Date.now(),
                        totalPrice: parseFloat(finalPrice),
                        selectedCouponId: query.selectedCouponId,
                    }),
                });

                console.log('📡 API Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ API Error Response:', errorText);
                    
                    // If API is not working, create demo QR data
                    console.log('🔄 API not successful, using demo data');
                    const demoQrData = {
                        paymentIntentId: "pi_demo_" + Date.now(),
                        amount: parseFloat(finalPrice),
                        currency: "thb",
                        merchant: {
                            name: "Mijor Cinema",
                            id: "MIJOR-CINEMA-TH"
                        },
                        bookingId: "QR-" + Date.now(),
                        timestamp: new Date().toISOString(),
                        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
                        paymentMethod: "promptpay",
                        billPayment: {
                            ref1: "QR-" + Date.now(),
                            ref2: "DEMO" + Date.now().toString().slice(-8),
                            amount: parseFloat(finalPrice).toFixed(2)
                        }
                    };
                    
                    setQrData(demoQrData);
                    setPaymentIntentId(demoQrData.paymentIntentId);
                    setTimeRemaining(900);
                    setIsLoading(false);
                    return;
                }

                const data = await response.json();
                console.log('📊 API Response data:', data);
                
                if (data.success) {
                    console.log('🔵 QR Payment Created:', data);
                    
                    // Set QR data for new component
                    setQrData(data.qrData);
                    setPaymentIntentId(data.paymentIntentId);
                    
                    // Set expiration time from backend
                    if (data.expiresIn) {
                        setTimeRemaining(data.expiresIn);
                    }
                    
                } else {
                    console.error('❌ Payment creation failed:', data);
                    throw new Error(data.error || data.message || 'Failed to create QR payment');
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error("❌ Failed to generate QR code:", error);
                const errorMessage = error instanceof Error ? error.message : "Failed to generate QR code";
                setError(errorMessage);
                setIsLoading(false);
            }
        };

        generateQR();
    }, [isReady, finalPrice, query.selectedCouponId]);

    /* ===== Timer Component ===== */
    // Responsibility: Display countdown timer with proper formatting
    const TimerDisplay = () => {
        return (
            <span className={`font-mono ${
                paymentStatus === "expired" ? "text-red-500" : 
                paymentStatus === "succeeded" ? "text-green-500" : 
                "text-yellow-500"
            }`}>
                {paymentStatus === "succeeded" ? "Paid!" : formatTime(timeRemaining)} ({timeRemaining}s)
            </span>
        );
    };

    /* ===== Timer Countdown ===== */
    // Responsibility: Manage payment countdown timer
    useEffect(() => {
        if (timeRemaining <= 0 || paymentStatus === 'expired' || paymentStatus === 'succeeded') {
            return;
        }

        console.log('⏰ Starting timer with', timeRemaining, 'seconds remaining');
        
        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                const newValue = prev <= 1 ? 0 : prev - 1;
                console.log('⏰ Timer tick:', prev, '->', newValue);
                return newValue;
            });
        }, 1000);

        return () => {
            console.log('⏰ Clearing timer');
            clearInterval(timer);
        };
    }, []); // Empty dependency - run only once when component mounts

    /* ===== Payment Status Handler ===== */
    // Responsibility: Handle payment status changes and redirects
    useEffect(() => {
        if (paymentStatus === 'succeeded') {
            console.log('✅ Payment successful! Redirecting...');
            setTimeout(() => {
                router.push(`/payment-success?${new URLSearchParams(query as any).toString()}`);
            }, 2000);
        } else if (paymentStatus === 'canceled' || paymentStatus === 'expired' || paymentStatus === 'failed') {
            console.log('❌ Payment not successful:', paymentStatus);
        }
    }, [paymentStatus, query, router]);

    /* ===== Utility Functions ===== */
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleBack = () => {
        router.back();
    };

    if (!isReady) return null;

    return (
        <main className="min-h-screen bg-[#101525]">
            <div className="container mx-auto px-4 py-8">
                {/* ===== Header ===== */}
                <header className="flex items-center justify-between mb-8">
                    <Button
                        variant="secondary"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Back
                    </Button>
                    <div className="flex items-center gap-2 text-white">
                        <Clock size={20} className={
                            paymentStatus === "expired" ? "text-red-500" : 
                            paymentStatus === "succeeded" ? "text-green-500" : 
                            "text-yellow-500"
                        } />
                        <TimerDisplay />
                        {statusLoading && <RefreshCw size={16} className="animate-spin text-blue-500" />}
                    </div>
                </header>

                {/* ===== Main Content ===== */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* ===== QR Code Section ===== */}
                        <section className="bg-brand-gray-100 rounded-xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6 text-center">
                                Scan QR Code to Pay
                            </h2>
                            
                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : paymentStatus === "expired" ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <AlertCircle size={48} className="text-red-500 mb-4" />
                                    <p className="text-red-500 text-center">QR Code expired</p>
                                    <Button
                                        variant="primary"
                                        onClick={() => window.location.reload()}
                                        className="mt-4"
                                    >
                                        Generate New QR Code
                                    </Button>
                                </div>
                            ) : paymentStatus === "succeeded" ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <CheckCircle size={48} className="text-green-500 mb-4" />
                                    <p className="text-green-500 text-center">Payment Successful!</p>
                                    <p className="text-gray-400 text-sm mt-2">Redirecting...</p>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <AlertCircle size={48} className="text-red-500 mb-4" />
                                    <p className="text-red-500 text-center mb-2">QR Code Generation Failed</p>
                                    <p className="text-gray-400 text-sm text-center mb-4 max-w-xs">{error}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="primary"
                                            onClick={() => window.location.reload()}
                                            className="mt-2"
                                        >
                                            Try Again
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={handleBack}
                                            className="mt-2"
                                        >
                                            Go Back
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <QRCodeDisplay 
                                    qrData={qrData}
                                    isLoading={statusLoading}
                                    size={256}
                                    timeRemaining={timeRemaining}
                                    formatTime={formatTime}
                                />
                            )}
                        </section>

                        {/* ===== Booking Details Section ===== */}
                        <section className="bg-brand-gray-100 rounded-xl p-8">
                            <h2 className="text-xl font-bold text-white mb-6">Booking Details</h2>
                            
                            <div className="space-y-4">
                                <div className="text-white">
                                    <p className="text-gray-400 text-sm">Movie</p>
                                    <p className="font-semibold">{title}</p>
                                </div>
                                
                                <div className="text-white">
                                    <p className="text-gray-400 text-sm">Date & Time</p>
                                    <p className="font-semibold">{date} at {time}</p>
                                </div>
                                
                                <div className="text-white">
                                    <p className="text-gray-400 text-sm">Cinema & Hall</p>
                                    <p className="font-semibold">{cinema} - {hall}</p>
                                </div>
                                
                                <div className="text-white">
                                    <p className="text-gray-400 text-sm">Seats</p>
                                    <p className="font-semibold">{selectedSeats.join(", ")}</p>
                                </div>
                                
                                <div className="border-t border-brand-gray-0 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white">Total Amount</span>
                                        <span className="text-white font-bold text-lg">THB {finalPrice}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg">
                                <p className="text-yellow-500 text-sm text-center">
                                    ⚠️ Please complete payment within 15 minutes
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
