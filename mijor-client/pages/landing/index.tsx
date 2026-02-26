"use client";
import { fetchCoupons, Coupon } from "@/services/couponApi";

import { useState, useEffect } from "react";
import { useCinemas } from '@/hooks/useCinemas';
import router from "next/router";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import { formatDate } from "@/utils/dateUtils";
import Button from "@/components/ui/Button";
import Footer from "@/components/common/footer";
import { useAuth } from "@/context/AuthContext";
import { fetchUserCoupons } from "@/services/couponService";
import Alert from "@/components/ui/Alert";
import SearchSection from "@/components/landing/SearchSection";
import CityCard from "@/components/common/cityCard";
import Segmented from "@/components/common/segmented";


function LandingPage() {
  /* ===== Hooks ===== */
  const { user } = useAuth();

  /* ===== Component State ===== */
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [userCouponIds, setUserCouponIds] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const { cinemas, isNearestFirst, toggleSort, loading, errorAlert } = useCinemas();

  const groupedCinemas = cinemas.reduce((acc, cinema) => {
    const cityName = cinema.cities?.name || "Other";
    if (!acc[cityName]) acc[cityName] = [];
    acc[cityName].push(cinema);
    return acc;
  }, {} as Record<string, typeof cinemas>);

  const sortedCities = Object.keys(groupedCinemas).sort();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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

      <div id="cinemas-section" className="flex flex-col items-center py-8 px-6 bg-brand-gray-0 text-white">
        <div className="flex flex-col gap-8 w-full max-w-[1200px]">

          {/* ส่วนหัวข้อ และ สวิตช์สลับโหมด */}
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-[32px] font-bold text-white">All cinemas</h2>
            <Segmented
              options={[
                { label: "Browse by City" },
                { label: "Nearest Locations First" }
              ]}
              checked={isNearestFirst}
              onClick={toggleSort}
            />
          </div>

          {/* ส่วนแสดงรายชื่อการ์ดโรงหนัง */}
          <div className="flex flex-col gap-8 w-full">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <p className="text-lg text-brand-gray-300">Loading cinemas...</p>
              </div>
            ) : cinemas.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 border border-dashed rounded-xl border-brand-gray-0/50">
                <p className="mb-2 text-xl font-medium text-white">No cinemas found</p>
                <p className="text-sm text-brand-gray-300">Check back later for newly added locations</p>
              </div>
            ) : isNearestFirst ? (
              // แบบเรียงตามความใกล้ (Flat Grid)
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {cinemas.map((cinema: any) => (
                  <CityCard
                    key={cinema.id}               // React ใช้จดจำลำดับรายการ
                    id={cinema.id}
                    cinema={cinema.name}          // ชื่อโรง 
                    length={cinema.length}        // ระยะทาง (ส่งเข้าไปเป็น null ได้ถ้าหา GPS ไม่เจอ)
                    address={cinema.location}     // สถานที่ตั้ง
                  />
                ))}
              </div>
            ) : (
              // แบบจัดกลุ่มตามเมือง (Grouped Grid)
              sortedCities.map(city => (
                <div key={city} className="flex flex-col gap-4">
                  <h3 className="text-body-1-bold text-brand-gray-300">{city}</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {groupedCinemas[city].map((cinema: any) => (
                      <CityCard
                        key={cinema.id}
                        id={cinema.id}
                        cinema={cinema.name}
                        length={cinema.length}
                        address={cinema.location}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
      {/* Error Banner (Fixed Bottom) */}
      {errorAlert && (
        <div className="fixed z-50 left-6 right-6 bottom-6 md:left-auto md:w-auto custom-alert-wrapper">
          <style>{`
                        .custom-alert-wrapper > div {
                            background-color: #982b3d !important;
                            backdrop-filter: none !important;
                            height: auto !important;
                            padding: 1.5rem !important;
                            border-radius: 0.375rem !important;
                            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                            width: 100% !important;
                        }
                        @media (min-width: 768px) {
                            .custom-alert-wrapper > div {
                                width: 520px !important;
                            }
                        }
                        .custom-alert-wrapper > div > div {
                            gap: 0.25rem !important;
                        }
                        .custom-alert-wrapper h3 {
                            font-size: 1.125rem !important; 
                            font-weight: 600 !important;
                            margin-bottom: 0.25rem !important;
                        }
                        .custom-alert-wrapper p {
                            font-size: 1rem !important;
                            opacity: 0.9 !important;
                            line-height: 1.5 !important;
                        }
                        .custom-alert-wrapper button {
                            font-weight: 400 !important;
                            font-size: 1.25rem !important;
                            padding-top: 0.25rem !important;
                        }
                    `}</style>
          <Alert
            type="error"
            title={errorAlert.title}
            message={errorAlert.message}
          />
        </div>
      )}
      <Footer />
    </div>
  );
}