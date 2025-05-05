import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { fetchUserById } from "../store/userProfile/userProfileAction";
import {
    sendFriendRequest,
    cancelFriendRequest,
    manageFriendRequest,
} from "../../store/friends/friendsAction";
import { resetFriendState } from "../../store/friends/friendsSlice";
import { getMe } from "../../store/auth/authActions";
import { fetchUserById } from "../../store/userProfile/userProfileAction";
const FriendsProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const prevIdRef = useRef();

    const { user: myUser } = useSelector((state) => state.auth);
    const myId = myUser?._id;

    const {
        user,
        loading,
        error: userError,
    } = useSelector((state) => state.userProfile);

    const { sending, error: friendError } = useSelector(
        (state) => state.friends
    );

    // Load current logged-in user if not loaded
    useEffect(() => {
        if (!myUser?._id && !loading) {
            dispatch(getMe());
        }
    }, [dispatch, myUser, loading]);

    // Fetch profile user data when `id` changes
    useEffect(() => {
        if (id !== prevIdRef.current) {
            dispatch(fetchUserById(id));
            dispatch(resetFriendState());
            prevIdRef.current = id;
        }
    }, [id, dispatch]);

    // Friend request handling
    const handleAddFriend = () => {
        dispatch(sendFriendRequest(user._id));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleCancelRequest = () => {
        dispatch(cancelFriendRequest(user._id));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleManageFriendsRequest = () => {
        const friendData = {
            requestId: user._id,
            action: "accept",
        };
        dispatch(manageFriendRequest(friendData));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleDeleteFriendsRequest = () => {
        const friendData = {
            requestId: user._id,
            action: "reject",
        };
        dispatch(manageFriendRequest(friendData));
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const hasSentRequest = !!(
        myUser?._id &&
        user?._id &&
        myUser.sentFriendRequests?.includes(user._id)
    );

    const isFriend = !!(
        myUser?._id &&
        user?._id &&
        myUser.friends?.includes(user._id)
    );
    const isSentFriendRequest = !!(
        myUser?._id &&
        user?._id &&
        myUser.friendRequests?.includes(user._id)
    );
    console.log("++++++++++++++++++++++++++++++", isSentFriendRequest);

    const isIam = myId === user?._id;

    if (userError) {
        return (
            <div className="text-center mt-10 text-gray-500">
                User not found
            </div>
        );
    }

    if (loading || user === undefined || user === null || !myUser?._id) {
        return (
            <div className="flex flex-col w-[60rem] h-full bg-white overflow-y-auto animate-pulse">
                {/* Skeleton Loader */}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-[60rem] h-full bg-white overflow-y-auto">
            {/* Cover Photo & Profile */}
            <div className="relative h-96 w-full">
                <div className="w-full h-full relative rounded-2xl bg-gray-200 text-gray-400">
                    {user.coverPhoto?.url && (
                        <img
                            src={user.coverPhoto.url}
                            className="w-full h-full object-cover rounded-2xl"
                            alt="Banner"
                        />
                    )}
                </div>
                <div className="absolute bottom-[-60px] left-10">
                    <img
                        src={user.profile_pic.url}
                        alt={user.name}
                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                </div>
            </div>

            <div className="mt-20 px-10 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user.name}
                    </h1>
                    <p className="text-gray-600">{user.bio}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0">
                    {isIam ? (
                        <Link
                            to="/profile"
                            className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-md hover:bg-gray-300"
                        >
                            View My Profile
                        </Link>
                    ) : isFriend ? (
                        <button
                            onClick={() => navigate(`/chat/${user._id}`)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                            Message
                        </button>
                    ) : isSentFriendRequest ? (
                        <div className=" gap-3 flex">
                            <button
                                onClick={handleManageFriendsRequest()}
                                disabled={sending}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                            >
                                {sending ? "Confirming..." : "Confirm"}
                            </button>
                            <button
                                onClick={handleDeleteFriendsRequest}
                                disabled={sending}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                            >
                                {sending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    ) : hasSentRequest ? (
                        <button
                            onClick={handleCancelRequest}
                            disabled={sending}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                        >
                            {sending ? "Cancelling..." : "Cancel Request"}
                        </button>
                    ) : (
                        <button
                            onClick={handleAddFriend}
                            disabled={sending}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-200 transition"
                        >
                            {sending ? "Sending..." : "Add Friend"}
                        </button>
                    )}

                    {friendError && (
                        <p className="text-red-500 text-sm mt-1">
                            {friendError}
                        </p>
                    )}
                </div>
            </div>

            <div className="px-10 py-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
                <p>{user.bio}</p>
                <p className="text-gray-700 whitespace-pre-line">
                    🌟 Simple boy{"\n"}
                    👨‍💻 Digital Creator{"\n"}
                    🎓 Studied at Panskura Banamali College
                </p>
            </div>
        </div>
    );
};

export default FriendsProfile;
