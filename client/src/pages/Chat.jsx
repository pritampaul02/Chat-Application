import React from "react";
import ChatScreen from "../components/ChatScreen";
import Sidebar from "../components/Sidebar";

const Chat = () => {
    return (
        <section className="flex flex-row w-screen overflow-hidden">
            <Sidebar />
            <ChatScreen />
        </section>
    );
};

export default Chat;
