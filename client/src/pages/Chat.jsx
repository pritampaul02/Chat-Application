import React from "react";
import ChatScreen from "../components/ChatScreen";
import Sidebar from "../components/Sidebar-common";

const Chat = () => {
    return (
        <section className="flex w-full flex-row overflow-hidden">
            <Sidebar mode="chat" />
            <ChatScreen />
        </section>
    );
};

export default Chat;
