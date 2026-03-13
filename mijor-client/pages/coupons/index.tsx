/* ===== Imports ===== */
import { useState, useEffect } from "react";
import Tabs from "@/components/ui/Tab";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import Pagination from "@/components/ui/pagination";
import LoadingPage from "@/components/loading/LoadingPage";
import { formatDate } from "@/utils/dateUtils";
import { fetchCoupons, Coupon } from "@/services/couponApi";
import { useAuth } from "@/contexts/AuthContext";
import router from "next/router";
import { fetchUserCoupons } from "@/services/couponService";
import Alert from "@/components/ui/Alert";

type UserCouponState = {
  coupon_id: string;
  is_used: boolean;
};

const mapUserCoupons = (list: any[]): UserCouponState[] => {
  return list.map((uc) => ({
    coupon_id: uc.coupon_id,
    is_used: uc.is_used,
  }));
};

/* ===== Component State ===== */
export default function CouponPage() {
  const [currentTab, setCurrentTab] = useState("All coupons");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userCoupons, setUserCoupons] = useState<{ coupon_id: string; is_used: boolean }[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  
  const { user } = useAuth();
  const itemsPerPage = 8;

  /* ===== Derived State ===== */
  const filteredCoupons =
    currentTab === "All coupons"
      ? coupons
      : coupons.filter((coupon) => coupon.brand === currentTab);

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoupons = filteredCoupons.slice(startIndex, endIndex);

  /* ===== Tab Configuration ===== */
  const tabItems = [
    { id: "All coupons", label: "All coupons" },
    ...Array.from(new Set(coupons.map((coupon) => coupon.brand))).map(
      (brand) => ({
        id: brand,
        label: brand,
      }),
    ),
  ];

  /* ===== Event Handlers ===== */
  const refreshUserCoupons = async () => {
    if (!user) return;
    
    try {
      const userCoupons = await fetchUserCoupons();
      const userCouponList = mapUserCoupons(userCoupons);
      setUserCoupons(userCouponList);
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to refresh user coupons:", error);
    }
  };

  const handleTabChange = (id: string) => {
    setCurrentTab(id);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Data Fetching ===== */
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setLoading(true);
        const data = await fetchCoupons();
        setCoupons(data);

        if (user) {
          const userCoupons = await fetchUserCoupons();
          const userCouponList = mapUserCoupons(userCoupons);
          setUserCoupons(userCouponList);
        } else {
          setUserCoupons([]);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, [user]);

  /* ===== Alert Timer Effect ===== */
  useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingPage />
      </div>
    );
  }

  return (
    <>
      {/* ===== Category Tabs ===== */}
      <div className="bg-brand-gray-100/30 flex flex-col items-center">
        <div className="w-full bg-brand-gray-0 px-4 py-6 sm:px-6 sm:py-8 md:px-30 md:py-10 shadow-2xl">
          <div className="overflow-x-auto overflow-y-hidden no-scrollbar">
            <Tabs
              tabs={tabItems}
              activeTab={currentTab}
              onChange={handleTabChange}
            />
          </div>
        </div>

        {/* ===== Coupon Cards ===== */}
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 max-w-[1200px] pt-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-primary" />
            </div>
          ) : (
            currentCoupons?.map((coupon: Coupon) => (
              <CardCouponVertical
                key={coupon.id}
                coupon_id={coupon.id.toString()}
                userCoupons={userCoupons}
                onCouponSaved={refreshUserCoupons}
                imageSrc={coupon.image_url}
                title={coupon.title}
                validUntil={formatDate(coupon.valid_until)}
                onClick={() => router.push(`/coupons/${coupon.id}`)}
              />
            ))
          )}
        </div>
        </div>

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center py-4 sm:py-6 md:py-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      
      {/* ===== Success Alert ===== */}
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
    </>
  );
}
