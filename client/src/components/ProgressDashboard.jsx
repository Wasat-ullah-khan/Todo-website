import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Loader2 } from 'lucide-react';

const ProgressDashboard = ({ todos, status }) => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (status === 'loading') {
        return (
            <div className="glass-card rounded-[2rem] p-8 mb-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-3" />
                <span className="font-bold text-slate-400">Updating metrics...</span>
            </div>
        );
    }

    const stats = [
        { label: 'Total', value: total, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { label: 'Done', value: completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="glass-card rounded-[2.5rem] p-7 lg:p-10 mb-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-white/10 relative overflow-hidden group/dash"
        >
            {/* Animated Background Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover/dash:bg-indigo-600/20 transition-all duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl group-hover/dash:bg-violet-600/20 transition-all duration-700"></div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                {/* Left Side: Stats Section */}
                <div className="flex-1 w-full order-2 sm:order-1">
                    <div className="grid grid-cols-3 gap-3">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group/stat flex flex-col items-center">
                                <div className={`p-3 lg:p-4 rounded-2xl ${stat.bg} mb-3 inline-flex group-hover/stat:scale-110 group-hover/stat:shadow-lg transition-all duration-300 ring-1 ring-white/5`}>
                                    <stat.icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color} filter drop-shadow-[0_0_8px_currentColor]`} />
                                </div>
                                <div className="text-xl lg:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Progress Circle Section */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 p-5 lg:p-6 rounded-[2.5rem] border border-white/10 shadow-xl backdrop-blur-md order-1 sm:order-2 min-w-[160px]">
                    <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                            <defs>
                                <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="50%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#d946ef" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <circle
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-200 dark:text-white/5"
                            />
                            <motion.circle
                                initial={{ strokeDashoffset: 263.9 }}
                                animate={{ strokeDashoffset: 263.9 - (263.9 * percentage) / 100 }}
                                transition={{ duration: 2, ease: "circOut" }}
                                cx="48"
                                cy="48"
                                r="42"
                                stroke="url(#premiumGradient)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                fill="transparent"
                                strokeDasharray={263.9}
                                filter="url(#glow)"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-2xl lg:text-3xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                                {percentage}%
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <h3 className="text-xs font-black italic tracking-widest uppercase opacity-80" style={{ color: 'var(--text-accent)' }}>PROGRESS</h3>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProgressDashboard;
