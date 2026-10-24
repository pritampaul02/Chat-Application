import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBarFriend from "../components/friendsComponents/SideBarFriend";

const FriendsLayout = () => {
    const location = useLocation();
    const isRootFriends = location.pathname === "/friends";

    return (
        <section className="flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Friends Sidebar (full width on mobile if on /friends, hidden on mobile if viewing a friend profile) */}
            <div
                className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800/80 shrink-0 h-full overflow-hidden ${
                    isRootFriends ? "block" : "hidden"
                } md:block`}
            >
                <SideBarFriend />
            </div>

            {/* Profile Detail View Area */}
            <div
                className={`flex-1 h-full overflow-hidden ${
                    isRootFriends ? "hidden md:flex" : "flex"
                }`}
            >
                <Outlet />
            </div>
        </section>
    );
};

export default FriendsLayout;
