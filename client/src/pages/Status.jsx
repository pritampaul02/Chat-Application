import React from "react";
import ChatScreen from "../components/ChatScreen";
import Sidebar from "../components/Sidebar-common";

const Status = () => {
    return (
        <section className="flex w-full flex-row overflow-hidden">
            <Sidebar mode="status" />
        </section>
    );
};
export default Status;
