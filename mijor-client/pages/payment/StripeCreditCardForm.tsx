export const dynamic = 'force-dynamic';

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Calendar } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Alert from "@/components/ui/Alert";

// ตั้งค่า Style ให้ตัวหนังสือข้างใน Element เหมือนกับ InputField ของคุณ

export default function StripeCreditCardForm({
  setHandleStripePayment,
  onPaymentSuccess,
  clientSecret,
  onFormValidChange,
  selectedCouponId,
  finalPrice,
  isFree = false,
}: any) {

    if (typeof window === 'undefined') {
    return <div>Loading payment form...</div>;
  }
  
  const stripe = useStripe();
  const elements = useElements();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const syncTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("theme-sync", syncTheme);
    return () => window.removeEventListener("theme-sync", syncTheme);
  }, []);

  const STRIPE_STYLE = {
    style: {
      base: {
        fontSize: "16px",
        color: isDark ? "#ffffff" : "#111827",
        fontFamily: "inherit",
        "::placeholder": {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  // สำหรับเก็บสถานะว่าแต่ละช่องกรอกครบหรือยัง (เอาไปทำ Validation)
  const [validation, setValidation] = useState({
    number: false,
    ownerName: false,
    expiry: false,
    cvc: false,
  });

  // เพิ่ม loading state และ error handling
  const [ownerName, setOwnerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    number: "",
    ownerName: "",
    expiry: "",
    cvc: "",
  });
  const [touched, setTouched] = useState({
    number: false,
    ownerName: false,
    expiry: false,
    cvc: false,
  });
  const [alertConfig, setAlertConfig] = useState<{
    type: "error" | "success";
    title: string;
    message: string;
  } | null>(null);

  // Validation functions
  const validateField = (field: string, value: any) => {
    let error = "";
    
    switch (field) {
      case "number":
        if (!value.complete && touched.number) {
          error = "Card number is not valid";
        }
        break;
      case "ownerName":
        if (!value.trim() && touched.ownerName) {
          error = "Card owner name is not valid";
        }
        break;
      case "expiry":
        if (!value.complete && touched.expiry) {
          error = "Expiry date is not valid";
        }
        break;
      case "cvc":
        if (!value.complete && touched.cvc) {
          error = "CVC is not valid";
        }
        break;
    }
    
    return error;
  };

  const handleFieldChange = (field: string, value: any) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === "ownerName") {
      setOwnerName(value);
      setValidation(prev => ({ ...prev, ownerName: value.trim().length > 0 }));
    } else {
      setValidation(prev => ({ ...prev, [field]: value.complete }));
    }
    
    const error = validateField(field, field === "ownerName" ? value : value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  // Notify parent component when form validation changes
  useEffect(() => {
    const isFormValid = validation.number && validation.ownerName && validation.expiry && validation.cvc;
    if (onFormValidChange) {
      onFormValidChange(isFormValid);
    }
  }, [validation]); // ลบ onFormValidChange ออก

  // Memoize onPaymentSuccess to prevent infinite loop
  const memoizedOnPaymentSuccess = useCallback(() => {
    onPaymentSuccess({
      selectedCouponId,
      finalPrice
    });
  }, [selectedCouponId, finalPrice]); // ลบ onPaymentSuccess ออกเพื่อป้องกัน infinite loop

  useEffect(() => {
    if (isFree) {
      // Free booking - skip payment and call success directly
      setHandleStripePayment?.(async () => {
        memoizedOnPaymentSuccess();
      });
      onFormValidChange?.(true);
      return;
    }

    if (stripe && elements && clientSecret) {
      const confirmPayment = async () => {
        setIsProcessing(true);
        setError(null);

        // ดึง card element
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          setError("Card element not found");
          setIsProcessing(false);
          return;
        }

        if (!validation.ownerName) {
          setError("Owner name is required");
          setAlertConfig({
            type: "error",
            title: "Payment Failed",
            message: "Your Card owner name is incomplete",
          });
          setIsProcessing(false);
          return;
        }

        // confirmCardPayment
        console.log("🔵 Confirming payment with clientSecret:", clientSecret);
        console.log("🔵 Card element found:", !!cardElement);
        console.log("🔵 Owner name:", ownerName);
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: ownerName,
              },
            },
          },
        );

        console.log("🔵 Payment result:", { error, paymentIntent });
        console.log("🔵 Payment status:", paymentIntent?.status);

        if (error) {
          console.error("🔴 Payment error:", error);
          setError(error.message || "Payment failed");
          setAlertConfig({
            type: "error",
            title: "Payment Failed",
            message: error.message || "Payment failed",
          });
        } else if (paymentIntent) {
          if (paymentIntent.status === "succeeded") {
            console.log("✅ Payment successful!");
            memoizedOnPaymentSuccess();
          } else if (paymentIntent.status === "requires_payment_method") {
            console.log("⚠️ Payment requires additional authentication");
            setError("Payment requires additional authentication");
            setAlertConfig({
              type: "error",
              title: "Authentication Required",
              message: "Please complete additional authentication steps.",
            });
          } else if (paymentIntent.status === "requires_action") {
            console.log("⚠️ Payment requires action");
            setError("Payment requires additional action");
            setAlertConfig({
              type: "error",
              title: "Action Required",
              message: "Please complete the required action to continue.",
            });
          } else {
            console.log("⚠️ Payment not succeeded:", paymentIntent.status);
            setError(`Payment not completed: ${paymentIntent.status}`);
            setAlertConfig({
              type: "error",
              title: "Payment Incomplete",
              message: `Payment status: ${paymentIntent.status}`,
            });
          }
        }
        setIsProcessing(false);
      };
      setHandleStripePayment(() => confirmPayment);
    }
  }, [stripe, elements, clientSecret, validation.ownerName, ownerName, memoizedOnPaymentSuccess]);

  return (
    <form className="grid grid-cols-2 gap-x-10 gap-y-6">
      {/* Card Number */}
      <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
        <label className="text-body-2 text-brand-gray-300">Card number</label>
        <div className={`h-14 flex items-center px-4 rounded-xl text-white bg-brand-gray-0 border transition-all ${
          fieldErrors.number 
            ? 'border-red-500' 
            : 'border-brand-gray-100/50'
        }`}>
          <CardNumberElement
            className="w-full"
            options={STRIPE_STYLE}
            onChange={(e) => handleFieldChange("number", e)}
          />
        </div>
        {fieldErrors.number && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.number}</p>
        )}
      </div>

      {/* Card Owner */}
      <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
        <label className="text-body-2 text-brand-gray-300">Card owner</label>
        <input
          type="text"
          placeholder="Name"
          value={ownerName}
          onChange={(e) => handleFieldChange("ownerName", e.target.value)}
          className={`h-14 px-4 rounded-xl bg-brand-gray-0 border text-white focus:outline-none transition-all ${
            fieldErrors.ownerName
              ? 'border-red-500'
              : 'border-brand-gray-100/50'
          }`}
        />
        {fieldErrors.ownerName && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.ownerName}</p>
        )}
      </div>

      {/* Expiry Date */}
      <div className="col-span-1 flex flex-col gap-2">
        <label className="text-body-2 text-brand-gray-300">Expiry date</label>
        <div className={`h-14 flex items-center px-4 rounded-xl text-white bg-brand-gray-0 border transition-all ${
          fieldErrors.expiry
            ? 'border-red-500'
            : 'border-brand-gray-100/50'
        }`}>
          <CardExpiryElement
            className="w-full"
            options={STRIPE_STYLE}
            onChange={(e) => handleFieldChange("expiry", e)}
          />
          <Calendar
            size={20}
            // สั่งให้ Element ของ Stripe รับโฟกัสเมื่อคลิกไอคอน
            onClick={() => elements?.getElement(CardExpiryElement)?.focus()}
            className="text-brand-gray-300 cursor-pointer hover:text-white transition-colors"
          />
        </div>
        {fieldErrors.expiry && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.expiry}</p>
        )}
      </div>

      {/* CVC */}
      <div className="col-span-1 flex flex-col gap-2">
        <label className="text-body-2 text-brand-gray-300">CVC</label>
        <div className={`h-14 flex items-center px-4 rounded-xl text-white bg-brand-gray-0 border transition-all ${
          fieldErrors.cvc
            ? 'border-red-500'
            : 'border-brand-gray-100/50'
        }`}>
          <CardCvcElement
            className="w-full"
            options={STRIPE_STYLE}
            onChange={(e) => handleFieldChange("cvc", e)}
          />
        </div>
        {fieldErrors.cvc && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.cvc}</p>
        )}
      </div>
      {alertConfig && (
        <div className="fixed flex items-center justify-center z-50 md:right-10 md:bottom-10 md:w-110">
          <Alert
            type={alertConfig.type as any}
            title={alertConfig.title}
            message={alertConfig.message}
            onClose={() => setAlertConfig(null)}
          />
        </div>
      )}
    </form>
  );
}
