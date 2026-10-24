import React from "react";
import IconLink from "../ui/IconLink";
import {
    MessageSquare,
    Search,
    UserPlus,
    Settings,
    User,
    LogOut,
    CircleFadingPlus,
    Sun,
    Moon,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../store/auth/authActions";
import useScreenSize from "../Hooks/useScreenSize";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { width } = useScreenSize();
    const { theme, toggleTheme } = useTheme();
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();

    const pendingRequestsCount = user?.friendRequests?.length || 0;

    const handleLogout = async () => {
        try {
            await dispatch(logOutUser()).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isMobile = width < 768;
    const isChatActiveOnMobile =
        isMobile &&
        location.pathname.startsWith("/chat/") &&
        location.pathname.split("/")[2]?.length > 0;

    return (
        <>
            {/* Desktop & Tablet Vertical Dock */}
            <aside className="hidden md:flex h-screen w-16 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 flex-col items-center justify-between py-5 fixed left-0 z-40 top-0 shadow-xl transition-colors duration-200">
                {/* Brand / Logo */}
                <div className="flex flex-col items-center justify-center gap-7">
                    <div
                        onClick={() => navigate("/chat")}
                        className="cursor-pointer relative group flex items-center justify-center"
                        title="Chat App"
                    >
                        <div className="w-10 h-10 rounded-2xl bg-[#00A1FF]/10 dark:bg-[#00A1FF]/15 border border-[#00A1FF]/30 p-1.5 shadow-lg shadow-[#00A1FF]/20 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                            <img
                                src="/icon.png"
                                alt="Chat Logo"
                                className="w-full h-full object-contain drop-shadow"
                            />
                        </div>
                    </div>

                    {/* Main Nav Items */}
                    <nav className="flex flex-col gap-3">
                        <IconLink
                            to="/chat"
                            title="Chats"
                            icon={<MessageSquare className="w-5 h-5" />}
                        />
                        <IconLink
                            to="/status"
                            title="Status / Stories"
                            icon={<CircleFadingPlus className="w-5 h-5" />}
                        />
                        <IconLink
                            to="/search"
                            title="Search & Explore"
                            icon={<Search className="w-5 h-5" />}
                        />
                        <IconLink
                            to="/friends"
                            title="Friends & Requests"
                            icon={<UserPlus className="w-5 h-5" />}
                            badge={pendingRequestsCount}
                        />
                    </nav>
                </div>

                {/* Bottom Profile & Actions */}
                <div className="flex flex-col items-center gap-3">
                    {/* Theme Toggle Button */}
                    <button
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-[#00A1FF] dark:text-slate-400 dark:hover:text-[#00A1FF] hover:bg-[#00A1FF]/10 transition-colors duration-200 cursor-pointer"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-amber-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-700" />
                        )}
                    </button>

                    <IconLink
                        to="/settings"
                        title="Settings"
                        icon={<Settings className="w-5 h-5" />}
                    />
                    <IconLink
                        to="/profile"
                        title={user?.name || "My Profile"}
                        icon={
                            user?.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-7 h-7 rounded-full object-cover border border-[#00A1FF]/50"
                                />
                            ) : (
                                <User className="w-5 h-5" />
                            )
                        }
                    />
                    <button
                        title="Sign Out"
                        onClick={handleLogout}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors duration-200 cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation Bar */}
            <nav
                className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800/80 flex justify-around items-center h-16 z-40 px-2 shadow-2xl transition-all duration-300 ${
                    isChatActiveOnMobile ? "translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
                }`}
            >
                <IconLink
                    to="/chat"
                    title="Chat"
                    icon={<MessageSquare className="w-5 h-5" />}
                />
                <IconLink
                    to="/status"
                    title="Status"
                    icon={<CircleFadingPlus className="w-5 h-5" />}
                />
                <IconLink
                    to="/search"
                    title="Search"
                    icon={<Search className="w-5 h-5" />}
                />
                <IconLink
                    to="/friends"
                    title="Friends"
                    icon={<UserPlus className="w-5 h-5" />}
                    badge={pendingRequestsCount}
                />
                <button
                    title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 active:scale-95 transition-all"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-amber-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-slate-700" />
                    )}
                </button>
                <IconLink
                    to="/profile"
                    title="Profile"
                    icon={
                        user?.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="w-6 h-6 rounded-full object-cover border border-[#00A1FF]/50"
                            />
                        ) : (
                            <User className="w-5 h-5" />
                        )
                    }
                />
                <button
                    title="Sign Out"
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-500 active:scale-95 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </nav>
        </>
    );
};

export default Header;

