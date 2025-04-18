import React from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center p-8">
                <h2 className="text-2xl font-medium mb-4">Welcome to Dosti</h2>
                <p className="text-gray-600 mb-6">
                    Select a conversation from the sidebar to start chatting
                </p>
            </div>
        </div>
    );
};

export default Chat;
