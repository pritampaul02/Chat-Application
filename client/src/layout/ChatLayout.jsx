import React from "react";
import { Outlet } from "react-router-dom";
import SidebarChat from "../components/sidebar/SidebarChat";

const ChatLayout = () => {
    return (
        <section className="flex w-full flex-row overflow-hidden">
            <SidebarChat />
            <div className="flex-1">
                <Outlet />
            </div>
        </section>
    );
};

export default ChatLayout;
