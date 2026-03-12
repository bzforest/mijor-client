import React from "react";
import { useRouter } from "next/router";
import { Coupon } from "@/services/couponApi";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import Button from "@/components/ui/Button";
import { formatDate } from "@/utils/dateUtils";

type CouponSectionProps = {
  coupons: Coupon[];
  userCoupons: { coupon_id: string; is_used: boolean }[];
  refreshUserCoupons: () => Promise<void>;
};

export default function CouponSection({
  coupons,
  userCoupons,
  refreshUserCoupons,
}: CouponSectionProps) {
  const router = useRouter();

  const getUniqueBrandCoupons = (allCoupons: Coupon[], limit: number = 4) => {
    const result: Coupon[] = [];
    const seenBrands = new Set<string>();

    for (const coupon of allCoupons) {
      if (!seenBrands.has(coupon.brand) && result.length < limit) {
        seenBrands.add(coupon.brand);
        result.push(coupon);
      }
    }

    return result;
  };

  return (
    <section
      className="
    flex flex-col
    gap-[40px]
    px-1 pb-16
    min-[375px]:px-6
    text-white
    md:px-[120px] md:pb-[80px]
  "
    >
      {/* ===== Section Header ===== */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">
          <h2 className="text-headline-3">
            Special Coupons
          </h2>
        </div>

        <Button
          variant="text"
          onClick={() => router.push("/coupons")}
          className="cursor-pointer"
        >
          View all
        </Button>

      </div>

      {/* ===== Coupon Grid ===== */}
      <div className="grid grid-cols-2 gap-5 md:flex md:flex-wrap md:justify-around">

        {getUniqueBrandCoupons(coupons).map((coupon) => (
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
        ))}

        {/* ===== Layout placeholders (desktop alignment hack) ===== */}
        <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
        <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
        <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
        <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>
        <i className="hidden md:block w-[285px] h-0 m-0 p-0" aria-hidden="true"></i>

      </div>
    </section>
  );
}
