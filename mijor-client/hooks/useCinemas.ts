"use client";

import { useState, useEffect } from "react";
import { useLocation } from "@/contexts/LocationContext";

export function useCinemas() {
    const [cinemas, setCinemas] = useState<any[]>([]);
    const [isNearestFirst, setIsNearestFirst] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorAlert, setErrorAlert] = useState<{ title: string; message: string } | null>(null);

    const { userLocation, requestLocation, locationError } = useLocation();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    useEffect(() => {
        requestLocation().catch(() => {
            // Error is handled via locationError context state
        });
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/cinemas`)
            .then(async (res) => {
                if (!res.ok) throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                setCinemas(data);
                setErrorAlert(null);
            })
            .catch((err) => {
                console.error("Error fetching cinemas:", err);
                setErrorAlert({
                    title: "Error - API or database errors occur",
                    message: "Something went wrong while retrieving nearby cinemas. Please refresh or try again later.",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (locationError) {
            setIsNearestFirst(false);
            setErrorAlert({
                title: "Error - Location access is denied",
                message: "Please enable location permissions in your browser settings and try again",
            });
        }
    }, [locationError]);

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Number((R * c).toFixed(2));
    };

    const MAX_DISTANCE_KM = 1000;

    const cinemasWithDistance = cinemas.map(cinema => {
        const distance = userLocation ? getDistance(userLocation.lat, userLocation.lng, cinema.latitude, cinema.longitude) : null;
        return { ...cinema, length: distance };
    });

    const nearbyCinemas = cinemasWithDistance
        .filter(c => c.length !== null && c.length <= MAX_DISTANCE_KM)
        .sort((a, b) => (a.length as number) - (b.length as number));

    const sortedCinemas = isNearestFirst && userLocation
        ? nearbyCinemas
        : [...cinemasWithDistance].sort((a, b) => {
            const cityA = a.cities?.name || "";
            const cityB = b.cities?.name || "";
            return cityA.localeCompare(cityB);
        });

    useEffect(() => {
        if (isNearestFirst && userLocation) {
            if (nearbyCinemas.length === 0) {
                setErrorAlert({
                    title: "Error - No cinemas are found near the user",
                    message: "We couldn't find any cinemas near your location. Try searching in another area.",
                });
            } else {
                setErrorAlert(prev => prev?.title === "Error - No cinemas are found near the user" ? null : prev);
            }
        }
    }, [isNearestFirst, userLocation, cinemas]);

    const toggleSort = async () => {
        const newValue = !isNearestFirst;
        setIsNearestFirst(newValue);

        if (newValue && !userLocation) {
            try {
                await requestLocation();
            } catch (error) {
                setIsNearestFirst(false);
            }
        } else if (!newValue) {
            setErrorAlert(prev => prev?.title === "Error - No cinemas are found near the user" ? null : prev);
        }
    };



    return {
        cinemas: sortedCinemas,
        isNearestFirst,
        toggleSort,
        loading,
        errorAlert,
        userLocation,
        getDistance,
    };
}
