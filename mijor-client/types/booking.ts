export type Seat = {
  id: string;
  seat_number: number;
  status: "available" | "selected" | "booked";
  selected_by: string;
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
