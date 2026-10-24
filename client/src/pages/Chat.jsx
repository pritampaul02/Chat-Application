import React from "react";
import { useSelector } from "react-redux";
import { MessageSquare, ShieldCheck, Sparkles, Video, Zap } from "lucide-react";

const Chat = () => {
    const user = useSelector((state) => state.auth.user);
    const firstName = user?.name ? user.name.split(" ")[0] : "Friend";

    return (
        <div className="hidden md:flex flex-col items-center justify-center h-full w-full chat-canvas-bg text-slate-800 dark:text-slate-100 select-none p-8 relative overflow-hidden font-sans transition-colors duration-200">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00A1FF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center">
                {/* Brand Logo */}
                <div className="w-20 h-20 rounded-3xl bg-[#00A1FF]/10 dark:bg-[#00A1FF]/15 border border-[#00A1FF]/30 p-3.5 shadow-2xl shadow-[#00A1FF]/25 mb-6 flex items-center justify-center transition-transform hover:scale-105">
                    <img
                        src="/icon.png"
                        alt="Chat App Logo"
                        className="w-full h-full object-contain drop-shadow"
                    />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A1FF] to-[#38bdf8]">{firstName}</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-sm">
                    Select a conversation from the sidebar to chat, make zero-latency voice or video calls, and share stories.
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-md backdrop-blur-md flex flex-col items-center text-center">
                        <Zap className="w-5 h-5 text-[#00A1FF] mb-2" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Real-time</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Instant delivery & blue ticks</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-md backdrop-blur-md flex flex-col items-center text-center">
                        <Video className="w-5 h-5 text-[#00A1FF] mb-2" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">HD Calling</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Voice, video & group calls</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-md backdrop-blur-md flex flex-col items-center text-center">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Peer-to-Peer</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Private WebRTC streams</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
