import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/global";

const Layout = () => {
    return (
        <main className="h-screen w-screen flex flex-row">
            <Header />
            <section>
                <Outlet />
            </section>
        </main>
    );
};

export default Layout;
