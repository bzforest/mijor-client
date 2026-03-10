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

  /* ================= Clickable State ================= */
  const clickable =
    variant === "available" || variant === "selected"
      ? "cursor-pointer"
      : "cursor-not-allowed";

  /**
   * Current User's Booked Seat
   * If this seat belongs to the current user (e.g. from a shared link they booked),
   * display their avatar or CircleUserRound if they don't have one, instead of the friend seat icon.
   */
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
   * Friend Seat with Profile Image Overlay
   * If the variant is "friend" and a profileImageUrl is provided,
   * show the profile image as a circular overlay on top of the seat icon.
   */
  if (variant === "friend" && profileImageUrl) {
    return (
      <button
        type="button"
        onClick={onClick}
        onChange={onChange}
        className="flex w-fit items-center justify-center cursor-not-allowed flex-shrink-0"
        title={friendName || "Friend's seat"}
      >
        <div style={{ width: width }}>
          {/* Base seat icon */}
          <img
            src={icon.src}
            alt="friend seat icon"
            style={{ width: width }}
            className="block"
          />
          {/* Profile image overlay — circular, centered on the seat */}
          <img
            src={profileImageUrl}
            alt={friendName || "Friend profile"}
            className="w-full h-full object-cover rounded-full -mt-[32px] mx-auto z-10 relative" // Adjusting overlay to actually overlay it properly
            style={{ width: "24px", height: "24px" }}
          />
        </div>
      </button>
    );
  }

  /**
   * Friend Seat without Profile Image — uses FriendSeat.png as-is
   * Also shows a tooltip with the friend's name on hover
   */
  return (
    <button
      type="button"
      onClick={onClick}
      onChange={onChange}
      className={`flex w-fit items-center justify-center flex-shrink-0 ${clickable}`}
      title={variant === "friend" && friendName ? friendName : undefined}
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
