import MovieShowtimeCard from "@/components/common/showTimeMovie";
import { useRouter } from "next/router";

interface CinemaShowtimesListProps {
    loading: boolean;
    date?: string;
    movies: Array<{
        id: string;
        title: string;
        posterUrl: string;
        tags: string[];
        halls: any[];
    }>;
}

export default function CinemaShowtimesList({ loading, movies, date }: CinemaShowtimesListProps) {
    const router = useRouter();
    if (loading) {
        return (
            <p className="py-20 text-center text-headline-3 text-brand-gray-300 border-t border-brand-gray-100/10">
                Loading showtimes for this date...
            </p>
        );
    }

    if (movies.length === 0) {
        return (
            <p className="py-20 text-center text-headline-3 text-brand-gray-300 border-t border-brand-gray-100/10">
                No showtimes available for this cinema.
            </p>
        );
    }

    return (
        <>
            {movies.map((movie) => (
                <MovieShowtimeCard
                    key={movie.id}
                    title={movie.title}
                    posterUrl={movie.posterUrl}
                    tags={movie.tags}
                    halls={movie.halls}
                    date={date}
                    onSelectTime={(showtimeId) => router.push(`/booking/${showtimeId}`)}
                    onClickMovieDetail={() => router.push(`/movies/${movie.id}`)}
                />
            ))}
        </>
    );
}
