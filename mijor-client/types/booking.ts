export type Seat = {
  id: string;
  seat_number: number;
  status: "available" | "selected" | "booked";
  selected_by: string | null;
  expires_at: string | null;
  booked_by_name: string | null;
  booked_by_avatar: string | null;
};

export type SeatRow = {
  id: string;
  row_letter: string;
  seats: Seat[];
};

export type ShowtimeInfo = {
  id: string;
  title: string;
  posterUrl: string;
  date: string;
  time: string;
  cinema: string;
  hall: string;
  languages: string[];
  genres: string[];
  price: number;
};

export type PaymentParams = {
  selectedCouponId: string;
  finalPrice: number;
  paymentMethod: string;
  cardOwner?: string;
  cardnumber?: string;
  paymentIntentId?: string;
};
