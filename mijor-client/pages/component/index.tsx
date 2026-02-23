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
import DateSelection from "@/components/common/dateSelection";
import ShowTimeSelection from "@/components/common/showTimeSelection";
import Review from "@/components/common/review";
import CardCouponHorizontal from "@/components/common/cardCouponHorizontal";
import CardCouponVertical from "@/components/common/cardCouponVertical";
import Navbar from "@/components/common/navbar";
import CinemaShowTime from "@/components/common/showTimeCinema";
import MovieShowtimeCard from "@/components/common/showTimeMovie";

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

// Mock Data 
const cinemas = [
    {
        id: "c1",
        nameCinema: "Minor Cineplex Arkham",
        halls: [
            {
                id: "h1",
                name: "Hall 1",
                schedules: [
                    { id: "1", time: "11:30" },
                    { id: "2", time: "14:30" },
                    { id: "3", time: "16:30" },
                    { id: "4", time: "20:30" },
                ],
            },
            {
                id: "h2",
                name: "Hall 3",
                schedules: [
                    { id: "5", time: "09:00" },
                    { id: "6", time: "12:00" },
                    { id: "7", time: "15:00" },
                ],
            },
            {
                id: "h3",
                name: "Hall 6",
                schedules: [
                    { id: "8", time: "13:30" },
                    { id: "9", time: "18:00" },
                ],
            },
        ],
    },
    {
        id: "c2",
        nameCinema: "Minor Cineplex Metropolis",
        halls: [
            {
                id: "h4",
                name: "Hall 2",
                schedules: [
                    { id: "10", time: "10:30" },
                    { id: "11", time: "13:30" },
                ],
            },
            {
                id: "h5",
                name: "Hall 4",
                schedules: [
                    { id: "12", time: "11:00" },
                    { id: "13", time: "14:00" },
                    { id: "14", time: "17:00" },
                ],
            },
            {
                id: "h6",
                name: "IMAX Hall",
                schedules: [
                    { id: "15", time: "19:00" },
                    { id: "16", time: "22:00" },
                ],
            },
        ],
    },
    {
        id: "c3",
        nameCinema: "Minor Cineplex Gotham",
        halls: [
            {
                id: "h7",
                name: "Hall 1",
                schedules: [
                    { id: "17", time: "12:45" },
                    { id: "18", time: "15:45" },
                ],
            },
            {
                id: "h8",
                name: "Hall 5",
                schedules: [
                    { id: "19", time: "10:00" },
                    { id: "20", time: "13:00" },
                    { id: "21", time: "16:00" },
                ],
            },
            {
                id: "h9",
                name: "Gold Class",
                schedules: [{ id: "22", time: "20:00" }],
            },
        ],
    },
];

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
            <section className="min-h-screen bg-brand-gray-900 text-white flex flex-col">

                {/* Navbar */}
                <Navbar
                    isLoggedIn={true}
                    userName="Tony Stark"
                    userImage="/stark.jpg"
                />

                <section className=" in-h-screen p-10 flex items-center justify-center">

                    <Review
                        userName="Christopher Nolan"
                        userImage="/batman.jpg"
                        date="24 Jun 2024"
                        rating={5}
                        content="Lorem ipsum dolor sit amet consectetur. Turpis lobortis elementum amet viverra placerat erat."
                    />

                </section>

                <section className="min-h-50 px bg-brand-gray-900 flex  gap-8 flex-wrap p-10">

                    {/* User size */}
                    <CardCouponVertical
                        imageSrc="/Merry.png"
                        title="Merry March Magic - Get 50 THB Off! (Only in March)"
                        validUntil="18 Jun 2025"
                    />
                </section>

                <section className="min-h-50 bg-brand-gray-900 p-10 flex gap-6 flex-wrap">
                    <CardCouponHorizontal
                        couponImage="/Merry.png"
                        title="Merry March Magic - Get 50 THB Off! (Only in March)"
                        validDate="18 Jun 2025"
                    />
                </section>
            </section>

            {/* champ section */}
            <ShowTimeSelection
                schedules={[
                    { id: "1", time: "10:30" },
                    { id: "2", time: "13:00" },
                    { id: "3", time: "15:30" },
                    { id: "4", time: "18:00" },
                    { id: "6", time: "22:00" },
                ]}
                onSelect={(schedule) => console.log("Selected:", schedule)}
            />
            <DateSelection />
            {cinemas.map((cinema) => (
                <CinemaShowTime
                    key={cinema.id}
                    nameCinema={cinema.nameCinema}
                    halls={cinema.halls}
                />
            ))}

            <MovieShowtimeCard
                title="The Dark Knight"
                posterUrl="/path-to-your-poster.jpg"
                tags={["Action", "Crime", "TH"]}
                halls={cinemas[0].halls}
            />
        </div>
    );
}
