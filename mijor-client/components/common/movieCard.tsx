import formatMyDate from "@/utils/formatDate";
import Tag from "../ui/Tag";
import { Star } from 'lucide-react';

type MovieCardProps = {
    movie: {
        id: string;
        title: string;
        picture: string;
        date: string;
        rating: string;
        genre: string[];
        language: string[];
    };
    variant: "desktop" | "mobile";
}

function MovieCard({ movie, variant }: MovieCardProps) {
    return (
        <div
            className={`
        flex flex-col
        gap-[16px]
        ${variant === "desktop" ? "w-[285px]" : "w-[161px]"}
    `}
        >
            <img src={movie.picture} alt={movie.title} />

            {/* ===== Movie Info ===== */}
            <div className="flex flex-col">

                <div className="flex flex-row items-center justify-between">

                    <span className="text-body-2 text-brand-gray-300">
                        {formatMyDate(movie.date)}
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

                <h1 className="text-headline-4">
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