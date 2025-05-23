// pages/Friends/SideBarFriend.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChaListFriends } from "../../store/chatList/chatAction";
import { useSocketContext } from "../../context/socketContext";

const UserCard = ({ user, showActions }) => (
    <div className="flex items-start p-4 gap-3 hover:bg-[#00A3FF22] rounded-md">
        <Link to={`/friends/${user._id}`}>
            <img
                src={user.profile_pic?.url}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
            />
        </Link>
        <div className="flex-1 flex flex-col">
            <div className="flex justify-between">
                <Link to={`/friends/${user._id}`}>
                    <h3 className="font-medium hover:underline">{user.name}</h3>
                </Link>
                <p className="text-sm text-gray-500">{user.time || ""}</p>
            </div>
            <p className="text-sm text-gray-500">
                {user.mutual || 0} mutual friends
            </p>
            {showActions && (
                <div className="flex gap-2 mt-2">
                    <button className="bg-primary text-white px-3 py-1 rounded-md text-sm">
                        Confirm
                    </button>
                    <button className="bg-gray-200 text-black px-3 py-1 rounded-md text-sm">
                        Delete
                    </button>
                </div>
            )}
        </div>
    </div>
);

const SideBarFriend = () => {
    const {socket} = useSocketContext();
    const [activeTab, setActiveTab] = useState("Friend Requests");
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.chatList);

    useEffect(() => {
        dispatch(fetchChaListFriends());
    }, [dispatch]);

    const TABS = useMemo(() => ["Friend Requests", "All Friends"], []);

    const filteredFriends = useMemo(() => {
        return (
            user?.friends?.filter((u) =>
                u.name.toLowerCase().includes(search.toLowerCase())
            ) || []
        );
    }, [user?.friends, search]);

    const friendRequestList = useMemo(
        () =>
            user?.friendRequests?.map((u) => (
                <UserCard key={u._id} user={u} showActions />
            )),
        [user?.friendRequests]
    );

    const allFriendsList = useMemo(
        () => filteredFriends?.map((u) => <UserCard key={u._id} user={u} />),
        [filteredFriends]
    );

    useEffect(() => {
        if (!socket) return;

        const handleFriendRequest = ({ senderId, senderName }) => {
            console.log(
                "📨 Friend Request received from:",
                senderId,
                senderName
            );
            dispatch(fetchChaListFriends());
            alert(`📩 ${senderName} sent you a friend request.`);
        };

        const handleSendFriendRequest = ({ senderId, senderName }) => {
            console.log("✅ Friend Request sent to:", senderId, senderName);
            dispatch(fetchChaListFriends());
            // alert(`✅ Friend request sent to ${senderName}.`);
        };

        const handleManageFriendReq = ({ senderId, senderName }) => {
            console.log(
                "🔄 Friend Request accepted/rejected from:",
                senderId,
                senderName
            );
            dispatch(fetchChaListFriends());
            // alert(`📬 ${senderName} responded to your friend request.`);
        };

        const handleManageSendFriendReq = ({ senderId, senderName }) => {
            console.log(
                "🔄 You accepted/rejected friend request from:",
                senderId,
                senderName
            );
            dispatch(fetchChaListFriends());
            // alert(`🤝 You accepted/rejected ${senderName}'s request.`);
        };

        socket.on("friendRequest", handleFriendRequest);
        socket.on("sendFriendRequest", handleSendFriendRequest);
        socket.on("manageFriendReq", handleManageFriendReq);
        socket.on("manageSendFriendReq", handleManageSendFriendReq);

        return () => {
            socket.off("friendRequest", handleFriendRequest);
            socket.off("sendFriendRequest", handleSendFriendRequest);
            socket.off("manageFriendReq", handleManageFriendReq);
            socket.off("manageSendFriendReq", handleManageSendFriendReq);
        };
    }, [socket, dispatch]);

    return (
        <div className="w-full md:ml-14 md:w-[22rem] h-full bg-white border-r border-gray-200 flex flex-col">
            {/* Tabs */}
            <header className="bg-gray-100 px-4">
                <ul className="flex items-center h-12 gap-2 overflow-x-auto">
                    {TABS.map((tab) => (
                        <li key={tab}>
                            <button
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1 rounded-lg text-sm ${
                                    activeTab === tab
                                        ? "bg-gray-300 font-semibold"
                                        : "hover:bg-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </header>

            {/* Body */}
            <main className="flex-1 overflow-y-auto p-4">
                {activeTab === "All Friends" && (
                    <div className="mb-4">
                        <div className="flex items-center border px-2 rounded-md bg-white h-10 gap-2 border-gray-300">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full text-sm outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <h4 className="mt-3 text-sm">
                            {user?.totalFriends || 0} <b>friends</b>
                        </h4>
                    </div>
                )}

                {activeTab === "Friend Requests" && (
                    <div>
                        <h2 className="text-lg mb-2">
                            {user?.totalFriendRequests || 0} Friend Requests
                        </h2>
                        {friendRequestList}
                    </div>
                )}

                {activeTab === "All Friends" && <div>{allFriendsList}</div>}
            </main>
        </div>
    );
};

export default SideBarFriend;
