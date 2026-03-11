import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import WheelSpin from "./WheelSpin";
import PopcornFrenzy from "./PopcornFrenzy";
import Leaderboard from "./Leaderboard";
import { useAuth } from "@/contexts/AuthContext";

type Difficulty = "easy" | "medium" | "hard" | "expert";
type GameTab = "trivia" | "game2" | "game3" | "leaderboard";
type GameState = "loading" | "loginRequired" | "locked" | "selectDifficulty" | "playing" | "won" | "lost";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getAuthToken(): string | null {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
}

export default function CouponMinigameModal({ isOpen, onClose }: Props) {
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<GameTab>("trivia");
    const [gameState, setGameState] = useState<GameState>("loading");

    const [nextPlayDate, setNextPlayDate] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

    const [currentQuestion, setCurrentQuestion] = useState<{ id: string, question: string, options: string[] } | null>(null);
    const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
    const [rewardTitle, setRewardTitle] = useState<string | null>(null);
    const [remainingSpins, setRemainingSpins] = useState<number>(0);

    const [loadingAction, setLoadingAction] = useState(false);
    const [popcornNeedsRefresh, setPopcornNeedsRefresh] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setActiveTab("trivia");
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setRewardTitle(null);
            setSelectedOpt(null);
            setCurrentQuestion(null);
            setSelectedDifficulty(null);
            setRemainingSpins(0);

            if (activeTab === "trivia") {
                checkStatus();
            } else if (activeTab === "game2") {
                setGameState(user ? "playing" : "loginRequired");
            } else {
                setGameState("playing");
            }
        }
    }, [isOpen, user, activeTab]);

    const checkStatus = async () => {
        if (!user) {
            setGameState("loginRequired");
            return;
        }

        setGameState("loading");
        try {
            const token = getAuthToken();
            const res = await axios.get(`${API_URL}/minigames/trivia/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.data.canPlay) {
                setNextPlayDate(res.data.nextPlayDate);
                setGameState("locked");
            } else {
                setGameState("selectDifficulty");
            }
        } catch (err) {
            console.error("Failed to check minigame status", err);
            // Fallback to locking or error UI
            setGameState("selectDifficulty"); // Or handle gracefully
        }
    };

    const handleStart = async (difficulty: Difficulty) => {
        setLoadingAction(true);
        try {
            const token = getAuthToken();
            const res = await axios.get(`${API_URL}/minigames/trivia/questions?difficulty=${difficulty}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const q = res.data;
            // Shuffle options physically
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

            setCurrentQuestion({
                id: q.id,
                question: q.question,
                options: shuffledOptions
            });
            setSelectedDifficulty(difficulty);
            setGameState("playing");
        } catch (err) {
            console.error("Failed to fetch question:", err);
            alert("Oops! Could not start the game. Please try again.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleAnswer = async () => {
        if (!currentQuestion || !selectedOpt || !selectedDifficulty) return;
        setLoadingAction(true);

        try {
            const token = getAuthToken();
            const res = await axios.post(`${API_URL}/minigames/trivia/submit`,
                {
                    questionId: currentQuestion.id,
                    answer: selectedOpt,
                    difficulty: selectedDifficulty
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setRewardTitle(res.data.reward || "a special discount coupon");
                setGameState("won");
            } else {
                setGameState("lost");
            }
        } catch (err: any) {
            console.error("Failed to submit answer:", err);

            if (err.response?.status === 403) {
                // Handled case where user clicked submit but backend saw they already played this month
                alert("Wait, you've already played this month!");
                onClose();
            } else {
                setGameState("lost"); // treating error as lose for safety
            }
        } finally {
            setLoadingAction(false);
        }
    };

    // Determine Modal Title
    let title = "Minigames";
    if (activeTab === "trivia") {
        if (gameState === "loading") title = "Checking Status...";
        else if (gameState === "loginRequired") title = "Members Only";
        else if (gameState === "locked") title = "Come Back Next Month";
        else if (gameState === "won") title = "Congratulations!";
        else if (gameState === "lost") title = "Better luck next time...";
        else if (gameState === "selectDifficulty") title = "Movie Trivia!";
        else title = "Question Time!";
    } else if (activeTab === "game2") {
        if (gameState === "loginRequired") title = "Members Only";
        else if (gameState === "won") {
            if (rewardTitle?.includes("luck")) title = "Ah, too bad!";
            else if (rewardTitle?.includes("Free")) title = "Bonus!";
            else title = "Jackpot!";
        }
        else title = "Wheel Spin!";
    } else if (activeTab === "game3") {
        title = "Popcorn Frenzy";
    } else if (activeTab === "leaderboard") {
        title = "Leaderboard (Popcorn Frenzy)";
    }

    // Determine Button Text & Action
    let primaryActionButton: string | undefined;
    let onPrimaryAction: (() => void) | undefined;

    if (activeTab === "trivia") {
        if (gameState === "playing") {
            primaryActionButton = loadingAction ? "Submitting..." : "Submit Answer";
            onPrimaryAction = loadingAction ? undefined : handleAnswer;
        } else if (gameState === "won") {
            primaryActionButton = "Awesome! Close";
            onPrimaryAction = onClose;
        } else if (gameState === "lost" || gameState === "selectDifficulty" || gameState === "locked" || gameState === "loginRequired") {
            primaryActionButton = "Close";
            onPrimaryAction = onClose;
        }
    } else if (activeTab === "game2") {
        if (gameState === "won") {
            if (remainingSpins > 0) {
                primaryActionButton = `Spin Again! (${remainingSpins} left)`;
                onPrimaryAction = () => {
                    setGameState("playing");
                    setRewardTitle(null);
                };
            } else {
                primaryActionButton = "Awesome! Close";
                onPrimaryAction = onClose;
            }
        } else {
            primaryActionButton = "Close";
            onPrimaryAction = onClose;
        }
    } else {
        primaryActionButton = "Close";
        onPrimaryAction = onClose;
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            primaryActionButton={primaryActionButton}
            onPrimaryAction={onPrimaryAction}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
            {/* --- TAB NAVIGATION --- */}
            <div className="flex justify-center gap-2 mb-6 pb-4 border-b border-brand-gray-200/50">
                <button
                    onClick={() => setActiveTab("trivia")}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${activeTab === "trivia"
                        ? "bg-brand-primary-500 text-white font-medium shadow-md shadow-brand-primary-500/20"
                        : "bg-brand-gray-200 text-brand-gray-400 hover:text-white"
                        }`}
                >
                    Trivia
                </button>
                <button
                    onClick={() => setActiveTab("game2")}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${activeTab === "game2"
                        ? "bg-brand-primary-500 text-white font-medium shadow-md shadow-brand-primary-500/20"
                        : "bg-brand-gray-200 text-brand-gray-400 hover:text-white"
                        }`}
                >
                    Wheel Spin
                </button>
                <button
                    onClick={() => setActiveTab("game3")}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${activeTab === "game3"
                        ? "bg-brand-primary-500 text-white font-medium shadow-md shadow-brand-primary-500/20"
                        : "bg-brand-gray-200 text-brand-gray-400 hover:text-white"
                        }`}
                >
                    Popcorn Frenzy
                </button>
                <button
                    onClick={() => setActiveTab("leaderboard")}
                    className={`px-4 py-2 text-sm rounded-full transition-colors flex items-center gap-2 ${activeTab === "leaderboard"
                        ? "bg-brand-primary-500 text-white font-medium shadow-md shadow-brand-primary-500/20"
                        : "bg-brand-gray-200 text-brand-gray-400 hover:text-white"
                        }`}
                >
                    🏆 Leaderboard
                </button>
            </div>

            {/* --- TAB CONTENT --- */}
            {activeTab === "trivia" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {gameState === "loading" && (
                        <div className="flex flex-col items-center justify-center py-10 gap-4">
                            <div className="w-8 h-8 rounded-full border-4 border-brand-primary-500 border-t-transparent animate-spin"></div>
                            <p className="text-brand-gray-400 animate-pulse">Loading Minigame...</p>
                        </div>
                    )}

                    {gameState === "loginRequired" && (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-300">
                            <div className="text-5xl mb-2">🔒</div>
                            <p className="text-white text-lg font-medium">Please Log In!</p>
                            <p className="text-brand-gray-400">You must be logged in to your account to play the minigames and earn discount rewards.</p>
                        </div>
                    )}

                    {gameState === "locked" && (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-300">
                            <div className="text-5xl mb-2">⏳</div>
                            <p className="text-white text-lg font-medium">You've already played!</p>
                            <p className="text-brand-gray-400">Our trivia game is available once a month.</p>
                            {nextPlayDate && (
                                <p className="mt-2 text-sm bg-brand-gray-200 py-2 px-4 rounded-full text-brand-primary-500">
                                    Try again on {new Date(nextPlayDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {gameState === "selectDifficulty" && (
                        <div className="flex flex-col gap-6 text-center">
                            <p>Select a difficulty level. Harder questions give higher discounts!</p>

                            {loadingAction ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-4">
                                    <div className="w-8 h-8 rounded-full border-4 border-brand-primary-500 border-t-transparent animate-spin"></div>
                                    <p className="text-brand-gray-400 animate-pulse">Fetching your question...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleStart("easy")}
                                        className="flex flex-col items-center gap-1 p-4 rounded-xl border border-green-500/50 hover:bg-green-500/10 transition-colors"
                                    >
                                        <span className="text-xl">🟢</span>
                                        <span className="font-bold text-green-400">Easy</span>
                                        <span className="text-sm text-brand-gray-400">5% Discount</span>
                                    </button>
                                    <button
                                        onClick={() => handleStart("medium")}
                                        className="flex flex-col items-center gap-1 p-4 rounded-xl border border-yellow-500/50 hover:bg-yellow-500/10 transition-colors"
                                    >
                                        <span className="text-xl">🟡</span>
                                        <span className="font-bold text-yellow-400">Medium</span>
                                        <span className="text-sm text-brand-gray-400">10% Discount</span>
                                    </button>
                                    <button
                                        onClick={() => handleStart("hard")}
                                        className="flex flex-col items-center gap-1 p-4 rounded-xl border border-orange-500/50 hover:bg-orange-500/10 transition-colors"
                                    >
                                        <span className="text-xl">🟠</span>
                                        <span className="font-bold text-orange-400">Hard</span>
                                        <span className="text-sm text-brand-gray-400">15% Discount</span>
                                    </button>
                                    <button
                                        onClick={() => handleStart("expert")}
                                        className="flex flex-col items-center gap-1 p-4 rounded-xl border border-red-500/50 hover:bg-red-500/10 transition-colors"
                                    >
                                        <span className="text-xl">🔴</span>
                                        <span className="font-bold text-red-500">Expert</span>
                                        <span className="text-sm text-brand-gray-400">20% Discount</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {gameState === "playing" && currentQuestion && selectedDifficulty && (
                        <div className="flex flex-col gap-6 text-left">
                            <div className="flex justify-between items-center text-xs text-brand-gray-400 uppercase tracking-widest font-semibold border-b border-brand-gray-200 pb-2">
                                <span>{selectedDifficulty} Level</span>
                                <span className="text-brand-primary-500">Active Challenge</span>
                            </div>
                            <p className="font-semibold text-white text-lg">
                                {currentQuestion.question}
                            </p>
                            <div className="flex flex-col gap-3">
                                {currentQuestion.options.map((opt, i) => (
                                    <label
                                        key={i}
                                        className="flex items-center gap-3 cursor-pointer p-3 border border-brand-gray-200 rounded-md hover:bg-brand-gray-200 transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="triviaOption"
                                            className="w-4 h-4 cursor-pointer accent-brand-primary-500"
                                            checked={selectedOpt === opt}
                                            onChange={() => setSelectedOpt(opt)}
                                        />
                                        <span className={selectedOpt === opt ? "text-white" : "text-brand-gray-400"}>{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {gameState === "won" && rewardTitle && (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-brand-primary-500/20 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <p className="text-white text-lg font-bold">You won: {rewardTitle}!</p>
                            <p className="text-brand-gray-400">
                                It has been directly added to your account. You can view it in your <b>My Coupons</b> page!
                            </p>
                        </div>
                    )}

                    {gameState === "lost" && (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                                <span className="text-4xl">🫠</span>
                            </div>
                            <p className="text-white font-medium text-lg">Oops! That wasn't the correct answer.</p>
                            <p className="text-brand-gray-400">Keep brushing up on your movie knowledge and see you next month!</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "game2" && (
                <div className="flex flex-col gap-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {gameState === "loginRequired" && (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-300 py-10">
                            <div className="text-5xl mb-2">🔒</div>
                            <p className="text-white text-lg font-medium">Please Log In!</p>
                            <p className="text-brand-gray-400">You must be logged in to your account to play the minigames and earn discount rewards.</p>
                        </div>
                    )}

                    {gameState !== "loginRequired" && gameState !== "won" && (
                        <WheelSpin
                            onWin={(reward, activeSpins) => {
                                setRewardTitle(reward);
                                setRemainingSpins(activeSpins);
                                setGameState("won");
                            }}
                        />
                    )}

                    {gameState === "won" && rewardTitle && (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-500 py-10">
                            <div className="w-24 h-24 rounded-full bg-brand-primary-500/20 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                                <span className="text-4xl">
                                    {rewardTitle.includes("luck") ? "🫠" : rewardTitle.includes("Free") ? "🔄" : "🎉"}
                                </span>
                            </div>
                            <p className="text-white text-lg font-bold">
                                {rewardTitle.includes("luck") ? rewardTitle : `You won: ${rewardTitle}!`}
                            </p>

                            {!rewardTitle.includes("luck") && !rewardTitle.includes("Free") ? (
                                <p className="text-brand-gray-400">
                                    It has been directly added to your account. You can view it in your <b>My Coupons</b> page!
                                </p>
                            ) : rewardTitle.includes("Free") ? (
                                <p className="text-brand-gray-400">
                                    We've refunded your spin! You can try again right now.
                                </p>
                            ) : (
                                <p className="text-brand-gray-400">
                                    Don't give up! Book another movie to earn more spins.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "game3" && (
                <div className="flex flex-col gap-6 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full">
                    {!user ? (
                        <div className="flex flex-col gap-4 items-center text-center animate-in zoom-in duration-300 py-10 w-full">
                            <div className="text-5xl mb-2">🔒</div>
                            <p className="text-white text-lg font-medium">Please Log In!</p>
                            <p className="text-brand-gray-400">You must be logged in to your account to play Popcorn Frenzy.</p>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="w-full h-full">
                                <PopcornFrenzy onGameEnd={() => {
                                    setPopcornNeedsRefresh(prev => prev + 1);
                                    // Optionally navigate to leaderboard after a few seconds
                                }} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "leaderboard" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 w-full flex justify-center">
                    <div className="w-full">
                        <Leaderboard refreshTrigger={popcornNeedsRefresh} />
                    </div>
                </div>
            )}
        </Modal>
    );
}
