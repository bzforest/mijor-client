/* ===== Imports ===== */
import Footer from "@/components/common/footer";
import Navbar from "@/components/common/navbar";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/dateUtils";
import { useAuth } from "@/contexts/AuthContext";
import { saveCoupon, fetchUserCoupons } from "@/services/couponService";

/* ===== Type Definitions ===== */
type Coupon = {
  id: string;
  title: string;
  brand?: string;
  image_url: string;
  valid_until: string;
  description?: string;
  terms_and_conditions?: string;
  code?: string;
  discount_type?: string;
  discount_value?: string;
  min_purchase?: string;
  is_active?: boolean;
  created_at?: string;
};

/* ===== Constants ===== */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

/* ===== Component Props ===== */
type NotFoundScreenProps = {
  onBack: () => void;
};

/* ===== Main Component ===== */
export default function CouponDetail() {
  /* ===== Hooks ===== */
  const router = useRouter();
  const { id } = router.query;
  const { user , navigateToLogin } = useAuth();

  /* ===== Component State ===== */
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCouponSaved, setIsCouponSaved] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userCoupons, setUserCoupons] = useState<string[]>([]);

  /* ===== Derived State ===== */
  const hasCoupon = userCoupons.includes(coupon?.id || '');

  /* ===== Event Handlers ===== */
  const handleClick = async () => {
    if (!user) {
      setIsOpen(true);
      return;
    }

    try {
      const result = await saveCoupon(coupon?.id || '');

      if (result.success) {
        setIsCouponSaved(true);
        setShowAlert(true);
      } else {
        console.error('Save coupon failed:', result.message);
        // TODO: Implement proper error handling UI
        setIsCouponSaved(true);
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
      // TODO: Implement proper error handling UI
      setIsCouponSaved(true);
      setShowAlert(true);
    }
  };

  /* ===== Effects ===== */
  useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert]);

  /* ===== Data Fetching ===== */
  useEffect(() => {
    if (!router.isReady || !id) return;

    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/coupons/${id}`, {
          signal: controller.signal,
        });

        if (isMounted) {
          setCoupon(response.data.data[0] || response.data.data);

          // Fetch user's coupons if logged in
          if (user) {
            const userCoupons = await fetchUserCoupons();
            const userCouponIds = userCoupons.map((uc: any) => uc.coupon_id);
            setUserCoupons(userCouponIds);
          }
        }
      } catch (err: any) {
        if (err.name !== "CanceledError" && isMounted) {
          console.error("Failed to fetch:", err);
          setError(err.message || "Failed to load coupon");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, router.isReady, user]);

  /* ===== Conditional Renders ===== */
  if (loading) {
    return <LoadingScreen />;
  }

  if (!coupon) {
    return <NotFoundScreen onBack={() => router.push("/")} />;
  }

  /* ===== Data Extraction ===== */
  const couponData = Array.isArray(coupon) ? coupon[0] : coupon;
  const {
    title = "No Title",
    brand = "No Brand",
    image_url = "",
    valid_until = "",
    description = "No description available.",
    terms_and_conditions = "",
  } = couponData;

  /* ===== Main Render ===== */
  return (
    <div className="flex flex-col min-h-screen bg-brand-gray-100/30 text-white">

      <main className="flex-1 mx-auto max-w-6xl md:py-16 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* ===== Coupon Image ===== */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl h-[387px]">
              <img
                src={image_url}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ===== Coupon Content ===== */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-12 p-4 pb-10 md:p-10 bg-brand-gray-0 rounded-lg">
            {/* Header Section */}
            <div>
              <h1 className="mb-4 text-2xl font-bold leading-tight md:text-4xl">
                {title || "Loading Title..."}
              </h1>

              <div className="flex items-center text-gray-400 gap-6">
                <span className="text-body-2 text-brand-gray-400">
                  Valid until
                </span>
                <span className="text-white text-body-1 font-bold leading-6">
                  {formatDate(valid_until)}
                </span>
              </div>
            </div>

            {/* Action Section */}
            <div>
              {!isCouponSaved && !hasCoupon ? (
                <Button
                  onClick={handleClick}
                  variant="primary"
                >
                  Get coupon
                </Button>
              ) : (
                <Button
                  onClick={() => setIsCouponSaved(false)}
                  variant="primary"
                  state="disabled"
                  disabled
                >
                  Coupon Saved
                </Button>
              )}

              {showAlert && (
                <div className="fixed flex items-center justify-center z-50 transform transition-all duration-500 ease-out md:right-10 md:bottom-10 md:w-[440px]">
                  <Alert
                    type="success"
                    title="Coupon Claimed!"
                    message="You can find it in the 'My Coupons' menu"
                    onClose={() => setShowAlert(false)}
                  />
                </div>
              )}
            </div>

            {/* Description Section */}
            <section className="space-y-4 text-body-1 text-brand-gray-400">
              <p className="leading-relaxed whitespace-pre-line">
                {description || "No description available."}
              </p>
            </section>

            {/* Terms Section */}
            {terms_and_conditions && (
              <section className="text-body-1 text-brand-gray-400">
                <h2 className="mb-4 text-lg font-bold text-gray-200">
                  Terms & Conditions
                </h2>
                <div className="space-y-2">
                  {terms_and_conditions
                    .split("\\n")
                    .map((term: string, index: number) => (
                      <span
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-400"
                      >
                        {term}
                      </span>
                    ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* ===== Login Modal ===== */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create an account to continue"
        primaryActionButton="Sign up"
        secondaryActionButton="Log in"
        onPrimaryAction={() => router.push("/register")}
        onSecondaryAction={navigateToLogin}
      >
        Please log in to get this coupon.
      </Modal>

    </div >
  );
}

/* ===== Subcomponents ===== */

function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-brand-gray-0">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
    </div>
  );
}

function NotFoundScreen({ onBack }: NotFoundScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-gray-0 text-white">
      <h1 className="text-xl mb-4">ไม่พบข้อมูลคูปอง</h1>
      <button onClick={onBack} className="text-brand-primary underline">
        กลับหน้าหลัก
      </button>
    </div>
  );
}
