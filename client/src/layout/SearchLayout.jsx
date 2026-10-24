import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Search from "../pages/Search";

const SearchLayout = () => {
    const location = useLocation();
    const isRootSearch = location.pathname === "/search";

    return (
        <section className="flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
            <div
                className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800/80 shrink-0 h-full overflow-hidden ${
                    isRootSearch ? "block" : "hidden"
                } md:block`}
            >
                <Search />
            </div>

            <div
                className={`flex-1 h-full overflow-hidden ${
                    isRootSearch ? "hidden md:flex" : "flex"
                }`}
            >
                <Outlet />
            </div>
        </section>
    );
};

export default SearchLayout;
