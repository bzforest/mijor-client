import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type LeaderboardEntry = {
    profile_id: string;
    name: string;
    avatar_url: string;
    score: number;
};

export default function Leaderboard({ refreshTrigger }: { refreshTrigger?: number }) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
                const res = await axios.get(`${API_URL}/minigames/popcorn/leaderboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setEntries(res.data.leaderboard);
                }
            } catch (e) {
                console.error("Failed to fetch leaderboard", e);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [refreshTrigger]);

    return (
        <div className="bg-brand-gray-900 rounded-lg p-5 border border-white/10 w-full min-h-[500px] md:h-[650px] shadow-lg flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-6 text-center drop-shadow-md tracking-wide">🏆 Top Scorer Board 🏆</h3>

            {loading ? (
                <div className="flex justify-center items-center h-[200px]">
                    <div className="w-10 h-10 border-4 border-brand-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : entries.length === 0 ? (
                <div className="text-center text-gray-400 italic mt-14">No scores yet. Be the first to conquer the board!</div>
            ) : (
                <div className="flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar">
                    {entries.map((entry, index) => (
                        <div key={`${entry.profile_id}-${index}`} className="flex items-center justify-between bg-brand-gray-800 p-3 rounded-lg border border-white/5 shadow-sm hover:bg-brand-gray-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className={`font-black w-8 text-center drop-shadow-sm ${index === 0 ? 'text-yellow-400 text-2xl' :
                                    index === 1 ? 'text-slate-300 text-xl' :
                                        index === 2 ? 'text-amber-600 text-xl' : 'text-gray-500 text-lg'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="w-10 h-10 rounded-full bg-brand-gray-700 overflow-hidden shrink-0 border-2 border-brand-gray-600">
                                    {entry.avatar_url ? (
                                        <img src={entry.avatar_url} alt={entry.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">?</div>
                                    )}
                                </div>
                                <span className="text-white font-medium truncate max-w-[140px]" title={entry.name}>
                                    {entry.name || 'Anonymous'}
                                </span>
                            </div>
                            <div className="font-extrabold text-brand-primary-500 text-lg">
                                {entry.score} <span className="text-xs text-brand-gray-400 font-normal">pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
