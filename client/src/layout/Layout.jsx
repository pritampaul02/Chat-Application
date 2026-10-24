import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/global";

const Layout = () => {
    return (
        <main className="h-screen w-screen flex flex-row bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans select-none transition-colors duration-200">
            <Header />

            <section className="flex-1 h-full w-full md:pl-16 overflow-hidden flex flex-col">
                <Outlet />
            </section>
        </main>
    );
};

export default Layout;
