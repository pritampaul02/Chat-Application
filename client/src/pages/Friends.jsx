import React from "react";

const Friends = () => {
    return (
        <div className="flex flex-1 items-center justify-center h-full bg-gray-50 select-none">
            <div className="text-center p-8">
                <h2 className="text-2xl font-medium mb-4">
                    Welcome to Chat Buddies{" "}
                </h2>
                <p className="text-gray-600 mb-6">
                    Select a friend from the sidebar to view thire profile
                </p>
            </div>
        </div>
    );
};
export default Friends;
