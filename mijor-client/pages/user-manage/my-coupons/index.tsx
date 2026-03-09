/* ===== Imports ===== */
import { useState, useEffect } from "react";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import Pagination from "@/components/ui/pagination";
import MenuSidebar from "@/components/common/menuSidebar";
import { formatDate } from "@/utils/dateUtils";
import { fetchCoupons, Coupon } from "@/services/couponApi";
import { useAuth } from "@/contexts/AuthContext";
import router from "next/router";
import { fetchUserCoupons } from "@/services/couponService";
import Alert from "@/components/ui/Alert";

/* ===== Component ===== */
export default function CouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userCouponIds, setUserCouponIds] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const { user } = useAuth();
  const itemsPerPage = 6;

  const totalPages = Math.ceil(coupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCoupons = coupons.slice(startIndex, startIndex + itemsPerPage);

  /* ===== Refresh User Coupons ===== */
  const refreshUserCoupons = async () => {
    if (!user) return;

    try {
      const userCoupons = await fetchUserCoupons();
      const ids = userCoupons.map((uc: any) => uc.coupon_id);
      setUserCouponIds(ids);
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to refresh user coupons:", error);
    }
  };

  /* ===== Pagination ===== */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Load All Coupons (ไม่ต้องใช้ token) ===== */
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setLoading(true);
        const data = await fetchCoupons();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, []);

  /* ===== Load User Coupons (รอ user พร้อมก่อน) ===== */
  useEffect(() => {
    if (!user) {
      setUserCouponIds([]);
      return;
    }

    const loadUserCoupons = async () => {
      try {
        const userCoupons = await fetchUserCoupons();
        const ids = userCoupons.map((uc: any) => uc.coupon_id);
        setUserCouponIds(ids);
      } catch (error) {
        console.error("Error fetching user coupons:", error);
      }
    };

    loadUserCoupons();
  }, [user]);

  /* ===== Alert Auto Close ===== */
  useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
  

  
      {/* ===== Main Container จำกัดเฉพาะ Desktop ===== */}
      <div className="px-4 md:px-16 py-8 md:py-12">
        <div className="w-full lg:max-w-[1300px] lg:mx-auto lg:flex lg:gap-12 lg:items-start">
  
          {/* ===== Desktop Sidebar เท่านั้น ===== */}
          
            <MenuSidebar />
          
  
          {/* ===== Content ===== */}
          <div className="flex-1">
  
            <h1 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-10">
              My coupons
            </h1>
  
            <div className="grid grid-cols-2 gap-4 md:gap-8  ">
              {loading ? (
                <div className="flex justify-center items-center h-64 col-span-2">
                  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white" />
                </div>
              ) : (
                currentCoupons.map((coupon: Coupon) => (
                  <CardCouponVertical
                    key={coupon.id}
                    coupon_id={coupon.id.toString()}
                    userCoupons={userCouponIds}
                    onCouponSaved={refreshUserCoupons}
                    imageSrc={coupon.image_url}
                    title={coupon.title}
                    validUntil={formatDate(coupon.valid_until)}
                    onClick={() => router.push(`/coupons/${coupon.id}`)}
                  />
                ))
              )}
            </div>
  
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 md:mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
  
      {showAlert && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 w-[90%] max-w-[420px]">
          <Alert
            type="success"
            title="Coupon Claimed!"
            message="You can find it in the 'My Coupons' menu"
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}
    </div>
  );
} 