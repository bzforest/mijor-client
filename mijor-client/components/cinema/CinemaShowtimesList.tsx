import MovieShowtimeCard from "@/components/common/showTimeMovie";

interface CinemaShowtimesListProps {
    loading: boolean;
    movies: Array<{
        id: string;
        title: string;
        posterUrl: string;
        tags: string[];
        halls: any[];
    }>;
}

export default function CinemaShowtimesList({ loading, movies }: CinemaShowtimesListProps) {
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
            {movies.slice(0, 4).map((movie) => (
                <MovieShowtimeCard
                    key={movie.id}
                    title={movie.title}
                    posterUrl={movie.posterUrl}
                    tags={movie.tags}
                    halls={movie.halls}
                    onClick={() => { }}
                />
            ))}
        </>
    );
}
