// ===== Types =====
type CityCardProps = {
    cinema: string;
    length?: number | string | null;
    address: string;
};

// ===== Component =====
function CityCard({ cinema, length, address }: CityCardProps) {
    return (
        <article className="flex flex-row items-center w-[590px] p-[16px] gap-[16px] rounded-[4px] border border-brand-gray-100">
            {/* --- Icon Section --- */}
            <div className="flex justify-center items-center bg-brand-gray-100 rounded-full w-[52px] h-[52px]">
                <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C7.58172 2 4 5.58172 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58172 16.4183 2 12 2ZM12 13.5C10.067 13.5 8.5 11.933 8.5 10C8.5 8.067 10.067 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.933 13.933 13.5 12 13.5Z"
                        fill="#4E7BEE"
                    />
                </svg>
            </div>

            {/* --- Details Section --- */}
            <div className="flex flex-col gap-[4px]">
                <h3 className="text-headline-3 text-white">
                    {cinema}
                </h3>

                <div className="flex flex-row gap-[8px]">
                    {/* Display distance separator only when length data exists */}
                    {length && (
                        <>
                            <p className="text-body-2 text-white">
                                {length} km
                            </p>
                            <span className="text-body-2 text-brand-gray-200">
                                |
                            </span>
                        </>
                    )}
                    
                    <p className="text-body-2 text-brand-gray-300">
                        {address}
                    </p>
                </div>
            </div>
        </article>
    );
}

export default CityCard;