import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Target = {
    id: number;
    x: number;
    y: number;
    type: 'normal' | 'golden' | 'trap';
    expiresAt: number;
};

export default function PopcornFrenzy({ onGameEnd }: { onGameEnd?: () => void }) {
    const { user } = useAuth();
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover" | "submitting" | "submitted">("idle");
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [targets, setTargets] = useState<Target[]>([]);

    const targetIdCounter = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Main Game Loop for Spawning
    useEffect(() => {
        if (gameState !== "playing") return;

        const loop = setInterval(() => {
            const now = Date.now();
            setTargets(prev => {
                const active = prev.filter(t => t.expiresAt > now);
                // Spawn new targets if too few (maintain at least 3-6 targets on screen)
                if (active.length < 5 && Math.random() < 0.2) {
                    const typeRand = Math.random();
                    let type: 'normal' | 'golden' | 'trap' = 'normal';
                    let duration = 1800; // Normal lasts 1.8s

                    if (typeRand < 0.1) { type = 'golden'; duration = 1000; } // Golden 10% chance, lasts 1s
                    else if (typeRand < 0.3) { type = 'trap'; duration = 2500; } // Trap 20% chance, lasts 2.5s

                    active.push({
                        id: ++targetIdCounter.current,
                        x: 10 + Math.random() * 80, // Safe zone 10% to 90%
                        y: 20 + Math.random() * 70, // Safe zone 20% to 90%
                        type,
                        expiresAt: now + duration
                    });
                }
                return active;
            });
        }, 100);

        return () => clearInterval(loop);
    }, [gameState]);

    // Timer Loop
    useEffect(() => {
        if (gameState !== "playing") return;

        if (timeLeft <= 0) {
            setGameState("gameover");
            setTargets([]);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, gameState]);

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setTimeLeft(30);
        setTargets([]);
        targetIdCounter.current = 0;
    };

    const handleTargetClick = (id: number, type: 'normal' | 'golden' | 'trap') => {
        // Remove target immediately upon click
        setTargets(prev => prev.filter(t => t.id !== id));

        // Update score
        if (type === 'normal') setScore(s => s + 1);
        else if (type === 'golden') setScore(s => s + 5);
        else if (type === 'trap') setScore(s => Math.max(0, s - 2));
    };

    const submitScore = async () => {
        try {
            setGameState("submitting");
            const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
            await axios.post(`${API_URL}/minigames/popcorn/submit`, { score }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGameState("submitted");
            if (onGameEnd) onGameEnd();
        } catch (e) {
            console.error(e);
            alert("Failed to submit score");
            setGameState("gameover");
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-[400px] bg-brand-gray-900 rounded-lg relative overflow-hidden shadow-inner border border-white/5" ref={containerRef}>
            {/* Header / HUD */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none bg-linear-to-b from-black/80 to-transparent">
                <div className="text-white font-bold text-xl drop-shadow-md">Time: <span className={timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-brand-primary"}>{timeLeft}s</span></div>
                <div className="text-white font-bold text-xl drop-shadow-md">Score: <span className="text-yellow-400">{score}</span></div>
            </div>

            {/* Play Area */}
            {gameState === "playing" && targets.map(t => (
                <div
                    key={t.id}
                    onMouseDown={() => handleTargetClick(t.id, t.type)}
                    onTouchStart={() => handleTargetClick(t.id, t.type)}
                    className="absolute cursor-pointer select-none transition-transform active:scale-75 hover:scale-110 drop-shadow-xl"
                    style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)', fontSize: t.type === 'golden' ? '3.5rem' : '2.8rem' }}
                >
                    {t.type === 'normal' && "🍿"}
                    {t.type === 'golden' && "✨🍿✨"}
                    {t.type === 'trap' && "🥤"}
                </div>
            ))}

            {/* Overlays */}
            {gameState === "idle" && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-sm">
                    <h3 className="text-3xl font-bold text-white mb-2">Popcorn Frenzy! 🍿</h3>
                    <p className="text-gray-300 mb-6 max-w-sm">Tap as many popcorns as you can in <span className="text-white font-bold text-lg">30 seconds</span> to climb the leaderboard!<br /><br />
                        <span className="inline-block text-left">
                            🍿 = <span className="text-green-400 font-bold">+1 point</span><br />
                            ✨🍿✨ = <span className="text-yellow-400 font-bold">+5 points!</span><br />
                            🥤 = <span className="text-red-400 font-bold">-2 points</span>
                        </span>
                    </p>
                    <Button onClick={startGame} className="animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.3)]">Start Game</Button>
                </div>
            )}

            {(gameState === "gameover" || gameState === "submitting" || gameState === "submitted") && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-20 backdrop-blur-md">
                    <h3 className="text-4xl font-bold text-white mb-2">Time's Up! ⏰</h3>
                    <p className="text-gray-300 mb-8 text-xl">Your Score: <span className="text-yellow-400 font-bold text-5xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">{score}</span></p>

                    {gameState === "gameover" && (
                        <div className="flex gap-4">
                            <Button variant="secondary" onClick={startGame}>Play Again</Button>
                            <Button onClick={submitScore} variant="primary">Submit Score</Button>
                        </div>
                    )}

                    {gameState === "submitting" && <div className="text-brand-primary animate-pulse text-lg">Submitting your score...</div>}

                    {gameState === "submitted" && (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-green-400 font-bold text-xl drop-shadow-md">🎉 Score Submitted! 🎉</p>
                            <Button onClick={startGame} variant="secondary">Play Again</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
