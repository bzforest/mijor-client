/* ===== Component: QRCodeDisplay ===== */
/* Responsibility: Generate QR code from payment data and display with real-time timer */

import { useState, useEffect } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  qrData: any;
  isLoading?: boolean;
  size?: number;
  className?: string;
  timeRemaining?: number;
  formatTime?: (seconds: number) => string;
}

export default function QRCodeDisplay({ 
  qrData, 
  isLoading = false, 
  size = 256, 
  className = "",
  timeRemaining,
  formatTime
}: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  /* ===== QR Code Generation ===== */
  // Responsibility: Convert payment data to QR code image
  useEffect(() => {
    const generateQRCode = async () => {
      if (!qrData || isLoading) return;

      try {
        console.log('🔵 Generating QR Code with data:', qrData);
        
        const qrString = JSON.stringify(qrData);
        
        const qrDataUrl = await QRCode.toDataURL(qrString, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        
        setQrCodeUrl(qrDataUrl);
        console.log('✅ QR Code generated successfully');
        
      } catch (error) {
        console.error('❌ QR Code generation failed:', error);
        setError("Failed to generate QR code");
      }
    };

    generateQRCode();
  }, [qrData, isLoading, size]);

  /* ===== Loading State ===== */
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-400">กำลังสร้าง QR Code...</p>
      </div>
    );
  }

  /* ===== Error State ===== */
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="text-red-500 text-center mb-4">
          <p>❌ {error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  /* ===== Waiting State ===== */
  if (!qrCodeUrl) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <p className="text-gray-400">รอการสร้าง QR Code...</p>
      </div>
    );
  }

  /* ===== Main Display ===== */
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <img 
          src={qrCodeUrl} 
          alt="Payment QR Code" 
          className="border-4 border-white rounded-lg shadow-lg"
          style={{ width: size, height: size }}
        />
        <div className="absolute inset-0 border-2 border-gray-300 rounded-lg pointer-events-none"></div>
      </div>
      
      {/* ===== Payment Details ===== */}
      {qrData && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            จำนวน: THB {qrData.amount?.toFixed(2) || "0.00"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ร้าน: {qrData.merchant?.name || "Mijor Cinema"}
          </p>
          {timeRemaining !== undefined && formatTime && (
            <p className="text-xs text-yellow-500 mt-1">
              หมดอายุ: {formatTime(timeRemaining)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
