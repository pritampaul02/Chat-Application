import React from "react";
import InputBox from "./components/ui/InputBox";
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

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/setting" element={<Settings />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
