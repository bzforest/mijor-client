import Tag from "@/components/ui/Tag";

interface CinemaHeroProps {
    cinema: {
        name: string;
        image_url: string;
        description: string;
        hearing_assistance: boolean;
        wheelchair_access: boolean;
    };
}

export default function CinemaHero({ cinema }: CinemaHeroProps) {
    if (!cinema) return null;

    const defaultImage = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

    return (
        <div className="flex flex-col w-full bg-brand-gray-0/80 border-t border-brand-gray-100 md:border-[#222534] md:border md:flex-row md:shadow-2xl md:overflow-hidden md:rounded-[16px] backdrop-blur-sm">
            {/* Mobile Top Row: Stacked Image & Title (Always bg-brand-gray-0) */}
            <div className="flex flex-col md:hidden w-full">
                <img
                    src={cinema.image_url || defaultImage}
                    alt={cinema.name}
                    className="object-cover w-full h-[220px]"
                />
                <div className="flex flex-col p-6 px-6 gap-3 text-white">
                    <h1 className="font-bold text-headline-3">{cinema.name}</h1>
                    <div className="flex flex-col items-start gap-2">
                        {cinema.hearing_assistance && <Tag label="Hearing assistance" variant="genre" />}
                        {cinema.wheelchair_access && <Tag label="Wheelchair access" variant="genre" />}
                    </div>
                    <div className="mt-2 leading-relaxed text-body-1 text-brand-gray-300">
                        {cinema.description ? (
                            <p>{cinema.description}</p>
                        ) : (
                            <p>Minor Cineplex cinemas often offer features like comfortable seating, concession stands with snacks and drinks, and advanced sound systems.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop Full Image & Title */}
            <img
                src={cinema.image_url || defaultImage}
                alt={cinema.name}
                className="hidden object-cover opacity-90 md:block md:w-[380px]"
            />
            <div className="hidden md:flex flex-col gap-6 justify-center w-full p-10 text-white">
                <h1 className="font-bold text-headline-2">{cinema.name}</h1>
                <div className="flex gap-4">
                    {cinema.hearing_assistance && <Tag label="Hearing assistance" variant="genre" />}
                    {cinema.wheelchair_access && <Tag label="Wheelchair access" variant="genre" />}
                </div>
                <div className="flex flex-col gap-4 mt-2 leading-relaxed text-body-1 text-brand-gray-300">
                    {cinema.description ? (
                        <p>{cinema.description}</p>
                    ) : (
                        <>
                            <p>Minor Cineplex cinemas often offer features like comfortable seating, concession stands with snacks and drinks, and advanced sound systems.</p>
                            <p>Typically show a mix of Hollywood blockbusters, Thai films, and independent or international movies.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
