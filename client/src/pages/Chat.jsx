import React from "react";

const Chat = () => {
    const user = JSON.parse(sessionStorage.getItem("myUser"));
    const userName = user ? user.name : null;
    const name = userName ? userName.split(" ")[0] : userName;

    return (
        <div className=" hidden md:flex items-center justify-center h-full bg-gray-50  select-none">
            <div className="text-center p-8">
                <h2 className="text-2xl font-medium mb-4">
                    Hi! {name} Welcome to Chat Buddies
                </h2>
                <p className="text-gray-600 mb-6">
                    Select a conversation from the sidebar to start chatting
                </p>
            </div>
        </div>
    );
};

export default Chat;
