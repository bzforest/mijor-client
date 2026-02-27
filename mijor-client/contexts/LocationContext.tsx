"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LocationContextType {
    userLocation: { lat: number; lng: number } | null;
    requestLocation: () => Promise<void>;
    locationError: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const requestLocation = async () => {
        return new Promise<void>((resolve, reject) => {
            if (!("geolocation" in navigator)) {
                setLocationError("Geolocation is not supported by your browser");
                reject(new Error("Geolocation not supported"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocationError(null);
                    resolve();
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Please enable location permissions in your browser settings and try again");
                    reject(error);
                }
            );
        });
    };

    return (
        <LocationContext.Provider value={{ userLocation, requestLocation, locationError }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
};
