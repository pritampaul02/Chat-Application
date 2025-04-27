import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Chat,
    Friends,
    Login,
    Profile,
    Register,
    Search,
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

import { loadUser } from "./store/auth/authSlice";
import { useDispatch } from "react-redux";

const App = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route path="chat" element={<ChatLayout />}>
                            <Route index element={<Chat />} />
                            <Route path=":chatId" element={<ChatScreen />} />
                        </Route>

                        <Route path="status" element={<StatusLayout />}>
                            <Route index element={<Status />} />
                            <Route
                                path=":statusId"
                                element={
                                    <StatusPopup
                                        onClose={() => {}}
                                        status={{
                                            type: "image",
                                            src: "/assets/preview1.jpg",
                                            text: "Parindon ki tarah",
                                            caption: "nayagra waterfall",
                                            bottomText: "Abb to aaja... 🥺😌🌧️",
                                            timestamp: "Yesterday at 8:56 PM",
                                            views: 18,
                                        }}
                                    />
                                }
                            />
                        </Route>

                        <Route path="friends" element={<Friends />} />
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
