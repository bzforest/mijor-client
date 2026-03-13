import React from "react";
import CityCard from "@/components/common/cityCard";
import Segmented from "@/components/common/segmented";

type CinemaSectionProps = {
  cinemas: any[];
  isNearestFirst: boolean;
  toggleSort: () => void;
  loading: boolean;
};

export default function CinemaSection({
  cinemas,
  isNearestFirst,
  toggleSort,
  loading,
}: CinemaSectionProps) {
  const groupedCinemas = cinemas.reduce((acc, cinema) => {
    const cityName = cinema.cities?.name || "Other";
    if (!acc[cityName]) acc[cityName] = [];
    acc[cityName].push(cinema);
    return acc;
  }, {} as Record<string, typeof cinemas>);

  const sortedCities = Object.keys(groupedCinemas).sort();

  return (
    <div
      className="
    flex flex-col
    gap-[40px]
    px-[16px] pb-[40px]
    w-full
    md:px-[120px] md:pb-[80px]
  "
    >
      {/* ===== Header ===== */}
      <div className="flex flex-col gap-[16px] md:flex-row md:justify-between">
        <h2 className="text-headline-2 whitespace-nowrap">
          All cinemas
        </h2>

        <div className="w-fit">
          <Segmented
            options={[
              { label: "Browse by City" },
              { label: "Nearest Locations First" },
            ]}
            checked={isNearestFirst}
            onClick={toggleSort}
          />
        </div>
      </div>

      {/* ===== Cinema List ===== */}
      <div className="flex flex-col gap-[16px] lg:grid-cols-2">

        {/* ================= Loading State ================= */}
        {loading ? (
          <p>Loading cinemas...</p>

        ) : isNearestFirst ? (

          /* ================= Nearest First ================= */
          <div className="flex flex-col gap-[16px] lg:grid lg:grid-cols-2">
            {cinemas.map((cinema: any) => (
              <CityCard
                key={cinema.id}
                id={cinema.id}
                cinema={cinema.name}
                length={cinema.length}
                address={cinema.location}
              />
            ))}
          </div>

        ) : (

          /* ================= Grouped by City ================= */
          sortedCities.map((city) => (
            <div
              key={city}
              className="flex flex-col gap-[24px]"
            >
              <h3 className="text-headline-3 text-brand-gray-300">
                {city}
              </h3>

              <div className="flex flex-col gap-[16px] lg:grid lg:grid-cols-2">
                {groupedCinemas[city].map((cinema: any) => (
                  <CityCard
                    key={cinema.id}
                    id={cinema.id}
                    cinema={cinema.name}
                    length={cinema.length}
                    address={cinema.location}
                  />
                ))}
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
