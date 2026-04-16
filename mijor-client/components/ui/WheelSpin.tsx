import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Props = {
    onWin: (reward: string, remainingSpins: number) => void;
};

const segments: { label: string; color: string; value: number | 'free' | 'miss' }[] = [
    { label: "5% OFF", color: "#EC4899", value: 5 },
    { label: "10% OFF", color: "#A855F7", value: 10 },
    { label: "MISS", color: "#64748B", value: 'miss' },
    { label: "15% OFF", color: "#EF4444", value: 15 },
    { label: "FREE SPIN", color: "#10B981", value: 'free' },
    { label: "20% OFF", color: "#3B82F6", value: 20 },
    { label: "MISS", color: "#64748B", value: 'miss' },
    { label: "JACKPOT", color: "#EAB308", value: 50 }
];

function getAuthToken() {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
}

export default function WheelSpin({ onWin }: Props) {

    const [availableSpins, setAvailableSpins] = useState<number | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [resultIndex, setResultIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {

            const token = getAuthToken();
            if (!token) return;

            const res = await axios.get(`${API_URL}/minigames/wheel/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAvailableSpins(res.data.availableSpins);

        } catch (err) {
            console.error(err);
        }
    };

    const spin = async () => {

        if (isSpinning || availableSpins === 0) return;

        setIsSpinning(true);

        try {

            const token = getAuthToken();

            const res = await axios.post(
                `${API_URL}/minigames/wheel/spin`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const discount = res.data.discount;

            const possible = segments
                .map((s, i) => (s.value === discount ? i : null))
                .filter((v) => v !== null) as number[];

            const targetIndex =
                possible[Math.floor(Math.random() * possible.length)];

            setResultIndex(targetIndex);

            const segmentAngle = 360 / segments.length;

            const targetAngle = targetIndex * segmentAngle + segmentAngle / 2;

            const spins = 6;

            const finalRotation =
                rotation +
                spins * 360 +
                (360 - targetAngle) -
                (rotation % 360);

            setRotation(finalRotation);

            setAvailableSpins((prev) => (prev ? prev - 1 : 0));

            setTimeout(() => {

                setIsSpinning(false);

                onWin(res.data.reward, res.data.remainingSpins || 0);

            }, 4200);

        } catch (err) {
            console.error(err);
            setIsSpinning(false);
        }
    };

    if (availableSpins === null) {
        return (
            <div className="text-center py-10 text-gray-400">
                Loading spins...
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6">

            <div className="text-center">
                <p className="text-gray-400">Available Spins</p>
                <p className="text-4xl font-bold text-pink-500">{availableSpins}</p>
                <p className="text-xs text-gray-400">
                    Earn 1 spin for every 500 THB spent
                </p>
            </div>

            <div className="relative w-72 h-72">

                {/* pointer */}

                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-0 h-0
          border-l-[18px] border-r-[18px] border-t-[28px]
          border-l-transparent border-r-transparent border-t-white
          drop-shadow-lg"/>
                </div>

                {/* wheel */}

                <div
                    onClick={spin}
                    className={`w-full h-full rounded-full border-[6px] border-white overflow-hidden
          shadow-[0_0_40px_rgba(236,72,153,0.5)]
          transition-transform duration-[4200ms] cubic-bezier(0.175, 0.885, 0.32, 1.275) ${!isSpinning && availableSpins && availableSpins > 0 ? "cursor-pointer hover:shadow-[0_0_60px_rgba(236,72,153,0.8)]" : ""}`}
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        background: `conic-gradient(${segments.map((seg, i) => {
                            const angle = 360 / segments.length;
                            return `${seg.color} ${i * angle}deg ${(i + 1) * angle}deg`;
                        }).join(', ')})`
                    }}
                >

                    {segments.map((seg, i) => {

                        const angle = 360 / segments.length;

                        return (
                            <div
                                key={i}
                                className="absolute w-full h-full top-0 left-0"
                                style={{
                                    transform: `rotate(${i * angle + angle / 2}deg)`
                                }}
                            >
                                <div
                                    className="absolute flex flex-col justify-center items-center text-center w-16"
                                    style={{
                                        left: '50%',
                                        top: '12%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    <span className="text-white font-extrabold text-sm uppercase leading-tight drop-shadow-md">
                                        {seg.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                </div>

            </div>

            <button
                onClick={spin}
                disabled={isSpinning || availableSpins === 0}
                className={`px-8 py-3 rounded-full font-bold text-lg cursor-pointer
        ${isSpinning || availableSpins === 0
                        ? "bg-gray-300 text-gray-500"
                        : "bg-linear-to-r from-pink-500 to-purple-500 text-white hover:scale-105 active:scale-95"}
        `}
            >
                {isSpinning ? "SPINNING..." : "SPIN THE WHEEL"}
            </button>

        </div>
    );
}