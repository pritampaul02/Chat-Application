// pages/Friends/FriendsProfile.jsx
import React, { useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    sendFriendRequest,
    cancelFriendRequest,
    manageFriendRequest,
} from "../../store/friends/friendsAction";
import { resetFriendState } from "../../store/friends/friendsSlice";
import { getMe } from "../../store/auth/authActions";
import { fetchUserById } from "../../store/userProfile/userProfileAction";
import { ArrowLeft } from "lucide-react";

const FriendsProfile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const prevIdRef = useRef();
    // console.log("---------------=====================>" , "send friend req page");

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

    useEffect(() => {
        if (!myUser?._id && !loading) dispatch(getMe());
    }, [dispatch, myUser, loading]);

    useEffect(() => {
        if (id !== prevIdRef.current) {
            dispatch(fetchUserById(id));
            dispatch(resetFriendState());
            prevIdRef.current = id;
        }
    }, [id, dispatch]);

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
        dispatch(
            manageFriendRequest({ requestId: user._id, action: "accept" })
        );
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const handleDeleteFriendsRequest = () => {
        dispatch(
            manageFriendRequest({ requestId: user._id, action: "reject" })
        );
        dispatch(getMe());
        dispatch(resetFriendState());
    };

    const hasSentRequest = myUser?.sentFriendRequests?.includes(user?._id);
    const isFriend = myUser?.friends?.includes(user?._id);
    const isSentFriendRequest = myUser?.friendRequests?.includes(user?._id);
    const isIam = myId === user?._id;

    if (userError)
        return (
            <div className="text-center mt-10 text-gray-500">
                User not found
            </div>
        );

    if (loading || !user || !myUser?._id) {
        return <div className="animate-pulse p-6">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col w-full md:w-[60rem]  mx-auto h-full  overflow-y-auto">
            {/* Header with back button */}
            <div className="flex items-center gap-2 p-4 border-b border-gray-200 md:hidden">
                <button
                    onClick={() => navigate("/friends")}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="font-medium text-gray-800 text-lg">
                    Friend Profile
                </h2>
            </div>

            {/* Cover Photo & Profile */}
            <div className="relative h-60 md:h-96 w-full">
                <div className="w-full h-full relative rounded-2xl bg-gray-200 text-gray-400">
                    {user.coverPhoto?.url && (
                        <img
                            src={user.coverPhoto.url}
                            className="w-full h-full object-cover rounded-2xl"
                            alt="Banner"
                        />
                    )}
                </div>
                <div className="absolute bottom-[-60px] left-4 md:left-10">
                    <img
                        src={user.profile_pic.url}
                        alt={user.name}
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                </div>
            </div>

            <div className="mt-20 px-4 md:px-10 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                        <div className="flex gap-3">
                            <button
                                onClick={handleManageFriendsRequest}
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

            {/* Bio section */}
            <div className="px-4 md:px-10 py-6 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
                <p className="text-gray-700 whitespace-pre-line">
                    {user.bio || "No bio available."}
                    {/* {"\n"}🌟 Simple boy{"\n"}👨‍💻 Digital Creator{"\n"}🎓 Studied
                    at Panskura Banamali College */}
                </p>
            </div>
        </div>
    );
};

export default FriendsProfile;
