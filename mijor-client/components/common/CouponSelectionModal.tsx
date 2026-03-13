import { useState } from "react";
import Modal from "../ui/Modal";
import CardCouponHorizontal from "./cardCouponHorizontal";
import Pagination from "../ui/pagination";
import { UserCoupon } from "@/services/couponService";

type CouponSelectionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userCoupons: UserCoupon[];
    onCouponChange?: (id: string) => void;
};

const COUPONS_PER_PAGE = 4;

export default function CouponSelectionModal({
    isOpen,
    onClose,
    userCoupons,
    onCouponChange,
}: CouponSelectionModalProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil((userCoupons?.length || 0) / COUPONS_PER_PAGE);
    const paginatedCoupons = (userCoupons || []).slice(
        (currentPage - 1) * COUPONS_PER_PAGE,
        currentPage * COUPONS_PER_PAGE
    );

    const handleSelect = (id: string) => {
        onCouponChange?.(id);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Select coupon"
            className="max-w-[1000px]"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-4">
                {paginatedCoupons.map((userCoupon) => (
                    <div key={userCoupon.id}>
                        <CardCouponHorizontal
                            id={userCoupon.coupons?.id}
                            couponImage={userCoupon.coupons?.image_url || ""}
                            title={userCoupon.coupons?.title || ""}
                            validDate={userCoupon.coupons?.valid_until || ""}
                            onSelect={() => handleSelect(userCoupon.id)}
                        />
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </Modal>
    );
}
