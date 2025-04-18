import React from "react";
// import Sidebar from "../components/Sidebar";
import ChatScreen from "./ChatScreen";
import RightMenu from "../components/RightMenu";

const Profile = () => {
    return (
        <section className="flex flex-row w-full overflow-hidden">
            {/* <Sidebar /> */}
            <ChatScreen />
            <RightMenu />
        </section>
    );
};

export default Profile;
