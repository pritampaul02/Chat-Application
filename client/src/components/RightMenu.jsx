import React from "react";

const RightMenu = () => {
    return (
        <div className="w-80 bg-slate-300 h-screen">
            <input
                type="text"
                placeholder="Search"
                className="w-full outline-1"
            />
            <p>Pined chats</p>
            <p>All chats</p>
        </div>
    );
};

export default RightMenu;
