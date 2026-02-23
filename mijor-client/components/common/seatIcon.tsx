import BookedIcon from '@/assets/seatIcon/Booked.png';
import AvailableIcon from '@/assets/seatIcon/Available.png';
import SelectedIcon from '@/assets/seatIcon/Selected.png';
import ReservedIcon from '@/assets/seatIcon/Reserved.png';
import FriendSeatIcon from '@/assets/seatIcon/FriendSeat.png';

type SeatIconProps = {
    variant: 'booked' | 'available' | 'selected' | 'reserved' | 'friend';
    onClick?: () => void;
    onChange?: () => void;
};

const iconMap = {
    booked: BookedIcon,
    available: AvailableIcon,
    selected: SelectedIcon,
    reserved: ReservedIcon,
    friend: FriendSeatIcon,
};

function SeatIcon({ variant, onClick, onChange }: SeatIconProps) {
    const icon = iconMap[variant];

    /* ================= Clickable State ================= */
    const clickable =
        variant === "available" || variant === "selected"
            ? "cursor-pointer"
            : "cursor-not-allowed";

    return (
        <button
            type="button"
            onClick={onClick}
            onChange={onChange}
            className={`
            w-fit
            ${clickable}
        `}
        >
            <img
                src={icon.src}
                alt={`${variant} icon`}
                width={40}
            />
        </button>
    );
}

export default SeatIcon;