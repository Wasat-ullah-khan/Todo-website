import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
    const navigate = useNavigate();

    const handleNavigate = (mode) => {
        navigate('/auth', { state: { initialMode: mode } });
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-['Outfit','Inter',sans-serif]">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-no-repeat transition-all duration-1000"
                style={{
                    backgroundImage: "url('/img1.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Dark overlay with blur to ensure text readability against busy background */}
                <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"></div>
            </div>

            {/* Navigation / Header */}
            <nav className="relative z-20 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-12 py-8 max-w-7xl mx-auto gap-8 sm:gap-0">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10">
                        <span className="text-white font-black text-xl italic mt-0.5">T</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-white italic">
                        Todo<span className="text-indigo-500">.</span>
                    </span>
                </div>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => handleNavigate('login')}
                        className="text-sm font-black text-white hover:text-indigo-300 transition-all uppercase tracking-widest relative group"
                    >
                        Sign In
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
                    </button>
                    <button
                        onClick={() => handleNavigate('signup')}
                        className="px-8 py-3 bg-white text-black font-black rounded-full hover:bg-indigo-50 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] text-xs uppercase tracking-widest"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[75vh] px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white italic">
                        STAY <br className="hidden sm:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-indigo-300 to-white drop-shadow-2xl">
                            AHEAD.
                        </span>
                    </h1>
                    <p className="mt-8 text-sm sm:text-base text-slate-200 font-bold uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed drop-shadow-md">
                        The minimal workspace for <br className="sm:hidden" /> professional focus.
                    </p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => handleNavigate('signup')}
                            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-[0_15px_30px_rgba(79,70,229,0.4)] transition-all transform hover:scale-105 active:scale-95 text-xs uppercase tracking-widest border border-white/10"
                        >
                            Start Organizing
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Landing;
