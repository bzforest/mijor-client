import BookedIcon from "@/assets/seatIcon/Booked.png";
import AvailableIcon from "@/assets/seatIcon/Available.png";
import SelectedIcon from "@/assets/seatIcon/Selected.png";
import ReservedIcon from "@/assets/seatIcon/Reserved.png";
import FriendSeatIcon from "@/assets/seatIcon/FriendSeat.png";
import { CircleUserRound } from "lucide-react";

type SeatIconProps = {
  variant: "booked" | "available" | "selected" | "reserved" | "friend";
  width?: string;
  onClick?: () => void;
  onChange?: () => void;
  profileImageUrl?: string | null;
  friendName?: string | null;
  isCurrentUser?: boolean;
};

const iconMap = {
  booked: BookedIcon,
  available: AvailableIcon,
  selected: SelectedIcon,
  reserved: ReservedIcon,
  friend: FriendSeatIcon,
};

function SeatIcon({
  variant,
  width = "40px",
  onClick,
  onChange,
  profileImageUrl,
  friendName,
  isCurrentUser,
}: SeatIconProps) {
  const icon = iconMap[variant];

  const clickable =
    variant === "available" || variant === "selected"
      ? "cursor-pointer"
      : "cursor-not-allowed";

  // Current User's Booked Seat
  if (isCurrentUser) {
    return (
      <button
        type="button"
        className="flex items-center justify-center cursor-not-allowed flex-shrink-0 rounded-full bg-[#1A1D2D]"
        style={{ width: width, height: width }}
        title="Your seat"
      >
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="Your profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <CircleUserRound className="w-full h-full text-brand-gray-300" strokeWidth={1} />
        )}
      </button>
    );
  }

  /**
   * FIX: Friend Seat
   * - ถ้ามี profileImageUrl → แสดงแค่ profile image (ไม่มี base icon ซ้อน)
   * - ถ้าไม่มี profileImageUrl → แสดงแค่ FriendSeat.png icon
   */
  if (variant === "friend") {
    return (
      <button
        type="button"
        onClick={onClick}
        onChange={onChange}
        className="flex items-center justify-center cursor-not-allowed flex-shrink-0 rounded-full bg-[#1A1D2D]"
        style={{ width: width, height: width }}
        title={friendName || "Friend's seat"}
      >
        {profileImageUrl ? (
          // มี profile → แสดงแค่รูป profile
          <img
            src={profileImageUrl}
            alt={friendName || "Friend profile"}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          // ไม่มี profile → แสดงแค่ FriendSeat icon
          <img
            src={icon.src}
            alt="friend seat icon"
            className="w-full h-full"
          />
        )}
      </button>
    );
  }

  // Default: booked / available / selected / reserved
  return (
    <button
      type="button"
      onClick={onClick}
      onChange={onChange}
      className={`flex w-fit items-center justify-center flex-shrink-0 overflow-hidden ${variant === "reserved" ? "bg-[#101525] rounded" : ""} ${clickable}`}
      title={friendName ? friendName : undefined}
    >
      <img
        src={icon.src}
        alt={`${variant} icon`}
        style={{ width: width }}
        className="block"
      />
    </button>
  );
}

export default SeatIcon;