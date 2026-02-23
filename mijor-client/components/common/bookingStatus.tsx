interface BookingStatusProps {
    status: "paid" | "completed" | "pay" | "cancelled";
}

function BookingStatus({ status }: BookingStatusProps) {
    const style =
        status === "paid"
            ? "bg-brand-green"
            : status === "pay"
                ? "bg-brand-blue-200"
                : status === "completed"
                    ? "border border-brand-gray-100"
                    : status === "cancelled"
                        ? "bg-brand-gray-200"
                        : "";

    const text =
        status === "paid"
            ? "Paid"
            : status === "completed"
                ? "Completed"
                : status === "pay"
                    ? "Pay at Cinema"
                    : status === "cancelled"
                        ? "Canceled"
                        : "";

    return (
        <div
            className={`
                ${style}
                px-[16px] py-[6px]
                w-fit
                rounded-full
            `}
        >
            <h1 className="text-body-2-bold text-white text-center">
                {text}
            </h1>
        </div>
    );
}

export default BookingStatus;