import React, { useEffect, useMemo } from "react";
import { IoSearch } from "react-icons/io5";
import { UserRoundPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchUsers } from "../store/search/searchAction";
import { setQuery } from "../store/search/searchSlice";
import { resetFriendState } from "../store/friends/friendsSlice";
import {
    cancelFriendRequest,
    sendFriendRequest,
} from "../store/friends/friendsAction";

const Search = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const { users, query, loading, hasMore } = useSelector(
        (state) => state.search
    );

    const { sending, success } = useSelector((state) => state.friends);

    const myUser = JSON.parse(sessionStorage.getItem("myUser"));
    const myId = myUser?._id;
    const sentRequests = myUser?.sentFriendRequests || [];
    const friends = myUser?.friends || [];

    useEffect(() => {
        if (query) {
            dispatch(fetchUsers());
        }
    }, [dispatch, query]);

    const handleInputChange = (e) => {
        dispatch(setQuery(e.target.value));
    };

    const handleShowMore = () => {
        dispatch(fetchUsers());
    };

    useEffect(() => {
        dispatch(resetFriendState());
    }, [dispatch]);

    const dedupedUsers = useMemo(() => {
        const seen = new Set();
        return users.filter((user) => {
            if (seen.has(user._id)) return false;
            seen.add(user._id);
            return true;
        });
    }, [users]);

    const userList = useMemo(
        () =>
            dedupedUsers.map((user) => {
                const userPath = `/search/${user.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${user._id}`;
                const isActive = location.pathname === userPath;
                const isIam = myId === user._id;

                return (
                    <div
                        key={user._id}
                        className={`flex items-center justify-between px-4 py-2 rounded-lg transition ${
                            isActive ? "bg-[#E5F4FF]" : "hover:bg-[#F0F4F7]"
                        }`}
                    >
                        <Link
                            to={userPath}
                            className="flex items-center gap-3 flex-1"
                        >
                            <img
                                src={user.profile_pic?.url}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                    {user.name}
                                </span>
                            </div>
                        </Link>

                        <div className="ml-2">
                            {friends.includes(user._id) ? (
                                <button
                                    onClick={() =>
                                        navigate(`/chat/${user._id}`)
                                    }
                                    className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
                                >
                                    Message
                                </button>
                            ) : sentRequests.includes(user._id) ? (
                                <button
                                    onClick={() =>
                                        dispatch(cancelFriendRequest(user._id))
                                    }
                                    disabled={sending}
                                    className="bg-primary text-white text-sm px-3 py-1 rounded-md hover:opacity-90"
                                >
                                    {sending ? "Cancelling..." : "Unsend"}
                                </button>
                            ) : isIam ? (
                                <button
                                    onClick={() => navigate(`/profile`)}
                                    className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
                                >
                                    View My Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() =>
                                        dispatch(sendFriendRequest(user._id))
                                    }
                                    disabled={sending}
                                    className={`text-sm px-3 py-1 rounded-md shadow ${
                                        sending || success
                                            ? "bg-blue-300 text-white cursor-not-allowed"
                                            : "bg-primary text-white hover:bg-primary-200"
                                    }`}
                                >
                                    {sending ? (
                                        "Sending..."
                                    ) : success ? (
                                        "Request Sent"
                                    ) : (
                                        <>
                                            <UserRoundPlus className="inline mr-1 w-4 h-4" />
                                            Add Friend
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                );
            }),
        [
            dedupedUsers,
            location.pathname,
            myId,
            friends,
            sentRequests,
            sending,
            success,
            dispatch,
            navigate,
        ]
    );

    return (
        <div className="w-full md:ml-14 md:w-[22rem] bg-white border-r border-gray-200 h-screen flex flex-col">
            <div className="w-full px-6 pb-3 pt-4 sticky top-0 bg-white z-10">
                <h1 className="text-2xl font-semibold mb-3 mt-4 text-gray-800">
                    Search
                </h1>
                <div className="flex items-center h-10 border border-gray-300 rounded-md px-3 bg-white hover:shadow transition">
                    <input
                        type="text"
                        value={query}
                        name="name"
                        onChange={handleInputChange}
                        placeholder="Search people..."
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                    />
                    <IoSearch className="text-gray-500 text-xl" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[calc(100vh-120px)]">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between animate-pulse px-4 py-2"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                            <div className="w-20 h-8 bg-gray-200 rounded-md"></div>
                        </div>
                    ))
                ) : (
                    <>
                        {userList}

                        {!loading &&
                            hasMore &&
                            hasMore >= 10 &&
                            dedupedUsers.length <= 10 && (
                                <div className="text-center mt-4">
                                    <button
                                        onClick={handleShowMore}
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        Show more
                                    </button>
                                </div>
                            )}

                        {!loading && query && dedupedUsers.length === 0 && (
                            <div className="text-center text-gray-500 mt-10 text-sm">
                                No users found for "
                                <span className="font-semibold">{query}</span>"
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Search;
