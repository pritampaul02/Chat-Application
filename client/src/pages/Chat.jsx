import React from "react";
import ChatScreen from "../components/ChatScreen";
import Sidebar from "../components/Sidebar";

const Chat = () => {
    return (
        <section className="flex w-full flex-row overflow-hidden">
            <Sidebar />
            <ChatScreen />
        </section>
    );
};

export default Chat;
