import formatMyDate from "@/utils/formatDate";
import BookingStatus from "./bookingStatus";
import { MapPin, CalendarDays, Clock3, Store } from "lucide-react";

export interface BookingCardProps {
    title: string;
    picture: string;
    cinema: string;
    date: string;
    time: string;
    hall: string;
    bookingNo: string;
    bookedDate: string;
    tickets: number;
    selectedSeat: string;
    paymentMethod: string;
    status: "paid" | "completed" | "pay" | "cancelled" | "refunded";
    variant: "desktop" | "mobile";
    onClick?: () => void,
}

function BookingCard({
    title,
    picture,
    cinema,
    date,
    time,
    hall,
    bookingNo,
    bookedDate,
    tickets,
    selectedSeat,
    paymentMethod,
    status,
    variant,
    onClick,
}: BookingCardProps) {

    /* ================= Desktop Variant ================= */
    if (variant === "desktop") {
        return (
            <div
                onClick={onClick}
                className="
                    flex flex-col
                    p-[24px] gap-[24px]
                    w-[691px]
                    bg-brand-gray-0
                    rounded-[8px]
                    cursor-pointer
                "
            >
                {/* ===== Top Section ===== */}
                <div className="flex flex-row gap-[24px]">

                    {/* Poster */}
                    <img
                        src={picture}
                        alt={title}
                        className="
                            object-cover flex-shrink-0
                            w-[96px] h-[140px]
                            rounded-[4px]
                        "
                    />

                    {/* Movie Info */}
                    <div className="flex flex-col justify-center gap-[12px] flex-1">
                        <h1 className="text-headline-4 text-white">
                            {title}
                        </h1>

                        <div className="flex flex-col gap-[4px]">

                            {/* Cinema */}
                            <div className="flex flex-row items-center gap-[8px]">
                                <MapPin
                                    size={16}
                                    strokeWidth={3}
                                    className="text-brand-gray-200 flex-shrink-0"
                                />
                                <span className="text-body-2 text-brand-gray-400">
                                    {cinema}
                                </span>
                            </div>

                            {/* Date */}
                            <div className="flex flex-row items-center gap-[8px]">
                                <CalendarDays
                                    size={16}
                                    strokeWidth={3}
                                    className="text-brand-gray-200 flex-shrink-0"
                                />
                                <span className="text-body-2 text-brand-gray-400">
                                    {formatMyDate(date)}
                                </span>
                            </div>

                            {/* Time */}
                            <div className="flex flex-row items-center gap-[8px]">
                                <Clock3
                                    size={16}
                                    strokeWidth={3}
                                    className="text-brand-gray-200 flex-shrink-0"
                                />
                                <span className="text-body-2 text-brand-gray-400">
                                    {time}
                                </span>
                            </div>

                            {/* Hall */}
                            <div className="flex flex-row items-center gap-[8px]">
                                <Store
                                    size={16}
                                    strokeWidth={3}
                                    className="text-brand-gray-200 flex-shrink-0"
                                />
                                <span className="text-body-2 text-brand-gray-400">
                                    {hall}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Info (Right) */}
                    <div className="flex flex-col items-start gap-[4px]">
                        <div className="flex flex-row items-center gap-[8px]">
                            <span className="text-body-2 text-brand-gray-300">
                                Booking No.
                            </span>
                            <span className="text-body-2-bold text-brand-gray-300">
                                {bookingNo}
                            </span>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <span className="text-body-2 text-brand-gray-300">
                                Booked date
                            </span>
                            <span className="text-body-2-bold text-brand-gray-300">
                                {formatMyDate(bookedDate)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-brand-gray-100" />

                {/* ===== Bottom Section ===== */}
                <div className="flex flex-row items-center justify-between">

                    <div className="flex flex-row gap-[16px]">

                        {/* Ticket Count */}
                        <div
                            className="
                                flex items-center
                                px-[16px] py-[8px]
                                h-[48px]
                                bg-brand-gray-100
                                rounded-[4px]
                            "
                        >
                            <span className="text-body-1-bold text-brand-gray-400">
                                {tickets} Tickets
                            </span>
                        </div>

                        {/* Seat & Payment */}
                        <div className="flex flex-col gap-[4px] flex-1 w-[172px]">

                            <div className="flex flex-row items-center justify-between gap-[16px]">
                                <span className="text-body-2 text-brand-gray-300">
                                    Selected Seat
                                </span>
                                <span className="text-body-2-bold text-brand-gray-400">
                                    {selectedSeat}
                                </span>
                            </div>

                            <div className="flex flex-row items-center justify-between gap-[16px]">
                                <span className="text-body-2 text-brand-gray-300">
                                    Payment method
                                </span>
                                <span className="flex flex-row justify-end text-body-2-bold text-brand-gray-400">
                                    {paymentMethod}
                                </span>
                            </div>
                        </div>
                    </div>

                    <BookingStatus status={status} />
                </div>
            </div>
        );
    }

    /* ================= Mobile Variant ================= */
    return (
        <div
            onClick={onClick}
            className="
                flex flex-col
                p-[24px] gap-[24px]
                w-[343px]
                bg-brand-gray-0
                rounded-[8px]
            "
        >
            {/* Top Section */}
            <div className="flex flex-row gap-[24px]">

                <img
                    src={picture}
                    alt={title}
                    className="
                        object-cover flex-shrink-0
                        w-[96px] h-[140px]
                        rounded-[4px]
                    "
                />

                <div className="flex flex-col justify-center gap-[12px] flex-1">
                    <h1 className="text-headline-4 text-white">
                        {title}
                    </h1>

                    <div className="flex flex-col gap-[4px]">

                        <div className="flex flex-row items-center gap-[8px]">
                            <MapPin size={16} strokeWidth={3} className="text-brand-gray-200 flex-shrink-0" />
                            <span className="text-body-2 text-brand-gray-400">{cinema}</span>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <CalendarDays size={16} strokeWidth={3} className="text-brand-gray-200 flex-shrink-0" />
                            <span className="text-body-2 text-brand-gray-400">
                                {formatMyDate(date)}
                            </span>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <Clock3 size={16} strokeWidth={3} className="text-brand-gray-200 flex-shrink-0" />
                            <span className="text-body-2 text-brand-gray-400">{time}</span>
                        </div>

                        <div className="flex flex-row items-center gap-[8px]">
                            <Store size={16} strokeWidth={3} className="text-brand-gray-200 flex-shrink-0" />
                            <span className="text-body-2 text-brand-gray-400">{hall}</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Booking Info */}
            <div className="flex flex-col gap-[4px]">
                <div className="flex flex-row items-center gap-[8px]">
                    <span className="text-body-2 text-brand-gray-300">Booking No.</span>
                    <span className="text-body-2-bold text-brand-gray-300">{bookingNo}</span>
                </div>
                <div className="flex flex-row items-center gap-[8px]">
                    <span className="text-body-2 text-brand-gray-300">Booked date</span>
                    <span className="text-body-2-bold text-brand-gray-300">
                        {formatMyDate(bookedDate)}
                    </span>
                </div>
            </div>

            <div className="h-[1px] bg-brand-gray-100" />

            {/* Bottom Section */}
            <div className="flex flex-col gap-[16px]">

                <div className="flex flex-row items-center gap-[16px] w-full">

                    <div
                        className="
                            flex items-center flex-shrink-0
                            px-[16px] py-[8px]
                            h-[48px]
                            bg-brand-gray-100
                            rounded-[4px]
                        "
                    >
                        <span className="text-body-1-bold text-brand-gray-400">
                            {tickets} Tickets
                        </span>
                    </div>

                    <div className="flex flex-col gap-[4px] flex-1">

                        <div className="flex flex-row items-center justify-between gap-[16px]">
                            <span className="text-body-2 text-brand-gray-300">
                                Selected Seat
                            </span>
                            <span className="text-body-2-bold text-brand-gray-400">
                                {selectedSeat}
                            </span>
                        </div>

                        <div className="flex flex-row items-center justify-between gap-[16px]">
                            <span className="text-body-2 text-brand-gray-300">
                                Payment method
                            </span>
                            <span className="flex flex-row justify-end text-body-2-bold text-brand-gray-400">
                                {paymentMethod}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-end">
                    <BookingStatus status={status} />
                </div>
            </div>
        </div>
    );
}

export default BookingCard;