import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideBarFriend from "../components/friendsComponents/SideBarFriend";

const FriendsLayout = () => {
    const location = useLocation();
    const showSearch = location.pathname === "/friends";

    return (
        <section className="flex w-full h-screen overflow-hidden">
            <div
                className={`w-[100%] md:w-[25rem] border-r border-gray-200 shrink-0 overflow-y-auto 
                ${showSearch ? "block" : "hidden"} 
                md:block`}
            >
                <SideBarFriend />
            </div>

            <div className="flex-1 flex justify-center overflow-y-auto">
                <div className="w-full md:w-[60rem] h-full">
                    <Outlet />
                </div>
            </div>
        </section>
    );
};

export default FriendsLayout;
