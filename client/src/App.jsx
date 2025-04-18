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
} from "./pages/Index";
import Layout from "./layout/Layout";
import ChatScreen from "./pages/ChatScreen";
import ChatLayout from "./layout/ChatLayout";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route path="/chat" element={<ChatLayout />}>
                        <Route index element={<Chat />} />
                        <Route path=":chatId" element={<ChatScreen />} />
                    </Route>
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
