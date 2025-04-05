import React from "react";
import Sidebar from "../components/Sidebar";
import ChatScreen from "../components/ChatScreen";
import RightMenu from "../components/RightMenu";

const Profile = () => {
    return (
        <section className="flex flex-row w-screen overflow-hidden">
            <Sidebar />
            <ChatScreen />
            <RightMenu />
        </section>
    );
};

export default Profile;
