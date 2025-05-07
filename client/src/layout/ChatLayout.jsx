import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import SidebarChat from "../components/sidebar/SidebarChat";
const ChatLayout = () => {
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <section className="flex w-full h-screen overflow-hidden relative">
            {/* Mobile Toggle Button */}

            {/* Sidebar (hidden on small screens) */}
            <SidebarChat
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
            />
            {/* Main Chat Area */}
            <div className="flex-1 h-full w-full">
                <Outlet
                    context={{ toggleSidebar: () => setShowSidebar(true) }}
                />
            </div>
        </section>
    );
};

export default ChatLayout;
