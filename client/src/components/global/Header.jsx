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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../store/auth/authActions";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logOutUser()).unwrap();
            navigate("/login"); // redirect to login after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <nav className="h-screen w-14 bg-slate-50 flex flex-col items-center justify-between py-6 pb-8">
            <div className="flex flex-col items-center justify-center gap-6">
                <img
                    src="/icon.png"
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                />
                <ul className="flex flex-col gap-3">
                    <IconLink
                        to="/chat"
                        title="Chat"
                        icon={<MessageSquare />}
                    />
                    <IconLink
                        to="/status"
                        title="Status"
                        icon={<CircleFadingPlus />}
                    />
                    <IconLink to="/search" title="Search" icon={<Search />} />
                    <IconLink
                        to="/friends"
                        title="Friends"
                        icon={<UserPlus />}
                    />
                </ul>
            </div>

            <div className="flex flex-col items-center gap-3">
                <ul>
                    <IconLink
                        to="/settings"
                        title="Settings"
                        icon={<Settings />}
                    />
                </ul>
                <ul>
                    <IconLink to="/profile" title="Profile" icon={<User />} />
                </ul>
                <button
                    title="Logout"
                    className="cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogOut className="text-2xl" />
                </button>
            </div>
        </nav>
    );
};

export default Header;
