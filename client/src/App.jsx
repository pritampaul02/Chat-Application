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
import StatusSidebar from "./components/StatusComponent/StatusSidebar";
import StatusPopup from "./components/StatusComponent/StatusPopup";
import SearchLayout from "./layout/SearchLayout";
import UserProfile from "./components/UserProfile";

const App = () => {
    const [showPopup, setShowPopup] = React.useState(false);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                                    onClose={() => setShowPopup(false)}
                                    status={{
                                        type: "image", // "image" | "video" | "text"
                                        src: "/assets/preview1.jpg",
                                        text: "Parindon ki tarah", // Only for text type
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
                    <Route path="status" element={<Status />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
