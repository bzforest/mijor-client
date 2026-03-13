import React from "react";

type MinigameFABProps = {
  onClick: () => void;
};

export default function MinigameFAB({ onClick }: MinigameFABProps) {
  return (
    <button
      onClick={onClick}
      className="flex fixed bottom-6 left-5 z-100 items-center justify-center w-14 h-14 text-3xl text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full shadow-[0_4px_15px_rgba(236,72,153,0.5)] transition-transform animate-bounce hover:scale-110"
      aria-label="Play Minigames"
      title="Play Minigames to earn discount coupons!"
    >
      🎮
    </button>
  );
}
