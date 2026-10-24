import React from "react";
import { UserPlus, Sparkles, Users, MessageSquare } from "lucide-react";

const Friends = () => {
    return (
        <div className="hidden md:flex flex-col items-center justify-center h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 select-none p-8 relative overflow-hidden font-sans transition-colors duration-200">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#00A1FF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-sm w-full text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#00A1FF] via-cyan-400 to-blue-600 p-[2px] shadow-2xl shadow-[#00A1FF]/20 mb-6 animate-pulse">
                    <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[22px] flex items-center justify-center shadow-inner">
                        <Users className="w-8 h-8 text-[#00A1FF]" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Friends & Connections
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                    Select a friend or pending request from the sidebar to view their profile, send direct messages, or start voice and video calls.
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 px-4 py-2 rounded-xl backdrop-blur-md shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#00A1FF]" />
                    <span>Real-time friend notifications enabled</span>
                </div>
            </div>
        </div>
    );
};

export default Friends;
