import { useState } from "react";
import { useRouter } from "next/router";
import DateSelection from "@/components/common/dateSelection";
import CinemaHero from "@/components/cinema/CinemaHero";
import CinemaShowtimesList from "@/components/cinema/CinemaShowtimesList";
import { useCinemaDetails } from "@/hooks/useCinemaDetails";

function CinemaDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toLocaleDateString("en-CA"));

    const { cinema, movies, loading, error } = useCinemaDetails(id, selectedDate);

    if (loading && !cinema) {
        return (
            <div className="bg-brand-gray-0 min-h-screen py-10 px-6 sm:px-12 lg:px-24 flex justify-center items-center">
                <p className="text-white text-headline-3">Loading cinema details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-brand-gray-0 min-h-screen py-10 px-6 sm:px-12 lg:px-24 flex justify-center items-center">
                <p className="text-brand-red text-headline-3">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-gray-100/30 flex flex-col">

            {/* Top section containing Navbar and Hero with Full-Width Blurred Background */}
            <div className="relative w-full flex flex-col overflow-hidden">
                {/* Blurred Background Image Overlay */}
                {cinema?.image_url && (
                    <div
                        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                        style={{
                            backgroundImage: `url(${cinema.image_url})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            filter: 'blur(20px)',
                            transform: 'scale(1.1)'
                        }}
                    />
                )}

                {/* Main Content (Z-10 to stay above blur) */}
                <div className="relative z-10 w-full flex flex-col">

                    <div className="flex justify-center pt-4 pb-6 md:pt-10 md:pb-12 px-0 md:px-6 lg:px-24">
                        <div className="flex flex-col items-center w-full max-w-5xl">
                            {/* --- Hero Section --- */}
                            {cinema && <CinemaHero cinema={cinema} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Date Selection (Full Width Background ALWAYS ON) --- */}
            <div className="flex justify-center w-full bg-brand-gray-0 py-4 shadow-sm z-20">
                <div className="w-full max-w-5xl px-0 md:px-6">
                    <DateSelection value={selectedDate} onChange={setSelectedDate} />
                </div>
            </div>

            {/* --- Movies List --- */}
            <div className="flex justify-center w-full px-6 pt-10 pb-20 md:px-0 z-20">
                <div className="flex flex-col items-center w-full max-w-5xl">
                    <div className="flex flex-col gap-10 w-full">
                        <CinemaShowtimesList loading={loading} movies={movies} date={selectedDate} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default CinemaDetail;