import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans">

            {/* Background Cinematic Glow Elements */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[50vh] bg-gradient-to-b from-blue-900/20 via-slate-900/5 to-transparent blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
            <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Projector Light Beam */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[60vh] bg-gradient-to-b from-amber-200/5 via-amber-300/5 to-transparent opacity-80 pointer-events-none"
                style={{ clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }}
            >
                <div className="w-full h-full bg-gradient-to-t from-transparent to-amber-100/10 animate-pulse duration-700" />
            </div>

            {/* Left Film Strip Effect */}
            <div className="absolute left-2 md:left-8 top-0 bottom-0 w-12 md:w-16 border-x border-slate-800/40 flex flex-col justify-around py-4 opacity-20 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div key={`left-film-${i}`} className="w-4 h-6 md:w-6 md:h-10 border border-slate-700/50 bg-black rounded-sm mx-auto shadow-inner" />
                ))}
            </div>

            {/* Right Film Strip Effect */}
            <div className="absolute right-2 md:right-8 top-0 bottom-0 w-12 md:w-16 border-x border-slate-800/40 flex flex-col justify-around py-4 opacity-20 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div key={`right-film-${i}`} className="w-4 h-6 md:w-6 md:h-10 border border-slate-700/50 bg-black rounded-sm mx-auto shadow-inner" />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full px-6">

                {/* Cinema Movie Reel */}
                <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 mb-12">
                    {/* Subtle Outer Glow */}
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />

                    <svg
                        className="w-full h-full text-amber-500 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                        viewBox="0 0 100 100"
                        fill="none"
                        stroke="currentColor"
                    >
                        {/* Outer Thick Rim */}
                        <circle cx="50" cy="50" r="46" className="text-amber-700/80" stroke="currentColor" strokeWidth="6" />
                        <circle cx="50" cy="50" r="46" className="text-amber-400" strokeDasharray="130 159" strokeLinecap="round" strokeWidth="3" />

                        {/* Inner Ring */}
                        <circle cx="50" cy="50" r="30" className="text-amber-600/50" strokeWidth="3" />
                        <circle cx="50" cy="50" r="30" className="text-amber-400/80" strokeDasharray="8 10" strokeWidth="1" />

                        {/* Inner Hub */}
                        <circle cx="50" cy="50" r="8" className="text-amber-400 bg-amber-500/10" fill="currentColor" strokeWidth="2" />

                        {/* Reel Spokes */}
                        <g className="text-amber-500/70" strokeWidth="4" strokeLinecap="round">
                            <path d="M50 12v10" />
                            <path d="M50 78v10" />
                            <path d="M12 50h10" />
                            <path d="M78 50h10" />
                            <line x1="23.1" y1="23.1" x2="30.2" y2="30.2" />
                            <line x1="76.9" y1="76.9" x2="69.8" y2="69.8" />
                            <line x1="23.1" y1="76.9" x2="30.2" y2="69.8" />
                            <line x1="76.9" y1="23.1" x2="69.8" y2="30.2" />
                        </g>

                        {/* Inner Cutouts (The holes in the film reel) */}
                        <g className="text-amber-500" fill="currentColor" fillOpacity="0.1">
                            <circle cx="50" cy="21" r="6" />
                            <circle cx="50" cy="79" r="6" />
                            <circle cx="21" cy="50" r="6" />
                            <circle cx="79" cy="50" r="6" />
                            <circle cx="29" cy="29" r="6" />
                            <circle cx="71" cy="71" r="6" />
                            <circle cx="29" cy="71" r="6" />
                            <circle cx="71" cy="29" r="6" />
                        </g>
                    </svg>

                    {/* Central Bright Spot */}
                    <div className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_20px_2px_rgba(255,255,255,0.8)] animate-pulse" />
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-4 w-full">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-[0.2em] uppercase drop-shadow-lg">
                        Loading
                    </h1>
                    <p className="text-amber-300/70 text-sm md:text-base font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-3">
                        <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-amber-500/50" />
                        Preparing the theater
                        <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-amber-500/50" />
                    </p>
                </div>

                {/* Ticket Style Progress Indicator */}
                <div className="mt-16 w-full max-w-[300px] relative">

                    {/* Ticket Shape Wrapper */}
                    <div className="relative h-4 w-full bg-slate-900 rounded-sm border border-slate-700/50 p-[2px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]">

                        {/* Progress Track Empty */}
                        <div className="absolute inset-[2px] bg-slate-950 rounded-[1px] overflow-hidden">
                            {/* Indeterminate Animated Filled Bar */}
                            <div className="h-full w-full bg-gradient-to-r from-amber-700/50 via-amber-400 to-amber-700/50 animate-pulse" />
                        </div>
                    </div>

                    {/* Ticket Perforations (Left & Right Cutouts) */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-r border-slate-700/50 z-10" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-l border-slate-700/50 z-10" />
                </div>

            </div>
        </div>
    );
};

export default LoadingPage;
