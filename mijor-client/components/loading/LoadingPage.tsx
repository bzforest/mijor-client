import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans transition-colors duration-500">

            {/* Background Cinematic Glow Elements */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[50vh] bg-gradient-to-b from-blue-200/40 via-slate-200/20 dark:from-blue-900/20 dark:via-slate-900/5 to-transparent blur-[80px] pointer-events-none transition-colors duration-500" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000 transition-colors duration-500" />
            <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none transition-colors duration-500" />

            {/* Projector Light Beam */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[60vh] bg-gradient-to-b from-amber-100/20 via-amber-200/20 dark:from-amber-200/5 dark:via-amber-300/5 to-transparent opacity-80 pointer-events-none transition-colors duration-500"
                style={{ clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }}
            >
                <div className="w-full h-full bg-gradient-to-t from-transparent to-amber-200/30 dark:to-amber-100/10 animate-pulse duration-700 transition-colors duration-500" />
            </div>

            {/* Left Film Strip Effect */}
            <div className="absolute left-2 md:left-8 top-0 bottom-0 w-12 md:w-16 border-x border-slate-300 dark:border-slate-800/40 flex flex-col justify-around py-4 opacity-30 dark:opacity-20 pointer-events-none transition-colors duration-500">
                {[...Array(12)].map((_, i) => (
                    <div key={`left-film-${i}`} className="w-4 h-6 md:w-6 md:h-10 border border-slate-400/50 dark:border-slate-700/50 bg-slate-800 dark:bg-black rounded-sm mx-auto shadow-inner transition-colors duration-500" />
                ))}
            </div>

            {/* Right Film Strip Effect */}
            <div className="absolute right-2 md:right-8 top-0 bottom-0 w-12 md:w-16 border-x border-slate-300 dark:border-slate-800/40 flex flex-col justify-around py-4 opacity-30 dark:opacity-20 pointer-events-none transition-colors duration-500">
                {[...Array(12)].map((_, i) => (
                    <div key={`right-film-${i}`} className="w-4 h-6 md:w-6 md:h-10 border border-slate-400/50 dark:border-slate-700/50 bg-slate-800 dark:bg-black rounded-sm mx-auto shadow-inner transition-colors duration-500" />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full px-6">

                {/* Cinema Movie Reel */}
                <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 mb-12">
                    {/* Subtle Outer Glow */}
                    <div className="absolute inset-0 bg-amber-400/20 dark:bg-amber-500/20 rounded-full blur-3xl animate-pulse transition-colors duration-500" />

                    <svg
                        className="w-full h-full text-amber-600 dark:text-amber-500 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_15px_rgba(217,119,6,0.4)] dark:drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-500"
                        viewBox="0 0 100 100"
                        fill="none"
                        stroke="currentColor"
                    >
                        {/* Outer Thick Rim */}
                        <circle cx="50" cy="50" r="46" className="text-amber-800/80 dark:text-amber-700/80 transition-colors duration-500" stroke="currentColor" strokeWidth="6" />
                        <circle cx="50" cy="50" r="46" className="text-amber-500 dark:text-amber-400 transition-colors duration-500" strokeDasharray="130 159" strokeLinecap="round" strokeWidth="3" />

                        {/* Inner Ring */}
                        <circle cx="50" cy="50" r="30" className="text-amber-700/50 dark:text-amber-600/50 transition-colors duration-500" strokeWidth="3" />
                        <circle cx="50" cy="50" r="30" className="text-amber-500/80 dark:text-amber-400/80 transition-colors duration-500" strokeDasharray="8 10" strokeWidth="1" />

                        {/* Inner Hub */}
                        <circle cx="50" cy="50" r="8" className="text-amber-500 bg-amber-600/10 dark:text-amber-400 dark:bg-amber-500/10 transition-colors duration-500" fill="currentColor" strokeWidth="2" />

                        {/* Reel Spokes */}
                        <g className="text-amber-600/80 dark:text-amber-500/70 transition-colors duration-500" strokeWidth="4" strokeLinecap="round">
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
                        <g className="text-amber-600 dark:text-amber-500 transition-colors duration-500" fill="currentColor" fillOpacity="0.1">
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
                    <div className="absolute w-5 h-5 bg-amber-100 dark:bg-white rounded-full shadow-[0_0_20px_2px_rgba(253,230,138,0.8)] dark:shadow-[0_0_20px_2px_rgba(255,255,255,0.8)] animate-pulse transition-all duration-500" />
                </div>

                {/* Loading Text */}
                <div className="text-center space-y-4 w-full">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-[0.2em] uppercase drop-shadow-sm dark:drop-shadow-lg transition-all duration-500">
                        Loading
                    </h1>
                    <p className="text-amber-700/80 dark:text-amber-300/70 text-sm md:text-base font-medium tracking-[0.15em] uppercase flex items-center justify-center gap-3 transition-colors duration-500">
                        <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-amber-600/50 dark:to-amber-500/50 transition-colors duration-500" />
                        Preparing the theater
                        <span className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-amber-600/50 dark:to-amber-500/50 transition-colors duration-500" />
                    </p>
                </div>

                {/* Ticket Style Progress Indicator */}
                <div className="mt-16 w-full max-w-[300px] relative">

                    {/* Ticket Shape Wrapper */}
                    <div className="relative h-4 w-full bg-slate-200 dark:bg-slate-900 rounded-sm border border-slate-300 dark:border-slate-700/50 p-[2px] shadow-md dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-500">

                        {/* Progress Track Empty */}
                        <div className="absolute inset-[2px] bg-slate-50 dark:bg-slate-950 rounded-[1px] overflow-hidden transition-colors duration-500">
                            {/* Indeterminate Animated Filled Bar */}
                            <div className="h-full w-full bg-gradient-to-r from-amber-400/60 via-amber-500 to-amber-400/60 dark:from-amber-700/50 dark:via-amber-400 dark:to-amber-700/50 animate-pulse transition-colors duration-500" />
                        </div>
                    </div>

                    {/* Ticket Perforations (Left & Right Cutouts) */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full border-r border-slate-300 dark:border-slate-700/50 z-10 transition-colors duration-500" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 dark:bg-slate-950 rounded-full border-l border-slate-300 dark:border-slate-700/50 z-10 transition-colors duration-500" />
                </div>

            </div>
        </div>
    );
};

export default LoadingPage;