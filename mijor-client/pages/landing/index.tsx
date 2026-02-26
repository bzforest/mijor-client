import { fetchCoupons, Coupon } from "@/services/couponApi";
import { useState, useEffect } from "react";
import router from "next/router";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import { formatDate } from "@/utils/dateUtils";
import Button from "@/components/ui/Button";
import Footer from "@/components/common/footer";
import { useAuth } from "@/context/AuthContext";
import { fetchUserCoupons } from "@/services/couponService";
import Alert from "@/components/ui/Alert";

import SearchSection from "@/components/landing/SearchSection";

function LandingPage() {
  /* ===== Hooks ===== */
  const { user } = useAuth();

  /* ===== Component State ===== */
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userCouponIds, setUserCouponIds] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  /* ===== Data Fetching ===== */
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCoupons();
      setCoupons(data);

      if (user) {
        const userCoupons = await fetchUserCoupons();
        const userCouponIds = userCoupons.map((uc: any) => uc.coupon_id);
        setUserCouponIds(userCouponIds);
      } else {
        setUserCouponIds([]);
      }
    };

    loadData();
  }, [user]);

  /* ===== Alert Timer Effect ===== */
  useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert]);

  /* ===== Business Logic ===== */
  // Responsibility: Filter coupons to show only one per brand
  const getUniqueBrandCoupons = (allCoupons: Coupon[], limit: number = 4) => {
    const result: Coupon[] = [];
    const seenBrands = new Set<string>();

    for (const coupon of allCoupons) {
      // Only add if brand hasn't been seen and limit not reached
      if (!seenBrands.has(coupon.brand) && result.length < limit) {
        seenBrands.add(coupon.brand);
        result.push(coupon);
      }
    }

    return result;
  };

  // Responsibility: Refresh user coupons list after saving
  const refreshUserCoupons = async () => {
    if (!user) return;

    try {
      const userCoupons = await fetchUserCoupons();
      const userCouponIds = userCoupons.map((uc: any) => uc.coupon_id);
      setUserCouponIds(userCouponIds);
      setShowAlert(true);
    } catch (error) {
      console.error("Failed to refresh user coupons:", error);
    }
  };

  /* ===== Render ===== */

  return (
      <div>
        <div id="search-section">
                <SearchSection />
        </div>

        <div id="movie-list-section">
        </div>

        <section
          id="coupons-section"
          className="px-4 py-10 md:px-20 flex flex-col gap-5"
        >
          {/* Section Header */}
          <div className="flex justify-between items-center py-5">
            <h2 className="font-bold text-4xl">Special Coupons</h2>
            <Button variant="text" onClick={() => router.push(`/coupons`)}>
              View all
            </Button>
          </div>

          {/* Coupon Grid */}
          <div className="flex flex-wrap justify-center gap-5">
            {getUniqueBrandCoupons(coupons).map((coupon) => (
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
            ))}
          </div>
        </section>

        <div id="cinemas-section">
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

      <Footer />
      </div>
  );
}

export default LandingPage;