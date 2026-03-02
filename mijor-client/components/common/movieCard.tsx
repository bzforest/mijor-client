"use client";
import formatMyDate from "@/utils/formatDate";
import Tag from "../ui/Tag";
import { Star } from 'lucide-react';
import { useRouter } from "next/router";

type MovieCardProps = {
    movie: {
        id: string;
        title: string;
        poster_url: string;
        release_date?: string;
        rating: string;
        genre: string[];
        language: string[];
    };
    variant: "desktop" | "mobile";
};

function MovieCard({ movie, variant }: MovieCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/movies/${movie.id}`);
    };


    return (
        <div
            onClick={handleClick}
            className={`
        flex flex-col gap-[16px] cursor-pointer
        transition-transform duration-200 hover:scale-[1.02]
        ${variant === "desktop" ? "w-[285px]" : "w-[161px]"}
    `}
        >
            <img
                src={movie.poster_url}
                alt={movie.title}
                className={`w-full object-cover rounded-sm ${variant === "desktop" ? "h-[380px]" : "h-[220px]"}`}
            />

            {/* ===== Movie Info ===== */}
            <div className="flex flex-col gap-1">

                <div className="flex flex-row items-center justify-between">

                    <span className="text-body-2 text-brand-gray-300">
                        {formatMyDate(movie.release_date)}
                    </span>

                    <div
                        className="
                        flex flex-row items-center
                        gap-[4px]
                        text-body-2-bold text-brand-gray-300
                    "
                    >
                        <Star
                            size={16}
                            fill="#4E7BEE"
                            stroke="#4E7BEE"
                        />
                        {movie.rating}
                    </div>
                </div>

                <h1 className="text-headline-4 line-clamp-2">
                    {movie.title}
                </h1>
            </div>

            {/* ===== Tags ===== */}
            <div
                className="
                    flex flex-row flex-wrap
                    gap-[8px]
                "
            >
                {movie.genre.map((genre, index) => (
                    <Tag
                        key={index}
                        label={genre}
                        variant="genre"
                    />
                ))}

                <Tag
                    label={movie.language.join("/")}
                    variant="language"
                />
            </div>
        </div>
    )
}

export default MovieCard;