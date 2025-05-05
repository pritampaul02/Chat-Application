import React from "react";
import { Outlet } from "react-router-dom";
import SideBarFriend from "../components/friendsComponents/SideBarFriend";

const FriendsLayout = () => {
    return (
        <section className="flex w-full h-screen overflow-hidden">
            <SideBarFriend />

            <div className="flex-1 flex justify-center overflow-y-auto">
                <Outlet />
            </div>
        </section>
    );
};

export default FriendsLayout;
