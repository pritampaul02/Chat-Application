import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/global";
import Sidebar from "../components/Sidebar";

const Layout = () => {
    return (
        <main className="h-screen w-screen flex flex-row">
            <Header />
            {/* <Sidebar /> */}
            <section>
                <Outlet />
            </section>
        </main>
    );
};

export default Layout;
