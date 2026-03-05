import formatMyDate from "@/utils/formatDate";
import Tag from "../ui/Tag";
import { MapPin, CalendarDays, Clock3, Store, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import { UserCoupon } from "@/services/couponService";
import { useState } from "react";
import InputField from "../ui/InputField";
import CouponSelectionModal from "./CouponSelectionModal";

type SummaryBoxProps = {
  title: string;
  picture: string;
  date: string;
  genre: string[];
  language: string;
  remainingTime?: string;
  cinema?: string;
  time?: string;
  hall?: string;
  selectedSeats?: string[];
  totalPrice?: number;
  finalPrice?: number;
  userCoupons?: UserCoupon[];
  selectedCouponId?: string;
  onCouponChange?: (id: string) => void;
  onNext?: () => void;
  paymentMethod?: string;
  is_active?: boolean;
  isNextDisabled?: boolean;
};

function SummaryBox({
  title,
  picture,
  date,
  genre,
  language,
  remainingTime,
  cinema,
  time,
  hall,
  selectedSeats = [],
  totalPrice = 0,
  finalPrice = 0,
  userCoupons = [],
  selectedCouponId,
  onCouponChange,
  onNext,
  paymentMethod,
  is_active,
  isNextDisabled = false,
}: SummaryBoxProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedCoupon = userCoupons.find((c) => c.id === selectedCouponId);

  return (
    <div className="md:sticky flex flex-col gap-[24px] rounded-[8px] w-full md:w-[305px] px-[16px] pt-[16px] pb-[24px] h-fit bg-brand-gray-0 border border-brand-gray-100/50">
      {/* Time remaining */}
      {remainingTime && (
        <div className="flex flex-row items-center gap-[8px]">
          <span className="text-body-2 text-brand-gray-300">
            Time remaining:
          </span>
          <span className="text-body-2-bold text-brand-blue-100">
            {remainingTime}
          </span>
        </div>
      )}

      {/* Movie info row */}
      <div className="flex flex-row gap-[16px]">
        <img
          src={picture}
          alt={title}
          className="w-[82px] h-[120px] rounded-[4px] object-cover"
        />

        <div className="flex flex-col gap-[12px] justify-center">
          <h1 className="text-headline-3 text-white leading-tight">{title}</h1>

          <div className="flex flex-row gap-[8px] flex-wrap">
            {genre.map((genre, index) => (
              <Tag key={index} label={genre} variant="genre" />
            ))}
            {language && <Tag label={language} variant="language" />}
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-row items-center gap-[12px]">
          <MapPin size={24} className="text-brand-gray-200" strokeWidth={2} />
          <span className="text-body-2 text-brand-gray-400">{cinema}</span>
        </div>

        <div className="flex flex-row items-center gap-[12px]">
          <CalendarDays
            size={24}
            className="text-brand-gray-200"
            strokeWidth={2}
          />
          <span className="text-body-2 text-brand-gray-400">
            {formatMyDate(date || "")}
          </span>
        </div>

        <div className="flex flex-row items-center gap-[12px]">
          <Clock3 size={24} className="text-brand-gray-200" strokeWidth={2} />
          <span className="text-body-2 text-brand-gray-400">{time}</span>
        </div>

        <div className="flex flex-row items-center gap-[12px]">
          <Store size={24} className="text-brand-gray-200" strokeWidth={2} />
          <span className="text-body-2 text-brand-gray-400">{hall}</span>
        </div>
      </div>

      {/* ================= Coupon Section ================= */}
      {userCoupons.length > 0 && (
        <div className="flex flex-col pt-[16px] gap-4 border-t border-brand-gray-100">
          <div className="flex flex-row justify-between items-center w-full">
            <span className="text-body-2 text-brand-gray-400">Coupon</span>

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-brand-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Select coupon"
            >
              <ChevronRight size={16} />
            </button>

          </div>
          <InputField
            label=""
            placeholder="Choose coupon"
            text={selectedCoupon?.coupons?.title || ""}
            onChange={onCouponChange}
            correct={true}
            onClear={() => onCouponChange?.("")}
          />
        </div>
      )}

      {/* ================= Coupon Selection Modal ================= */}
      <CouponSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userCoupons={userCoupons}
        onCouponChange={onCouponChange}
      />

      {/* Booking info section */}
      {selectedSeats.length > 0 && (
        <div className="flex flex-col pt-[24px] gap-[24px] border-t border-brand-gray-100">
          <div className="flex flex-col gap-[12px]">
            <div className="flex flex-row justify-between items-center w-full">
              <span className="text-body-2 text-brand-gray-400">
                Selected Seat
              </span>
              <span className="text-body-2-bold text-white">
                {selectedSeats.join(", ")}
              </span>
            </div>

            {paymentMethod ? (
              <>
                <div className="flex flex-row justify-between items-center w-full">
                  <span className="text-body-2 text-brand-gray-400">Payment method</span>
                  <span className="text-body-2-bold text-white">
                    {paymentMethod === "CreditCard" ? "Credit card" : "QR Code"}
                  </span>
                </div>

                {finalPrice < totalPrice && (
                  <div className="flex flex-row justify-between items-center w-full">
                    <span className="text-body-2 text-brand-gray-400">Coupon</span>
                    <span className="text-body-2-bold text-brand-red">
                      -THB{totalPrice - finalPrice}
                    </span>
                  </div>
                )}

                <div className="flex flex-row justify-between items-center w-full">
                  <span className="text-body-2 text-brand-gray-400">Total</span>
                  <span className="text-body-2-bold text-white uppercase">
                    THB{finalPrice}
                  </span>
                </div>
              </>
            ) : (
              /* Booking page or fallback: simple total price */
              <div className="flex flex-row justify-between items-center w-full">
                <span className="text-body-2 text-brand-gray-400">Total</span>
                <span className="text-body-2-bold text-white uppercase">
                  THB{totalPrice}
                </span>
              </div>
            )}
          </div>

          <Button onClick={onNext} className="w-full" state={isNextDisabled ? "disabled" : "default"}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default SummaryBox;
