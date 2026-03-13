import { useState, useEffect } from "react";

export function useCinemaDetails(id: string | string[] | undefined, selectedDate: string) {
    const [cinema, setCinema] = useState<any>(null);
    const [movies, setMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return; // Wait until router is ready

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        setLoading(true);
        fetch(`${apiUrl}/api/cinemas/${id}/showtimes?date=${selectedDate}`)
            .then(async (res) => {
                if (!res.ok) throw new Error(`Failed to fetch API: ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                setCinema(data.cinema);
                setMovies(data.movies);
            })
            .catch((err) => {
                console.error("Error fetching showtimes:", err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, selectedDate]);

    return { cinema, movies, loading, error };
}
