import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Chat,
    Friends,
    Login,
    Profile,
    Register,
    Settings,
    Status,
} from "./pages/index";
import Layout from "./layout/Layout";
import ChatScreen from "./pages/ChatScreen";
import ChatLayout from "./layout/ChatLayout";
import StatusLayout from "./layout/StatusLayout";
import StatusPopup from "./components/StatusComponent/StatusPopup";
import SearchLayout from "./layout/SearchLayout";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./private/ProtectedRoute";

import { loadUser } from "./store/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import RequestPasswordReset from "./pages/ReqPasswordReset";
import ResetPassword from "./pages/ResetPassword";
import FriendsLayout from "./layout/FriendsLayout";
import FriendsProfile from "./components/friendsComponents/FriendsProfile";
import { InfoIcon } from "lucide-react";

import { useRef } from "react";
// import { getSocket, initializeSocket } from "./store/socket/socketSlice";

const App = () => {
    const dispatch = useDispatch();
    const loadUserCalled = useRef(false);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!loadUserCalled.current) {
            dispatch(loadUser());
            loadUserCalled.current = true;
        }
    }, [dispatch]);

    // useEffect(() => {
    //     if (user) {
    //         initializeSocket({ userId: user._id });
    //         // console.log("ok");
    //     }
    // }, [user]);

    // useEffect(() => {
    //     if (!socket) return;

    //     socket.on("friendRequest", (senderId, senderName) => {
    //         console.log(
    //             "friend Request reciver  =======>",
    //             senderId,
    //             senderName
    //         );
    //         dispatch(loadUser());
    //         alert(`${senderName} send you a friend request`);
    //     });

    //     socket.on("sendFriendRequest", (reciverId, reciverName) => {
    //         console.log(
    //             "friend Request sender =======>",
    //             reciverId,
    //             reciverName
    //         );
    //         dispatch(loadUser());
    //         alert(`${reciverName}  friend request send success`);
    //     });

    //     socket.on("manageFriendReq", (senderId, senderName) => {
    //         console.log(
    //             "friend Request sender   =======>",
    //             senderId,
    //             senderName
    //         );
    //         dispatch(loadUser());
    //         alert(`${senderName} send you a friend request`);
    //     });

    //     socket.on("manageSendFriendReq", (reciverId, reciverName) => {
    //         console.log(
    //             "friend Request reciver =======>",
    //             reciverId,
    //             reciverName
    //         );
    //         dispatch(loadUser());
    //         alert(`${reciverName}  friend request send success`);
    //     });
    // }, [socket]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/request-password-reset"
                    element={<RequestPasswordReset />}
                />

                <Route path="/reset-password" element={<ResetPassword />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="chat" element={<ChatLayout />}>
                            <Route index element={<Chat />} />
                            <Route path=":chatId" element={<ChatScreen />} />
                        </Route>

                        <Route path="status" element={<StatusLayout />}>
                            <Route index element={<Status />} />
                            <Route path=":statusId" element={<StatusPopup />} />
                        </Route>

                        <Route path="/friends" element={<FriendsLayout />}>
                            <Route index element={<Friends />} />
                            <Route
                                path="/friends/:id"
                                element={<FriendsProfile />}
                            />
                        </Route>

                        {/* <Route path="friends" element={<Friends />} /> */}
                        <Route path="settings" element={<Settings />} />
                        <Route path="search" element={<SearchLayout />}>
                            <Route path=":name/:id" element={<UserProfile />} />
                        </Route>
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
