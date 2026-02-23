import { useState } from "react";

import SummaryBox from "@/components/common/summaryBox";
import MovieCard from "@/components/common/movieCard";
import CityCard from "@/components/common/cityCard";
import BookingStatus from "@/components/common/bookingStatus";
import MenuSidebar from "@/components/common/menuSidebar";
import SeatIcon from "@/components/common/seatIcon";
import BookingCard from "@/components/common/bookingCard";
import MenuSegmented from "@/components/common/menuSegmented";
import Segmented from "@/components/common/segmented";

const moviesDataMock = [
    {
        id: "1",
        title: "Django Unchained",
        picture: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT0Y3K-9VNW2z5rUMxiimw6HCzWM7XbBrfihFTm47uFLdHJa75_",
        date: "24/06/2024",
        rating: "4.6",
        genre: ["Action", "Crime"],
        language: ["TH", "EN"],
        remainingTime: "04:55",
        time: "16:30",
        hall: "Hall 1",
        cinema: "Minor Cineplex Arkham",
    },
    {
        id: "2",
        title: "Inception",
        picture: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQovCe0H45fWwAtV31ajOdXRPTxSsMQgPIQ3lcZX_mAW0jXV3kH",
        date: "25/06/2024",
        rating: "4.8",
        genre: ["Sci-Fi", "Thriller"],
        language: ["EN", "TH"],
        remainingTime: "03:20",
        time: "18:45",
        hall: "Hall 3",
        cinema: "Major Cineplex Central",
    },
    {
        id: "3",
        title: "Interstellar",
        picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9oW0XQlu1lo1G_49M-YwGzKR6rUg-CtflZj07HfbT8d2GwKWg",
        date: "26/06/2024",
        rating: "4.9",
        genre: ["Sci-Fi", "Drama"],
        language: ["EN"],
        remainingTime: "02:10",
        time: "20:15",
        hall: "Hall 2",
        cinema: "SF Cinema City",
    },
];

const cityCardMock = [{
    cinema: "Cinema branch name",
    length: "3.4",
    address: "1224 Arkham bridge, Arkham city ",
},
{
    cinema: "Cinema branch name",
    length: null,
    address: "1224 Arkham bridge, Arkham city ",
}]

const bookingCardMock = {
    title: "The Dark Knight",
    picture: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    cinema: "Minor Cineplex Arkham",
    date: "24/06/2024",
    time: "16:30",
    hall: "Hall 1",
    bookingNo: "AK11223",
    bookedDate: "24/06/2024",
    tickets: 2,
    selectedSeat: "C9, C10",
    paymentMethod: "Credit card",
    status: "paid" as const,
}


export default function Component() {
    const [selectedSeat, setSelectedSeat] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(false)
    const [checked2, setChecked2] = useState<boolean>(false)

    return (
        <div className="flex flex-col gap-10 p-10 bg-brand-gray-100">
            {/* first section */}

            {/* ================= Movie Card ================= */}
            <div className="grid grid-cols-2 gap-10">
                <div
                    className="
                    flex flex-col
                    items-center
                    p-[16px] gap-[16px]
                    h-fit
                    bg-brand-gray-0
                    border-2 border-dashed border-[#9747ff] rounded-[16px]
                "
                >
                    <h1 className="text-headline-3 text-brand-gray-300 text-center">
                        Moivie Card
                    </h1>

                    <div className="flex flex-row gap-[16px]">
                        <MovieCard movie={moviesDataMock[0]} variant="desktop" />
                        <MovieCard movie={moviesDataMock[0]} variant="mobile" />
                    </div>
                </div>

                {/* ================= Right Column ================= */}
                <div className="flex flex-col gap-10">

                    {/* -------- City Card -------- */}
                    <div
                        className="
                            flex flex-col
                            items-center
                            p-[16px] gap-[16px]
                            h-fit
                            border-2 border-dashed border-[#9747ff] rounded-[16px]
                            bg-brand-gray-0
                        "
                    >
                        <h1 className="text-headline-3 text-brand-gray-300 text-center">
                            City Card
                        </h1>

                        {cityCardMock.map((card, index) => (
                            <CityCard
                                key={index}
                                cinema={card.cinema}
                                length={card.length ?? null}
                                address={card.address}
                            />
                        ))}
                    </div>

                    {/* -------- Status / Sidebar / Seat -------- */}
                    <div className="flex flex-row gap-10">

                        {/* Booking Status */}
                        <div
                            className="
                                flex flex-col
                                p-[16px] gap-[16px]
                                h-fit
                                border-2 border-dashed border-[#9747ff] rounded-[16px]
                                bg-brand-gray-0
                            "
                        >
                            <h1 className="text-headline-3 text-brand-gray-300 text-center">
                                Booking Status
                            </h1>

                            <BookingStatus status="paid" />
                            <BookingStatus status="pay" />
                            <BookingStatus status="completed" />
                            <BookingStatus status="cancelled" />
                        </div>

                        {/* Menu Sidebar */}
                        <div
                            className="
                        flex flex-col
                        p-[16px] gap-[16px]
                        h-fit
                        border-2 border-dashed border-[#9747ff] rounded-[16px]
                    "
                        >
                            <h1 className="text-headline-3 text-brand-gray-300 text-center">
                                Menu Sidebar
                            </h1>

                            <MenuSidebar />
                        </div>

                        {/* Seat Icon */}
                        <div
                            className="
                        flex flex-col
                        items-center
                        p-[16px] gap-[16px]
                        h-fit
                        border-2 border-dashed border-[#9747ff] rounded-[16px]
                    "
                        >
                            <h1 className="text-headline-3 text-brand-gray-300 text-center">
                                Seat Icon
                            </h1>

                            <SeatIcon
                                variant="booked"
                                onClick={() => console.log("Booked seat clicked")}
                            />

                            {!selectedSeat ? (
                                <SeatIcon
                                    variant="available"
                                    onClick={() => setSelectedSeat(true)}
                                />
                            ) : (
                                <SeatIcon
                                    variant="selected"
                                    onClick={() => setSelectedSeat(false)}
                                />
                            )}

                            <SeatIcon
                                variant="reserved"
                                onClick={() => console.log("Reserved seat clicked")}
                            />

                            <SeatIcon variant="friend" />
                        </div>
                    </div>
                </div>
            </div>


            {/* ================= Summary Box ================= */}
            <div
                className="
                flex flex-col
                items-center
                p-[16px] gap-[16px]
                h-fit
                border-2 border-dashed border-[#9747ff] rounded-[16px]
            "
            >
                <h1 className="text-headline-3 text-brand-gray-300 text-center">
                    Summary Box
                </h1>

                <div className="flex flex-row gap-10">
                    {moviesDataMock.map((movie, index) => (
                        <SummaryBox
                            key={index}
                            title={movie.title}
                            picture={movie.picture}
                            date={movie.date}
                            rating={movie.rating}
                            genre={movie.genre}
                            language={movie.language[0]}
                            remainingTime={movie.remainingTime}
                            cinema={movie.cinema}
                            time={movie.time}
                            hall={movie.hall}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-row px-40 gap-10 h-fit">
                {/* ================= Booking Card ================= */}
                <div
                    className="
                flex flex-col
                items-center
                p-[16px] gap-[16px]
                h-fit
                w-fit
                border-2 border-dashed border-[#9747ff] rounded-[16px]
            "
                >
                    <h1 className="text-headline-3 text-brand-gray-300 text-center">
                        Booking Card (Desktop)
                    </h1>

                    <BookingCard {...bookingCardMock} variant="desktop" />

                    <h1 className="text-headline-3 text-brand-gray-300 text-center">
                        Booking Card (Mobile)
                    </h1>

                    <BookingCard {...bookingCardMock} variant="mobile" />
                </div>

                <div className="flex flex-col gap-10 h-fit">
                    {/* ================= Segmented ================= */}
                    <div className="flex flex-col gap-[16px] h-fit">

                        {/* Menu Segmented */}
                        <div
                            className="
                            flex flex-col
                            items-center
                            p-[16px] gap-[16px]
                            h-fit
                            w-fit
                            bg-brand-gray-0
                            border-2 border-dashed border-[#9747ff] rounded-[16px]
                        "
                        >
                            <h1 className="text-headline-3 text-brand-gray-300 text-center">
                                menu-segmented button
                            </h1>

                            <MenuSegmented
                                label="Title"
                                checked={checked}
                                onClick={() => setChecked(!checked)}
                            />
                        </div>

                        {/* Segmented */}
                        <div className="flex flex-row gap-[16px]">
                            <div
                                className="
                                flex flex-col
                                items-center
                                p-[16px] gap-[16px]
                                h-fit
                                w-fit
                                bg-brand-gray-0
                                border-2 border-dashed border-[#9747ff] rounded-[16px]
                            "
                            >
                                <h1 className="text-headline-3 text-brand-gray-300 text-center">
                                    segmented button
                                </h1>

                                <Segmented
                                    options={[
                                        { label: "Browse by City" },
                                        { label: "Nearest Locations First" },
                                    ]}
                                    checked={checked2}
                                    onClick={() => setChecked2(!checked2)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* foy section */}

            {/* champ section */}

        </div>
    );
}