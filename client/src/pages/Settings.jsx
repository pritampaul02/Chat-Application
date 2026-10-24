import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    Bell,
    Volume2,
    Shield,
    Video,
    CheckCheck,
    Smartphone,
    User,
    Check,
    Sun,
    Moon,
    Palette,
} from "lucide-react";
import { notificationService } from "../utils/notification";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
    const user = useSelector((state) => state.auth.user);
    const { theme, toggleTheme, setTheme } = useTheme();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [notificationStatus, setNotificationStatus] = useState(
        typeof Notification !== "undefined" ? Notification.permission : "default"
    );

    const handleEnableNotifications = async () => {
        const perm = await notificationService.requestPermission();
        setNotificationStatus(perm);
    };

    const handleTestSound = () => {
        notificationService.playReceiveSound();
    };

    return (
        <div className="flex-1 h-full overflow-y-auto customScrollbar bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 sm:p-8 font-sans transition-colors duration-200">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage your theme, notifications, audio & calling preferences, and privacy
                    </p>
                </div>

                {/* Appearance & Theme Section */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none backdrop-blur-md space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Palette size={18} className="text-[#00A1FF]" />
                        <span>Appearance & Theme</span>
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Choose how the chat application looks to you. Select between light and dark modes.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                theme === "light"
                                    ? "border-[#00A1FF] bg-[#00A1FF]/10 text-slate-900 shadow-sm shadow-[#00A1FF]/10 ring-2 ring-[#00A1FF]/20"
                                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${theme === "light" ? "bg-[#00A1FF] text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                                <Sun size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Light Mode</span>
                                    {theme === "light" && <Check size={14} className="text-[#00A1FF]" />}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Clean & bright</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                theme === "dark"
                                    ? "border-[#00A1FF] bg-[#00A1FF]/10 text-slate-900 dark:text-white shadow-sm shadow-[#00A1FF]/10 ring-2 ring-[#00A1FF]/20"
                                    : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                        >
                            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-[#00A1FF] text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                                <Moon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>Dark Mode</span>
                                    {theme === "dark" && <Check size={14} className="text-[#00A1FF]" />}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Sleek & high-contrast</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Notifications & Push Section */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none backdrop-blur-md space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Bell size={18} className="text-[#00A1FF]" />
                        <span>Push Notifications</span>
                    </h3>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Browser Push Alerts</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Receive desktop & mobile notifications for incoming messages and calls
                            </p>
                        </div>
                        <button
                            onClick={handleEnableNotifications}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                notificationStatus === "granted"
                                    ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-[#00A1FF] hover:bg-[#008fe6] text-white shadow-md shadow-[#00A1FF]/25 active:scale-95"
                            }`}
                        >
                            {notificationStatus === "granted" ? "Enabled ✓" : "Enable Alerts"}
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sound Effects</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Play subtle audio chimes when messages arrive or calls ring
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleTestSound}
                                className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-[#00A1FF] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-lg cursor-pointer transition-colors"
                            >
                                Test Sound
                            </button>
                            <input
                                type="checkbox"
                                checked={soundEnabled}
                                onChange={(e) => setSoundEnabled(e.target.checked)}
                                className="w-4 h-4 accent-[#00A1FF] rounded cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Chat & Privacy Section */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none backdrop-blur-md space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield size={18} className="text-[#00A1FF]" />
                        <span>Chat & Privacy</span>
                    </h3>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Read Receipts (Blue Ticks)</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Let your friends see when you have read their messages
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCheck size={18} className="text-[#00A1FF]" />
                            <input
                                type="checkbox"
                                checked={readReceipts}
                                onChange={(e) => setReadReceipts(e.target.checked)}
                                className="w-4 h-4 accent-[#00A1FF] rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Status Privacy</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Stories and status updates are visible only to confirmed friends
                            </p>
                        </div>
                        <span className="text-xs text-[#00A1FF] font-semibold bg-[#00A1FF]/10 px-2.5 py-0.5 rounded-full border border-[#00A1FF]/20">
                            My Friends
                        </span>
                    </div>
                </div>

                {/* Voice & Video Calling Settings */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none backdrop-blur-md space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Video size={18} className="text-[#00A1FF]" />
                        <span>Voice & Video Calling</span>
                    </h3>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Zero-Latency P2P</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                WebRTC direct peer connection for ultra-low latency calling
                            </p>
                        </div>
                        <span className="text-xs text-emerald-500 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            Active
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Acoustic Echo Cancellation</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Automatically suppress feedback and background noise during calls
                            </p>
                        </div>
                        <span className="text-xs text-[#00A1FF] font-semibold bg-[#00A1FF]/10 px-2.5 py-0.5 rounded-full border border-[#00A1FF]/20">
                            Auto
                        </span>
                    </div>
                </div>

                {/* Account Summary */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-none backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center">
                            {user?.profilePicture || user?.profile_pic?.url ? (
                                <img
                                    src={user.profilePicture || user.profile_pic.url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                    <span className="text-xs text-[#00A1FF] font-semibold bg-[#00A1FF]/10 px-2.5 py-1 rounded-full border border-[#00A1FF]/20">
                        Active Account
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Settings;
